const fs = require('fs')
const path = require('path')

const coursesDir = 'public/dicts/en/xingrong-courses/data/courses'
const outputFile = 'public/list/xingrong.json'

// 读取所有课程文件
const files = fs.readdirSync(coursesDir)
  .filter(f => f.endsWith('.json'))
  .sort((a, b) => {
    const numA = parseInt(a.replace('.json', ''))
    const numB = parseInt(b.replace('.json', ''))
    return numA - numB
  })

const courseList = files.map((file) => {
  const filePath = path.join(coursesDir, file)
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  const courseNum = file.replace('.json', '')
  
  return {
    id: `xingrong_${courseNum.padStart(2, '0')}`,
    name: `星荣课程 ${courseNum}`,
    description: `星荣英语学习课程第 ${courseNum} 课，共 ${data.length} 条学习内容`,
    category: '星荣课程',
    tags: ['星荣课程', '英语学习'],
    url: `xingrong-courses/data/courses/${file}`,
    length: data.length,
    translateLanguage: 'zh-CN',
    language: 'en',
    type: 'xingrong'
  }
})

// 写入文件
fs.writeFileSync(outputFile, JSON.stringify(courseList, null, 2), 'utf8')
console.log(`已创建课程列表，共 ${courseList.length} 个课程`)


