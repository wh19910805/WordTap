import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import Discovery from '@/views/Discovery.vue'
import CourseDetail from '@/views/CourseDetail.vue'
import ChapterList from '@/views/ChapterList.vue'
import Learning from '@/views/Learning.vue'
import Profile from '@/views/Profile.vue'
import Settings from '@/views/Settings.vue'
import Login from '@/views/Login.vue'
import DatabaseViewer from '@/views/DatabaseViewer.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { showTabBar: true, requiresAuth: false } // 暂时不需要登录
  },
  {
    path: '/discovery',
    name: 'Discovery',
    component: Discovery,
    meta: { showTabBar: true, requiresAuth: false }
  },
  {
    path: '/course/:id',
    name: 'CourseDetail',
    component: CourseDetail,
    meta: { requiresAuth: false }
  },
  {
    path: '/course/:id/chapters',
    name: 'ChapterList',
    component: ChapterList,
    meta: { requiresAuth: false }
  },
  {
    path: '/course/:courseId/lesson/:lessonId',
    name: 'Learning',
    component: Learning,
    meta: { requiresAuth: false }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { showTabBar: true, requiresAuth: false }
  },
  {
    path: '/settings/:settingType',
    name: 'Settings',
    component: Settings,
    meta: { requiresAuth: false }
  },
  {
    path: '/database',
    name: 'DatabaseViewer',
    component: DatabaseViewer,
    meta: { requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫（可选，如果需要强制登录）
router.beforeEach(async (to, from, next) => {
  console.log('[router] beforeEach 触发:', { from: from.path, to: to.path, name: to.name })
  
  try {
    const authStore = useAuthStore()
    
    // 初始化认证状态
    if (!authStore.isAuthenticated) {
      console.log('[router] 开始初始化认证状态')
      await authStore.init()
      console.log('[router] 认证状态初始化完成')
    }
    
    // 如果路由需要登录但用户未登录，可以重定向到登录页
    // 目前设置为不需要登录，所以直接通过
    // if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    //   next({ name: 'Login', query: { redirect: to.fullPath } })
    // } else {
    //   next()
    // }
    
    console.log('[router] 路由守卫通过，继续导航')
    next()
  } catch (error) {
    console.error('[router] 路由守卫错误:', error)
    next()
  }
})

router.afterEach((to, from) => {
  console.log('[router] afterEach 触发:', { from: from.path, to: to.path, name: to.name })
})

export default router

