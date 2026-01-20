import { watchEffect } from 'vue'
import { useLearningStore } from '@/stores/learning'
import { getPronunciationUrl } from './pronunciation'
import { updateSource, play, PlayOptions } from './audio'

let lastPronunciationUrl = ''

/**
 * 当前语句的发音管理
 */
export function useCurrentStatementEnglishSound() {
  const learningStore = useLearningStore()

  // 监听当前语句变化，自动更新音频源
  watchEffect(() => {
    const sentence = learningStore.currentSentence
    if (!sentence || !sentence.text) return

    const pronunciationUrl = getPronunciationUrl(sentence.text)
    
    // 只有当 URL 变化时才更新
    if (lastPronunciationUrl !== pronunciationUrl) {
      updateSource(pronunciationUrl)
      lastPronunciationUrl = pronunciationUrl
    }
  })

  /**
   * 播放当前语句的发音
   */
  function playSound(options?: PlayOptions) {
    return play(options)
  }

  return {
    playSound
  }
}

