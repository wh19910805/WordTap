<template>
  <div class="min-h-screen bg-[var(--background-color)]">
    <div v-if="course" class="pb-20">
      <!-- Hero Section -->
      <div class="relative h-64">
        <img :src="course.image" :alt="course.name" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 class="text-2xl font-bold mb-2">{{ course.name }}</h1>
          <p class="text-sm opacity-90 line-clamp-2">{{ course.description }}</p>
        </div>
      </div>

      <!-- 课程信息 -->
      <div class="page-container content-area">
        <div class="card bg-[var(--surface-color)] border-[var(--border-color)] text-[var(--text-primary)]">
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
        <div class="card bg-[var(--surface-color)] border-[var(--border-color)] flex items-center justify-between">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-[var(--text-tertiary)]" fill="currentColor" viewBox="0 0 20 20">
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
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCourseStore } from "@/stores/course";

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

async function loadCourse() {
  const courseId = route.params.id;
  course.value = await courseStore.loadCourseDetail(courseId);
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
});
</script>
