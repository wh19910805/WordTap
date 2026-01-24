<template>
  <div class="min-h-screen bg-[var(--background-color)] pb-20">
    <!-- 顶部 Tab 切换 -->
    <div
      class="sticky top-0 z-10 bg-[var(--surface-color)] border-b border-[var(--border-color)]"
    >
      <div class="flex">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="[
            'flex-1 py-4 px-4 text-center font-medium border-b-2 transition-colors',
            activeTab === tab.key
              ? 'border-[var(--primary-color)] text-[var(--primary-color)]'
              : 'border-transparent text-[var(--text-tertiary)]',
          ]"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- 我的课程 -->
    <div v-if="activeTab === 'my'" class="pb-20">
      <div class="page-container content-area">
        <div v-if="courseStore.myCourses.length === 0" class="text-center py-12">
          <div class="text-gray-400 mb-4">还没有加入任何课程</div>
          <button @click="activeTab = 'market'" class="text-[var(--primary-color)] font-medium">
            去课程广场看看 →
          </button>
        </div>

        <!-- 课程网格 -->
        <div v-else class="pt-6 pb-4">
          <div class="grid grid-cols-2 gap-4">
            <div
              v-for="course in courseStore.myCourses"
              :key="course.id"
              :data-course-name="course.name"
              class="bg-[var(--surface-color)] border-2 border-[var(--border-color)] rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 relative group hover:border-[var(--primary-color)]"
            >
              <!-- 移除按钮 -->
              <button
                @click.stop="handleRemoveCourse(course.id, course.name)"
                class="absolute top-2 right-2 z-10 p-1.5 bg-black/50 hover:bg-red-500 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
                title="移除课程"
              >
                <svg
                  class="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <!-- 课程卡片（可点击进入） -->
              <div @click="goToChapters(course.id)" class="cursor-pointer">
                <!-- 课程封面 -->
                <div class="relative w-full aspect-[4/3] overflow-hidden rounded-t-3xl">
                  <img
                    :src="getCourseCover(course.id, course.name)"
                    :alt="course.name"
                    class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    @error="handleImageError"
                  />
                  <!-- 学习进度标签 -->
                  <div class="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                    <div class="text-white text-xs mb-1 font-medium">
                      已学 {{ getCompletedCount(course.id) }}/{{ course.length }} 课时
                    </div>
                    <div class="w-full h-1.5 bg-white/30 rounded-full overflow-hidden">
                      <div
                        class="h-full bg-[var(--primary-color)] transition-all duration-1000"
                        :style="{
                          width: `${
                            (getCompletedCount(course.id) / course.length) * 100
                          }%`,
                        }"
                      ></div>
                    </div>
                  </div>
                </div>

                <!-- 课程信息 -->
                <div class="p-3">
                  <h3
                    class="font-semibold text-base mb-1 line-clamp-2 text-[var(--text-primary)] group-hover:text-[var(--primary-color)] transition-colors duration-300"
                  >
                    {{ course.name }}
                  </h3>
                  <div
                    class="flex items-center justify-between text-xs text-gray-500 mt-2"
                  >
                    <span
                      class="bg-[var(--primary-color)]/10 text-[var(--primary-color)] px-2 py-0.5 rounded-full"
                      >{{ course.category || "官方" }}</span
                    >
                    <div class="flex items-center gap-1">
                      <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path
                          fill-rule="evenodd"
                          d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <span>{{ getCompletedCount(course.id) }}/{{ course.length }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 课程广场 -->
    <div v-else class="pb-20">
      <!-- 分类筛选 -->
      <div
        class="sticky top-[57px] z-10 bg-[var(--surface-color)] border-b border-[var(--border-color)] px-4 py-3"
      >
        <div class="content-area flex gap-2 overflow-x-auto scrollbar-hide">
          <button
            @click="selectedCategory = null"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
              selectedCategory === null
                ? 'bg-[var(--primary-color)] text-white'
                : 'bg-[var(--hover-color)] text-[var(--text-primary)]',
            ]"
          >
            全部
          </button>
          <button
            v-for="category in categories"
            :key="category"
            @click="selectedCategory = selectedCategory === category ? null : category"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
              selectedCategory === category
                ? 'bg-[var(--primary-color)] text-white'
                : 'bg-[var(--hover-color)] text-[var(--text-primary)]',
            ]"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <!-- 课程网格 -->
      <div class="page-container content-area">
        <div class="grid grid-cols-2 gap-4">
          <div
            v-for="course in filteredCourses"
            :key="course.id"
            :data-course-name="course.name"
            @click="goToDetail(course.id)"
            class="bg-[var(--surface-color)] border-2 border-[var(--border-color)] rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer group hover:border-[var(--primary-color)]"
          >
            <!-- 课程封面 -->
            <div class="relative w-full aspect-[4/3] overflow-hidden rounded-t-3xl">
              <img
                :src="getCourseCover(course.id, course.name)"
                :alt="course.name"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                @error="handleImageError"
              />
              <!-- 标签覆盖层 -->
              <div class="absolute top-2 left-2 flex gap-1 flex-wrap">
                <span
                  v-if="isFreeCourse(course)"
                  class="px-2.5 py-0.75 bg-lime-400 text-white text-xs font-medium rounded-full"
                >
                  免费
                </span>
                <span
                  v-if="course.update"
                  class="px-2.5 py-0.75 bg-pink-500 text-white text-xs font-medium rounded-full"
                >
                  new
                </span>
              </div>
              <!-- 悬停播放按钮 -->
              <div
                class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
              >
                <div
                  class="w-12 h-12 bg-white rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300"
                >
                  <svg
                    class="w-6 h-6 text-[var(--primary-color)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <!-- 课程信息 -->
            <div class="p-3">
              <h3
                class="font-semibold text-base mb-1 line-clamp-2 text-[var(--text-primary)] group-hover:text-[var(--primary-color)] transition-colors duration-300"
              >
                {{ course.name }}
              </h3>
              <div class="flex items-center justify-between text-xs text-gray-500 mt-2">
                <span class="bg-[var(--primary-color)]/10 text-[var(--primary-color)] px-2 py-0.5 rounded-full">{{
                  course.category || "官方"
                }}</span>
                <div class="flex items-center gap-1">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                  <span>{{ formatNumber(getLearnerCount(course.id)) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Bar -->
    <TabBar />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCourseStore } from "@/stores/course";
import { courseApi } from "@/api/client";
import TabBar from "@/components/TabBar.vue";
import { confirm, alert } from "@/composables/useModal";

const route = useRoute();
const router = useRouter();
const courseStore = useCourseStore();

const activeTab = ref(route.query.tab === "market" ? "market" : "my");
const selectedCategory = ref(null);

const tabs = [
  { key: "my", label: "我的课程" },
  { key: "market", label: "课程广场" },
];

// 获取所有分类
const categories = computed(() => {
  const categorySet = new Set();
  const allCourses = Array.isArray(courseStore.courses) ? courseStore.courses : [];
  allCourses.forEach((course) => {
    if (course.category) {
      categorySet.add(course.category);
    }
  });
  return Array.from(categorySet).sort();
});

// 根据选中的分类筛选课程
const filteredCourses = computed(() => {
  let courses = Array.isArray(courseStore.courses) ? courseStore.courses : [];
  if (selectedCategory.value) {
    courses = courses.filter((c) => c.category === selectedCategory.value);
  }
  return courses;
});

function getCompletedCount(courseId) {
  // 这里应该从数据库查询，暂时返回模拟数据
  return Math.floor(Math.random() * 20);
}

function getCourseStatus(courseId) {
  const myCourse = courseStore.myCourses.find((c) => c.id === courseId);
  if (!myCourse) return null;
  const completed = getCompletedCount(courseId);
  return completed === myCourse.length ? "completed" : "progressing";
}

function getWordCount(course) {
  // 估算单词数
  return course.length * 50;
}

function getLearnerCount(courseId) {
  // 模拟学习人数
  return Math.floor(Math.random() * 200000) + 1000;
}

function formatNumber(num) {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + "万";
  }
  return num.toLocaleString();
}

