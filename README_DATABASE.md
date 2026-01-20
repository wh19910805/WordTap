# WordTap 数据库架构

## 概述

WordTap 支持两种数据库方案：
1. **IndexedDB**（通过 Dexie.js）作为浏览器本地存储
2. **MySQL** 作为后端服务器数据库（适用于多用户和数据同步场景）

## 数据库信息

### IndexedDB（本地存储）
- **数据库名称**: `WordTapDB`
- **数据库类型**: IndexedDB（浏览器内置）
- **当前版本**: 2

### MySQL（后端存储）
- **数据库名称**: `wordtap_db`
- **字符集**: utf8mb4
- **排序规则**: utf8mb4_unicode_ci
- **存储引擎**: InnoDB

## 完整数据库表结构

### 1. users（用户表）
存储用户注册和登录信息。

```javascript
{
  id: string,              // 用户ID（主键）
  username: string,        // 用户名（唯一）
  email: string,           // 邮箱（唯一）
  password: string,        // 密码（SHA-256哈希）
  avatar: string,          // 头像URL
  nickname: string,        // 昵称
  gender: 'male'|'female'|'unknown', // 性别
  birthdate: string,       // 出生日期
  phone: string,           // 手机号
  country: string,         // 国家
  language: string,        // 语言偏好（默认zh-CN）
  timezone: string,        // 时区（默认Asia/Shanghai）
  isVerified: boolean,     // 是否验证
  verificationCode: string, // 验证码
  verificationExpire: string, // 验证码过期时间
  lastLoginIp: string,     // 最后登录IP
  loginCount: number,      // 登录次数
  isActive: boolean,       // 是否激活
  createdAt: string,       // 创建时间
  lastLoginAt: string,     // 最后登录时间
  updatedAt: string        // 最后更新时间
}
```

### 2. userStats（用户统计表）
存储用户的学习统计数据。

```javascript
{
  id: string,              // 统计ID（通常是 'main'）
  userId: string,          // 用户ID（外键）
  streak: number,          // 连胜天数
  totalCheckIn: number,    // 累计打卡天数
  wordCount: number,       // 词汇量
  studyTimeToday: number,  // 今日学习时长
  studyTimeWeek: number,   // 本周学习时长
  studyTimeMonth: number,  // 本月学习时长
  studyTimeYear: number,   // 本年学习时长
  studyTimeTotal: number,  // 总学习时长
  lastStudyDate: string,   // 最后学习日期
  completedLessons: number, // 完成课程数
  correctAnswers: number,  // 正确答案数
  wrongAnswers: number,    // 错误答案数
  accuracy: number,        // 准确率
  xpPoints: number,        // 经验值
  level: number,           // 用户等级
  createdAt: string,       // 创建时间
  updatedAt: string        // 最后更新时间
}
```

### 3. userLevels（用户等级表）
存储用户的等级和经验值信息。

```javascript
{
  id: number,              // 自增ID
  userId: string,          // 用户ID（外键）
  level: number,           // 当前等级
  xpRequired: number,      // 当前等级所需经验值
  currentXp: number,       // 当前经验值
  nextLevelXp: number,     // 下一等级所需经验值
  levelUpReward: object,   // 升级奖励（JSON）
  createdAt: string,       // 创建时间
  updatedAt: string        // 最后更新时间
}
```

### 4. userAchievements（用户成就表）
存储用户的成就信息。

```javascript
{
  id: number,              // 自增ID
  userId: string,          // 用户ID（外键）
  achievementId: string,   // 成就ID
  achievementName: string, // 成就名称
  description: string,     // 成就描述
  achievementType: 'learning'|'social'|'special', // 成就类型
  rarity: 'common'|'rare'|'epic'|'legendary', // 稀有度
  points: number,          // 成就点数
  unlockedAt: string,      // 解锁时间
  isUnlocked: boolean,     // 是否已解锁
  createdAt: string,       // 创建时间
  updatedAt: string        // 最后更新时间
}
```

### 5. courses（课程表）
存储用户添加的课程信息。

