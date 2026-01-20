import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db } from '@/db'

export const useUserStore = defineStore('user', () => {
  const streak = ref(0) // 连胜天数
  const totalCheckIn = ref(0) // 累计打卡天数
  const wordCount = ref(0)
  const studyTime = ref({
    today: 0,
    week: 0,
    month: 0,
    year: 0,
    total: 0
  })
  const lastStudyDate = ref(null)
  const weeklyActivity = ref([]) // 本周打卡记录
  const completedLessons = ref(0) // 完成课程数
  const recentLessons = ref([]) // 最近学习
  const learningHeatmap = ref({}) // 学习热力图数据

  // 从数据库加载用户数据
  async function loadUserData() {
    console.log('[user.js] loadUserData 开始执行')
    try {
      console.log('[user.js] 开始从数据库加载用户统计')
      const stats = await db.userStats.get('main')
      console.log('[user.js] 数据库查询完成，stats:', stats)
      if (stats) {
        streak.value = stats.streak || 0
        totalCheckIn.value = stats.totalCheckIn || 0
        wordCount.value = stats.wordCount || 0
        studyTime.value = stats.studyTime || { today: 0, week: 0, month: 0, year: 0, total: 0 }
        lastStudyDate.value = stats.lastStudyDate || null
        completedLessons.value = stats.completedLessons || 0
        console.log('[user.js] 用户数据加载完成:', {
          streak: streak.value,
          totalCheckIn: totalCheckIn.value,
          wordCount: wordCount.value
        })
      } else {
        console.log('[user.js] 数据库中没有用户统计数据')
      }
      
      console.log('[user.js] 开始更新周活动')
      await updateWeeklyActivity()
      console.log('[user.js] 周活动更新完成')
      
      console.log('[user.js] 开始加载最近学习记录')
      await loadRecentLessons()
      console.log('[user.js] 最近学习记录加载完成，数量:', recentLessons.value.length)
      
      console.log('[user.js] 开始加载学习热力图')
      await loadLearningHeatmap()
      console.log('[user.js] 学习热力图加载完成')
      
      console.log('[user.js] loadUserData 执行完成')
    } catch (error) {
      console.error('[user.js] 加载用户数据失败:', error)
      console.error('[user.js] 错误详情:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
    }
  }

  // 更新连续打卡天数
  async function updateStreak() {
    const today = new Date().toDateString()
    // 确保 lastStudyDate 是字符串格式
    const lastDate = lastStudyDate.value 
      ? (typeof lastStudyDate.value === 'string' 
          ? lastStudyDate.value 
          : new Date(lastStudyDate.value).toDateString())
      : null
    
    if (lastDate === today) {
      // 今天已经学习过，不更新
      return
    }
    
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toDateString()
    
    if (lastDate === yesterdayStr) {
      // 连续学习
      streak.value += 1
    } else if (lastDate !== today) {
      // 中断了，重置为1
      streak.value = 1
    }
    
    lastStudyDate.value = today
    
    // 更新累计打卡
    if (streak.value > 0) {
      totalCheckIn.value = (totalCheckIn.value || 0) + 1
    }
    
    // 确保所有值都是可序列化的原始值
    const statsToSave = {
      id: 'main',
      streak: Number(streak.value) || 0,
      totalCheckIn: Number(totalCheckIn.value) || 0,
      wordCount: Number(wordCount.value) || 0,
      studyTime: studyTime.value ? JSON.parse(JSON.stringify(studyTime.value)) : { today: 0, week: 0, month: 0, year: 0, total: 0 },
      lastStudyDate: String(today || ''),
      completedLessons: Number(completedLessons.value) || 0
    }
    
    await db.userStats.put(statsToSave)
  }

  // 增加词汇量
  async function addWordCount(count = 1) {
    wordCount.value += count
    // 确保所有值都是可序列化的原始值
    const statsToSave = {
      id: 'main',
      streak: Number(streak.value) || 0,
      totalCheckIn: Number(totalCheckIn.value) || 0,
      wordCount: Number(wordCount.value) || 0,
      studyTime: studyTime.value ? JSON.parse(JSON.stringify(studyTime.value)) : { today: 0, week: 0, month: 0, year: 0, total: 0 },
      lastStudyDate: lastStudyDate.value ? String(lastStudyDate.value) : null,
      completedLessons: Number(completedLessons.value) || 0
    }
    await db.userStats.put(statsToSave)
  }

  // 增加学习时长（分钟）
  async function addStudyTime(minutes, period = 'today') {
    studyTime.value[period] = (studyTime.value[period] || 0) + minutes
    // 同时更新总计
    studyTime.value.total = (studyTime.value.total || 0) + minutes
    // 确保所有值都是可序列化的原始值
    const statsToSave = {
      id: 'main',
      streak: Number(streak.value) || 0,
      totalCheckIn: Number(totalCheckIn.value) || 0,
      wordCount: Number(wordCount.value) || 0,
      studyTime: studyTime.value ? JSON.parse(JSON.stringify(studyTime.value)) : { today: 0, week: 0, month: 0, year: 0, total: 0 },
      lastStudyDate: lastStudyDate.value ? String(lastStudyDate.value) : null,
      completedLessons: Number(completedLessons.value) || 0
    }
    await db.userStats.put(statsToSave)
  }

  // 更新周活动数据（本周打卡记录）
  async function updateWeeklyActivity() {
    const activities = []
    const today = new Date()
    const dayOfWeek = today.getDay() // 0=周日, 1=周一...
    
    // 获取本周的周一到周日
    const monday = new Date(today)
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday)
      date.setDate(monday.getDate() + i)
      const dateStr = date.toDateString()
      
      // 检查当天是否有学习记录
      const hasStudy = lastStudyDate.value && 
        new Date(lastStudyDate.value).toDateString() === dateStr
      
      activities.push({
        date: dateStr,
        dayOfWeek: i, // 0=周一, 6=周日
        checked: hasStudy || false,
        isToday: dateStr === today.toDateString()
      })
    }
    
    weeklyActivity.value = activities
  }

  // 加载最近学习
  async function loadRecentLessons() {
    try {
      // 从数据库查询所有课时记录
      const allLessons = await db.lessons.toArray()
      
      // 过滤有 lastStudyTime 的记录，按时间倒序排列，取前3个
      const sortedLessons = allLessons
        .filter(lesson => lesson.lastStudyTime != null)
        .sort((a, b) => (b.lastStudyTime || 0) - (a.lastStudyTime || 0))
        .slice(0, 3)
      
      recentLessons.value = sortedLessons.map(lesson => ({
        id: lesson.id,
        courseId: lesson.courseId,
        title: lesson.title || `Lesson ${lesson.order || ''}`,
        time: lesson.lastStudyTime,
        order: lesson.order
      }))
    } catch (error) {
      console.error('加载最近学习失败:', error)
      recentLessons.value = []
    }
  }

  // 加载学习热力图
  async function loadLearningHeatmap() {
    try {
      // 从数据库查询所有学习记录，生成热力图数据
      const allLessons = await db.lessons.toArray()
      const heatmap = {}
      
      allLessons.forEach(lesson => {
        if (lesson.lastStudyTime) {
          const date = new Date(lesson.lastStudyTime)
          const dateStr = date.toISOString().split('T')[0] // YYYY-MM-DD
          heatmap[dateStr] = (heatmap[dateStr] || 0) + 1
        }
      })
      
      learningHeatmap.value = heatmap
    } catch (error) {
      console.error('加载学习热力图失败:', error)
      learningHeatmap.value = {}
    }
  }

  return {
    streak,
    totalCheckIn,
    wordCount,
    studyTime,
    lastStudyDate,
    weeklyActivity,
    completedLessons,
    recentLessons,
    learningHeatmap,
    loadUserData,
    updateStreak,
    addWordCount,
    addStudyTime,
    updateWeeklyActivity,
    loadRecentLessons,
    loadLearningHeatmap
  }
})

