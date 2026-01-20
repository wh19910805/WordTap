<template>
  <div class="fixed inset-0 bg-black/50 z-50 flex items-end" @click.self="$emit('close')">
    <div class="w-full bg-white dark:bg-gray-800 rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold">设置</h2>
        <button @click="$emit('close')" class="p-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="space-y-6">
        <!-- 外观 -->
        <div>
          <h3 class="text-lg font-semibold mb-3">外观</h3>
          <div class="flex gap-2">
            <button
              v-for="theme in themes"
              :key="theme.value"
              @click="settingsStore.theme = theme.value; settingsStore.applyTheme()"
              :class="[
                'flex-1 py-2 px-4 rounded-lg border-2 transition-colors',
                settingsStore.theme === theme.value
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              ]"
            >
              {{ theme.label }}
            </button>
          </div>
        </div>

        <!-- 声音 -->
        <div>
          <h3 class="text-lg font-semibold mb-3">声音</h3>
          <div class="space-y-3">
            <label class="flex items-center justify-between">
              <span>打字音效</span>
              <input
                type="checkbox"
                v-model="settingsStore.keypressSound"
                class="w-12 h-6 rounded-full bg-gray-200 appearance-none relative transition-colors checked:bg-primary-500"
              />
            </label>
            <label class="flex items-center justify-between">
              <span>自动播放音频</span>
              <input
                type="checkbox"
                v-model="settingsStore.autoPlayAudio"
                class="w-12 h-6 rounded-full bg-gray-200 appearance-none relative transition-colors checked:bg-primary-500"
              />
            </label>
            <div>
              <div class="mb-2">
                <span class="text-sm text-gray-600 dark:text-gray-400">发音类型</span>
              </div>
              <div class="flex gap-2">
                <button
                  @click="settingsStore.pronunciationType = 1"
                  :class="[
                    'flex-1 py-2 px-4 rounded-lg border-2 transition-colors',
                    settingsStore.pronunciationType === 1
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  ]"
                >
                  英音
                </button>
                <button
                  @click="settingsStore.pronunciationType = 2"
                  :class="[
                    'flex-1 py-2 px-4 rounded-lg border-2 transition-colors',
                    settingsStore.pronunciationType === 2
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  ]"
                >
                  美音
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 显示 -->
        <div>
          <h3 class="text-lg font-semibold mb-3">显示</h3>
          <div class="space-y-3">
            <label class="flex items-center justify-between">
              <span>默认显示中文</span>
              <input
                type="checkbox"
                v-model="settingsStore.showChinese"
                class="w-12 h-6 rounded-full bg-gray-200 appearance-none relative transition-colors checked:bg-primary-500"
              />
            </label>
            <label class="flex items-center justify-between">
              <span>默认显示英文</span>
              <input
                type="checkbox"
                v-model="settingsStore.defaultShowEnglish"
                class="w-12 h-6 rounded-full bg-gray-200 appearance-none relative transition-colors checked:bg-primary-500"
              />
            </label>
            <label class="flex items-center justify-between">
              <span>默认显示人名</span>
              <input
                type="checkbox"
                v-model="settingsStore.defaultShowName"
                class="w-12 h-6 rounded-full bg-gray-200 appearance-none relative transition-colors checked:bg-primary-500"
              />
            </label>
            <div>
              <div class="flex items-center justify-between mb-2">
                <span>字体大小</span>
                <span class="text-primary-500">{{ settingsStore.fontSize }}px</span>
              </div>
              <input
                type="range"
                min="14"
                max="24"
                v-model.number="settingsStore.fontSize"
                class="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSettingsStore } from '@/stores/settings'

const settingsStore = useSettingsStore()

const themes = [
  { value: 'light', label: '浅色' },
  { value: 'dark', label: '深色' },
  { value: 'system', label: '跟随系统' }
]

defineEmits(['close'])
</script>

<style scoped>
input[type="checkbox"]::before {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  top: 2px;
  left: 2px;
  transition: transform 0.2s;
}

input[type="checkbox"]:checked::before {
  transform: translateX(24px);
}
</style>

