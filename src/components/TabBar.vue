<template>
  <div class="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border-t border-gray-200/50 dark:border-gray-700/50 safe-area-inset-bottom shadow-lg">
    <div class="flex items-center justify-around h-16 px-2">
      <router-link
        v-for="tab in tabs"
        :key="tab.path"
        :to="tab.path"
        class="flex flex-col items-center justify-center flex-1 h-full relative transition-all duration-300"
        :class="isActive(tab.path) ? 'text-primary-500' : 'text-gray-500 dark:text-gray-400'"
      >
        <div class="relative">
          <component :is="tab.icon" class="w-6 h-6 mb-1 transition-transform duration-300" :class="isActive(tab.path) ? 'scale-110' : ''" />
          <div v-if="isActive(tab.path)" class="absolute -top-1 -right-1 w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
        </div>
        <span class="text-xs font-medium transition-all duration-300" :class="isActive(tab.path) ? 'scale-105' : ''">{{ tab.label }}</span>
        <div v-if="isActive(tab.path)" class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary-500 rounded-t-full"></div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { HomeIcon, ExploreIcon, ProfileIcon } from './icons/index.js'

const route = useRoute()

const tabs = [
  {
    path: '/',
    label: '首页',
    icon: HomeIcon
  },
  {
    path: '/discovery',
    label: '发现',
    icon: ExploreIcon
  },
  {
    path: '/profile',
    label: '我的',
    icon: ProfileIcon
  }
]

function isActive(path) {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}
</script>

