<template>
  <div class="h-screen bg-gray-50 dark:bg-gray-900 overflow-y-auto pb-20">
    <div class="space-y-4 p-4">
      <!-- 每日打卡部分 -->
      <div class="card card-hover">
        <!-- 标题栏 -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <component :is="FireIcon" class="w-5 h-5 text-white" />
            </div>
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">每日打卡</h2>
          </div>
          <button @click="showSettings = true" class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <component :is="SettingsIcon" class="w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
          </button>
        </div>

        <div class="p-4 space-y-3">
          <!-- 连胜和累计打卡 -->
          <div class="grid grid-cols-2 gap-2.5">
            <div class="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-3 text-white shadow-lg relative overflow-hidden">
              <div class="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
              <div class="relative z-10">
                <div class="flex items-center gap-1.5 mb-1">
                  <component :is="FireIcon" class="w-4 h-4" />
                  <div class="text-xs font-medium opacity-90">连胜</div>
                </div>
                <div class="text-2xl font-bold mt-0.5">
                  <span>{{ userStore.streak }}</span><span class="text-xs opacity-80 ml-0.5">天</span>
                </div>
              </div>
            </div>
            <div class="card p-3 border-2 border-gray-100 dark:border-gray-700">
              <div class="flex items-center gap-1.5 mb-1">
                <div class="w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                  <component :is="CheckIcon" class="w-2.5 h-2.5 text-white" />
                </div>
                <div class="text-xs font-medium text-gray-500 dark:text-gray-400">累计打卡</div>
              </div>
              <div class="text-2xl font-bold mt-0.5 text-gray-900 dark:text-white">
                <span>{{ userStore.totalCheckIn }}</span><span class="text-xs text-gray-500 dark:text-gray-400 ml-0.5">天</span>
              </div>
            </div>
          </div>

          <!-- 本周打卡记录 -->
          <div>
            <div class="text-[11px] text-gray-600 dark:text-gray-400 mb-1">本周打卡记录</div>
            <div class="flex gap-1">
              <div
                v-for="(day, index) in weekDays"
                :key="index"
                class="flex-1 flex flex-col items-center"
              >
                <div
                  :class="[
                    'w-full h-8 rounded flex items-center justify-center border transition-all',
                    day.checked
                      ? 'bg-purple-500 border-purple-500 text-white'
                      : day.isToday
                      ? 'bg-white dark:bg-gray-700 border-purple-500 text-gray-900 dark:text-white'
                      : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-400'
                  ]"
                >
                  <component v-if="day.checked" :is="CheckIcon" class="w-3 h-3" />
                </div>
                <div class="text-[9px] text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">{{ day.label }}</div>
              </div>
            </div>
          </div>

          <!-- 推广横幅 -->
          <div
            v-if="showPromoBanner"
            class="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-4 flex items-center gap-3 relative shadow-lg animate-slide-up"
          >
            <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <component :is="GiftIcon" class="w-6 h-6 text-yellow-900" />
            </div>
            <div class="flex-1 text-sm text-yellow-900 font-medium">
              炫耀战绩带邀请码,好友注册付费双方都有奖励哦
            </div>
            <button class="text-yellow-900 text-sm font-semibold hover:underline">了解→</button>
            <button @click="showPromoBanner = false" class="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-lg transition-colors">
              <component :is="CloseIcon" class="w-4 h-4 text-yellow-900" />
            </button>
          </div>

          <!-- 继续学习按钮 -->
          <div class="mb-3">
            <button 
              v-if="latestProgress && !loadingProgress"
              @click="continueLearning"
              class="w-full bg-gradient-to-r from-primary-500 to-blue-500 text-white rounded-lg p-3 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              <component :is="PlayIcon" class="w-5 h-5" />
              <span class="text-sm font-semibold">继续学习</span>
            </button>
          </div>

          <!-- 操作按钮 -->
          <div class="flex gap-3">
            <button class="flex-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 flex items-center justify-center gap-2">
              <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="text-sm text-gray-700 dark:text-gray-300">打卡日历</span>
            </button>
            <button class="flex-1 bg-purple-500 text-white rounded-lg p-3 flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.885 12.938 9 12.482 9 12c0-.482-.115-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span class="text-sm font-medium">炫耀战绩</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 最近学习 -->
      <div class="bg-white dark:bg-gray-800">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold">最近学习</h2>
        </div>
        <div class="p-4 space-y-3">
          <div
            v-for="(lesson, index) in recentLessons"
            :key="index"
            @click="goToLesson(lesson)"
            class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
          >
            <div class="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg flex-shrink-0 overflow-hidden">
              <img
                :src="getCourseCover(lesson.courseId)"
                :alt="lesson.title"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
            </div>
            <div class="flex-1 min-w-0">
              <div class="font-medium text-gray-900 dark:text-white truncate">{{ lesson.courseName || '课程' }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">{{ lesson.title }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-500 mt-1">{{ formatRelativeTime(lesson.time) }}</div>
            </div>
          </div>
          <div v-if="recentLessons.length === 0" class="text-center py-8 text-gray-400 text-sm">
            暂无最近学习记录
          </div>
        </div>
      </div>

      <!-- 学习统计部分 -->
      <div class="card">
        <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">学习统计</h2>
          </div>
          <div class="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              v-for="period in timePeriods"
              :key="period.key"
              @click="currentPeriod = period.key"
              :class="[
                'px-2 py-1 rounded text-xs font-medium transition-colors',
                currentPeriod === period.key
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              ]"
            >
              {{ period.label }}
            </button>
          </div>
        </div>

        <div class="p-4">
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">学习时长</div>
              <div class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ formatStudyTime(currentStudyTime) }}
              </div>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">完成课程</div>
              <div class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ userStore.completedLessons }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">节</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 学习工具 -->
      <div class="bg-white dark:bg-gray-800">
        <div class="p-4">
          <div class="grid grid-cols-2 gap-3">
            <!-- 错题本 -->
            <div class="flex items-center gap-2.5 p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-800 card-hover">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                <component :is="BookIcon" class="w-5 h-5 text-white" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-medium text-sm text-gray-900 dark:text-white">错题本</div>
                <div class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">记录学习中遇到的错误</div>
                <div class="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">74题待复习</div>
              </div>
            </div>

            <!-- 生词本 -->
            <div class="flex items-center gap-2.5 p-3 bg-gradient-to-r from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-800/20 rounded-xl border border-purple-200 dark:border-purple-800 card-hover">
              <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
                <component :is="BookIcon" class="w-5 h-5 text-white" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-medium text-sm text-gray-900 dark:text-white">生词本</div>
                <div class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">记录学习中遇到的生词</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 学习热力图 -->
      <div class="bg-white dark:bg-gray-800">
        <div class="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-sm font-semibold">学习热力图</h2>
          <div class="flex items-center gap-1">
            <button @click="prevMonth" class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
              <component :is="ArrowLeftIcon" class="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
            </button>
            <span class="text-[11px] font-semibold text-gray-700 dark:text-gray-300 px-1">{{ currentMonthLabel }}</span>
            <button @click="nextMonth" class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
              <component :is="ArrowRightIcon" class="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
            </button>
          </div>
        </div>
        <div class="px-4 py-2">
          <div class="heatmap-container">
            <div class="grid grid-cols-7 gap-0.5 mb-0.5">
              <div class="text-[9px] text-gray-500 dark:text-gray-400 text-center leading-tight" v-for="day in weekDayLabels" :key="day">
                {{ day }}
              </div>
            </div>
            <div class="grid grid-cols-7 gap-0.5">
              <div
                v-for="(day, index) in heatmapDays"
                :key="index"
                :class="[
                  'h-2.5 rounded-sm',
                  day.hasData
                    ? 'bg-green-500'
                    : day.isToday
                    ? 'bg-gray-200 dark:bg-gray-700 border border-gray-400'
                    : 'bg-gray-100 dark:bg-gray-800'
                ]"
                :title="day.date"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Bar -->
    <TabBar />

    <!-- 设置弹窗 -->
    <SettingsModal v-if="showSettings" @close="showSettings = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useCourseStore } from '@/stores/course'
