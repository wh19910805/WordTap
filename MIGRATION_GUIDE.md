# 从 IndexedDB 迁移到 MySQL 指南

## 概述

本指南说明如何将 WordTap 应用从使用 IndexedDB（本地数据库）迁移到使用 MySQL（服务器数据库）。

## 架构变化

### 之前（IndexedDB）
- 纯前端应用
- 数据存储在浏览器本地
- 使用 Dexie.js 直接访问数据库

### 之后（MySQL）
- 前端 + 后端架构
- 数据存储在 MySQL 服务器
- 前端通过 REST API 访问数据

## 迁移步骤

### 1. 安装和配置后端

参考 `backend/README.md` 文件。

### 2. 修改前端代码

#### 2.1 更新认证 Store

修改 `src/stores/auth.js`，使用 API 而不是直接访问 IndexedDB：

```javascript
import { api, setToken, removeToken } from '@/api/client'

// 注册
async function register(username, email, password) {
  try {
    const result = await api.auth.register(username, email, password)
    if (result.success) {
      setToken(result.token)
      currentUser.value = result.user
      return { success: true, message: '注册成功' }
    }
    return result
  } catch (error) {
    return { success: false, message: error.message }
  }
}

// 登录
async function login(usernameOrEmail, password) {
  try {
    const result = await api.auth.login(usernameOrEmail, password)
    if (result.success) {
      setToken(result.token)
      currentUser.value = result.user
      return { success: true, message: '登录成功' }
    }
    return result
  } catch (error) {
    return { success: false, message: error.message }
  }
}
```

#### 2.2 更新用户 Store

修改 `src/stores/user.js`，使用 API 获取和更新数据：

```javascript
import { api } from '@/api/client'

async function loadUserData() {
  try {
    const statsResult = await api.user.getStats()
    if (statsResult.success) {
      const stats = statsResult.stats
      streak.value = stats.streak
      totalCheckIn.value = stats.totalCheckIn
      wordCount.value = stats.wordCount
      studyTime.value = stats.studyTime
      lastStudyDate.value = stats.lastStudyDate
      completedLessons.value = stats.completedLessons
    }
  } catch (error) {
    console.error('加载用户数据失败:', error)
  }
}

async function addStudyTime(minutes, period = 'today') {
  studyTime.value[period] = (studyTime.value[period] || 0) + minutes
  studyTime.value.total = (studyTime.value.total || 0) + minutes
  
  await api.user.updateStats({
    studyTime: studyTime.value
  })
}
```

#### 2.3 更新课程 Store

修改 `src/stores/course.js`，使用 API：

```javascript
import { api } from '@/api/client'

async function loadCourses() {
  try {
    const result = await api.courses.getAll()
    if (result.success) {
      courses.value = result.courses
    }
  } catch (error) {
    console.error('加载课程失败:', error)
  }
}

async function addCourse(courseId) {
  try {
    const course = courses.value.find(c => c.id === courseId)
    if (!course) {
      return false
    }

    const result = await api.courses.add({
      id: course.id,
      name: course.name,
      category: course.category,
      tags: course.tags
    })

    return result.success
  } catch (error) {
    console.error('添加课程失败:', error)
    return false
  }
}
```

### 3. 配置环境变量

在项目根目录创建 `.env` 文件：

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 4. 数据迁移（可选）

如果需要将现有的 IndexedDB 数据迁移到 MySQL：

1. 使用数据库管理页面（`/database`）导出数据
2. 编写迁移脚本将 JSON 数据导入 MySQL
3. 或者手动在数据库中创建用户并关联数据

## 优势

1. **数据持久化**: 数据存储在服务器，不会因清除浏览器数据而丢失
2. **多设备同步**: 可以在不同设备上访问相同的数据
3. **数据安全**: 服务器端可以实施更严格的安全措施
4. **可扩展性**: 更容易添加新功能和数据分析

## 注意事项

1. **需要后端服务器**: 必须运行后端服务器才能使用
2. **网络依赖**: 需要网络连接才能访问数据
3. **部署复杂度**: 需要部署前端和后端两个部分
4. **成本**: 需要服务器资源来运行 MySQL 和 Node.js

## 混合方案

也可以采用混合方案：
- 使用 IndexedDB 作为离线缓存
- 使用 MySQL 作为主数据库
- 实现数据同步机制

这样可以兼顾离线使用和数据持久化。