```javascript
{
  id: string,              // 课程ID（主键）
  userId: string,          // 用户ID（外键）
  name: string,            // 课程名称
  description: string,     // 课程描述
  category: string,        // 课程分类
  subCategory: string,     // 课程子分类
  difficulty: 'beginner'|'intermediate'|'advanced'|'expert', // 难度
  language: string,        // 语言（默认en）
  tags: string,            // 标签（JSON字符串）
  thumbnail: string,       // 课程缩略图
  totalLessons: number,    // 总课时数
  totalWords: number,      // 总词汇数
  estimatedHours: number,  // 估计学习时长（小时）
  completionRate: number,  // 完成率
  isPublic: boolean,       // 是否公开
  isFeatured: boolean,     // 是否精选
  rating: number,          // 评分
  reviewCount: number,     // 评论数
  addedAt: string,         // 添加时间
  updatedAt: string        // 最后更新时间
}
```

### 6. lessons（课时表）
存储课程的课时信息。

```javascript
{
  id: string,              // 课时ID（主键）
  courseId: string,        // 课程ID（外键）
  userId: string,          // 用户ID（外键）
  title: string,           // 课时标题
  description: string,     // 课时描述
  order: number,           // 排序
  duration: number,        // 预计时长（秒）
  wordCount: number,       // 词汇数
  completedAt: string,     // 完成时间
  bestTime: number,        // 最佳时长（秒）
  attemptCount: number,    // 尝试次数
  lastStudyTime: string,   // 最后学习时间
  isLocked: boolean,       // 是否锁定
  unlockCondition: object, // 解锁条件（JSON）
  createdAt: string,       // 创建时间
  updatedAt: string        // 最后更新时间
}
```

### 7. userProgress（学习进度表）
存储用户的学习详细进度。

```javascript
{
  id: number,              // 自增ID（主键）
  userId: string,          // 用户ID（外键）
  courseId: string,        // 课程ID（外键）
  lessonId: string,        // 课时ID（外键）
  sentenceIndex: number,   // 句子索引
  inputText: string,       // 输入文本
  isCorrect: boolean,      // 是否正确
  accuracy: number,        // 准确率
  studyTime: number,       // 学习时长（秒）
  timestamp: string        // 时间戳
}
```

### 8. vocabulary（词汇表）
存储词汇信息。

```javascript
{
  id: number,              // 自增ID（主键）
  word: string,            // 单词
  pronunciation: string,   // 发音
  definition: string,      // 定义
  exampleSentences: string,// 例句
  partOfSpeech: string,    // 词性
  difficulty: 'beginner'|'intermediate'|'advanced'|'expert', // 难度
  frequency: number,       // 频率
  courseId: string,        // 课程ID（外键）
  lessonId: string,        // 课时ID（外键）
  createdAt: string,       // 创建时间
  updatedAt: string        // 最后更新时间
}
```

### 9. userVocabulary（用户词汇掌握表）
存储用户对词汇的掌握情况。

```javascript
{
  id: number,              // 自增ID（主键）
  userId: string,          // 用户ID（外键）
  wordId: number,          // 词汇ID（外键）
  word: string,            // 单词
  masteryLevel: 'unlearned'|'learning'|'mastered', // 掌握程度
  reviewCount: number,     // 复习次数
  correctCount: number,    // 正确次数
  wrongCount: number,      // 错误次数
  lastReviewed: string,    // 最后复习时间
  nextReview: string,      // 下次复习时间
  reviewInterval: number,  // 复习间隔（天）
  easeFactor: number,      // 遗忘曲线参数
  createdAt: string,       // 创建时间
  updatedAt: string        // 最后更新时间
}
```

### 10. settings（设置表）
存储用户个人设置。

```javascript
{
  id: number,              // 自增ID（主键）
  userId: string,          // 用户ID（外键）
  key: string,             // 设置键
  value: any,              // 设置值
  createdAt: string,       // 创建时间
  updatedAt: string        // 最后更新时间
}
```

### 11. systemSettings（系统设置表）
存储系统全局设置。

```javascript
{
  id: number,              // 自增ID（主键）
  key: string,             // 设置键
  value: any,              // 设置值
  description: string,     // 描述
  settingType: 'general'|'security'|'notifications'|'marketing', // 设置类型
  isActive: boolean,       // 是否激活
  createdAt: string,       // 创建时间
  updatedAt: string        // 最后更新时间
}
```

### 12. notifications（通知表）
存储用户通知信息。

```javascript
{
  id: number,              // 自增ID（主键）
  userId: string,          // 用户ID（外键）
  title: string,           // 通知标题
  content: string,         // 通知内容
  notificationType: 'system'|'learning'|'marketing'|'achievement', // 通知类型
  priority: 'low'|'medium'|'high', // 优先级
  isRead: boolean,         // 是否已读
  readAt: string,          // 阅读时间
  expiresAt: string,       // 过期时间
  createdAt: string        // 创建时间
}
```