import { progressApi } from '@/api/client'
import TabBar from '@/components/TabBar.vue'
import SettingsModal from '@/components/SettingsModal.vue'
import { 
  FireIcon, 
  SettingsIcon, 
  CheckIcon, 
  CalendarIcon, 
  ShareIcon, 
  BookIcon, 
  GiftIcon, 
  CloseIcon, 
  ArrowLeftIcon, 
  ArrowRightIcon,
  PlayIcon
} from '@/components/icons/index.js'

const router = useRouter()
const userStore = useUserStore()
const courseStore = useCourseStore()

const showSettings = ref(false)
const showPromoBanner = ref(true)
const currentPeriod = ref('week')
const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())
const latestProgress = ref(null) // 最新学习进度
const loadingProgress = ref(false)

const timePeriods = [
  { key: 'total', label: '总计' },
  { key: 'week', label: '本周' },
  { key: 'month', label: '本月' },
  { key: 'year', label: '今年' }
]

const weekDays = computed(() => {
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  return userStore.weeklyActivity.map((day, index) => ({
    ...day,
    label: days[index]
  }))
})

const currentStudyTime = computed(() => {
  if (currentPeriod.value === 'total') {
    return userStore.studyTime.total || 0
  }
  return userStore.studyTime[currentPeriod.value] || 0
})

