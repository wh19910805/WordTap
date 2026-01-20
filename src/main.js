// 最开始的日志，确认文件是否被加载
console.log('[main.js] ========== 文件开始执行 ==========')

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'
import { useAuthStore } from './stores/auth'

console.log('[main.js] 导入完成')

const app = createApp(App)
const pinia = createPinia()

console.log('[main.js] 创建应用和 Pinia 完成')

app.use(pinia)
app.use(router)

console.log('[main.js] 注册插件完成')

// 检查 DOM 元素
const appElement = document.getElementById('app')
if (!appElement) {
  console.error('[main.js] 错误: 找不到 #app 元素')
} else {
  console.log('[main.js] 找到 #app 元素:', appElement)
}

// 直接挂载应用，不等待认证初始化
// 认证初始化在路由守卫中处理
try {
  app.mount('#app')
  console.log('[main.js] 应用挂载成功')
} catch (error) {
  console.error('[main.js] 应用挂载失败:', error)
}

// 异步初始化认证状态（不阻塞应用挂载）
const authStore = useAuthStore()
authStore.init().then(() => {
  console.log('[main.js] 认证初始化完成')
}).catch((error) => {
  console.error('[main.js] 认证初始化失败:', error)
})