### 13. marketingCampaigns（营销活动表）
存储营销活动信息。

```javascript
{
  id: string,              // 活动ID（主键）
  name: string,            // 活动名称
  description: string,     // 活动描述
  campaignType: 'discount'|'promotion'|'event'|'newsletter', // 活动类型
  startDate: string,       // 开始时间
  endDate: string,         // 结束时间
  discountPercentage: number, // 折扣百分比
  discountAmount: number,  // 折扣金额
  couponCode: string,      // 优惠券代码
  maxUses: number,         // 最大使用次数
  currentUses: number,     // 当前使用次数
  isActive: boolean,       // 是否激活
  targetAudience: object,  // 目标受众（JSON）
  createdAt: string,       // 创建时间
  updatedAt: string        // 最后更新时间
}
```

### 14. coupons（优惠券表）
存储优惠券信息。

```javascript
{
  id: string,              // 优惠券ID（主键）
  campaignId: string,      // 营销活动ID（外键）
  code: string,            // 优惠券代码（唯一）
  discountType: 'percentage'|'fixed', // 折扣类型
  discountValue: number,   // 折扣值
  minimumAmount: number,   // 最低消费金额
  maxDiscount: number,     // 最大折扣金额
  startDate: string,       // 开始时间
  endDate: string,         // 结束时间
  userId: string,          // 用户ID（外键）
  isUsed: boolean,         // 是否已使用
  usedAt: string,          // 使用时间
  createdAt: string,       // 创建时间
  updatedAt: string        // 最后更新时间
}
```

### 15. userActivities（用户行为记录表）
存储用户行为记录。

```javascript
{
  id: number,              // 自增ID（主键）
  userId: string,          // 用户ID（外键）
  activityType: 'login'|'logout'|'course_start'|'course_complete'|'lesson_start'|'lesson_complete'|'word_learn'|'word_review'|'achievement_unlock'|'notification_read'|'coupon_use', // 活动类型
  activityData: object,    // 活动数据（JSON）
  ipAddress: string,       // IP地址
  userAgent: string,       // 用户代理
  createdAt: string        // 创建时间
}
```

### 16. appCrashes（应用崩溃日志表）
存储应用崩溃日志。

```javascript
{
  id: number,              // 自增ID（主键）
  userId: string,          // 用户ID（外键）
  errorType: string,       // 错误类型
  errorMessage: string,    // 错误信息
  stackTrace: string,      // 堆栈跟踪
  userAgent: string,       // 用户代理
  browserInfo: object,     // 浏览器信息（JSON）
  osInfo: object,          // 操作系统信息（JSON）
  deviceInfo: object,      // 设备信息（JSON）
  pageUrl: string,         // 页面URL
  referrerUrl: string,     // 来源URL
  sessionId: string,       // 会话ID
  ipAddress: string,       // IP地址
  createdAt: string        // 创建时间
}
```

### 17. userFeedback（用户反馈表）
存储用户反馈信息。

```javascript
{
  id: number,              // 自增ID（主键）
  userId: string,          // 用户ID（外键）
  feedbackType: 'bug'|'feature_request'|'suggestion'|'complaint'|'other', // 反馈类型
  title: string,           // 反馈标题
  content: string,         // 反馈内容
  priority: 'low'|'medium'|'high', // 优先级
  status: 'new'|'in_progress'|'resolved'|'closed', // 状态
  screenshotUrl: string,   // 截图URL
  attachments: object,     // 附件（JSON）
  userAgent: string,       // 用户代理
  browserInfo: object,     // 浏览器信息（JSON）
  osInfo: object,          // 操作系统信息（JSON）
  deviceInfo: object,      // 设备信息（JSON）
  createdAt: string,       // 创建时间
  updatedAt: string        // 最后更新时间
}
```

### 18. studyPlans（学习计划表）
存储用户的学习计划信息。

```javascript
{
  id: string,              // 学习计划ID（主键）
  userId: string,          // 用户ID（外键）
  name: string,            // 计划名称
  description: string,     // 计划描述
  targetGoal: string,      // 目标
  targetDate: string,      // 目标日期
  currentProgress: number, // 当前进度
  isActive: boolean,       // 是否激活
  createdAt: string,       // 创建时间
  updatedAt: string        // 最后更新时间
}
```

### 19. studyPlanTasks（学习计划任务表）
存储学习计划的任务信息。

