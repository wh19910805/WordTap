# WordTap - 沉浸式英语听写与跟打应用

## 项目简介

WordTap 是一款"移动端优先"的沉浸式英语听写与跟打 Web 应用。通过高频的手指互动（键盘输入）结合即时反馈，解决传统背单词枯燥、"只看不写"记忆不牢的问题。

## 核心特性

- 🎯 **Flow（心流）体验**：自动流转、无缝衔接的打字体验
- 📱 **Mobile-First**：利用 VisualViewport API 完美解决手机软键盘遮挡内容的痛点
- 🔊 **即时反馈**：打字音效、正确/错误提示、震动反馈
- 📊 **数据可视化**：学习统计、连续打卡、学习时长追踪
- 💾 **本地优先**：使用 IndexedDB 存储，支持离线学习

## 技术栈

- **框架**: Vue 3 (Composition API)
- **状态管理**: Pinia
- **路由**: Vue Router
- **样式**: Tailwind CSS
- **数据库**: Dexie.js (IndexedDB)
- **音频**: Howler.js
- **工具库**: VueUse

## 项目结构

```
├── public/                 # 静态资源
│   ├── dicts/            # 词库数据
│   ├── sound/            # 音频文件
│   └── imgs/             # 图片资源
├── src/
│   ├── components/       # 组件
│   ├── views/           # 页面
│   ├── stores/          # Pinia stores
│   ├── db/              # 数据库配置
│   ├── router/          # 路由配置
│   └── style.css        # 全局样式
└── package.json
```

## 安装与运行

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 功能模块

### 1. 首页 (Dashboard)
- 连续打卡统计
- 词汇量统计
- 学习时长（今日/本周/本月/今年）
- 本周学习活动趋势图
- 继续学习快捷入口

### 2. 发现/选课页 (Discovery)
- 我的课程：显示已加入的课程及学习进度
- 课程广场：浏览所有可用课程，支持标签筛选

### 3. 课程详情页 (Course Detail)
- 课程封面和简介
- 总课时数和词汇量
- 学习人数统计
- 加入课程/开始学习按钮

### 4. 课时列表页 (Chapter List)
- 显示课程下所有课时
- 学习状态（未开始/进行中/已完成）
- 最佳耗时和完成次数
- 上次学习时间

### 5. 沉浸式学习页 (Learning) 🔥核心
- **VisualViewport 适配**：完美解决移动端键盘遮挡问题
- **隐藏输入框策略**：透明输入框捕获焦点，手动渲染 UI
- **实时字符校验**：正确变绿，错误震动反馈
- **自动流转**：完成当前句自动跳转下一句
- **音频播放**：支持播放/暂停/重播
- **多种模式**：跟打模式、中译英模式、纯听写模式

### 6. 个人中心 (Profile)
- 用户信息展示
- 学习统计数据
- 应用设置入口

## 核心技术实现

### VisualViewport API 适配

```javascript
// 监听视口变化
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', updateViewport)
}

function updateViewport() {
  viewportHeight.value = window.visualViewport.height
  keyboardHeight.value = window.innerHeight - window.visualViewport.height
  // 动态调整内容区 padding，确保当前句子在可视区域
}
```

### 隐藏输入框策略

使用透明、固定定位的 `<input>` 元素捕获焦点，通过拦截 `input` 事件获取用户按键，手动渲染 UI 上的字符。这样可以完全控制输入体验，避免浏览器默认行为。

### 输入处理优化

- 输入响应在 16ms (1帧) 内完成
- 使用 ref 直接操作 DOM，避免 Vue 响应式系统造成输入卡顿
- 支持空格、大小写、特殊字符的正确匹配

## 数据存储

使用 IndexedDB (Dexie.js) 存储：
- 课程列表和进度
- 用户学习统计
- 设置偏好

支持离线学习，联网后可同步数据。

## 浏览器支持

- Chrome/Edge (推荐)
- Safari (iOS 13+)
- Firefox
- 需要支持 VisualViewport API（移动端浏览器）

## 开发计划

- [ ] 句子级别的音频支持
- [ ] 学习报告和数据分析
- [ ] 社交功能（排行榜、分享）
- [ ] 更多课程内容
- [ ] PWA 支持优化

## 许可证

MIT

