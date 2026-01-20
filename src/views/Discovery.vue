<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
    <!-- 顶部 Tab 切换 -->
    <div class="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="flex">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="[
            'flex-1 py-4 px-4 text-center font-medium border-b-2 transition-colors',
            activeTab === tab.key
              ? 'border-primary-500 text-primary-500'
              : 'border-transparent text-gray-500 dark:text-gray-400'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- 我的课程 -->
    <div v-if="activeTab === 'my'" class="pb-20">
      <div v-if="courseStore.myCourses.length === 0" class="text-center py-12 px-4">
        <div class="text-gray-400 mb-4">还没有加入任何课程</div>
        <button
          @click="activeTab = 'market'"
          class="text-primary-500 font-medium"
        >
          去课程广场看看 →
        </button>
      </div>

      <!-- 课程网格 -->
      <div v-else class="px-4 pt-6 pb-4">
        <div class="grid grid-cols-2 gap-4">
          <div
            v-for="course in courseStore.myCourses"
            :key="course.id"
            class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm transition-transform hover:scale-105 relative"
          >
            <!-- 移除按钮 -->
            <button
              @click.stop="handleRemoveCourse(course.id, course.name)"
              class="absolute top-2 right-2 z-10 p-1.5 bg-black/50 hover:bg-red-500 rounded-full transition-colors"
              title="移除课程"
            >
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <!-- 课程卡片（可点击进入） -->
            <div
              @click="goToChapters(course.id)"
              class="cursor-pointer"
            >
              <!-- 课程封面 -->
              <div class="relative w-full aspect-[4/3] overflow-hidden">
                <img
                      :src="course.image || '/imgs/covers/default.png'"
                      :alt="course.name"
                      class="w-full h-full object-cover"
                      @error="handleImageError"
                    />
                <!-- 学习进度标签 -->
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <div class="text-white text-xs mb-1">
                    已学 {{ getCompletedCount(course.id) }}/{{ course.length }} 课时
                  </div>
                  <div class="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-primary-400 transition-all"
                      :style="{ width: `${(getCompletedCount(course.id) / course.length) * 100}%` }"
                    ></div>
                  </div>
                </div>
              </div>
              
              <!-- 课程信息 -->
              <div class="p-3">
                <h3 class="font-semibold text-base mb-1 line-clamp-2 text-gray-900 dark:text-white">
                  {{ course.name }}
                </h3>
                <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                  <span>{{ course.category || '官方' }}</span>
                  <div class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
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

    <!-- 课程广场 -->
    <div v-else class="pb-20">
      <!-- 分类筛选 -->
      <div class="sticky top-[57px] z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div class="flex gap-2 overflow-x-auto scrollbar-hide">
          <button
            @click="selectedCategory = null"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
              selectedCategory === null
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
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
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            ]"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <!-- 课程网格 -->
      <div class="px-4 pt-4 pb-4">
        <div class="grid grid-cols-2 gap-4">
          <div
            v-for="course in filteredCourses"
            :key="course.id"
            @click="goToDetail(course.id)"
            class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm cursor-pointer transition-transform hover:scale-105"
          >
            <!-- 课程封面 -->
            <div class="relative w-full aspect-[4/3] overflow-hidden">
              <img
                  :src="course.image || '/imgs/covers/default.png'"
                  :alt="course.name"
                  class="w-full h-full object-cover"
                  @error="handleImageError"
                />
              <!-- 标签覆盖层 -->
              <div class="absolute top-2 left-2 flex gap-1 flex-wrap">
                <span
                  v-if="isFreeCourse(course)"
                  class="px-2 py-0.5 bg-primary-500 text-white text-xs font-medium rounded"
                >
                  免费
                </span>
                <span
                  v-if="course.update"
                  class="px-2 py-0.5 bg-red-500 text-white text-xs font-medium rounded"
                >
                  new
                </span>
              </div>
            </div>
            
            <!-- 课程信息 -->
            <div class="p-3">
              <h3 class="font-semibold text-base mb-1 line-clamp-2 text-gray-900 dark:text-white">
                {{ course.name }}
              </h3>
              <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                <span>{{ course.category || '官方' }}</span>
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

    <TabBar />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCourseStore } from '@/stores/course'
import TabBar from '@/components/TabBar.vue'

const route = useRoute()
const router = useRouter()
const courseStore = useCourseStore()

const activeTab = ref(route.query.tab === 'market' ? 'market' : 'my')
const selectedCategory = ref(null)

const tabs = [
  { key: 'my', label: '我的课程' },
  { key: 'market', label: '课程广场' }
]

// 获取所有分类
const categories = computed(() => {
  const categorySet = new Set()
  courseStore.courses.forEach(course => {
    if (course.category) {
      categorySet.add(course.category)
    }
  })
  return Array.from(categorySet).sort()
})

// 根据选中的分类筛选课程
const filteredCourses = computed(() => {
  let courses = courseStore.courses
  if (selectedCategory.value) {
    courses = courses.filter(c => c.category === selectedCategory.value)
  }
  return courses
})

function getCompletedCount(courseId) {
  // 这里应该从数据库查询，暂时返回模拟数据
  return Math.floor(Math.random() * 20)
}

function getCourseStatus(courseId) {
  const myCourse = courseStore.myCourses.find(c => c.id === courseId)
  if (!myCourse) return null
  const completed = getCompletedCount(courseId)
  return completed === myCourse.length ? 'completed' : 'progressing'
}

function getWordCount(course) {
  // 估算单词数
  return course.length * 50
}

function getLearnerCount(courseId) {
  // 模拟学习人数
  return Math.floor(Math.random() * 200000) + 1000
}

function formatNumber(num) {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toLocaleString()
}

function isFreeCourse(course) {
  // 判断是否为免费课程：检查 tags 中是否包含"免费"，或者没有 cover 图片
  return course.tags?.some(tag => tag.includes('免费') || tag.includes('Free')) || false
}

function handleImageError(event) {
  // 如果图片加载失败，使用默认占位图或渐变背景
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM5MzMzRkYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM2MzI5RkYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+'
}

function goToDetail(courseId) {
  router.push({ name: 'CourseDetail', params: { id: courseId } })
}

function goToChapters(courseId) {
  router.push({ name: 'ChapterList', params: { id: courseId } })
}

async function handleRemoveCourse(courseId, courseName) {
  // 调试：检查函数是否存在
  if (typeof courseStore.removeCourse !== 'function') {
    console.error('removeCourse 函数不存在，可用方法:', Object.keys(courseStore))
    alert('移除功能暂时不可用，请刷新页面重试')
    return
  }
  
  if (confirm(`确定要移除课程"${courseName}"吗？\n\n移除后，该课程的学习进度将被清除。`)) {
    const success = await courseStore.removeCourse(courseId)
    if (success) {
      // 可以显示成功提示，但通常不需要，因为列表会自动更新
      console.log('课程已移除')
    } else {
      alert('移除课程失败，请重试')
    }
  }
}

onMounted(async () => {
  console.log('[Discovery] onMounted 执行')
  try {
    await courseStore.loadCourses()
    console.log('[Discovery] 课程加载完成，课程数量:', courseStore.courses.length)
  } catch (error) {
    console.error('[Discovery] 加载课程失败:', error)
  }
})
</script>

