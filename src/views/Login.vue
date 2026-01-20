<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8 animate-fade-in">
        <div class="flex justify-center mb-4">
          <div class="relative">
            <div class="w-20 h-20 bg-gradient-to-br from-primary-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl logo-float">
              <span class="text-white font-bold text-4xl">W</span>
            </div>
            <div class="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full border-4 border-white dark:border-gray-900 animate-pulse-slow"></div>
          </div>
        </div>
        <h1 class="text-4xl font-bold gradient-text mb-2">WordTap</h1>
        <p class="text-gray-500 dark:text-gray-400 text-lg">沉浸式英语听写练习</p>
      </div>

      <!-- 登录/注册表单 -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-6">
        <!-- Tab 切换 -->
        <div class="flex gap-2 border-b border-gray-200 dark:border-gray-700">
          <button
            @click="isLogin = true"
            :class="[
              'flex-1 py-3 text-center font-medium transition-colors border-b-2',
              isLogin
                ? 'border-primary-500 text-primary-500'
                : 'border-transparent text-gray-500 dark:text-gray-400'
            ]"
          >
            登录
          </button>
          <button
            @click="isLogin = false"
            :class="[
              'flex-1 py-3 text-center font-medium transition-colors border-b-2',
              !isLogin
                ? 'border-primary-500 text-primary-500'
                : 'border-transparent text-gray-500 dark:text-gray-400'
            ]"
          >
            注册
          </button>
        </div>

        <!-- 错误提示 -->
        <div
          v-if="errorMessage"
          class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-600 dark:text-red-400"
        >
          {{ errorMessage }}
        </div>

        <!-- 登录表单 -->
        <form v-if="isLogin" @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              用户名或邮箱
            </label>
            <input
              v-model="loginForm.username"
              type="text"
              required
              placeholder="请输入用户名或邮箱"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              密码
            </label>
            <input
              v-model="loginForm.password"
              type="password"
              required
              placeholder="请输入密码"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isLoading ? '登录中...' : '登录' }}
          </button>
        </form>

        <!-- 注册表单 -->
        <form v-else @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              用户名
            </label>
            <input
              v-model="registerForm.username"
              type="text"
              required
              minlength="3"
              placeholder="请输入用户名（至少3个字符）"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              邮箱
            </label>
            <input
              v-model="registerForm.email"
              type="email"
              required
              placeholder="请输入邮箱"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              密码
            </label>
            <input
              v-model="registerForm.password"
              type="password"
              required
              minlength="6"
              placeholder="请输入密码（至少6个字符）"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              确认密码
            </label>
            <input
              v-model="registerForm.confirmPassword"
              type="password"
              required
              placeholder="请再次输入密码"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isLoading ? '注册中...' : '注册' }}
          </button>
        </form>

        <!-- 快速体验（跳过登录） -->
        <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            @click="skipLogin"
            class="w-full text-center text-sm text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors"
          >
            先体验，稍后登录
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isLogin = ref(true)
const isLoading = ref(false)
const errorMessage = ref('')

const loginForm = ref({
  username: '',
  password: ''
})

const registerForm = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

async function handleLogin() {
  errorMessage.value = ''
  isLoading.value = true

  try {
    const result = await authStore.login(loginForm.value.username, loginForm.value.password)
    
    if (result.success) {
      router.push('/')
    } else {
      errorMessage.value = result.message
    }
  } catch (error) {
    errorMessage.value = '登录失败，请重试'
  } finally {
    isLoading.value = false
  }
}

async function handleRegister() {
  errorMessage.value = ''

  // 验证密码
  if (registerForm.value.password !== registerForm.value.confirmPassword) {
    errorMessage.value = '两次输入的密码不一致'
    return
  }

  if (registerForm.value.password.length < 6) {
    errorMessage.value = '密码长度至少为6个字符'
    return
  }

  isLoading.value = true

  try {
    const result = await authStore.register(
      registerForm.value.username,
      registerForm.value.email,
      registerForm.value.password
    )
    
    if (result.success) {
      router.push('/')
    } else {
      errorMessage.value = result.message
    }
  } catch (error) {
    errorMessage.value = '注册失败，请重试'
  } finally {
    isLoading.value = false
  }
}

function skipLogin() {
  // 跳过登录，直接进入应用
  router.push('/')
}
</script>

