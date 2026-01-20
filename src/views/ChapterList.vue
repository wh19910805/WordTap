<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
    <!-- 顶部导航栏 -->
    <div class="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center gap-3 p-4">
        <button
          @click="goBack"
          class="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div class="flex-1">
          <h1 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ course?.name || '课时列表' }}
          </h1>
        </div>
      </div>
    </div>

    <div v-if="course" class="p-4 space-y-3">
      <div
        v-for="(lesson, index) in course.lessons"
        :key="lesson.id"
        @click="goToLearning(lesson.id)"
        class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-sm text-gray-500 dark:text-gray-400">Lesson {{ lesson.order }}</span>
              <span class="text-lg font-semibold">{{ lesson.title }}</span>
            </div>
            <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span v-if="lesson.completed">✅ 已完成</span>
              <span v-else-if="lesson.lastStudyTime">
                {{ formatRelativeTime(lesson.lastStudyTime) }}
              </span>
              <span v-else>未开始</span>
              <span v-if="lesson.bestTime">
                最佳: {{ formatTime(lesson.bestTime) }}
              </span>
            </div>
          </div>
          <div class="ml-4">
            <svg
              class="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="flex items-center justify-center h-screen">
      <div class="text-gray-400">加载中...</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCourseStore } from '@/stores/course'

const route = useRoute()
const router = useRouter()
const courseStore = useCourseStore()

const course = ref(null)

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function formatRelativeTime(timeStr) {
  const time = new Date(timeStr)
  const now = new Date()
  const diff = now - time
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days}天前`
  if (days < 30) return `${Math.floor(days / 7)}周前`
  return `${Math.floor(days / 30)}个月前`
}

function goToLearning(lessonId) {
  router.push({
    name: 'Learning',
    params: {
      courseId: route.params.id,
      lessonId
    }
  })
}

function goBack() {
  // 返回到发现页面的"我的课程"标签
  // 使用 query 参数来指定默认标签
  router.push({ 
    name: 'Discovery',
    query: { tab: 'my' }
  })
}

onMounted(async () => {
  // 使用 loadCourseLessonsList 只加载课时列表，不加载详细内容
  course.value = await courseStore.loadCourseLessonsList(route.params.id)
})
</script>

