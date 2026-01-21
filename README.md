# WordTap - 沉浸式英语听写与跟打应用

## 项目简介

WordTap 是一款"移动端优先"的沉浸式英语听写与跟打 Web 应用。通过高频的手指互动（键盘输入）结合即时反馈，解决传统背单词枯燥、"只看不写"记忆不牢的问题。

## 核心特性

- 🎯 **Flow（心流）体验**：自动流转、无缝衔接的打字体验
- 📱 **Mobile-First**：利用 VisualViewport API 完美解决手机软键盘遮挡内容的痛点
- 🔊 **即时反馈**：打字音效、正确/错误提示、震动反馈
- 📊 **数据可视化**：学习统计、连续打卡、学习时长追踪
- 💾 **本地优先**：使用 IndexedDB 存储，支持离线学习
- 🌐 **前后端分离**：基于 FastAPI + Vue 3 的现代化架构
- 📚 **丰富课程**：内置多种类型的英语课程，支持课程筛选和学习进度跟踪
- 🛠️ **学习工具**：错题本、生词本等辅助学习功能
- 📈 **学习热力图**：直观展示学习情况

## 技术栈

### 前端

- **框架**: Vue 3 (Composition API)
- **状态管理**: Pinia
- **路由**: Vue Router
- **样式**: Tailwind CSS
- **数据库**: Dexie.js (IndexedDB)
- **音频**: Howler.js
- **工具库**: VueUse

### 后端

- **框架**: FastAPI (Python 3.9+)
- **API 客户端**: Axios
- **数据库**: SQLite (默认，支持 MySQL/MariaDB)

## 项目结构

```
├── backend/               # 后端应用 (FastAPI)
│   ├── api/             # API 路由
│   ├── models/          # 数据模型
│   ├── schemas/         # 数据校验
│   ├── crud/            # 数据库操作
│   ├── database/        # 数据库配置
│   ├── main.py          # 应用入口
│   └── requirements.txt # Python 依赖
├── public/               # 静态资源
│   ├── dicts/            # 词库数据
│   ├── sound/            # 音频文件
│   └── imgs/             # 图片资源
├── src/                  # 前端应用 (Vue 3)
│   ├── api/             # API 客户端配置
│   ├── components/       # 组件
│   ├── views/           # 页面
│   ├── stores/          # Pinia stores
│   ├── db/              # 数据库配置
│   ├── router/          # 路由配置
│   └── style.css        # 全局样式
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 安装与运行

### 前端安装与运行

#### 安装依赖

```bash
npm install
```

#### 开发模式

```bash
npm run dev
```

#### 构建生产版本

```bash
npm run build
```

### 后端安装与运行

#### 进入后端目录

```bash
cd backend
```

#### 安装 Python 依赖

```bash
# 创建虚拟环境
python3.9 -m venv venv

# 激活虚拟环境
# Linux/Mac
source venv/bin/activate
# Windows
venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt
```

#### 启动开发服务器

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### 生产部署

```bash
# 使用 Gunicorn 运行
pip install gunicorn

