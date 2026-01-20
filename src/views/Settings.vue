<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
    <!-- 顶部导航栏 -->
    <div class="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center gap-4 px-4 py-3">
        <button
          @click="goBack"
          class="p-2 -ml-2 active:bg-gray-100 dark:active:bg-gray-700 rounded-lg transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-lg font-semibold flex-1">{{ settingTitle }}</h1>
        <div class="w-10"></div>
      </div>
    </div>

    <div class="p-4 space-y-4">
      <!-- 外观设置 -->
      <div v-if="settingType === 'appearance'">
        <!-- 主题设置 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 mb-4">
          <h3 class="text-base font-semibold mb-4">主题设置</h3>
          <div class="grid grid-cols-3 gap-3">
            <button
              @click="settingsStore.theme = 'light'; settingsStore.applyTheme()"
              :class="[
                'p-4 rounded-xl border-2 transition-colors flex flex-col items-center gap-2 active:scale-95',
                settingsStore.theme === 'light'
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              ]"
            >
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span class="text-sm">浅色</span>
            </button>
            <button
              @click="settingsStore.theme = 'dark'; settingsStore.applyTheme()"
              :class="[
                'p-4 rounded-xl border-2 transition-colors flex flex-col items-center gap-2 active:scale-95',
                settingsStore.theme === 'dark'
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              ]"
            >
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <span class="text-sm">深色</span>
            </button>
            <button
              @click="settingsStore.theme = 'system'; settingsStore.applyTheme()"
              :class="[
                'p-4 rounded-xl border-2 transition-colors flex flex-col items-center gap-2 active:scale-95',
                settingsStore.theme === 'system'
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              ]"
            >
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span class="text-sm">跟随系统</span>
            </button>
          </div>
        </div>

        <!-- 字体设置 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 mb-4">
          <h3 class="text-base font-semibold mb-3">字体设置</h3>
          <div class="space-y-2">
            <label class="flex items-center justify-between p-3 rounded-lg active:bg-gray-100 dark:active:bg-gray-700 cursor-pointer">
              <span>系统默认字体</span>
              <svg v-if="settingsStore.fontFamily === 'system'" class="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <input
                type="radio"
                v-model="settingsStore.fontFamily"
                value="system"
                class="hidden"
              />
            </label>
            <label class="flex items-center justify-between p-3 rounded-lg active:bg-gray-100 dark:active:bg-gray-700 cursor-pointer">
              <span>Fredoka</span>
              <svg v-if="settingsStore.fontFamily === 'fredoka'" class="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <input
                type="radio"
                v-model="settingsStore.fontFamily"
                value="fredoka"
                class="hidden"
              />
            </label>
          </div>
        </div>

        <!-- 预览文本 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 mb-4">
          <h3 class="text-base font-semibold mb-3">预览文本</h3>
          <div class="text-base p-3 bg-gray-50 dark:bg-gray-700 rounded-lg" :style="{ fontFamily: settingsStore.fontFamily === 'fredoka' ? 'Fredoka, sans-serif' : 'system-ui, sans-serif' }">
            你好,世界! Hello, World!
          </div>
        </div>

        <!-- 音标大小 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4">
          <h3 class="text-base font-semibold mb-3">音标大小</h3>
          <div class="grid grid-cols-3 gap-3">
            <button
              @click="settingsStore.phoneticSize = 'small'"
              :class="[
                'p-4 rounded-xl border-2 transition-colors active:scale-95',
                settingsStore.phoneticSize === 'small'
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              ]"
            >
              <div class="text-sm mb-2 font-medium">小</div>
              <div class="text-xs text-gray-600 dark:text-gray-400">/'helǝʊ/</div>
            </button>
            <button
              @click="settingsStore.phoneticSize = 'medium'"
              :class="[
                'p-4 rounded-xl border-2 transition-colors active:scale-95',
                settingsStore.phoneticSize === 'medium'
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              ]"
            >
              <div class="text-sm mb-2 font-medium">中</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">/'helǝʊ/</div>
            </button>
            <button
              @click="settingsStore.phoneticSize = 'large'"
              :class="[
                'p-4 rounded-xl border-2 transition-colors active:scale-95',
                settingsStore.phoneticSize === 'large'
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700'
              ]"
            >
              <div class="text-sm mb-2 font-medium">大</div>
              <div class="text-base text-gray-600 dark:text-gray-400">/'hɛləʊ/</div>
            </button>
          </div>
        </div>
      </div>

      <!-- 答题设置 -->
      <div v-else-if="settingType === 'answering'">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-5">
          <!-- 答题正确后自动下一题 -->
          <label class="flex items-center justify-between py-2">
            <span class="text-base">答题正确后自动下一题</span>
            <input
              type="checkbox"
              v-model="settingsStore.autoNextAfterCorrect"
              class="w-12 h-6 rounded-full bg-gray-200 appearance-none relative transition-colors checked:bg-primary-500"
            />
          </label>

          <div class="h-px bg-gray-200 dark:bg-gray-700"></div>

          <!-- 忽略大小写 -->
          <label class="flex items-center justify-between py-2">
            <span class="text-base">忽略大小写</span>
            <input
              type="checkbox"
              v-model="settingsStore.ignoreCase"
              class="w-12 h-6 rounded-full bg-gray-200 appearance-none relative transition-colors checked:bg-primary-500"
            />
          </label>

          <div class="h-px bg-gray-200 dark:bg-gray-700"></div>

          <!-- 答题输入框样式 -->
          <div>
            <div class="mb-3">
              <span class="text-base">答题输入框样式</span>
            </div>
            <select
              v-model="settingsStore.inputBoxStyle"
              class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-base"
            >
              <option value="word-length">单词长度</option>
              <option value="fixed">固定宽度</option>
              <option value="auto">自动宽度</option>
            </select>
          </div>

          <div class="h-px bg-gray-200 dark:bg-gray-700"></div>

          <!-- 自动显示答案 -->
          <div>
            <div class="mb-3">
              <span class="text-base">自动显示答案</span>
            </div>
            <select
              v-model="settingsStore.autoShowAnswer"
              class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-base"
            >
              <option value="never">从不</option>
              <option value="after-3-errors">错误3次后</option>
              <option value="after-5-errors">错误5次后</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 播放设置 -->
      <div v-else-if="settingType === 'playback'">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-5">
          <!-- 倍速 -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-base">倍速</span>
              <span class="text-primary-500 font-semibold text-lg">{{ settingsStore.playbackSpeed }}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.25"
              v-model.number="settingsStore.playbackSpeed"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
            <div class="flex justify-between text-xs text-gray-500 mt-2">
              <span>0.5x</span>
              <span>1x</span>
              <span>1.5x</span>
              <span>2x</span>
            </div>
          </div>

          <div class="h-px bg-gray-200 dark:bg-gray-700"></div>

          <!-- 播放次数 -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-base">播放次数</span>
              <span class="text-primary-500 font-semibold text-lg">{{ settingsStore.playbackCount }}次</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              v-model.number="settingsStore.playbackCount"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
            <div class="flex justify-between text-xs text-gray-500 mt-2">
              <span>1次</span>
              <span>3次</span>
              <span>5次</span>
            </div>
          </div>

          <div class="h-px bg-gray-200 dark:bg-gray-700"></div>

          <!-- 播放间隔 -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-base">播放间隔</span>
              <span class="text-primary-500 font-semibold text-lg">{{ settingsStore.playbackInterval }}s</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              v-model.number="settingsStore.playbackInterval"
              class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
            <div class="flex justify-between text-xs text-gray-500 mt-2">
              <span>0s</span>
              <span>2.5s</span>
              <span>5s</span>
            </div>
          </div>

          <div class="h-px bg-gray-200 dark:bg-gray-700"></div>

          <!-- 课程循环播放 -->
          <label class="flex items-center justify-between py-2">
            <span class="text-base">课程循环播放</span>
            <input
              type="checkbox"
              v-model="settingsStore.loopCourse"
              class="w-12 h-6 rounded-full bg-gray-200 appearance-none relative transition-colors checked:bg-primary-500"
            />
          </label>

          <div class="h-px bg-gray-200 dark:bg-gray-700"></div>

          <!-- 隐藏答案 -->
          <label class="flex items-center justify-between py-2">
            <span class="text-base">隐藏答案</span>
            <input
              type="checkbox"
              v-model="settingsStore.hideAnswer"
              class="w-12 h-6 rounded-full bg-gray-200 appearance-none relative transition-colors checked:bg-primary-500"
            />
          </label>

          <div class="h-px bg-gray-200 dark:bg-gray-700"></div>

          <!-- 自动跳到下一题 -->
          <label class="flex items-center justify-between py-2">
            <span class="text-base">自动跳到下一题</span>
            <input
              type="checkbox"
              v-model="settingsStore.autoSkipNext"
              class="w-12 h-6 rounded-full bg-gray-200 appearance-none relative transition-colors checked:bg-primary-500"
            />
          </label>
        </div>
      </div>

      <!-- 听力设置 -->
      <div v-else-if="settingType === 'listening'">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4">
          <p class="text-gray-500 dark:text-gray-400 text-center py-8">暂无设置项</p>
        </div>
      </div>

      <!-- 口语设置 -->
      <div v-else-if="settingType === 'speaking'">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4">
          <h3 class="text-base font-semibold mb-4">显示模式</h3>
          <div class="space-y-3">
            <label class="flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors active:scale-[0.98]"
              :class="settingsStore.speakingDisplayMode === 'english' 
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                : 'border-gray-200 dark:border-gray-700'">
              <input
                type="radio"
                v-model="settingsStore.speakingDisplayMode"
                value="english"
                class="mt-1 w-5 h-5"
              />
              <div class="flex-1">
                <div class="font-semibold mb-1 text-base">显示英文</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">看英文原句,练习朗读发音</div>
              </div>
              <svg v-if="settingsStore.speakingDisplayMode === 'english'" class="w-6 h-6 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </label>

            <label class="flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors active:scale-[0.98]"
              :class="settingsStore.speakingDisplayMode === 'chinese' 
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                : 'border-gray-200 dark:border-gray-700'">
              <input
                type="radio"
                v-model="settingsStore.speakingDisplayMode"
                value="chinese"
                class="mt-1 w-5 h-5"
              />
              <div class="flex-1">
                <div class="font-semibold mb-1 text-base">显示中文</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">看中文翻译,练习口语翻译</div>
              </div>
              <svg v-if="settingsStore.speakingDisplayMode === 'chinese'" class="w-6 h-6 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </label>

            <label class="flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors active:scale-[0.98]"
              :class="settingsStore.speakingDisplayMode === 'blind' 
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                : 'border-gray-200 dark:border-gray-700'">
              <input
                type="radio"
                v-model="settingsStore.speakingDisplayMode"
                value="blind"
                class="mt-1 w-5 h-5"
              />
              <div class="flex-1">
                <div class="font-semibold mb-1 text-base">盲读模式</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">不显示任何提示,挑战记忆</div>
              </div>
              <svg v-if="settingsStore.speakingDisplayMode === 'blind'" class="w-6 h-6 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'

const route = useRoute()
const router = useRouter()
const settingsStore = useSettingsStore()

const settingType = computed(() => {
  return route.params.settingType || 'appearance'
})

const settingTitle = computed(() => {
  const titles = {
    appearance: '外观设置',
    answering: '答题设置',
    playback: '播放设置',
    listening: '听力设置',
    speaking: '口语设置'
  }
  return titles[settingType.value] || '设置'
})

function goBack() {
  router.back()
}
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

input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #8b5cf6;
  cursor: pointer;
  -webkit-appearance: none;
}

input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #8b5cf6;
  cursor: pointer;
  border: none;
}
</style>
