import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { authApi } from '@/api/client'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref(null)
  const isAuthenticated = computed(() => !!currentUser.value)
  const token = useStorage('wordtap_token', null)

  // 初始化：检查是否有已登录用户
  async function init() {
    try {
      if (token.value) {
        try {
          const user = await authApi.getCurrentUser()
          if (user) {
            currentUser.value = {
              id: user.id,
              username: user.username,
              email: user.email
            }
            return true
          } else {
            token.value = null
          }
        } catch (error) {
          console.error('获取用户信息失败:', error)
          token.value = null
        }
      }
      return false
    } catch (error) {
      console.error('初始化认证失败:', error)
      token.value = null
      return false
    }
  }

  // 注册
  async function register(username, email, password) {
    try {
      // 调用API注册
      const result = await authApi.register({
        username,
        email,
        password
      })
      
      // 注册成功后自动登录
      if (result.success) {
        await login(username, password)
      }
      
      return result
    } catch (error) {
      console.error('注册失败:', error)
      return { 
        success: false, 
        message: error.message || '注册失败，请重试'
      }
    }
  }

  // 登录
  async function login(usernameOrEmail, password) {
    try {
      // 调用API登录
      const result = await authApi.login({
        usernameOrEmail,
        password
      })
      
      // 登录成功后设置用户信息
      if (result.success) {
        // 获取当前用户信息
        const user = await authApi.getCurrentUser()
        if (user) {
          currentUser.value = {
            id: user.id,
            username: user.username,
            email: user.email
          }
        }
      }
      
      return result
    } catch (error) {
      console.error('登录失败:', error)
      return { 
        success: false, 
        message: error.message || '登录失败，请重试'
      }
    }
  }

  // 登出
  async function logout() {
    currentUser.value = null
    token.value = null
  }

  return {
    currentUser,
    isAuthenticated,
    token,
    init,
    register,
    login,
    logout
  }
})