# 启动生产服务器
Gunicorn -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000 main:app
```

## 功能模块

### 1. 首页 (Dashboard)

- 连续打卡统计
- 累计打卡天数
- 本周打卡记录可视化
- 学习时长统计（今日/本周/本月/今年）
- 继续学习快捷入口
- 最近学习记录
- 学习工具入口（错题本、生词本）
- 学习热力图

### 2. 发现/选课页 (Discovery)

- **我的课程**：显示已加入的课程及学习进度
- **课程广场**：浏览所有可用课程
- **分类筛选**：支持按课程类型筛选
- **课程卡片**：显示课程封面、名称、分类和学习人数
- **课程进度**：直观展示已学课时/总课时

### 3. 课程详情页 (Course Detail)

- 课程封面和简介
- 总课时数和词汇量
- 学习人数统计
- 加入课程/开始学习按钮
- 课程标签和更新状态

### 4. 课时列表页 (Chapter List)

- 显示课程下所有课时
- 学习状态（未开始/进行中/已完成）
- 最佳耗时和完成次数
- 上次学习时间
- 学习进度条

### 5. 沉浸式学习页 (Learning) 🔥核心

- **VisualViewport 适配**：完美解决移动端键盘遮挡问题
- **隐藏输入框策略**：透明输入框捕获焦点，手动渲染 UI
- **实时字符校验**：正确变绿，错误震动反馈
- **自动流转**：完成当前句自动跳转下一句
- **音频播放**：支持播放/暂停/重播
- **多种模式**：跟打模式、中译英模式、纯听写模式
- **即时反馈**：打字音效、正确/错误提示

### 6. 个人中心 (Profile)

- 用户信息展示
- 学习统计数据
- 应用设置入口
- 账号管理

### 7. 学习工具

#### 7.1 错题本

- 记录学习中遇到的错误
- 待复习题目统计
- 按课程分类管理

#### 7.2 生词本

- 记录学习中遇到的生词
- 生词数量统计
- 按课程分类管理

### 8. 学习热力图

- 按月展示学习情况
- 颜色深浅表示学习活跃度
- 支持月份切换

## 部署说明

### 本地开发环境

1. 启动后端服务（端口8000）
2. 启动前端开发服务器（端口3000）
3. 在浏览器中访问 http://localhost:3000

### 生产部署

#### 前端部署

1. 构建生产版本：`npm run build`
2. 将 `dist` 目录部署到 Nginx 或其他 Web 服务器
3. 配置 Nginx 代理规则，将 API 请求转发到后端服务

#### 后端部署

1. 使用 Gunicorn 运行后端服务
2. 配置系统服务（如 Systemd）确保服务自动启动
3. 配置防火墙，开放必要端口

#### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态资源
    location / {
        root /path/to/wordtap/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # 后端 API 代理
    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 开发指南

### 前端开发

- 主要开发目录：`src/`
- 组件开发：`src/components/`
- 页面开发：`src/views/`
- 状态管理：`src/stores/`
- API 调用：`src/api/`

### 后端开发

- 主要开发目录：`backend/`
- API 路由：`backend/api/`
- 数据模型：`backend/models/`
- 数据库操作：`backend/crud/`

### 代码规范

- 前端：使用 ESLint 和 Prettier 进行代码检查和格式化
- 后端：遵循 PEP 8 代码规范

## 数据库

### 前端本地存储

- 使用 Dexie.js 操作 IndexedDB
- 存储学习进度、统计数据等
- 支持离线学习

### 后端数据库

- 默认使用 SQLite
- 支持 MySQL/MariaDB
- 数据迁移：使用 Alembic

## 安全

- 使用 JWT 进行用户认证
- API 访问权限控制
- 数据加密存储
- 防止 SQL 注入
- 防止 XSS 攻击

## 监控与日志

- 后端日志：使用 Python logging 模块
- 访问日志：Nginx 访问日志
- 错误日志：后端错误日志

## 浏览器支持

- Chrome/Edge (推荐)
- Safari (iOS 13+)
- Firefox
- 需要支持 VisualViewport API（移动端浏览器）

## 核心技术实现

### VisualViewport API 适配

```javascript
// 监听视口变化
if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", updateViewport);
}

function updateViewport() {
  viewportHeight.value = window.visualViewport.height;
  keyboardHeight.value = window.innerHeight - window.visualViewport.height;
  // 动态调整内容区 padding，确保当前句子在可视区域
}
```

### 隐藏输入框策略

使用透明、固定定位的 `<input>` 元素捕获焦点，通过拦截 `input` 事件获取用户按键，手动渲染 UI 上的字符。这样可以完全控制输入体验，避免浏览器默认行为。

### 输入处理优化

- 输入响应在 16ms (1帧) 内完成
- 使用 ref 直接操作 DOM，避免 Vue 响应式系统造成输入卡顿
- 支持空格、大小写、特殊字符的正确匹配

### 前后端数据同步

- 优先使用后端 API 获取最新数据
- 本地缓存机制，支持离线学习
- 智能降级策略：API 不可用时自动切换到本地数据

## 开发计划

### 近期计划

- [x] 完善学习工具功能（错题本、生词本）
- [x] 学习热力图可视化
- [ ] 句子级别的音频支持
- [ ] 学习报告和数据分析

### 中期计划

- [ ] 社交功能（排行榜、分享）
- [ ] 更多课程内容
- [ ] PWA 支持优化
- [ ] 多语言支持

### 远期计划

- [ ] AI 个性化学习推荐
- [ ] 学习路径规划
- [ ] 口语练习功能
- [ ] 视频课程支持

## 贡献指南

### 开发环境设置

1. 克隆项目：`git clone https://github.com/wh19910805/wordTap.git`
2. 安装前端依赖：`npm install`
3. 安装后端依赖：参考后端安装与运行部分
4. 启动开发服务器：
   - 后端：`uvicorn main:app --reload --host 0.0.0.0 --port 8000`
   - 前端：`npm run dev`

### 提交规范

- 提交信息格式：`type(scope): description`
- 类型包括：feat, fix, docs, style, refactor, test, chore
- 示例：`feat(dashboard): 添加学习热力图功能`

### 分支管理

- `main`：主分支，用于生产部署
- `develop`：开发分支，用于整合功能
- `feature/*`：功能分支，用于开发新功能
- `fix/*`：修复分支，用于修复 bug

## 许可证

MIT License

## 联系方式

- 项目地址：https://github.com/wh19910805/wordTap
- 问题反馈：https://github.com/wh19910805/wordTap/issues

## 致谢

感谢所有为项目做出贡献的开发者和用户！
