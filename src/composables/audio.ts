import { getPronunciationUrl } from './pronunciation'

/**
 * 播放选项
 */
export interface PlayOptions {
  times?: number // 播放次数，默认 1
  rate?: number // 播放速度，默认 1.0
  interval?: number // 播放间隔（毫秒），默认 0
}

const DefaultPlayOptions: PlayOptions = {
  times: 1,
  rate: 1.0,
  interval: 0
}

// 全局音频实例（用于播放完整句子）
const audio = new Audio()
let isPlaying = false
let playTimer: number | null = null
let playPromise: Promise<void> | null = null

/**
 * 更新音频源
 */
export function updateSource(src: string) {
  audio.src = src
  audio.load()
}

/**
 * 播放音频
 * @param playOptions 播放选项
 */
export function play(playOptions?: PlayOptions): Promise<void> {
  // 如果已经有播放Promise，先等待它完成
  if (playPromise) {
    return playPromise
  }

  playPromise = new Promise((resolve, reject) => {
    if (!audio.src) {
      playPromise = null
      reject(new Error('音频源未设置'))
      return
    }

    const options = Object.assign({}, DefaultPlayOptions, playOptions)
    const times = options.times ?? DefaultPlayOptions.times ?? 1
    const rate = options.rate ?? DefaultPlayOptions.rate ?? 1.0
    const interval = options.interval ?? DefaultPlayOptions.interval ?? 0
    
    audio.playbackRate = rate

    let playCount = 0
    let isStopped = false

    const playNext = () => {
      if (playCount >= times || isStopped) {
        isPlaying = false
        playPromise = null
        resolve()
        return
      }

      isPlaying = true
      playCount++

      const audioPlayPromise = audio.play()
      
      // 处理现代浏览器返回的Promise
      if (audioPlayPromise && audioPlayPromise.catch) {
        audioPlayPromise.catch((error) => {
          // 如果是因为stop()调用导致的中断，不应该reject
          if (!isStopped) {
            isPlaying = false
            playPromise = null
            reject(error)
          }
        })
      }

      audio.onended = () => {
        if (playCount < times && interval > 0 && !isStopped) {
          playTimer = window.setTimeout(() => {
            playNext()
          }, interval)
        } else if (playCount < times && !isStopped) {
          playNext()
        } else {
          isPlaying = false
          playPromise = null
          resolve()
        }
      }

      audio.onerror = () => {
        if (!isStopped) {
          isPlaying = false
          playPromise = null
          reject(new Error('音频播放失败'))
        }
      }
    }

    playNext()
  })
  
  return playPromise
}

/**
 * 停止播放
 */
export function stop() {
  if (playTimer) {
    clearTimeout(playTimer)
    playTimer = null
  }
  
  // 标记为已停止，避免play() Promise reject
  isPlaying = false
  
  // 暂停音频
  audio.pause()
  audio.currentTime = 0
  
  // 清除playPromise
  playPromise = null
}

/**
 * 检查是否正在播放
 */
export function getIsPlaying(): boolean {
  return isPlaying
}

/**
 * 播放单个单词的发音
 */
export function usePlayWordSound() {
  const wordAudio = new Audio()
  let isPlaying = false
  let lastWord = ''

  /**
   * 播放单词发音
   */
  function handlePlayWordSound(word: string) {
    if (!word || word.trim() === '') return

    // 如果同一个单词正在播放，跳过
    if (isPlaying && lastWord === word) {
      return
    }

    // 停止之前的播放
    if (isPlaying) {
      wordAudio.pause()
      wordAudio.currentTime = 0
    }

    lastWord = word
    const pronunciationUrl = getPronunciationUrl(word)
    wordAudio.src = pronunciationUrl
    wordAudio.load()

    isPlaying = true
    wordAudio.play().catch(() => {
      isPlaying = false
    })

    wordAudio.onended = () => {
      isPlaying = false
    }

    wordAudio.onerror = () => {
      isPlaying = false
    }
  }

  return {
    handlePlayWordSound
  }
}

