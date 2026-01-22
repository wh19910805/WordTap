<template>
  <div class="min-h-screen bg-[var(--background-color)] pb-20">
    <!-- 顶部导航栏 -->
  <div class="sticky top-0 z-10 bg-[var(--surface-color)] border-b border-[var(--border-color)]">
    <div class="flex items-center gap-3 p-4">
      <button
        @click="goBack"
        class="p-2 -ml-2 hover:bg-[var(--hover-color)] rounded-full transition-colors"
      >
        <svg class="w-6 h-6 text-[var(--text-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div class="flex-1">
        <h1 class="text-lg font-semibold text-[var(--text-primary)]">
          {{ course?.name || '课时列表' }}
        </h1>
      </div>
    </div>
  </div>

    <div v-if="course" class="page-container" ref="lessonsContainer" style="max-height: calc(100vh - 100px); overflow-y: auto; overflow-x: hidden;">
      <div class="content-area">
      <div
        v-for="(lesson, index) in course.lessons"
        :key="lesson.id"
        :ref="el => { if (lesson.id) lessonRefs[lesson.id] = el }"
        @click="goToLearning(lesson.id)"
        class="card hover:border-indigo-300 transition-all duration-300 cursor-pointer bg-[var(--surface-color)] border-[var(--border-color)] text-[var(--text-primary)] mb-3"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-sm text-[var(--text-tertiary)]">Lesson {{ lesson.order }}</span>
              <span class="text-lg font-semibold">{{ lesson.title }}</span>
            </div>
            <div class="flex items-center gap-4 text-sm text-[var(--text-tertiary)]">
              <span v-if="lesson.completed" class="text-lime-400">✅ 已完成</span>
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
    </div>

    <div v-else class="flex items-center justify-center h-screen">
      <div class="text-gray-400">加载中...</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCourseStore } from '@/stores/course'
import { db } from '@/db'

const route = useRoute()
const router = useRouter()
const courseStore = useCourseStore()

const course = ref(null)
const lessonsContainer = ref(null)
const lessonRefs = ref({})
const lastStudiedLessonId = ref(null)

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
  // 保存当前学习的课时ID，用于返回时定位
  sessionStorage.setItem(`lastLesson_${route.params.id}`, lessonId)
  
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

// 自动滚动到上次学习的课时
async function scrollToLastLesson() {
  console.log('开始执行滚动到上次学习的课时');
  
  if (!course.value || !course.value.lessons || course.value.lessons.length === 0) {
    console.log('课程数据为空，跳过滚动');
    return
  }
  
  let lessonIdToScroll = null
  
  // 1. 首先从sessionStorage获取上次学习的课时ID
  const sessionKey = `lastLesson_${route.params.id}`
  const sessionLessonId = sessionStorage.getItem(sessionKey)
  console.log('从sessionStorage获取到的课时ID:', sessionLessonId, 'key:', sessionKey);
  
  if (sessionLessonId) {
    lessonIdToScroll = sessionLessonId
  } else {
    // 2. 如果sessionStorage中没有，从本地数据库获取最近学习的课时
    try {
      const allLessons = await db.lessons.where("courseId").equals(route.params.id).toArray()
      console.log('从本地数据库获取到的课时列表:', allLessons);
      
      if (allLessons.length > 0) {
        // 按最后学习时间排序，获取最近学习的课时
        const sortedLessons = allLessons.sort((a, b) => {
          const dateA = a.lastStudyTime ? new Date(a.lastStudyTime).getTime() : 0
          const dateB = b.lastStudyTime ? new Date(b.lastStudyTime).getTime() : 0
          return dateB - dateA
        })
        lessonIdToScroll = sortedLessons[0]?.id
        console.log('从本地数据库获取到的最近学习课时ID:', lessonIdToScroll);
      }
    } catch (error) {
      console.error("获取最近学习课时失败:", error)
    }
  }
  
  // 3. 如果找到了要滚动的课时，执行滚动
  if (lessonIdToScroll) {
    console.log('准备滚动到课时ID:', lessonIdToScroll);
    
    // 等待DOM更新完成，使用更长的延迟确保DOM完全渲染
    const scrollAttempts = 5;
    let currentAttempt = 0;
    
    const scrollInterval = setInterval(() => {
      currentAttempt++;
      console.log(`滚动尝试 ${currentAttempt}/${scrollAttempts}`);
      
      // 尝试获取课时元素
      const lessonElement = lessonRefs.value[lessonIdToScroll];
      console.log('获取到的课时元素:', lessonElement);
      
      if (lessonElement) {
        // 计算滚动位置，使课时在可视区域居中
        const containerRect = lessonsContainer.value.getBoundingClientRect();
        const lessonRect = lessonElement.getBoundingClientRect();
        const scrollTop = lessonElement.offsetTop - containerRect.height / 2 + lessonRect.height / 2;
        
        console.log('计算的滚动位置:', scrollTop);
        
        // 执行滚动，使用auto行为直接定位，没有滚动动画
        lessonsContainer.value.scrollTo({
          top: scrollTop,
          behavior: "auto"
        });
        
        // 清除定时器
        clearInterval(scrollInterval);
        console.log('滚动执行完成');
      } else if (currentAttempt >= scrollAttempts) {
        // 尝试次数用尽，清除定时器
        clearInterval(scrollInterval);
        console.log('滚动尝试失败，无法获取课时元素');
        
        // 尝试另一种滚动方式：找到课时索引，然后滚动
        const lessonIndex = course.value.lessons.findIndex(lesson => lesson.id === lessonIdToScroll);
        if (lessonIndex !== -1) {
          console.log('尝试通过索引滚动，索引:', lessonIndex);
          // 计算大概的滚动位置
          const estimatedScrollTop = lessonIndex * 100; // 假设每个课时大概100px高
          lessonsContainer.value.scrollTo({
            top: estimatedScrollTop,
            behavior: "auto"
          });
        }
      }
    }, 200);
  }
}

// 监听课程数据变化，当课程数据加载完成后自动滚动
watch(course, async (newCourse) => {
  if (newCourse && newCourse.lessons && newCourse.lessons.length > 0) {
    console.log('课程数据变化，开始滚动');
    await scrollToLastLesson()
  }
}, { deep: true });

onMounted(async () => {
  console.log('ChapterList页面挂载完成');
  // 使用 loadCourseLessonsList 只加载课时列表，不加载详细内容
  course.value = await courseStore.loadCourseLessonsList(route.params.id)
  
  // 当课程加载完成后，自动滚动到上次学习的课时
  if (course.value) {
    console.log('初始课程数据加载完成，开始滚动');
    await scrollToLastLesson()
  }
})
</script>

