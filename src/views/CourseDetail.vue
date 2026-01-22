<template>
  <div class="min-h-screen bg-[var(--background-color)]">
    <div v-if="course" :data-course-name="course.name" class="pb-20">
      <!-- 返回按钮 -->
      <button
        @click="goBack"
        class="absolute top-4 left-4 bg-white/80 hover:bg-white text-indigo-600 p-2 rounded-full shadow-lg z-10 transition-all duration-200"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <!-- Hero Section -->
      <div class="relative h-64">
        <img
          :src="course.image || course.previewImage || getCourseCover(course.id, course.name)"
          :alt="course.name"
          class="w-full h-full object-cover"
          @error="handleImageError"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 class="text-2xl font-bold mb-2">{{ course.name }}</h1>
          <p class="text-sm opacity-90 line-clamp-2">{{ course.description }}</p>
        </div>
      </div>

      <!-- 课程信息 -->
      <div class="page-container content-area">
        <div
          class="card bg-[var(--surface-color)] border-[var(--border-color)] text-[var(--text-primary)]"
        >
          <div class="grid grid-cols-2 gap-4">
            <div>
              <div class="text-sm text-[var(--text-tertiary)] mb-1">总课时</div>
              <div class="text-2xl font-bold">{{ course.lessonCount }}</div>
            </div>
            <div>
              <div class="text-sm text-[var(--text-tertiary)] mb-1">总词汇量</div>
              <div class="text-2xl font-bold">{{ estimatedWords }}</div>
            </div>
          </div>
        </div>

        <!-- Social Proof -->
        <div
          class="card bg-[var(--surface-color)] border-[var(--border-color)] flex items-center justify-between"
        >
          <div class="flex items-center gap-2">
            <svg
              class="w-5 h-5 text-[var(--text-tertiary)]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
            <span class="text-[var(--text-primary)]">{{ learnerCount }} 人在学</span>
          </div>
        </div>

        <!-- CTA Button -->
        <button
          @click="handleAddCourse"
          :class="[
            'w-full py-4 font-semibold text-white active:scale-95 transition-transform duration-200',
            isAdded ? 'bg-lime-400 rounded-full' : 'bg-indigo-600 rounded-full',
          ]"
        >
          {{ isAdded ? "开始学习" : "加入我的课程" }}
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-else class="flex items-center justify-center h-screen">
      <div class="text-gray-400">加载中...</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCourseStore } from "@/stores/course";
import { confirm, alert } from "@/composables/useModal";

const route = useRoute();
const router = useRouter();
const courseStore = useCourseStore();

const course = ref(null);
const learnerCount = ref(1203);

const isAdded = computed(() => {
  return courseStore.myCourses.some((c) => c.id === route.params.id);
});

const estimatedWords = computed(() => {
  return course.value ? course.value.lessonCount * 50 : 0;
});

// 获取课程封面
function getCourseCover(courseId, courseName) {
  // 新概念英语课程使用特定封面
  if (courseName && (courseName.includes('新概念英语') || courseName.includes('NCE'))) {
    // 根据课程名称或ID返回对应的新概念英语封面
    if (courseName.includes('1') || courseId.includes('1')) return "/imgs/covers/nce-1.png";
    if (courseName.includes('2') || courseId.includes('2')) return "/imgs/covers/nce-2.png";
    if (courseName.includes('3') || courseId.includes('3')) return "/imgs/covers/nce-3.png";
    if (courseName.includes('4') || courseId.includes('4')) return "/imgs/covers/nce-4.png";
    return "/imgs/covers/nce-1.png"; // 默认返回新概念英语1
  }
  
  // 其他课程随机返回普通图片目录的图片
  const randomIndex = Math.floor(Math.random() * 10);
  return `/imgs/${randomIndex}.jpg`;
}

// 处理图片加载失败
function handleImageError(event) {
  // 获取课程名称（从父元素或其他属性中获取）
  let courseName = '未知课程';
  const courseElement = event.target.closest('[data-course-name]');
  if (courseElement) {
    courseName = courseElement.dataset.courseName;
  }
  
  // 生成带有课程名称首字母的SVG图片
  const initial = courseName.charAt(0).toUpperCase();
  const colors = [
    '#9333FF', '#6329FF', '#4F46E5', '#3B82F6',
    '#10B981', '#059669', '#F59E0B', '#D97706',
    '#EF4444', '#DC2626', '#EC4899', '#DB2777'
  ];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  // 创建SVG文字图片
  const svg = `
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${randomColor};stop-opacity:0.9" />
          <stop offset="100%" style="stop-color:${randomColor};stop-opacity:0.7" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad1)" />
      <circle cx="200" cy="150" r="80" fill="white" fill-opacity="0.2" />
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="80" font-weight="bold" fill="white" text-anchor="middle" dy=".3em">${initial}</text>
      <text x="50%" y="70%" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle">${courseName.length > 15 ? courseName.substring(0, 15) + '...' : courseName}</text>
    </svg>
  `;
  
  // 转换为base64并设置为图片源
  event.target.src = 'data:image/svg+xml;base64,' + btoa(svg);
}

