import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { db } from '@/db'
import { PronunciationType } from '@/composables/pronunciation'

export const useSettingsStore = defineStore('settings', () => {
  // 使用 useStorage 实现持久化
  const theme = useStorage('wordtap-theme', 'system') // 'light' | 'dark' | 'system'
  const keypressSound = useStorage('wordtap-keypress-sound', true)
  const autoPlayAudio = useStorage('wordtap-auto-play', true)
  const showChinese = useStorage('wordtap-show-chinese', true)
  const defaultShowEnglish = useStorage('wordtap-default-show-english', true)
  const defaultShowName = useStorage('wordtap-default-show-name', true)
  const fontSize = useStorage('wordtap-font-size', 18)
  const mute = ref(false)
  // 发音类型：1=英音，2=美音，默认美音
  const pronunciationType = useStorage('wordtap-pronunciation-type', PronunciationType.American)

  // 外观设置
  const fontFamily = useStorage('wordtap-font-family', 'system') // 'system' | 'fredoka'
  const phoneticSize = useStorage('wordtap-phonetic-size', 'small') // 'small' | 'medium' | 'large'

  // 答题设置
  const autoNextAfterCorrect = useStorage('wordtap-auto-next-correct', false)
  const ignoreCase = useStorage('wordtap-ignore-case', true)
  const inputBoxStyle = useStorage('wordtap-input-box-style', 'word-length') // 'word-length' | 'fixed' | 'auto'
  const autoShowAnswer = useStorage('wordtap-auto-show-answer', 'after-3-errors') // 'never' | 'after-3-errors' | 'after-5-errors'

  // 播放设置
  const playbackSpeed = useStorage('wordtap-playback-speed', 1) // 1x, 1.25x, 1.5x, 2x
  const playbackCount = useStorage('wordtap-playback-count', 2) // 播放次数
  const playbackInterval = useStorage('wordtap-playback-interval', 1) // 播放间隔（秒）
  const loopCourse = useStorage('wordtap-loop-course', false)
  const hideAnswer = useStorage('wordtap-hide-answer', false)
  const autoSkipNext = useStorage('wordtap-auto-skip-next', false)

  // 口语设置
  const speakingDisplayMode = useStorage('wordtap-speaking-display-mode', 'english') // 'english' | 'chinese' | 'blind'

  // 应用主题
  function applyTheme() {
    if (theme.value === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      document.documentElement.classList.toggle('dark', prefersDark)
    } else {
      document.documentElement.classList.toggle('dark', theme.value === 'dark')
    }
  }

  // 初始化主题
  applyTheme()

  // 监听系统主题变化
  if (typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (theme.value === 'system') {
        applyTheme()
      }
    })
  }

  return {
    theme,
    keypressSound,
    autoPlayAudio,
    showChinese,
    defaultShowEnglish,
    defaultShowName,
    fontSize,
    mute,
    pronunciationType,
    applyTheme,
    // 外观设置
    fontFamily,
    phoneticSize,
    // 答题设置
    autoNextAfterCorrect,
    ignoreCase,
    inputBoxStyle,
    autoShowAnswer,
    // 播放设置
    playbackSpeed,
    playbackCount,
    playbackInterval,
    loopCourse,
    hideAnswer,
    autoSkipNext,
    // 口语设置
    speakingDisplayMode
  }
})