function isFreeCourse(course) {
  // 判断是否为免费课程：检查 tags 中是否包含"免费"，或者没有 cover 图片
  return (
    course.tags?.some((tag) => tag.includes("免费") || tag.includes("Free")) || false
  );
}

function getCourseCover(courseId, courseName) {
  // 新概念英语课程使用特定封面
  if (courseName && (courseName.includes("新概念英语") || courseName.includes("NCE"))) {
    // 根据课程名称或ID返回对应的新概念英语封面
    if (courseName.includes("1") || courseId.includes("1"))
      return "/imgs/covers/nce-1.png";
    if (courseName.includes("2") || courseId.includes("2"))
      return "/imgs/covers/nce-2.png";
    if (courseName.includes("3") || courseId.includes("3"))
      return "/imgs/covers/nce-3.png";
    if (courseName.includes("4") || courseId.includes("4"))
      return "/imgs/covers/nce-4.png";
    return "/imgs/covers/nce-1.png"; // 默认返回新概念英语1
  }

  // 其他课程随机返回普通图片目录的图片
  const randomIndex = Math.floor(Math.random() * 10);
  return `/imgs/${randomIndex}.jpg`;
}

function handleImageError(event) {
  // 获取课程名称（从父元素或其他属性中获取）
  let courseName = "未知课程";
  const courseCard = event.target.closest("[data-course-name]");
  if (courseCard) {
    courseName = courseCard.dataset.courseName;
  }

  // 生成带有课程名称首字母的SVG图片
  const initial = courseName.charAt(0).toUpperCase();
  const colors = [
    "#9333FF",
    "#6329FF",
    "#4F46E5",
    "#3B82F6",
    "#10B981",
    "#059669",
    "#F59E0B",
    "#D97706",
    "#EF4444",
    "#DC2626",
    "#EC4899",
    "#DB2777",
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
      <text x="50%" y="70%" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle">${
        courseName.length > 15 ? courseName.substring(0, 15) + "..." : courseName
      }</text>
    </svg>
  `;

  // 转换为base64并设置为图片源
  event.target.src = "data:image/svg+xml;base64," + btoa(svg);
}

function goToDetail(courseId) {
  // 传递当前tab参数，确保返回时能回到正确的标签页
  router.push({
    name: "CourseDetail",
    params: { id: courseId },
    query: { tab: activeTab.value },
  });
}

function goToChapters(courseId) {
  router.push({ name: "ChapterList", params: { id: courseId } });
}

async function handleRemoveCourse(courseId, courseName) {
  // 调试：检查函数是否存在
  if (typeof courseStore.removeCourse !== "function") {
    console.error("removeCourse 函数不存在，可用方法:", Object.keys(courseStore));
    await alert("移除功能暂时不可用，请刷新页面重试");
    return;
  }

  const confirmed = await confirm(
    `确定要移除课程"${courseName}"吗？\n\n移除后，该课程的学习进度将被清除。`
  );
  if (confirmed) {
    const success = await courseStore.removeCourse(courseId);
    if (success) {
      // 显示成功提示
      await alert("课程已移除");
    } else {
      await alert("移除课程失败，请重试");
    }
  }
}

onMounted(async () => {
  console.log("[Discovery] onMounted 执行");
  try {
    await courseStore.loadCourses();
    console.log("[Discovery] 课程加载完成，课程数量:", courseStore.courses.length);
  } catch (error) {
    console.error("[Discovery] 加载课程失败:", error);
  }
});
</script>
