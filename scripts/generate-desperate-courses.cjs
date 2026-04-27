const fs = require('fs')
const path = require('path')

const coursesDir = 'public/dicts/en/LAST-FANTASY/data/pdf'
const outputFile = 'public/list/desperate.json'

// 读取所有课程文件
const files = fs.readdirSync(coursesDir)
  .filter(f => f.endsWith('.json'))
  .sort()

const courseList = files.map((file) => {
  const filePath = path.join(coursesDir, file)
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  
  // 从文件名提取季数和集数: desperate_s01e01 -> S01E01
  const match = file.match(/desperate_s(\d+)e(\d+)\.json/)
  const season = match ? parseInt(match[1]) : 1
  const episode = match ? parseInt(match[2]) : 1
  
  return {
    id: `desperate_s${String(season).padStart(2, '0')}e${String(episode).padStart(2, '0')}`,
    name: `绝望的主妇 S${String(season).padStart(2, '0')}E${String(episode).padStart(2, '0')}`,
    description: `《绝望的主妇》第 ${season} 季第 ${episode} 集，共 ${data.length} 句台词`,
    category: "绝望的主妇",
    tags: ["绝望的主妇", "美剧", "英语学习"],
    url: `dicts/en/LAST-FANTASY/data/pdf/${file}`,
    length: data.length,
    translateLanguage: "zh-CN",
    language: "en",
    type: "desperate",
    season: season,
    episode: episode
  }
})

// 写入文件
fs.writeFileSync(outputFile, JSON.stringify(courseList, null, 2), 'utf8')
console.log(`已创建绝望的主妇课程列表，共 ${courseList.length} 个课程`)

// 统计每季课程数
const seasonStats = {}
courseList.forEach(c => {
  const s = c.season
  seasonStats[s] = (seasonStats[s] || 0) + 1
})
console.log('各季课程数:', seasonStats)