```javascript
{
  id: string,              // 任务ID（主键）
  studyPlanId: string,     // 学习计划ID（外键）
  userId: string,          // 用户ID（外键）
  taskType: 'course'|'lesson'|'word_review'|'daily_goal', // 任务类型
  taskData: object,        // 任务数据（JSON）
  targetValue: number,     // 目标值
  currentValue: number,    // 当前值
  isCompleted: boolean,    // 是否完成
  completedAt: string,     // 完成时间
  dueDate: string,         // 截止日期
  createdAt: string,       // 创建时间
  updatedAt: string        // 最后更新时间
}
```

## 如何查看数据库

### 方法1：使用浏览器开发者工具

1. **Chrome/Edge**:
   - 打开开发者工具（F12）
   - 转到 "Application" 标签
   - 在左侧找到 "IndexedDB"
   - 展开 "WordTapDB"
   - 查看各个表的数据

2. **Firefox**:
   - 打开开发者工具（F12）
   - 转到 "存储" 标签
   - 找到 "IndexedDB" > "WordTapDB"
   - 查看各个表的数据

### 方法2：使用数据库管理页面

访问 `/database` 路由，可以：
- 查看所有表的数据
- 刷新数据
- 导出数据为 JSON 文件
- 删除用户
- 清空所有数据（谨慎使用）

### 方法3：在代码中使用

```javascript
import { db } from '@/db'

// 获取所有用户
const users = await db.users.toArray()

// 获取单个用户
const user = await db.users.get('user_id')

// 添加用户
await db.users.add({
  id: 'user_123',
  username: 'test',
  email: 'test@example.com',
  password: 'hashed_password',
  createdAt: new Date().toISOString(),
  lastLoginAt: null
})

// 更新用户
await db.users.update('user_id', {
  lastLoginAt: new Date().toISOString()
})

// 删除用户
await db.users.delete('user_id')

// 查询用户
const user = await db.users.where('username').equals('test').first()
```

## 数据存储位置

IndexedDB 数据存储在浏览器的本地文件系统中：

- **Windows**: `C:\Users\<用户名>\AppData\Local\Google\Chrome\User Data\Default\IndexedDB\`
- **macOS**: `~/Library/Application Support/Google/Chrome/Default/IndexedDB/`
- **Linux**: `~/.config/google-chrome/Default/IndexedDB/`

## 数据导出和备份

### 导出数据

1. 访问 `/database` 页面
2. 点击 "导出数据" 按钮
3. 下载 JSON 文件

### 导入数据（需要手动实现）

```javascript
// 从 JSON 文件导入数据
async function importData(jsonData) {
  await db.users.bulkPut(jsonData.users)
  await db.userStats.bulkPut(jsonData.userStats)
  await db.courses.bulkPut(jsonData.courses)
  await db.lessons.bulkPut(jsonData.lessons)
  // ...
}
```

## 注意事项

1. **数据持久性**: IndexedDB 数据会一直保存，除非：
   - 用户手动清除浏览器数据
   - 使用无痕模式（关闭后清除）
   - 代码中删除数据库

2. **存储限制**: 
   - Chrome: 通常为可用磁盘空间的 50%
   - Firefox: 通常为可用磁盘空间的 50%
   - 具体限制因浏览器而异

3. **安全性**: 
   - 密码使用 SHA-256 哈希存储
   - 数据仅存储在本地，不会上传到服务器
   - 建议在生产环境中使用更安全的密码哈希方法（如 bcrypt）

4. **跨域限制**: IndexedDB 受同源策略限制，不同域名的页面无法访问彼此的数据库。

## 调试技巧

在浏览器控制台中：

```javascript
// 查看数据库版本
console.log(db.verno)

// 查看所有表
console.log(db.tables)

// 查看用户数量
db.users.count().then(count => console.log('用户数:', count))

// 查看所有用户
db.users.toArray().then(users => console.log(users))
```

## 常见问题

### Q: 如何重置数据库？
A: 在 `/database` 页面点击 "清空所有数据"，或使用浏览器开发者工具删除 IndexedDB。

### Q: 数据会丢失吗？
A: 正常情况下不会。但清除浏览器数据、使用无痕模式、或手动删除数据库会导致数据丢失。

### Q: 可以迁移到其他数据库吗？
A: 可以，但需要实现数据迁移逻辑。IndexedDB 适合本地存储，如果需要服务器同步，可以考虑使用后端 API。

