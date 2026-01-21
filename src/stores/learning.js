import { defineStore } from "pinia";
import { ref, computed, nextTick, watch } from "vue";
import { Howl } from "howler";
import { useCourseStore } from "./course";
import { useUserStore } from "./user";
import { useSettingsStore } from "./settings";
import { getPronunciationUrl } from "@/composables/pronunciation";
import {
  updateSource,
  play,
  stop as stopAudioPlay,
  getIsPlaying,
} from "@/composables/audio";

export const useLearningStore = defineStore("learning", () => {
  const currentSentenceIndex = ref(0);
  const inputText = ref("");
  const currentCharIndex = ref(0);
  const isCorrect = ref(true);
  const startTime = ref(null);
  const elapsedTime = ref(0);
  const timerInterval = ref(null);
  const currentAudio = ref(null); // 保留用于按键音效（Howl）
  const isPlaying = ref(false);
  const showEnglish = ref(true);
  const showChinese = ref(true);
  const mode = ref("follow"); // 'follow' | 'recall' | 'dictation'
  // 跟踪每行的完成状态和输入进度
  const sentenceProgress = ref({}); // { sentenceIndex: { completed: boolean, charIndex: number, inputText: string } }
  const isLessonCompleted = ref(false); // 是否完成所有句子（可以提交）
  const validationErrors = ref([]); // 校验错误列表
  const hintedWords = ref({}); // { sentenceIndex: { wordStart: number, wordEnd: number }[] } 记录被提示的单词位置
  // 缓存音频实例，避免每次输入都创建新实例
  const keySoundInstances = ref([]); // 预加载的按键音效实例
  const currentKeySoundIndex = ref(0); // 当前使用的音效索引
  const autoSaveInterval = ref(null); // 自动保存定时器

  const courseStore = useCourseStore();
  const userStore = useUserStore();
  const settingsStore = useSettingsStore();

  // 当前句子
  const currentSentence = computed(() => {
    if (!courseStore.lessonData?.sentences) return null;
    return courseStore.lessonData.sentences[currentSentenceIndex.value];
  });

  // 总句子数
  const totalSentences = computed(() => {
    return courseStore.lessonData?.sentences?.length || 0;
  });

  // 剩余单词数
  const remainingWords = computed(() => {
    if (!courseStore.lessonData?.sentences) return 0;
    let count = 0;
    for (
      let i = currentSentenceIndex.value;
      i < courseStore.lessonData.sentences.length;
      i++
    ) {
      count += courseStore.lessonData.sentences[i].words.length;
    }
    return count;
  });

  // 总单词数
  const totalWords = computed(() => {
    if (!courseStore.lessonData?.sentences) return 0;
    let count = 0;
    courseStore.lessonData.sentences.forEach((s) => {
      count += s.words.length;
    });
    return count;
  });

  // 自动填充人名
  function autoFillNames(lessonData) {
    // 添加调试日志，方便查看问题
    console.log("[DEBUG] autoFillNames called:", {
      defaultShowName: settingsStore.defaultShowName,
      hasLessonData: !!lessonData,
      hasNameList: !!lessonData?.nameList,
      nameList: lessonData?.nameList,
      hasSentences: !!lessonData?.sentences,
    });

    // 放宽条件，即使没有 nameList 也尝试自动填充
    if (!settingsStore.defaultShowName || !lessonData?.sentences) {
      return;
    }

    // 遍历所有句子，自动填充句首的人名
    lessonData.sentences.forEach((sentence, sentenceIndex) => {
      const sentenceText = sentence.text.trim();
      if (!sentenceText) return;

      let filledText = "";
      let charIndex = 0;
      let matchFound = false;

      // 智能人名匹配：不依赖预设列表，基于规则识别
      // 支持格式：
      // 1. 称呼+空格+名字：Mr. Smith, Mrs. Brown
      // 2. 称呼+名字：Mr.Smith, Mrs.Brown
      // 3. 名字+冒号：LOUISE:, Anna:, LUCY:What
      // 4. 称呼+名字+所有格：Mr. Smith's, Mrs. Brown's
      
      // 组合正则：匹配多种格式的人名
      const nameRegex = /^((Mr\.|Mrs\.|Miss|Ms\.|Dr\.|Prof\.)\s?([A-Z][a-zA-Z]+)(?:'s)?)|([A-Z][a-zA-Z]+):/i;
      const match = sentenceText.match(nameRegex);
      
      if (match) {
        matchFound = true;
        const matchedText = match[0];
        filledText = matchedText;
        charIndex = matchedText.length;
        
        // 特殊处理：如果是名字+冒号格式，检查冒号后是否有空格
        if (match[4]) {
          // 保留冒号后的空格
          while (charIndex < sentenceText.length) {
            const nextChar = sentenceText[charIndex];
            if (isSpace(nextChar)) {
              filledText += nextChar;
              charIndex++;
            } else {
              break;
            }
          }
        }
      }
      
      // 如果没有匹配到，尝试匹配更简单的格式：大写单词开头（可能是人名）
      if (!matchFound) {
        const simpleNameRegex = /^([A-Z][a-zA-Z]+)/;
        const simpleMatch = sentenceText.match(simpleNameRegex);
        
        if (simpleMatch) {
          // 检查是否是常见的非人名大写单词（如星期、月份等）
          const commonNonNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
                                 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
                                 'September', 'October', 'November', 'December', 'The', 'A', 'An'];
          
          const matchedWord = simpleMatch[0];
          // 排除常见非人名单词，且长度至少为2个字符
          if (!commonNonNames.includes(matchedWord) && matchedWord.length >= 2) {
            matchFound = true;
            filledText = matchedWord;
            charIndex = matchedWord.length;
          }
        }
      }
      
      // 如果找到匹配，更新进度
      if (matchFound) {
        console.log('[DEBUG] 智能匹配到人名:', filledText, 'in sentence:', sentenceText);
        
        // 更新进度
        if (!sentenceProgress.value[sentenceIndex]) {
          sentenceProgress.value[sentenceIndex] = {
            completed: false,
            charIndex: 0,
            inputText: "",
          };
        }
        sentenceProgress.value[sentenceIndex].inputText = filledText;
        sentenceProgress.value[sentenceIndex].charIndex = charIndex;
        
        // 同时更新当前输入状态（如果是当前行）
        if (sentenceIndex === currentSentenceIndex.value) {
          inputText.value = filledText;
          currentCharIndex.value = charIndex;
          console.log('[DEBUG] Updated current input state:', { inputText: filledText, charIndex });
        }
      }
    });
  }

  // 监听默认显示人名设置的变化，动态更新人名填充
  watch(
    () => settingsStore.defaultShowName,
    (newVal) => {
      if (courseStore.lessonData) {
        // 无论是开启还是关闭，都重新处理
        // 先重置所有未完成行的输入状态
        if (courseStore.lessonData.sentences) {
          courseStore.lessonData.sentences.forEach((_, index) => {
            const progress = sentenceProgress.value[index];
            if (progress && !progress.completed) {
              sentenceProgress.value[index] = {
                completed: false,
                charIndex: 0,
                inputText: "",
              };
            }
          });
        }
        
        // 如果开启了人名显示，重新填充
        if (newVal) {
          autoFillNames(courseStore.lessonData);
        }
        
        // 更新当前行的输入状态
        const progress = sentenceProgress.value[currentSentenceIndex.value];
        if (progress) {
          inputText.value = progress.inputText;
          currentCharIndex.value = progress.charIndex;
        }
      }
    },
  );

  // 初始化学习
  function initLearning(lessonData) {
    // 设置默认的起始索引
    let startIndex = 0;

    // 检查是否有保存的学习进度
    if (lessonData?.progress?.current_line !== undefined) {
      startIndex = lessonData.progress.current_line;
      // 确保起始索引在有效范围内
      if (lessonData.sentences && startIndex >= lessonData.sentences.length) {
        startIndex = lessonData.sentences.length - 1;
      }
      console.log(`使用保存的学习进度，从第 ${startIndex + 1} 行开始`);
    }

    currentSentenceIndex.value = startIndex;
    inputText.value = "";
    currentCharIndex.value = 0;
    isCorrect.value = true;
    startTime.value = Date.now();
    elapsedTime.value = 0;
    showEnglish.value = settingsStore.defaultShowEnglish;
    showChinese.value = settingsStore.showChinese;
    mode.value = "follow";
    // 初始化所有句子的进度
    sentenceProgress.value = {};
    isLessonCompleted.value = false;
    validationErrors.value = [];
    if (lessonData?.sentences) {
      lessonData.sentences.forEach((_, index) => {
        // 如果是之前已经学习过的行，标记为已完成
        const isCompleted = index < startIndex;
        sentenceProgress.value[index] = {
          completed: isCompleted,
          charIndex: isCompleted ? lessonData.sentences[index].text.length : 0,
          inputText: isCompleted ? lessonData.sentences[index].text : "",
        };
      });
    }

    // 自动填充人名
    autoFillNames(lessonData);

    // 设置当前行的输入状态
    if (sentenceProgress.value[startIndex]) {
      inputText.value = sentenceProgress.value[startIndex].inputText;
      currentCharIndex.value = sentenceProgress.value[startIndex].charIndex;
    }

    // 滚动到当前句子
    nextTick(() => {
      scrollToCurrentSentence();
    });

    // 初始化按键音效（预加载，优化性能）
    initKeySounds();

    startTimer();
    startAutoSave();

    // 自动播放第一行的音频
    if (settingsStore.autoPlayAudio) {
      setTimeout(() => {
        playCurrentLineAudio();
      }, 500);
    }
  }

  // 开始计时
  function startTimer() {
    if (timerInterval.value) {
      clearInterval(timerInterval.value);
    }
    timerInterval.value = setInterval(() => {
      if (startTime.value) {
        elapsedTime.value = Math.floor((Date.now() - startTime.value) / 1000);
      }
    }, 1000);
  }

  // 开始自动保存
  function startAutoSave() {
    if (autoSaveInterval.value) {
      clearInterval(autoSaveInterval.value);
    }
    // 每30秒自动保存一次学习进度
    autoSaveInterval.value = setInterval(() => {
      if (
        courseStore.currentLesson?.id &&
        courseStore.currentLesson?.courseId
      ) {
        console.log("自动保存学习进度...");
        courseStore.updateLessonProgress(
          courseStore.currentLesson.id,
          courseStore.currentLesson.courseId,
          elapsedTime.value,
          false, // 不标记为完成
          currentSentenceIndex.value, // 当前行号
          30, // 本次学习时间（30秒）
        );
      }
    }, 30000);
  }

  // 停止计时
  function stopTimer() {
    if (timerInterval.value) {
      clearInterval(timerInterval.value);
      timerInterval.value = null;
    }
  }

  // 停止自动保存
  function stopAutoSave() {
    if (autoSaveInterval.value) {
      clearInterval(autoSaveInterval.value);
      autoSaveInterval.value = null;
    }
  }

  // 播放音频（使用有道词典 API）
  async function playAudio(text) {
    if (settingsStore.mute) return;
    if (!text) return;

    // 停止之前的播放
    stopAudioPlay();

    // 生成发音 URL
    const pronunciationUrl = getPronunciationUrl(text);
    updateSource(pronunciationUrl);

    // 更新播放状态
    isPlaying.value = true;

    // 播放音频
    try {
      await play();
    } catch (error) {
      console.error("播放音频失败:", error);
    } finally {
      isPlaying.value = getIsPlaying();
    }
  }

  // 停止音频
  function stopAudio() {
    stopAudioPlay();
    isPlaying.value = false;
  }

  // 播放当前行的音频（使用有道词典 API）
  async function playCurrentLineAudio() {
    if (!currentSentence.value) return;
    if (settingsStore.mute) return;

    const sentenceText = currentSentence.value.text;
    if (!sentenceText) return;

    // 使用新的语音 API 播放当前句子
    await playAudio(sentenceText);
  }

  // 判断是否为标点符号
  function isPunctuation(char) {
    if (!char) return false;
    const punctuation = /[.,!?;:'"()\[\]{}\-—–…。，！？；：""''（）【】《》]/g;
    return punctuation.test(char);
  }

  // 判断是否为空格
  function isSpace(char) {
    if (!char) return false;
    return char === " " || char.charCodeAt(0) === 160;
  }

  // 判断是否为字母
  function isLetter(char) {
    if (!char) return false;
    return /[a-zA-Z]/.test(char);
  }

  // 判断是否是行的第一个单词的第一个字母
  function isFirstWordFirstLetter(sentenceText, charIndex, inputTextSoFar) {
    if (!sentenceText || charIndex < 0 || charIndex >= sentenceText.length) {
      return false;
    }

    // 检查当前字符是否是字母
    const currentChar = sentenceText[charIndex];
    if (!isLetter(currentChar)) {
      return false;
    }

    // 检查输入文本中是否已经包含字母
    // 如果 inputTextSoFar 中没有任何字母，说明这是第一个字母
    if (inputTextSoFar && inputTextSoFar.length > 0) {
      for (let i = 0; i < inputTextSoFar.length; i++) {
        if (isLetter(inputTextSoFar[i])) {
          // 如果输入文本中已经有字母，说明当前不是第一个字母
          return false;
        }
      }
    }

    // 如果输入文本为空或只包含非字母字符，且当前字符是字母，说明是第一个单词的第一个字母
    return true;
  }

  // 处理输入
  function handleInput(char) {
    if (!currentSentence.value) return false;

    // 获取当前预期字符
    let expectedChar = currentSentence.value.text[currentCharIndex.value];

    // 确保预期字符存在，防止越界
    if (expectedChar === undefined) {
      // 已经到达行尾
      setTimeout(() => {
        nextSentence();
      }, 300);
      return true;
    }

    // 检查是否已经自动填充了部分内容（例如人名）
    // 这种情况通常发生在 autoFillNames 函数执行后
    if (inputText.value.length > 0 && currentCharIndex.value > 0) {
      // 直接比较输入字符与预期字符（忽略大小写）
      const normalizedInput = char.toLowerCase();
      const normalizedExpected = expectedChar.toLowerCase();
      const isMatch = normalizedInput === normalizedExpected;

      if (isMatch) {
        // 输入正确，继续处理
        inputText.value += char;
        currentCharIndex.value++;
        isCorrect.value = true;

        // 更新当前行的进度
        if (!sentenceProgress.value[currentSentenceIndex.value]) {
          sentenceProgress.value[currentSentenceIndex.value] = {
            completed: false,
            charIndex: 0,
            inputText: "",
          };
        }
        sentenceProgress.value[currentSentenceIndex.value].charIndex = currentCharIndex.value;
        sentenceProgress.value[currentSentenceIndex.value].inputText = inputText.value;

        // 播放打字音效
        if (settingsStore.keypressSound && !settingsStore.mute) {
          playKeySound();
        }

        // 检查是否完成当前句子
        if (currentCharIndex.value >= currentSentence.value.text.length) {
          // 标记当前行已完成，保存完整输入
          sentenceProgress.value[currentSentenceIndex.value].completed = true;
          sentenceProgress.value[currentSentenceIndex.value].charIndex = currentSentence.value.text.length;
          sentenceProgress.value[currentSentenceIndex.value].inputText = inputText.value;
          setTimeout(() => {
            nextSentence();
          }, 300);
        }

        return true;
      } else {
        // 输入错误
        isCorrect.value = false;
        triggerShake();
        return false;
      }
    }

    // 检查是否需要跳过当前字符（标点或空格）
    const shouldSkipCurrent =
      (!settingsStore.requirePunctuation && isPunctuation(expectedChar)) ||
      (!settingsStore.requireSpace && isSpace(expectedChar));

    // 如果需要跳过当前字符，直接跳过并返回
    if (shouldSkipCurrent) {
      inputText.value += expectedChar;
      currentCharIndex.value++;
      // 更新当前行的进度
      if (!sentenceProgress.value[currentSentenceIndex.value]) {
        sentenceProgress.value[currentSentenceIndex.value] = {
          completed: false,
          charIndex: 0,
          inputText: "",
        };
      }
      sentenceProgress.value[currentSentenceIndex.value].charIndex = currentCharIndex.value;
      
      // 播放打字音效
      if (settingsStore.keypressSound && !settingsStore.mute) {
        playKeySound();
      }
      
      return true;
    }

    // 检查是否是行的第一个单词的第一个字母
    // 方法：检查当前行的 sentenceProgress 中是否已经包含字母
    // 如果当前行的 inputText 为空或只包含非字母字符，说明这是第一个字母
    const currentProgress = sentenceProgress.value[currentSentenceIndex.value];
    const currentLineInputText = currentProgress?.inputText || "";

    let hasLetterInCurrentLine = false;
    if (currentLineInputText && currentLineInputText.length > 0) {
      for (let i = 0; i < currentLineInputText.length; i++) {
        if (isLetter(currentLineInputText[i])) {
          hasLetterInCurrentLine = true;
          break;
        }
      }
    }

    // 如果当前行的 inputText 中没有字母，且当前输入是字母，且原文期望的字符也是字母，说明这是第一个字母
    const isFirstLetter =
      !hasLetterInCurrentLine && isLetter(char) && isLetter(expectedChar);

    // 如果是第一个单词的第一个字母，无论用户输入的是小写还是大写，都转为大写
    let processedChar = char;
    if (isFirstLetter) {
      processedChar = char.toUpperCase();
    }

    // 处理输入字符（忽略大小写进行比较）
    const normalizedInput = processedChar.toLowerCase();
    const normalizedExpected = expectedChar?.toLowerCase();

    // 比较字符（忽略大小写）
    // 对于第一个字母，我们总是转换为大写，然后与原文比较（忽略大小写）
    const isMatch = normalizedInput === normalizedExpected;

    if (isMatch) {
      // 正确，使用处理后的字符（可能已转换为大写）
      inputText.value += processedChar;
      currentCharIndex.value++;
      isCorrect.value = true;

      // 更新当前行的进度
      if (!sentenceProgress.value[currentSentenceIndex.value]) {
        sentenceProgress.value[currentSentenceIndex.value] = {
          completed: false,
          charIndex: 0,
          inputText: "",
        };
      }
      sentenceProgress.value[currentSentenceIndex.value].charIndex = currentCharIndex.value;
      sentenceProgress.value[currentSentenceIndex.value].inputText = inputText.value;

      // 播放打字音效
      if (settingsStore.keypressSound && !settingsStore.mute) {
        playKeySound();
      }

      // 检查是否完成当前句子
      if (currentCharIndex.value >= currentSentence.value.text.length) {
        // 标记当前行已完成，保存完整输入
        sentenceProgress.value[currentSentenceIndex.value].completed = true;
        sentenceProgress.value[currentSentenceIndex.value].charIndex = currentSentence.value.text.length;
        sentenceProgress.value[currentSentenceIndex.value].inputText = inputText.value;
        setTimeout(() => {
          nextSentence();
        }, 300);
      }

      return true;
    } else {
      // 错误
      isCorrect.value = false;
      triggerShake();
      return false;
    }
  }

  // 预加载按键音效实例（优化性能，避免每次输入都创建新实例）
  function initKeySounds() {
    if (keySoundInstances.value.length > 0) return; // 已经初始化过

    const sounds = [
      "/sound/key-sounds/机械键盘1.mp3",
      "/sound/key-sounds/机械键盘2.mp3",
    ];

    // 为每个音效创建多个实例，支持并发播放
    sounds.forEach((soundSrc) => {
      for (let i = 0; i < 3; i++) {
        const sound = new Howl({
          src: [soundSrc],
          volume: 0.3,
          html5: true,
          preload: true,
        });
        keySoundInstances.value.push(sound);
      }
    });
  }

  // 播放打字音效（使用预加载的实例）
  function playKeySound() {
    if (settingsStore.mute) return;

    // 如果还没有初始化，先初始化
    if (keySoundInstances.value.length === 0) {
      initKeySounds();
    }

    // 轮询使用不同的音效实例，避免重复播放冲突
    if (keySoundInstances.value.length > 0) {
      const sound = keySoundInstances.value[currentKeySoundIndex.value];
      currentKeySoundIndex.value =
        (currentKeySoundIndex.value + 1) % keySoundInstances.value.length;

      // 如果音效正在播放，停止并重新播放
      if (sound.playing()) {
        sound.stop();
      }
      sound.play();
    }
  }

  // 缓存震动容器元素引用（优化性能，避免频繁查询 DOM）
  let shakeContainerElement = null;

  // 触发震动
  function triggerShake() {
    // CSS 震动动画 - 应用到内容区
    // 使用缓存的元素引用，避免频繁查询 DOM
    if (!shakeContainerElement) {
      shakeContainerElement = document.querySelector(".learning-container");
    }
    if (shakeContainerElement) {
      shakeContainerElement.classList.add("shake");
      setTimeout(() => {
        shakeContainerElement.classList.remove("shake");
      }, 300);
    }

    // 触觉反馈（如果支持）
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }

  // 下一句
  function nextSentence() {
    if (currentSentenceIndex.value < totalSentences.value - 1) {
      // 确保当前行标记为已完成
      if (sentenceProgress.value[currentSentenceIndex.value]) {
        sentenceProgress.value[currentSentenceIndex.value].completed = true;
      }

      currentSentenceIndex.value++;

      // 初始化新行的进度（如果还没有）
      if (!sentenceProgress.value[currentSentenceIndex.value]) {
        sentenceProgress.value[currentSentenceIndex.value] = {
          completed: false,
          charIndex: 0,
          inputText: "",
        };
      }

      // 如果新行已经自动填充了人名，同步到当前输入状态
      const progress = sentenceProgress.value[currentSentenceIndex.value];
      if (progress.inputText && progress.charIndex > 0) {
        inputText.value = progress.inputText;
        currentCharIndex.value = progress.charIndex;
      } else {
        inputText.value = "";
        currentCharIndex.value = 0;
      }

      isCorrect.value = true;

      // 延迟滚动，确保 DOM 更新
      setTimeout(() => {
        scrollToCurrentSentence();
      }, 100);

      // 自动播放当前行的音频
      if (settingsStore.autoPlayAudio) {
        setTimeout(() => {
          playCurrentLineAudio();
        }, 300);
      }
    } else {
      // 完成所有句子，标记为可提交状态
      if (sentenceProgress.value[currentSentenceIndex.value]) {
        sentenceProgress.value[currentSentenceIndex.value].completed = true;
        sentenceProgress.value[currentSentenceIndex.value].inputText = inputText.value;
      }
      isLessonCompleted.value = true;
      stopTimer();
    }
  }

  // 跳过当前句
  function skipSentence() {
    nextSentence();
  }

  // 滚动到当前句子
  function scrollToCurrentSentence() {
    const sentenceEl = document.querySelector(
      `[data-sentence-index="${currentSentenceIndex.value}"]`,
    );
    if (sentenceEl) {
      sentenceEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  // 校验所有句子的输入
  function validateAllSentences() {
    validationErrors.value = [];

    if (!courseStore.lessonData?.sentences) {
      return false;
    }

    let hasError = false;
    courseStore.lessonData.sentences.forEach((sentence, index) => {
      const progress = sentenceProgress.value[index];
      if (!progress || !progress.completed) {
        validationErrors.value.push({
          index,
          message: `第 ${index + 1} 行未完成`,
        });
        hasError = true;
        return;
      }

      // 获取实际输入内容（去除标点和空格，只比较字母）
      const expectedText = sentence.text;
      const actualText = progress.inputText || "";

      // 比较文本（忽略大小写，但需要包含所有字符）
      if (actualText.length < expectedText.length) {
        validationErrors.value.push({
          index,
          message: `第 ${index + 1} 行输入不完整`,
        });
        hasError = true;
        return;
      }

      // 逐字符比较（忽略大小写）
      for (let i = 0; i < expectedText.length; i++) {
        const expectedChar = expectedText[i].toLowerCase();
        const actualChar = actualText[i]?.toLowerCase();

        // 跳过标点和空格，只比较字母和数字
        if (isPunctuation(expectedChar) || isSpace(expectedChar)) {
          continue;
        }

        if (actualChar !== expectedChar) {
          validationErrors.value.push({
            index,
            message: `第 ${index + 1} 行有输入错误`,
          });
          hasError = true;
          return;
        }
      }
    });

    return !hasError;
  }

  // 提交课程
  async function submitLesson() {
    // 校验所有句子
    if (!validateAllSentences()) {
      return false;
    }

    stopAudio();

    const totalTime = Math.floor((Date.now() - startTime.value) / 1000);
    const minutes = Math.floor(totalTime / 60);

    // 更新课时进度
    await courseStore.updateLessonProgress(
      courseStore.currentLesson.id,
      courseStore.currentLesson.courseId,
      totalTime,
      true,
    );

    // 更新用户数据
    await userStore.updateStreak();
    await userStore.addWordCount(totalWords.value);
    await userStore.addStudyTime(minutes, "today");

    return true;
  }

  // 完成课程（已废弃，保留用于兼容）
  async function completeLesson() {
    return await submitLesson();
  }

  // 切换显示英文
  function toggleEnglish() {
    showEnglish.value = !showEnglish.value;
  }

  // 切换显示中文
  function toggleChinese() {
    showChinese.value = !showChinese.value;
  }

  // 切换模式
  function toggleMode() {
    if (mode.value === "follow") {
      mode.value = "recall";
      showEnglish.value = false;
    } else if (mode.value === "recall") {
      mode.value = "dictation";
      showChinese.value = false;
    } else {
      mode.value = "follow";
      showEnglish.value = true;
      showChinese.value = true;
    }
  }

  // 重置
  function reset() {
    stopTimer();
    stopAutoSave();
    stopAudio();
    currentSentenceIndex.value = 0;
    inputText.value = "";
    currentCharIndex.value = 0;
    isCorrect.value = true;
    elapsedTime.value = 0;
    sentenceProgress.value = {};
    isLessonCompleted.value = false;
    validationErrors.value = [];
    hintedWords.value = {};
  }

  // 添加提示单词
  function addHintedWord(sentenceIndex, wordStart, wordEnd) {
    if (!hintedWords.value[sentenceIndex]) {
      hintedWords.value[sentenceIndex] = [];
    }
    // 检查是否已经提示过这个单词
    const exists = hintedWords.value[sentenceIndex].some(
      (hint) => hint.wordStart === wordStart && hint.wordEnd === wordEnd,
    );
    if (!exists) {
      hintedWords.value[sentenceIndex].push({ wordStart, wordEnd });
    }
  }

  // 检查字符是否在被提示的单词范围内
  function isCharHinted(sentenceIndex, charIndex) {
    const hints = hintedWords.value[sentenceIndex];
    if (!hints || hints.length === 0) return false;
    return hints.some(
      (hint) => charIndex >= hint.wordStart && charIndex < hint.wordEnd,
    );
  }

  // 获取指定行的输入进度
  function getSentenceCharIndex(sentenceIndex) {
    // 只处理当前行和已完成的行
    if (sentenceIndex === currentSentenceIndex.value) {
      // 当前行返回当前输入位置
      return currentCharIndex.value;
    }
    // 已完成的行返回完整长度
    if (sentenceProgress.value[sentenceIndex]?.completed) {
      return (
        courseStore.lessonData?.sentences[sentenceIndex]?.text?.length || 0
      );
    }
    // 未开始的行（sentenceIndex > currentSentenceIndex）或未完成的行返回 0
    // 确保未开始的行不会显示为已输入
    if (sentenceIndex > currentSentenceIndex.value) {
      return 0;
    }
    // 对于已完成但未标记为 completed 的行，也返回 0
    return 0;
  }

  // 获取当前光标位置对应的单词
  function getCurrentWord() {
    if (!currentSentence.value) return null;

    const text = currentSentence.value.text;
    const charIndex = currentCharIndex.value;

    // 如果已经到达末尾，返回最后一个单词
    if (charIndex >= text.length) {
      const words = currentSentence.value.words;
      return words && words.length > 0 ? words[words.length - 1] : null;
    }

    // 从当前位置向前找到单词的开始位置（遇到空格或标点停止）
    let start = charIndex;
    while (start > 0) {
      const prevChar = text[start - 1];
      if (/\s/.test(prevChar)) {
        break;
      }
      start--;
    }

    // 从当前位置向后找到单词的结束位置（遇到空格或标点停止）
    let end = charIndex;
    while (end < text.length) {
      const nextChar = text[end];
      if (/\s/.test(nextChar)) {
        break;
      }
      end++;
    }

    // 提取单词
    const word = text.substring(start, end).trim();
    if (!word) return null;

    // 去除单词前后的标点符号，但保留中间的
    return word.replace(/^[^\w]+|[^\w]+$/g, "") || word;
  }

  return {
    currentSentenceIndex,
    inputText,
    currentCharIndex,
    isCorrect,
    elapsedTime,
    isPlaying,
    showEnglish,
    showChinese,
    mode,
    sentenceProgress,
    isLessonCompleted,
    validationErrors,
    hintedWords,
    currentSentence,
    totalSentences,
    remainingWords,
    totalWords,
    initLearning,
    handleInput,
    addHintedWord,
    isCharHinted,
    nextSentence,
    skipSentence,
    playAudio,
    playCurrentLineAudio,
    stopAudio,
    toggleEnglish,
    toggleChinese,
    toggleMode,
    reset,
    completeLesson,
    validateAllSentences,
    submitLesson,
    getSentenceCharIndex,
    getCurrentWord,
    scrollToCurrentSentence,
  };
});
