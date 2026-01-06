# 沉浸式语文课文网站

一个具有沉浸式互动体验的中文课文网站首页，让用户仿佛"坐在教室里翻开语文书"。

## 项目特性

- 🎬 **睡眼动画**：进入网站时的睡眼睁开动画，营造代入感
- 🏫 **教室场景**：使用 Three.js 和 2.5D 贴图创建沉浸式教室环境
- 📖 **书籍交互**：点击书籍触发翻页动画
- 🎨 **响应式设计**：适配各种屏幕尺寸
- 🔄 **动画流程**：睁眼 → 教室场景 → 点击书籍 → 翻页 → 进入文章

## 技术栈

- **前端框架**: React 19
- **构建工具**: Vite 7
- **3D 渲染**: Three.js
- **动画库**: Framer Motion
- **样式**: CSS

## 项目结构

```
class/
├── public/
│   └── articles/              # 课文 HTML 文件
│       └── article1.html      # 示例课文
├── src/
│   ├── components/            # React 组件
│   ├── pages/                 # 页面组件
│   │   ├── HomePage.jsx       # 首页
│   │   └── HomePage.css       # 首页样式
│   ├── scenes/                # Three.js 场景
│   │   └── ClassroomScene.jsx # 教室场景
│   ├── hooks/                 # 自定义 hooks
│   ├── assets/                # 静态资源
│   │   ├── styles/
│   │   └── models/
│   ├── App.jsx                # 主应用组件
│   ├── App.css                # 应用样式
│   ├── index.css              # 全局样式
│   └── main.jsx               # 应用入口
├── index.html                 # HTML 入口
├── vite.config.js             # Vite 配置
└── package.json               # 项目配置
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 `http://localhost:5173`

### 生产构建

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 集成你的课文

### 方法 1: 存储 HTML 文件

将你已经写好的课文 HTML 文件放到 `public/articles/` 目录中：

```
public/
└── articles/
    ├── article1.html
    ├── article2.html
    └── article3.html
```

### 方法 2: 动态加载课文数据

在 `src/pages/HomePage.jsx` 中修改 `articles` 数组，添加你的课文信息：

```javascript
const articles = [
  { id: 'article1', title: '你的第一篇课文' },
  { id: 'article2', title: '你的第二篇课文' },
  { id: 'article3', title: '你的第三篇课文' },
]
```

## 自定义指南

### 修改教室场景

编辑 `src/scenes/ClassroomScene.jsx` 中的材质、灯光和对象属性：

- 修改书籍颜色：改变 `bookMaterial` 的 `color` 属性
- 调整相机位置：修改 `camera.position`
- 改变灯光强度：调整 `AmbientLight` 和 `DirectionalLight` 的参数

### 添加动画效果

使用 Framer Motion 在 `src/pages/HomePage.jsx` 中添加新的动画：

- 睡眼动画
- 书籍拿起动画
- 翻页动画

### 修改样式

编辑 CSS 文件自定义颜色、字体和布局：

- `src/index.css` - 全局样式
- `src/App.css` - 应用容器样式
- `src/pages/HomePage.css` - 首页样式

## 下一步计划

- [ ] 添加更复杂的 2.5D 分层贴图
- [ ] 实现完整的翻页动画
- [ ] 添加手指刷提示效果
- [ ] 支持多个课文场景切换
- [ ] 添加页面交互提示音效

## 许可证

MIT
