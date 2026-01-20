import axios from "axios";

// 创建axios实例
const apiClient = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem("wordtap_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    // 检查响应头是否包含token
    if (response.headers.authorization) {
      const token = response.headers.authorization.split(" ")[1];
      localStorage.setItem("wordtap_token", token);
    }

    // 检查响应数据是否包含token
    if (response.data && response.data.token) {
      localStorage.setItem("wordtap_token", response.data.token);
    }

    return response.data;
  },
  (error) => {
    // 处理错误响应
    if (error.response) {
      // 服务器返回错误状态码
      // 过滤掉正常情况的错误
      if (error.response.data && 
          (error.response.data.detail === '没有找到学习进度' || 
           error.response.data.detail === '无效的认证凭据')) {
        // 不记录这些正常情况的错误，直接返回错误数据
        return Promise.reject(error.response.data);
      }
      console.error("API Error:", error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // 请求已发送但没有收到响应
      console.error("Network Error:", error.request);
      return Promise.reject({ message: "网络错误，请检查网络连接" });
    } else {
      // 请求配置错误
      console.error("Request Error:", error.message);
      return Promise.reject({ message: "请求错误，请稍后重试" });
    }
  }
);

// 认证相关API
export const authApi = {
  // 用户注册
  register: (data) => apiClient.post("/auth/register", data),
  // 用户登录
  login: (data) => apiClient.post("/auth/login", data),
  // 获取当前用户信息
  getCurrentUser: () => apiClient.get("/auth/me"),
};

// 用户相关API（暂时未实现）
// export const userApi = {
//   // 获取用户信息
//   getUserInfo: (userId) => apiClient.get(`/user/${userId}`),
//   // 更新用户信息
//   updateUserInfo: (data) => apiClient.put("/user/profile", data),
//   // 更新密码
//   updatePassword: (data) => apiClient.put("/user/password", data),
//   // 获取用户统计
//   getUserStats: () => apiClient.get("/user/stats"),
// };

// 课程相关API
export const courseApi = {
  // 获取课程列表
  getCourses: (params) => apiClient.get("/courses", { params }),
  // 获取课程详情
  getCourseDetail: (courseId) => apiClient.get(`/courses/${courseId}`),
  // 获取课程的所有课时
  getCourseLessons: (courseId) => apiClient.get(`/courses/${courseId}/lessons`),
  // 添加课程到我的课程
  addToMyCourses: (courseId, tags) => apiClient.post("/courses/my-courses", { course_id: courseId, tags }),
  // 获取我的课程列表
  getMyCourses: () => apiClient.get("/courses/my-courses"),
  // 从我的课程中移除课程
  removeFromMyCourses: (courseId) => apiClient.delete(`/courses/my-courses/${courseId}`),
  // 更新我的课程标签
  updateMyCourseTags: (courseId, tags) => apiClient.put(`/courses/my-courses/${courseId}`, { tags }),
};

// 课时相关API
export const lessonApi = {
  // 获取课时详情
  getLessonDetail: (lessonId) => apiClient.get(`/courses/lessons/${lessonId}`),
};

// 学习进度相关API
export const progressApi = {
  // 更新学习进度
  updateProgress: (data) => apiClient.post("/courses/progress", data),
  // 获取课程学习进度
  getCourseProgress: (courseId) => apiClient.get(`/courses/progress/course/${courseId}`),
  // 获取最新学习进度
  getLatestProgress: () => apiClient.get("/courses/progress/latest"),
};

export default apiClient;
