<template>
  <div class="fixed inset-0 bg-black/50 z-50 flex items-end" @click.self="$emit('close')">
    <div
      class="w-full bg-white border-t-2 border-slate-200 rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
    >
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-gray-900">设置</h2>
        <button
          @click="$emit('close')"
          class="p-2 hover:bg-slate-100 rounded-full transition-colors active:scale-95"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            />
          </svg>
        </button>
      </div>

      <div class="space-y-6">
        <!-- 外观 -->
        <div
          class="bg-white border-2 border-slate-200 rounded-3xl p-6 transition-all duration-200"
        >
          <h3 class="text-lg font-semibold mb-4 text-gray-900">外观</h3>
          <div class="grid grid-cols-3 gap-4">
            <button
              v-for="theme in themes"
              :key="theme.value"
              @click="
                settingsStore.theme = theme.value;
                settingsStore.applyTheme();
              "
              :class="[
                'p-4 rounded-lg border-2 transition-colors flex flex-col items-center gap-2 active:scale-95',
                settingsStore.theme === theme.value
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-slate-200',
              ]"
            >
              {{ theme.label }}
            </button>
          </div>
        </div>

        <!-- 声音 -->
        <div
          class="bg-white border-2 border-slate-200 rounded-3xl p-6 transition-all duration-200"
        >
          <h3 class="text-lg font-semibold mb-4 text-gray-900">声音</h3>
          <div class="space-y-4">
            <label
              class="flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer"
            >
              <span class="text-base">打字音效</span>
              <input
                type="checkbox"
                v-model="settingsStore.keypressSound"
                class="w-12 h-6 rounded-full bg-slate-200 appearance-none relative transition-colors checked:bg-indigo-600"
              />
            </label>
            <label
              class="flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer"
            >
              <span class="text-base">自动播放音频</span>
              <input
                type="checkbox"
                v-model="settingsStore.autoPlayAudio"
                class="w-12 h-6 rounded-full bg-slate-200 appearance-none relative transition-colors checked:bg-indigo-600"
              />
            </label>
            <div>
              <div class="mb-3 text-sm text-gray-600">发音类型</div>
              <div class="grid grid-cols-2 gap-4">
                <button
                  @click="settingsStore.pronunciationType = 1"
                  :class="[
                    'p-4 rounded-lg border-2 transition-colors active:scale-95',
                    settingsStore.pronunciationType === 1
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-slate-200',
                  ]"
                >
                  英音
                </button>
                <button
                  @click="settingsStore.pronunciationType = 2"
                  :class="[
                    'p-4 rounded-lg border-2 transition-colors active:scale-95',
                    settingsStore.pronunciationType === 2
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-slate-200',
                  ]"
                >
                  美音
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 显示 -->
        <div
          class="bg-white border-2 border-slate-200 rounded-3xl p-6 transition-all duration-200"
        >
          <h3 class="text-lg font-semibold mb-4 text-gray-900">显示</h3>
          <div class="space-y-4">
            <label
              class="flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer"
            >
              <span class="text-base">默认显示中文</span>
              <input
                type="checkbox"
                v-model="settingsStore.showChinese"
                class="w-12 h-6 rounded-full bg-slate-200 appearance-none relative transition-colors checked:bg-indigo-600"
              />
            </label>
            <label
              class="flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer"
            >
              <span class="text-base">默认显示英文</span>
              <input
                type="checkbox"
                v-model="settingsStore.defaultShowEnglish"
                class="w-12 h-6 rounded-full bg-slate-200 appearance-none relative transition-colors checked:bg-indigo-600"
              />
            </label>
            <label
              class="flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer"
            >
              <span class="text-base">默认显示人名</span>
              <input
                type="checkbox"
                v-model="settingsStore.defaultShowName"
                class="w-12 h-6 rounded-full bg-slate-200 appearance-none relative transition-colors checked:bg-indigo-600"
              />
            </label>
            <div>
              <div class="flex items-center justify-between mb-3">
                <span class="text-base font-medium">字体大小</span>
                <span class="text-indigo-600 font-bold"
                  >{{ settingsStore.fontSize }}px</span
                >
              </div>
              <input
                type="range"
                min="14"
                max="24"
                v-model.number="settingsStore.fontSize"
                class="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSettingsStore } from "@/stores/settings";

const settingsStore = useSettingsStore();

const themes = [
  { value: "light", label: "浅色" },
  { value: "dark", label: "深色" },
  { value: "system", label: "跟随系统" },
];

defineEmits(["close"]);
</script>

<style scoped>
input[type="checkbox"]::before {
  content: "";
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
  background: #4f46e5;
  cursor: pointer;
  -webkit-appearance: none;
}

input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4f46e5;
  cursor: pointer;
  border: none;
}
</style>