// 添加调试日志，监控 course 对象的变化
watch(
  () => course.value,
  (newCourse) => {
    console.log("[DEBUG] course.value changed:", newCourse);
  },
  { deep: true }
);

// 打印初始值
console.log("[DEBUG] Initial course.value:", course.value);
console.log("[DEBUG] Initial courseStore.courses:", courseStore.courses);
console.log("[DEBUG] Initial courseStore.courses.length:", courseStore.courses.length);

// 返回按钮功能
function goBack() {
  // 读取当前路由中的 query 参数，获取 tab 值
  const tab = route.query.tab || 'market';
  // 返回时携带正确的 tab 参数，确保回到原来的标签页
  router.replace({ name: "Discovery", query: { tab } });
}

async function loadCourse() {
  const courseId = route.params.id;
  console.log("[DEBUG] loadCourse called with courseId:", courseId);
  console.log("[DEBUG] courseStore.courses.length:", courseStore.courses.length);

  // 如果课程列表为空，尝试先加载课程列表
  if (courseStore.courses.length === 0) {
    console.log("[DEBUG] courses list is empty, trying to load courses...");
    await courseStore.loadCourses();
    console.log("[DEBUG] after loadCourses, courses.length:", courseStore.courses.length);
  }

  // 首先，从课程列表中获取课程的基本信息（包括图片）
  const courseFromList = courseStore.courses.find((c) => c.id === courseId);
  console.log("[DEBUG] courseFromList:", courseFromList);
  if (courseFromList) {
    console.log("[DEBUG] courseFromList.image:", courseFromList.image);
    console.log("[DEBUG] courseFromList.previewImage:", courseFromList.previewImage);
    // 先设置课程的基本信息，确保图片能显示
    course.value = { ...courseFromList };
    console.log("[DEBUG] course.value after setting from list:", course.value);
  }

  // 然后，尝试加载课程的详细数据（课时列表等）
  try {
    const fullCourse = await courseStore.loadCourseDetail(courseId);
    console.log("[DEBUG] fullCourse:", fullCourse);
    if (fullCourse) {
      // 确保 fullCourse 包含图片信息
      if (!fullCourse.image && !fullCourse.previewImage && courseFromList) {
        // 如果 fullCourse 没有图片信息，但课程列表中有，使用课程列表中的图片信息
        fullCourse.image = courseFromList.image;
        fullCourse.previewImage = courseFromList.previewImage;
        console.log("[DEBUG] fullCourse after adding image:", fullCourse);
      }
      // 如果加载成功，更新课程对象
      course.value = fullCourse;
      console.log("[DEBUG] course.value after loading full course:", course.value);
    } else {
      console.log("[DEBUG] fullCourse is null, keeping course.value from list:", course.value);
    }
  } catch (error) {
    console.error("加载课程详细数据失败:", error);
    // 即使加载失败，课程的基本信息（包括图片）仍然能显示
    console.log("[DEBUG] Error loading full course, keeping course.value from list:", course.value);
  }
}

async function handleAddCourse() {
  console.log("点击加入课程按钮, courseId:", route.params.id, "isAdded:", isAdded.value);

  if (isAdded.value) {
    router.push({ name: "ChapterList", params: { id: route.params.id } });
  } else {
    try {
      const success = await courseStore.addCourse(route.params.id);
      console.log("加入课程结果:", success);

      if (success) {
        // 显示成功提示
        alert("已加入我的课程");
        // 等待一下让状态更新
        await new Promise((resolve) => setTimeout(resolve, 100));
        router.push({ name: "ChapterList", params: { id: route.params.id } });
      } else {
        console.error("加入课程返回 false");
        alert("加入课程失败，请重试。请打开浏览器控制台查看详细错误信息。");
      }
    } catch (error) {
      console.error("加入课程异常:", error);
      alert("加入课程失败: " + (error.message || "未知错误"));
    }
  }
}

onMounted(() => {
  loadCourse();

  // 确保浏览器返回按钮直接返回课程广场
  // 替换当前历史记录条目，使浏览器返回按钮直接返回课程广场
  router.replace(route.path);
});
</script>