const recentLessons = computed(() => {
  return userStore.recentLessons.map(lesson => {
    const course = courseStore.courses.find(c => c.id === lesson.courseId)
    return {
      ...lesson,
      courseName: course?.name || '未知课程'
    }
  })
})

const currentMonthLabel = computed(() => {
  return `${currentYear.value}年${currentMonth.value + 1}月`
})

const weekDayLabels = ['一', '二', '三', '四', '五', '六', '日']

const heatmapDays = computed(() => {
  const days = []
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
  const startDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1 // 周一为0
  
  // 填充月初空白
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push({ hasData: false, isToday: false, date: '' })
  }
  
  // 填充当月日期
  const today = new Date()
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(currentYear.value, currentMonth.value, day)
    const dateStr = date.toISOString().split('T')[0]
    const hasData = userStore.learningHeatmap[dateStr] > 0
    const isToday = date.toDateString() === today.toDateString()
    
    days.push({
      hasData,
      isToday,
      date: dateStr,
      day
    })
  }
  
  return days
})

function formatStudyTime(minutes) {
  if (minutes < 60) {
    return `${minutes}m`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h${mins}m` : `${hours}h`
}

function formatRelativeTime(timeStr) {
  if (!timeStr) return ''
  const time = new Date(timeStr)
  const now = new Date()
  const diff = now - time
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes} 分钟前`
  if (hours < 24) return `${hours} 小时前`
  if (days === 1) return '昨天'
  if (days < 7) return `${days} 天前`
  return `${Math.floor(days / 7)} 周前`
}

function getCourseCover(courseId) {
  const course = courseStore.courses.find(c => c.id === courseId)
  return course?.cover || '/imgs/covers/nce-1.png'
}

function handleImageError(event) {
  event.target.src = '/imgs/covers/nce-1.png'
}

// 获取最新学习进度
async function loadLatestProgress() {
  try {
    loadingProgress.value = true
    const progress = await progressApi.getLatestProgress()
    latestProgress.value = progress
    console.log('最新学习进度:', progress)
  } catch (error) {
    // 如果是404错误（没有找到学习进度），这是正常情况（用户可能还没有开始学习）
    if (error.detail === '没有找到学习进度') {
      console.log('用户还没有学习记录，这是正常情况')
      latestProgress.value = null
    } else if (error.detail === '无效的认证凭据') {
      console.log('用户未登录，跳过获取学习进度')
      latestProgress.value = null
    } else {
      console.warn('获取最新学习进度失败:', error)
      latestProgress.value = null
    }
  } finally {
    loadingProgress.value = false
  }
}

// 继续学习
function continueLearning() {
  if (latestProgress.value) {
    router.push({
      name: 'Learning',
      params: {
        courseId: latestProgress.value.course_id,
        lessonId: latestProgress.value.lesson_id
      }
    })
  }
}

function goToLesson(lesson) {
  router.push({
    name: 'Learning',
    params: {
      courseId: lesson.courseId,
      lessonId: lesson.id
    }
  })
}

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

onMounted(async () => {
  console.log('[Dashboard] onMounted 执行')
  try {
    console.log('[Dashboard] 开始加载用户数据')
    await userStore.loadUserData()
    console.log('[Dashboard] 用户数据加载完成')
    
    console.log('[Dashboard] 开始加载课程列表')
    await courseStore.loadCourses()
    console.log('[Dashboard] 课程列表加载完成，课程数量:', courseStore.courses.length)
    
    console.log('[Dashboard] 开始加载最新学习进度')
    await loadLatestProgress()
    console.log('[Dashboard] 最新学习进度加载完成')
  } catch (error) {
    console.error('[Dashboard] 初始化失败:', error)
    console.error('[Dashboard] 错误堆栈:', error.stack)
  }
})
</script>

<style scoped>
.heatmap-container {
  max-width: 100%;
  overflow-x: auto;
}
</style>
