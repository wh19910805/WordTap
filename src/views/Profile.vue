<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
    <div class="p-4 space-y-4">
      <!-- 顶部标题 -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <h1 class="text-xl font-bold">我的</h1>
          <span class="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
        </div>
      </div>

      <!-- 用户信息卡片 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4">
        <div class="flex items-center gap-3" @click="goToProfileDetail">
          <div class="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl flex-shrink-0">
            <svg v-if="!authStore.isAuthenticated" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span v-else class="font-bold">{{ userInitial }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-semibold text-lg">
              {{ authStore.isAuthenticated ? (authStore.currentUser?.username || '用户') : '游客' }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ authStore.isAuthenticated ? `@${authStore.currentUser?.username || 'user'}` : '@guest' }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              学习天数: {{ userStore.streak }} 天
            </div>
          </div>
          <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      <!-- 统计数据 -->
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4">
          <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">累计词汇</div>
          <div class="text-2xl font-bold">{{ userStore.wordCount }}</div>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4">
          <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">学习时长</div>
          <div class="text-2xl font-bold">{{ totalStudyTime }}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">分钟</div>
        </div>
      </div>

      <!-- 设置列表 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
        <button
          v-for="setting in settingsList"
          :key="setting.key"
          @click="goToSettings(setting.key)"
          class="w-full p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 last:border-b-0 active:bg-gray-100 dark:active:bg-gray-700 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="setting.key === 'appearance'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                <path v-else-if="setting.key === 'answering'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                <path v-else-if="setting.key === 'playback'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path v-else-if="setting.key === 'listening'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path v-else-if="setting.key === 'speaking'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <span class="text-base font-medium">{{ setting.label }}</span>
          </div>
          <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- 退出登录 -->
      <div class="pt-4">
        <button
          v-if="authStore.isAuthenticated"
          @click="handleLogout"
          class="w-full py-4 px-4 bg-red-500 text-white rounded-xl font-medium active:bg-red-600 transition-colors"
        >
          退出登录
        </button>
        <button
          v-else
          @click="goToLogin"
          class="w-full py-4 px-4 bg-primary-500 text-white rounded-xl font-medium active:bg-primary-600 transition-colors"
        >
          登录/注册
        </button>
      </div>
    </div>

    <TabBar />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/auth'
import TabBar from '@/components/TabBar.vue'

const router = useRouter()
const userStore = useUserStore()
const authStore = useAuthStore()

const userInitial = computed(() => {
  if (authStore.isAuthenticated && authStore.currentUser) {
    return authStore.currentUser.username.charAt(0).toUpperCase()
  }
  return 'U'
})

const totalStudyTime = computed(() => {
  const time = userStore.studyTime
  return (time.today || 0) + (time.week || 0) + (time.month || 0) + (time.year || 0)
})

// 设置分类列表
const settingsList = [
  {
    key: 'appearance',
    label: '外观设置'
  },
  {
    key: 'answering',
    label: '答题设置'
  },
  {
    key: 'playback',
    label: '播放设置'
  },
  {
    key: 'listening',
    label: '听力设置'
  },
  {
    key: 'speaking',
    label: '口语设置'
  }
]

function goToSettings(settingType) {
  router.push(`/settings/${settingType}`)
}

function goToProfileDetail() {
  // 可以跳转到详细的个人资料页面
  // router.push('/profile/detail')
}

async function handleLogout() {
  if (confirm('确定要退出登录吗？')) {
    await authStore.logout()
    router.push('/login')
  }
}

function goToLogin() {
  router.push('/login')
}

onMounted(async () => {
  await userStore.loadUserData()
  await authStore.init()
})
</script>

