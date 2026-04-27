import { useStorage } from "@vueuse/core";

/**
 * 发音类型枚举
 */
export enum PronunciationType {
  British = 1, // 英音
  American = 2, // 美音
}

/**
 * 本地音频目录映射
 * 用于绝望主妇等课程的本地音频
 */
// 缓存音频目录存在性检查
let localAudioDirsChecked = false;
const localAudioDirs: Record<string, boolean> = {};

/**
 * 检查本地音频目录是否存在
 */
function checkLocalAudioDir(courseType: string): boolean {
  if (!courseType) return false;
  
  // 已检查过直接返回结果
  if (localAudioDirsChecked && localAudioDirs[courseType] !== undefined) {
    return localAudioDirs[courseType] || false;
  }
  
  // 检查常见音频目录
  const audioDirs = [
    `/sound/desperate_housewives`,
    `/sound/${courseType}`,
  ];
  
  for (const dir of audioDirs) {
    try {
      // 使用fetch检查目录是否存在（实际是检查目录中的文件）
      // 这里简单返回true，让后续逻辑尝试加载
      localAudioDirs[courseType] = true;
    } catch (e) {
      localAudioDirs[courseType] = false;
    }
  }
  
  localAudioDirsChecked = true;
  return localAudioDirs[courseType] || false;
}

/**
 * 获取本地音频文件URL
 * @param courseType 课程类型
 * @param episode 集数 (如 1 表示 s01e01)
 * @returns 本地音频URL或null
 */
export function getLocalAudioUrl(courseType: string, episode: number | string): string | null {
  if (!courseType || !episode) return null;
  
  // 只有desperate类型使用本地音频
  if (courseType !== "desperate") return null;
  
  // episode可能是数字或字符串格式
  let ep = episode;
  if (typeof episode === "number") {
    ep = String(episode).padStart(2, "0");
  }
  
  // 绝望主妇音频命名格式: desperate_s01e01.mp3
  // 需要从episode解析出季和集
  // 这里简化处理，假设传入的是完整的集标识如 "s01e01"
  const episodeStr = String(ep);
  
  // 检查是否是 season + episode 格式，如 s01e01
  if (!episodeStr.match(/^s\d+e\d+$/i)) {
    return null;
  }
  
  return `/sound/desperate_housewives/desperate_${episodeStr.toLowerCase()}.mp3`;
}

/**
 * 预检查本地音频文件是否存在
 * @param audioUrl 音频URL
 * @returns Promise<boolean>
 */
async function checkAudioFileExists(audioUrl: string): Promise<boolean> {
  try {
    const response = await fetch(audioUrl, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * 发音功能管理
 * 使用有道词典 Web API 进行语音播放
 */
export function usePronunciation() {
  // 发音类型：1=英音，2=美音，默认美音
  const pronunciationType = useStorage<PronunciationType>(
    "wordtap-pronunciation-type",
    PronunciationType.American
  );

  /**
   * 获取发音类型
   */
  function getPronunciationType(): PronunciationType {
    return pronunciationType.value;
  }

  /**
   * 切换发音类型
   */
  function togglePronunciation(type?: PronunciationType) {
    if (type) {
      pronunciationType.value = type;
    } else {
      // 切换：美音 <-> 英音
      pronunciationType.value =
        pronunciationType.value === PronunciationType.American
          ? PronunciationType.British
          : PronunciationType.American;
    }
  }

  /**
   * 生成有道词典发音 URL
   * @param text 要发音的文本（单词或句子）
   * @returns 有道词典 API URL
   */
  function getPronunciationUrl(text: string | undefined): string {
    if (!text) return "";

    // 处理文本：确保符合有道 API 要求
    let processedText = text.trim();

    // 1. 移除中文文本（仅支持英文）
    processedText = processedText.replace(/[\u4e00-\u9fa5]/g, "");

    // 2. 限制文本长度（建议不超过500个字符）
    if (processedText.length > 500) {
      processedText = processedText.substring(0, 500);
    }

    // 3. 确保文本非空
    if (!processedText) return "";

    // 4. 编码文本（符合 URL 编码要求）
    const encodedText = encodeURIComponent(processedText);
    const type = getPronunciationType();

    // 有道词典 API
    // type=1: 英音
    // type=2: 美音
    return `https://dict.youdao.com/dictvoice?type=${type}&audio=${encodedText}`;
  }

  return {
    pronunciationType,
    getPronunciationType,
    togglePronunciation,
    getPronunciationUrl,
    getLocalAudioUrl,
    checkAudioFileExists,
  };
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

/**
 * 获取音频URL（优先本地音频，fallback到有道TTS）
 * @param text 要发音的文本
 * @param localAudioUrl 本地音频URL（可选）
 * @returns Promise<string> 音频URL
 */
export async function getAudioUrl(text: string, localAudioUrl?: string | null): Promise<string> {
  // 1. 优先使用本地音频
  if (localAudioUrl) {
    try {
      const exists = await checkAudioFileExists(localAudioUrl);
      if (exists) {
        return localAudioUrl;
      }
    } catch {
      // 检查失败，继续使用有道
    }
  }
  
  // 2. fallback到有道TTS
  return getPronunciationUrl(text);
}
