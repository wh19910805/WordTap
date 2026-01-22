import { useStorage } from '@vueuse/core'

/**
 * 发音类型枚举
 */
export enum PronunciationType {
  British = 1, // 英音
  American = 2 // 美音
}

/**
 * 发音功能管理
 * 使用有道词典 Web API 进行语音播放
 */
export function usePronunciation() {
  // 发音类型：1=英音，2=美音，默认美音
  const pronunciationType = useStorage<PronunciationType>(
    'wordtap-pronunciation-type',
    PronunciationType.American
  )

  /**
   * 获取发音类型
   */
  function getPronunciationType(): PronunciationType {
    return pronunciationType.value
  }

  /**
   * 切换发音类型
   */
  function togglePronunciation(type?: PronunciationType) {
    if (type) {
      pronunciationType.value = type
    } else {
      // 切换：美音 <-> 英音
      pronunciationType.value =
        pronunciationType.value === PronunciationType.American
          ? PronunciationType.British
          : PronunciationType.American
    }
  }

  /**
   * 生成有道词典发音 URL
   * @param text 要发音的文本（单词或句子）
   * @returns 有道词典 API URL
   */
  function getPronunciationUrl(text: string | undefined): string {
    if (!text) return ''
    
    // 编码文本
    const encodedText = encodeURIComponent(text.trim())
    const type = getPronunciationType()
    
    // 有道词典 API
    // type=1: 英音
    // type=2: 美音
    return `https://dict.youdao.com/dictvoice?type=${type}&audio=${encodedText}`
  }

  return {
    pronunciationType,
    getPronunciationType,
    togglePronunciation,
    getPronunciationUrl
  }
}

/**
 * 直接导出 getPronunciationUrl 函数，方便在其他模块中使用
 */
export function getPronunciationUrl(text: string | undefined): string {
  if (!text) return "";
  
  // 从 localStorage 获取发音类型，默认美音
  const pronunciationType = localStorage.getItem("wordtap-pronunciation-type");
  const type = pronunciationType ? parseInt(pronunciationType) : 2; // 默认美音
  
  // 直接使用传入的完整文本，支持单词、句子、段落、文章
  const textToPlay = text.trim();
  
  // 编码文本
  const encodedText = encodeURIComponent(textToPlay);
  
  // 有道词典 API
  // type=1: 英音
  // type=2: 美音
  return `https://dict.youdao.com/dictvoice?type=${type}&audio=${encodedText}`;
}

