<template>
  <div
    ref="containerRef"
    class="learning-container fixed inset-0 w-full h-full overflow-hidden bg-gray-900 text-white flex flex-col"
    :style="containerStyle"
  >
    <!-- 顶部导航区 -->
    <div class="flex items-center justify-between p-4 bg-gray-800/50 backdrop-blur-sm z-20">
      <button @click="goBack" class="p-2">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div class="text-sm font-medium">
        {{ learningStore.currentSentenceIndex + 1 }}/{{ learningStore.totalSentences }}
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="learningStore.toggleEnglish"
          :class="[
            'px-2.5 py-1 rounded-lg text-xs font-medium transition-colors',
            learningStore.showEnglish
              ? 'bg-primary-500 text-white'
              : 'bg-gray-700 text-gray-300'
          ]"
        >
          {{ learningStore.showEnglish ? '隐藏英文' : '显示英文' }}
        </button>
        <button
          @click="learningStore.toggleChinese"
          :class="[
            'px-2.5 py-1 rounded-lg text-xs font-medium transition-colors',
            learningStore.showChinese
              ? 'bg-primary-500 text-white'
              : 'bg-gray-700 text-gray-300'
          ]"
        >
          {{ learningStore.showChinese ? '隐藏中文' : '显示中文' }}
        </button>
        <button @click="showSettings = true" class="p-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 数据与控制栏 -->
    <div class="px-4 py-2 bg-gray-800/30 backdrop-blur-sm">
      <div class="flex items-center justify-between text-xs mb-2">
        <div>第 {{ attemptCount }} 次</div>
        <div>计时: {{ formatTime(learningStore.elapsedTime) }}</div>
        <div>词数: {{ learningStore.remainingWords }}/{{ learningStore.totalWords }}</div>
      </div>
      
      <!-- 音频控制 -->
      <div class="flex items-center gap-2">
        <div class="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
          <div class="h-full bg-primary-500" :style="{ width: audioProgress + '%' }"></div>
        </div>
        <button @click="togglePlay" class="p-2">
          <svg v-if="!learningStore.isPlaying" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
          </svg>
          <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" />
          </svg>
        </button>
        <button @click="toggleMute" class="p-2">
          <svg v-if="!settingsStore.mute" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4.617-3.793a1 1 0 011.383.07zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clip-rule="evenodd" />
          </svg>
          <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4.617-3.793a1 1 0 011.383.07zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clip-rule="evenodd" />
            <path d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06L3.28 2.22z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 内容交互区 -->
    <div
      ref="contentRef"
      class="flex-1 overflow-y-auto scrollbar-hide"
      :style="contentStyle"
    >
      <div class="px-4 py-8">
        <div
          v-for="(sentence, index) in courseStore.lessonData?.sentences"
          :key="sentence.id"
          :data-sentence-index="index"
          v-memo="[
            index === learningStore.currentSentenceIndex,
            learningStore.currentCharIndex,
            learningStore.showEnglish,
            learningStore.showChinese,
            learningStore.hintedWords[index]
          ]"
          :class="[
            'mb-8 transition-opacity duration-200',
            index === learningStore.currentSentenceIndex ? 'opacity-100' : 'opacity-40'
          ]"
        >
          <!-- 中文释义 -->
          <div
            v-if="learningStore.showChinese && sentence.translate"
            class="text-gray-400 mb-4 text-lg"
            :style="{ fontSize: settingsStore.fontSize - 2 + 'px' }"
          >
            {{ sentence.translate }}
          </div>

          <!-- 英文原文 -->
          <div
            v-if="learningStore.showEnglish"
            class="text-2xl mb-4 leading-relaxed"
            :style="{ fontSize: settingsStore.fontSize + 'px' }"
          >
            <template v-for="(part, partIndex) in splitIntoWords(sentence.text)" :key="partIndex">
              <span
                v-if="part.trim()"
                class="inline-block cursor-pointer hover:text-fuchsia-500 transition-colors"
                @click="handlePlayWordSound(part.trim())"
                :class="[
                  index === learningStore.currentSentenceIndex && getPartCharIndex(sentence.text, partIndex) < learningStore.currentCharIndex
                    ? 'text-green-400'
                    : index === learningStore.currentSentenceIndex && getPartCharIndex(sentence.text, partIndex) === learningStore.currentCharIndex
                    ? 'bg-primary-500 text-white px-1 rounded'
                    : 'text-gray-300'
                ]"
              >
                <template v-for="(char, charIndex) in part" :key="charIndex">
                  <span
                    :class="[
                      'inline-block',
                      index === learningStore.currentSentenceIndex && getPartCharIndex(sentence.text, partIndex) + charIndex < learningStore.currentCharIndex
                        ? 'text-green-400'
                        : index === learningStore.currentSentenceIndex && getPartCharIndex(sentence.text, partIndex) + charIndex === learningStore.currentCharIndex
                        ? 'bg-primary-500 text-white px-1 rounded'
                        : ''
                    ]"
                  >
                    {{ char === ' ' ? '\u00A0' : char }}
                  </span>
                </template>
              </span>
              <span
                v-else
                class="inline-block"
                :class="[
                  index === learningStore.currentSentenceIndex && getPartCharIndex(sentence.text, partIndex) < learningStore.currentCharIndex
                    ? 'text-green-400'
                    : 'text-gray-300'
                ]"
              >
                {{ part === ' ' ? '\u00A0' : part }}
              </span>
            </template>
          </div>

          <!-- 隐藏模式显示 -->
          <div
            v-else
            class="text-2xl mb-4 leading-relaxed"
            :style="{ fontSize: settingsStore.fontSize + 'px' }"
          >
            <span
              v-for="(char, charIndex) in sentence.text"
              :key="charIndex"
              :class="getCharClass(index, charIndex, char)"
            >
              {{ getCharDisplay(index, charIndex, char) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部操作区 -->
    <div
      ref="bottomBarRef"
      class="bg-gray-800/50 backdrop-blur-sm p-4 z-20"
    >
      <!-- 错误提示 -->
      <div v-if="learningStore.validationErrors.length > 0" class="mb-3 p-3 bg-red-900/50 border border-red-500 rounded-lg">
        <div class="text-red-300 text-sm font-medium mb-1">发现以下错误：</div>
        <div class="text-red-200 text-xs space-y-1">
          <div v-for="error in learningStore.validationErrors" :key="error.index">
            {{ error.message }}
          </div>
        </div>
      </div>

      <!-- 按钮行：左侧提示、重播、重新学习；右侧跳过、提交 -->
      <div class="flex items-center justify-between gap-2">
        <!-- 左侧按钮组 -->
        <div class="flex items-center gap-2">
          <button
            @click="toggleHint"
            class="px-3 py-2 bg-gray-700 rounded-lg text-sm font-medium text-white hover:bg-gray-600 active:scale-95 transition-all"
          >
            提示
          </button>
          <button
            @click="replayAudio"
            class="px-3 py-2 bg-gray-700 rounded-lg text-sm font-medium text-white hover:bg-gray-600 active:scale-95 transition-all"
          >
            重播
          </button>
          <button
            @click="handleRestart"
            :disabled="isSubmitting"
            class="px-3 py-2 rounded-lg text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            重新学习
          </button>
        </div>

        <!-- 右侧按钮组 -->
        <div class="flex items-center gap-2">
          <button
            @click="handleSkipLesson"
            :disabled="isSubmitting"
            class="px-3 py-2 bg-gray-700 rounded-lg text-sm font-medium text-white hover:bg-gray-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            跳过
          </button>
          <button
            @click="handleSubmit"
            :disabled="isSubmitting || (learningStore.isLessonCompleted && learningStore.validationErrors.length > 0)"
            :class="[
              'px-6 py-2 rounded-lg text-sm font-medium text-white transition-all',
              isSubmitting || (learningStore.isLessonCompleted && learningStore.validationErrors.length > 0)
                ? 'bg-gray-600 cursor-not-allowed opacity-50'
                : 'bg-green-500 hover:bg-green-600 active:scale-95'
            ]"
          >
            {{ isSubmitting ? '提交中...' : '提交' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 隐藏的输入框 -->
    <input
      ref="hiddenInputRef"
      type="text"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      class="fixed opacity-0 pointer-events-none"
      @input="handleInput"
      @keydown="handleKeyDown"
    />

    <!-- 设置弹窗 -->
    <SettingsModal v-if="showSettings" @close="showSettings = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLearningStore } from '@/stores/learning'
import { useCourseStore } from '@/stores/course'
import { useSettingsStore } from '@/stores/settings'
import { useAuthStore } from '@/stores/auth'
import SettingsModal from '@/components/SettingsModal.vue'
import { usePlayWordSound } from '@/composables/audio'
const route = useRoute()
const router = useRouter()
const learningStore = useLearningStore()
const courseStore = useCourseStore()
const settingsStore = useSettingsStore()
const authStore = useAuthStore()

const containerRef = ref(null)
const contentRef = ref(null)
const bottomBarRef = ref(null)
const hiddenInputRef = ref(null)
const showSettings = ref(false)
const attemptCount = ref(1)
const audioProgress = ref(0)
const viewportHeight = ref(window.innerHeight)
const keyboardHeight = ref(0)
const isSubmitting = ref(false)
const errorTimeout = ref(null)

// 单词发音功能
const { handlePlayWordSound } = usePlayWordSound()

// 将句子拆分为单词（用于点击播放）
function splitIntoWords(text) {
  if (!text) return []
  // 使用正则表达式分割单词，保留空格
  return text.split(/(\s+)/).filter(part => part.length > 0)
}

// 获取部分在整个句子中的字符索引
function getPartCharIndex(text, partIndex) {
  const parts = splitIntoWords(text)
  let index = 0
  for (let i = 0; i < partIndex; i++) {
    index += parts[i].length
  }
  return index
}

// 容器样式 - 使用 VisualViewport 高度
const containerStyle = computed(() => {
  return {
    height: `${viewportHeight.value}px`
  }
})

// 内容区样式 - 动态调整 padding-bottom 以适应键盘
const contentStyle = computed(() => {
  const bottomBarHeight = bottomBarRef.value?.offsetHeight || 80
  return {
    paddingBottom: `${keyboardHeight.value + bottomBarHeight}px`
  }
})

// 防抖函数
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// 更新视口高度（防抖优化，避免频繁调用）
const updateViewportDebounced = debounce(() => {
  if (window.visualViewport) {
    viewportHeight.value = window.visualViewport.height
    keyboardHeight.value = window.innerHeight - window.visualViewport.height
  } else {
    viewportHeight.value = window.innerHeight
    keyboardHeight.value = 0
  }
  
  // 滚动到当前句子（使用 nextTick 确保 DOM 更新后执行）
  nextTick(() => {
    scrollToCurrent()
  })
}, 100) // 100ms 防抖延迟

// 更新视口高度（立即执行版本，用于初始化）
function updateViewport() {
  if (window.visualViewport) {
    viewportHeight.value = window.visualViewport.height
    keyboardHeight.value = window.innerHeight - window.visualViewport.height
  } else {
    viewportHeight.value = window.innerHeight
    keyboardHeight.value = 0
  }
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// 缓存正则表达式（优化性能，避免每次调用都创建新实例）
const punctuationRegex = /[.,!?;:'"()\[\]{}\-—–…。，！？；：""''（）【】《》]/

// 判断是否为标点符号
function isPunctuation(char) {
  if (!char) return false
  return punctuationRegex.test(char)
}

// 判断是否为空格
function isSpace(char) {
  if (!char) return false
  return char === ' ' || char.charCodeAt(0) === 160
}

// 获取字符的样式类
function getCharClass(sentenceIndex, charIndex, char) {
  // 先判断行的状态，避免使用 sentenceCharIndex 影响未开始的行
  if (sentenceIndex < learningStore.currentSentenceIndex) {
    // 已完成的行：显示完整内容（绿色）
    return 'inline-block text-green-400'
  } else if (sentenceIndex === learningStore.currentSentenceIndex) {
    // 当前行：根据输入进度显示
    const sentenceCharIndex = learningStore.getSentenceCharIndex(sentenceIndex)
    const isPunct = isPunctuation(char)
    const isSp = isSpace(char)
    const isHinted = learningStore.isCharHinted(sentenceIndex, charIndex)
    
    if (charIndex < sentenceCharIndex) {
      return 'inline-block text-green-400'
    } else if (charIndex === sentenceCharIndex) {
      return 'inline-block bg-primary-500 text-white px-1 rounded'
    } else {
      // 如果被提示，显示为灰色
      if (isHinted) {
        return 'inline-block text-gray-400'
      }
      // 标点符号和空格直接显示（灰色）
      if (isPunct || isSp) {
        return 'inline-block text-gray-400'
      }
      return 'inline-block text-gray-600'
    }
  } else {
    // 未开始的行：标点符号和空格显示，其他显示下划线（不受当前行输入影响）
    const isPunct = isPunctuation(char)
    const isSp = isSpace(char)
    if (isPunct || isSp) {
      return 'inline-block text-gray-400'
    }
    return 'inline-block text-gray-600'
  }
}

// 获取字符的显示内容
function getCharDisplay(sentenceIndex, charIndex, char) {
  // 先判断行的状态，避免使用 sentenceCharIndex 影响未开始的行
  if (sentenceIndex < learningStore.currentSentenceIndex) {
    // 已完成的行：显示完整内容
    return char === ' ' ? '\u00A0' : char
  } else if (sentenceIndex === learningStore.currentSentenceIndex) {
    // 当前行：根据输入进度显示
    const sentenceCharIndex = learningStore.getSentenceCharIndex(sentenceIndex)
    const isPunct = isPunctuation(char)
    const isSp = isSpace(char)
    const isHinted = learningStore.isCharHinted(sentenceIndex, charIndex)
    
    if (charIndex < sentenceCharIndex) {
      // 已输入的部分：显示字符
      return char === ' ' ? '\u00A0' : char
    } else {
      // 未输入的部分：如果被提示，显示字符（灰色），否则标点符号和空格直接显示，其他显示下划线
      if (isHinted) {
        return char === ' ' ? '\u00A0' : char
      }
      if (isPunct || isSp) {
        return char === ' ' ? '\u00A0' : char
      }
      return char === ' ' ? '\u00A0' : '_'
    }
  } else {
    // 未开始的行：标点符号和空格显示，其他显示下划线（不受当前行输入影响）
    const isPunct = isPunctuation(char)
    const isSp = isSpace(char)
    if (isPunct || isSp) {
      return char === ' ' ? '\u00A0' : char
    }
    return char === ' ' ? '\u00A0' : '_'
  }
}

function handleInput(event) {
  const input = event.target.value
  const currentText = learningStore.inputText
  
  // 如果输入长度没有增加，说明是删除操作，忽略
  if (input.length <= currentText.length) {
    event.target.value = currentText
    return
  }
  
  // 优先使用 event.data 获取新输入的字符（更准确，特别是单个字符输入）
  let newChar = event.data
  
  // 如果 event.data 不存在，则通过比较 input 和 currentText 找出新输入的字符
  if (!newChar) {
    // 找出 input 中比 currentText 多出的部分
    if (input.startsWith(currentText)) {
      // 如果 input 以 currentText 开头，说明新字符在末尾
      newChar = input[currentText.length]
    } else {
      // 如果 input 不以 currentText 开头，说明可能有其他问题，尝试从末尾获取
      newChar = input[input.length - 1]
    }
  }
  
  if (newChar) {
    // 处理输入
    const success = learningStore.handleInput(newChar)
    
    // 如果输入成功，更新输入框值；如果失败，恢复原值
    if (success) {
      event.target.value = learningStore.inputText
    } else {
      // 输入错误，恢复之前的值
      event.target.value = learningStore.inputText
    }
  }
}

function handleKeyDown(event) {
  // 阻止退格键等默认行为，因为我们手动管理输入状态
  if (event.key === 'Backspace' || event.key === 'Delete') {
    event.preventDefault()
  }
  
  // 阻止其他特殊键
  if (event.key.length > 1 && !['Space', 'Enter'].includes(event.key)) {
    event.preventDefault()
  }
}

function togglePlay() {
  if (learningStore.isPlaying) {
    learningStore.stopAudio()
  } else {
    // 播放当前行的音频
    learningStore.playCurrentLineAudio()
  }
}

function toggleMute() {
  settingsStore.mute = !settingsStore.mute
  if (settingsStore.mute) {
    learningStore.stopAudio()
  }
}

function replayAudio() {
  const sentence = learningStore.currentSentence
  if (sentence?.text) {
    learningStore.playAudio(sentence.text)
  }
}

// 跳过当前课时，进入下一课时
async function handleSkipLesson() {
  if (isSubmitting.value) return
  
  try {
    isSubmitting.value = true
    
    const { courseId } = route.params
    
    // 重新加载课程详情以获取最新进度
    const currentCourse = await courseStore.loadCourseDetail(courseId)
    
    if (currentCourse && currentCourse.lessons) {
      const currentLessonIndex = currentCourse.lessons.findIndex(
        l => l.id === courseStore.currentLesson.id
      )
      
      if (currentLessonIndex >= 0 && currentLessonIndex < currentCourse.lessons.length - 1) {
        // 有下一课时，跳转到下一课时
        const nextLesson = currentCourse.lessons[currentLessonIndex + 1]
        
        // 重置提交状态
        isSubmitting.value = false
        
        // 重置学习状态
        learningStore.reset()
        
        // 跳转到下一课时，使用 replace 避免在历史记录中留下记录
        await router.replace({
          name: 'Learning',
          params: {
            courseId,
            lessonId: nextLesson.id
          }
        })
      } else {
        // 没有下一课时，返回课时列表
        isSubmitting.value = false
        learningStore.reset()
        router.replace({
          name: 'ChapterList',
          params: { id: courseId }
        })
      }
    } else {
      isSubmitting.value = false
    }
  } catch (error) {
    console.error('跳过课时失败:', error)
    isSubmitting.value = false
  }
}

// 重新学习当前课时
async function handleRestart() {
  if (isSubmitting.value) return
  
  // 确认对话框
  if (!confirm('确定要重新学习当前课时吗？当前进度将被重置。')) {
    return
  }
  
  try {
    // 重置学习状态
    learningStore.reset()
    
    // 重新初始化当前课时
    const { courseId, lessonId } = route.params
    const lessonData = await courseStore.loadLessonData(courseId, lessonId)
    
    if (lessonData) {
      // 重新初始化学习
      learningStore.initLearning(lessonData)
      
      // 重新聚焦输入框
      nextTick(() => {
        focusInput()
      })
    }
  } catch (error) {
    console.error('重新学习失败:', error)
  }
}

async function handleSubmit() {
  if (isSubmitting.value) return
  
  try {
    isSubmitting.value = true
    
    // 先校验
    const isValid = learningStore.validateAllSentences()
    
    // 如果有错误，不提交
    if (!isValid || learningStore.validationErrors.length > 0) {
      isSubmitting.value = false
      return
    }

    const success = await learningStore.submitLesson()
    
    if (success) {
      // 提交成功，跳转到下一课时或返回课时列表
      const { courseId } = route.params
      
      // 重新加载课程详情以获取最新进度
      const currentCourse = await courseStore.loadCourseDetail(courseId)
      
      if (currentCourse && currentCourse.lessons) {
        const currentLessonIndex = currentCourse.lessons.findIndex(
          l => l.id === courseStore.currentLesson.id
        )
        
        if (currentLessonIndex >= 0 && currentLessonIndex < currentCourse.lessons.length - 1) {
          // 有下一课时，跳转到下一课时
          const nextLesson = currentCourse.lessons[currentLessonIndex + 1]
          
          // 重置提交状态
          isSubmitting.value = false
          
          // 重置学习状态
          learningStore.reset()
          
          // 跳转到下一课时，使用 replace 避免在历史记录中留下记录
          await router.replace({
            name: 'Learning',
            params: {
              courseId,
              lessonId: nextLesson.id
            }
          })
        } else {
          // 没有下一课时，返回课时列表
          isSubmitting.value = false
          await router.push({
            name: 'ChapterList',
            params: { id: courseId }
          })
        }
      } else {
        // 无法获取课程信息，返回课时列表
        isSubmitting.value = false
        await router.push({
          name: 'ChapterList',
          params: { id: courseId }
        })
      }
    } else {
      alert('提交失败，请重试')
      isSubmitting.value = false
    }
  } catch (error) {
    alert('提交时发生错误: ' + (error.message || '未知错误'))
    isSubmitting.value = false
  }
}

// 点击提示，在原来位置显示单词（灰色），但不自动填充
function toggleHint() {
  // 如果关闭了英文显示，标记当前光标所在的单词为提示状态
  if (!learningStore.showEnglish) {
    const sentence = learningStore.currentSentence
    if (sentence) {
      const text = sentence.text
      const charIndex = learningStore.currentCharIndex
      const sentenceIndex = learningStore.currentSentenceIndex
      
      // 如果已经到达末尾，不需要提示
      if (charIndex >= text.length) {
        return
      }
      
      // 找到当前单词的起始位置（从当前位置向前找）
      let wordStart = charIndex
      while (wordStart > 0) {
        const prevChar = text[wordStart - 1]
        if (/\s/.test(prevChar)) {
          break
        }
        wordStart--
      }
      
      // 找到当前单词的结束位置（从当前位置向后找）
      let wordEnd = charIndex
      while (wordEnd < text.length) {
        const nextChar = text[wordEnd]
        if (/\s/.test(nextChar)) {
          break
        }
        wordEnd++
      }
      
      // 标记这个单词为提示状态
      if (wordStart < wordEnd) {
        learningStore.addHintedWord(sentenceIndex, wordStart, wordEnd)
      }
    }
  }
}

function goBack() {
  router.back()
}

// 聚焦隐藏输入框
function focusInput() {
  nextTick(() => {
    if (hiddenInputRef.value) {
      hiddenInputRef.value.focus()
    }
  })
}

// 滚动到当前句子
function scrollToCurrent() {
  nextTick(() => {
    learningStore.scrollToCurrentSentence()
  })
}

// 初始化学习页面的函数
async function initLearningPage() {
  const { courseId, lessonId } = route.params
  
  // 初始化认证状态（如果需要显示用户名）
  if (!authStore.isAuthenticated) {
    await authStore.init()
  }
  
  // 加载课时数据
  const lessonData = await courseStore.loadLessonData(courseId, lessonId)
  if (!lessonData) {
    router.back()
    return
  }

  // 初始化学习
  learningStore.initLearning(lessonData)
  
  // 初始化视口
  updateViewport()
  
  // 聚焦输入框
  focusInput()
}

// 监听路由参数变化，当课时ID改变时重新加载
watch(() => route.params.lessonId, async (newLessonId, oldLessonId) => {
  if (newLessonId && newLessonId !== oldLessonId) {
    // 重置学习状态
    learningStore.reset()
    // 重新初始化学习页面
    await initLearningPage()
  }
})

// 监听错误信息，3秒后自动清除
watch(() => learningStore.validationErrors.length, (newLength) => {
  // 清除之前的定时器
  if (errorTimeout.value) {
    clearTimeout(errorTimeout.value)
    errorTimeout.value = null
  }
  
  // 如果有错误，3秒后自动清除
  if (newLength > 0) {
    errorTimeout.value = setTimeout(() => {
      learningStore.validationErrors.splice(0)
      errorTimeout.value = null
      // 错误信息清除后，重新聚焦输入框，确保用户可以继续输入
      nextTick(() => {
        if (hiddenInputRef.value) {
          // 确保输入框的值是正确的
          hiddenInputRef.value.value = learningStore.inputText
          // 重新聚焦
          hiddenInputRef.value.focus()
          // 确保输入框可以接收输入
          hiddenInputRef.value.click()
        }
      })
    }, 3000)
  }
})

onMounted(async () => {
  await initLearningPage()
  
  // 监听视口变化（使用防抖版本，优化性能）
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', updateViewportDebounced)
    window.visualViewport.addEventListener('scroll', updateViewportDebounced)
  }
  
  // 监听窗口大小变化（备用方案，使用防抖版本）
  window.addEventListener('resize', updateViewportDebounced)
  
  // 点击内容区聚焦输入框
  if (contentRef.value) {
    contentRef.value.addEventListener('click', focusInput)
  }
  
  // 触摸内容区聚焦输入框
  if (contentRef.value) {
    contentRef.value.addEventListener('touchstart', focusInput)
  }
})

onUnmounted(() => {
  // 清除定时器
  if (errorTimeout.value) {
    clearTimeout(errorTimeout.value)
    errorTimeout.value = null
  }
  learningStore.reset()
  if (window.visualViewport) {
    window.visualViewport.removeEventListener('resize', updateViewportDebounced)
    window.visualViewport.removeEventListener('scroll', updateViewportDebounced)
  }
  window.removeEventListener('resize', updateViewportDebounced)
})
</script>

<style scoped>
.learning-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>

