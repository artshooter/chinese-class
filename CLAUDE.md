# CLAUDE.md

本文件为在此仓库中使用 Claude Code (claude.ai/code) 时提供指导。

## 项目概述

一个沉浸式中文互动学习网站，模拟在教室里打开中文课本的体验。核心特点包括：
- 书籍交互和翻页动画
- 响应式 2.5D 贴图设计
- 鼠标追踪的 3D 透视效果

## 技术栈

- **前端框架**：React 19
- **构建工具**：Vite 7
- **动画**：CSS transforms
- **样式**：原生 CSS

## 开发命令

```bash
# 安装依赖
npm install

# 开发服务器（运行在 http://localhost:5173）
npm run dev

# 生产构建
npm run build

# 本地预览生产构建
npm run preview
```

## 架构概述

### 状态机设计

HomePage 使用清晰的 6 状态机架构，确保交互流程清晰可控：

```
INITIAL (初始)
  ↓ 点击
OPENING (打开动画中)
  ↓ 动画完成
BOOK (书籍打开)
  ├─ 切换内容 → SWITCHING → 回到 BOOK
  ├─ 点击封面 → LOADING
  │             ↓
  │         CONTENT (查看内容)
  │             ↓ 点击关闭
  │           回到 BOOK
  │
  └─ 点击背景 → 回到 INITIAL
```

### 6 个核心状态

| 状态 | 含义 | 允许的操作 | 转移条件 |
|------|------|----------|--------|
| `INITIAL` | 书籍关闭，初始页面 | 鼠标移动（3D 透视）、点击打开 | 点击 → OPENING |
| `OPENING` | 打开书籍动画（300ms） | 无（禁止交互） | frame=4 → BOOK |
| `BOOK` | 书籍打开，显示封面 | 切换内容、点击封面、鼠标移动 | 多个转移目标 |
| `SWITCHING` | 切换封面动画（翻页） | 无（禁止交互） | 动画完成 → BOOK |
| `LOADING` | 加载内容中 | 无（显示加载提示） | 成功→CONTENT 或 失败→BOOK |
| `CONTENT` | 全屏查看内容 | 点击关闭按钮 | ESC 或关闭按钮 → BOOK |

### 核心组件结构

**HomePage** (`src/pages/HomePage.jsx`) - 状态机核心：
- **状态管理**：单一 `appState` 枚举管理整个流程
- **内容管理**：`currentContentIndex` 跟踪当前内容
- **动画控制**：`frame`（0-4） 和 `switchDirection`
- **3D 效果**：`transform`（rotateY、rotateX） 鼠标追踪
- **布局变换**：`layoutTransform`（x、y、scale） 书籍居中放大
- **错误处理**：`loadError` 加载失败提示
- **视觉反馈**：`isBookHovered` Hover 增强反馈

### 关键状态转换流程

**INITIAL 状态**（初始页面）：
- 视觉反馈：呼吸动画 + 发光 + 鼠标追踪 3D 透视
- 用户操作：点击书籍 → OPENING 状态

**OPENING 状态**（打开动画）：
- 动画：frame 0→4（75ms 间隔），共 300ms
- 布局：同时执行 layoutTransform（居中、缩放）
- 完成：frame=4 时自动转移到 BOOK 状态

**BOOK 状态**（书籍打开）：
- 显示当前内容封面（通过 `contents[currentContentIndex]`）
- 支持多个操作：
  - 点击左右箭头/方向键 → SWITCHING 切换封面
  - 点击封面/Enter → LOADING 查看内容
  - 点击背景/ESC → INITIAL 关闭书籍

**SWITCHING 状态**（切换封面）：
- 动画：显示 fanye-0.webp → fanye-1.webp → fanye-2.webp（100ms 间隔）
- 在 fanye-2 时替换封面内容
- 完成：更新 `currentContentIndex` 后回到 BOOK 状态

**LOADING 状态**（加载内容）：
- 显示加载动画和"加载中..."提示
- 10 秒超时保护
- 完成路径：
  - iframe onLoad → CONTENT 状态
  - iframe onError 或超时 → BOOK 状态 + 错误提示

**CONTENT 状态**（查看内容）：
- 显示全屏 iframe 及关闭按钮
- 点击关闭/ESC → 回到 BOOK 状态（保持 currentContentIndex）

### 资源结构

**打开书籍动画**：
- `/book-0.webp` ~ `/book-4.webp`：5 帧打开动画

**切换内容动画**：
- `/fanye-0.webp` ~ `/fanye-2.webp`：3 帧翻页动画

**背景和内容**：
- `/table.webp`：桌子背景
- `/back-view-v.webp` 等：内容封面图片（通过 CONTENTS 数组管理）

### 组件文件组织

- `src/pages/HomePage.jsx`：状态机和交互逻辑（~520 行）
- `src/pages/HomePage.css`：所有样式，包括新增动画
- `src/components/`、`src/hooks/`、`src/assets/`：预留目录

## 关键实现细节

### 状态管理

```javascript
const APP_STATES = {
  INITIAL: 'initial',      // 初始状态
  OPENING: 'opening',      // 打开动画
  BOOK: 'book',            // 书籍打开
  SWITCHING: 'switching',  // 切换封面动画
  LOADING: 'loading',      // 加载中
  CONTENT: 'content'       // 查看内容
}

// 核心状态变量
const [appState, setAppState] = useState(APP_STATES.INITIAL)
const [currentContentIndex, setCurrentContentIndex] = useState(0)
const [frame, setFrame] = useState(0)
const [transform, setTransform] = useState({ rotateY: 0, rotateX: 0 })
const [layoutTransform, setLayoutTransform] = useState({ x: 0, y: 0, scale: 1 })
const [loadError, setLoadError] = useState(null)
```

### OPENING 动画（打开书籍）

- **触发**：用户点击 INITIAL 状态的书籍
- **时长**：300ms（4 帧 × 75ms）
- **帧序列**：frame 0→1→2→3→4
- **资源**：`/book-0.webp` ~ `/book-4.webp`
- **并发**：同时执行 layoutTransform 变换（居中和缩放到 90vh）
- **完成条件**：frame=4 时自动转移到 BOOK 状态

```javascript
useEffect(() => {
  if (appState !== APP_STATES.OPENING) return

  let currentFrame = 0
  const timer = setInterval(() => {
    currentFrame++
    setFrame(currentFrame)
    if (currentFrame >= 4) {
      clearInterval(timer)
      handleOpeningComplete()
    }
  }, 75)

  return () => clearInterval(timer)
}, [appState])
```

### SWITCHING 动画（切换内容封面）

- **触发**：用户点击左右箭头或按方向键
- **时长**：~300ms（3 帧 × 100ms）
- **帧序列**：fanye-0 → fanye-1 → fanye-2
- **资源**：`/fanye-0.webp` ~ `/fanye-2.webp`
- **内容替换**：fanye-2 显示时替换封面内容
- **完成**：更新 currentContentIndex 后回到 BOOK 状态

### INITIAL 状态的被动动画

**呼吸动画**：
```css
@keyframes breathe {
  0%, 100% {
    transform: translateY(0px);
    filter: drop-shadow(0 0 20px rgba(255, 200, 87, 0.3));
  }
  50% {
    transform: translateY(-8px);
    filter: drop-shadow(0 0 30px rgba(255, 200, 87, 0.5));
  }
}
```

**3D 透视追踪**：
- 持续监听鼠标移动（仅在 INITIAL 和 BOOK 状态）
- rotateY：(x - 0.5) × 8，范围 ±4 度
- rotateX：(y - 0.5) × -5，范围 ±2.5 度
- 创建实时的视差深度效果

**Hover 增强反馈**：
```css
.book-container.breathing:hover {
  animation-duration: 1.5s;  /* 加快呼吸 */
  filter: drop-shadow(0 0 40px rgba(255, 200, 87, 0.8));  /* 加强发光 */
  transform: scale(1.05);  /* 放大 */
}
```

### 布局变换（书籍居中和缩放）

在 OPENING 状态开始时计算：
```javascript
const rect = anchorRef.current.getBoundingClientRect()
const targetHeight = window.innerHeight * 0.9  // 目标高度 90vh
const scale = targetHeight / rect.height  // 缩放系数

const targetX = window.innerWidth / 2
const targetY = window.innerHeight / 2
const currentX = rect.left + rect.width / 2
const currentY = rect.top + rect.height / 2

const x = targetX - currentX  // 水平偏移
const y = targetY - currentY  // 垂直偏移

setLayoutTransform({ x, y, scale })
```

### 3D 旋转（rotateZ）

```javascript
const getRotateZ = () => {
  if (frame === 4) return 0  // 完全打开时无倾斜
  return (frame / 3) * 20    // frame 0-3 时从 0-20 度
}
```

用于在打开过程中创建翻页的 3D 倾斜效果。

### 加载和错误处理

**加载超时**：
```javascript
const timeout = setTimeout(() => {
  if (appState === APP_STATES.LOADING) {
    handleLoadError('加载超时，请重试')
  }
}, 10000)  // 10 秒超时
```

**错误自动消失**：
```javascript
setLoadError(errorMessage)
setTimeout(() => {
  setLoadError(null)
}, 3000)  // 3 秒后自动清除
```

### 动画期间禁用交互

```javascript
const isAnimating = appState === APP_STATES.OPENING || appState === APP_STATES.SWITCHING

// 在 JSX 中
<div className={`book-container ${isAnimating ? 'animating' : ''}`} />

// 在 CSS 中
.book-container.animating {
  pointer-events: none;  /* 禁止所有交互 */
}
```

## 事件处理器和交互

### 核心事件处理器

| 处理器 | 触发条件 | 目标状态 | 说明 |
|-------|--------|--------|------|
| `handleClickBook` | 点击 INITIAL 状态的书籍 | OPENING | 计算 layoutTransform，启动打开动画 |
| `handleOpeningComplete` | frame = 4 | BOOK | 动画完成，自动转移到 BOOK |
| `handleSwitchContent` | 点击左右按钮或方向键（BOOK 状态） | SWITCHING | 启动翻页动画 |
| `handleSwitchingComplete` | 翻页动画完成 | BOOK | 更新 currentContentIndex，回到 BOOK |
| `handleViewContent` | 点击封面或 Enter（BOOK 状态） | LOADING | 启动加载超时 |
| `handleLoadSuccess` | iframe onLoad | CONTENT | 加载完成，显示内容 |
| `handleLoadError` | iframe onError 或超时 | BOOK | 显示错误提示，3s 后自动清除 |
| `handleCloseContent` | 点击关闭按钮或 ESC（CONTENT 状态） | BOOK | 保持 currentContentIndex 不变 |
| `handleCloseBook` | 点击背景或 ESC（BOOK 状态） | INITIAL | 重置 layoutTransform |

### 键盘导航

- `←` / `→`：切换内容（BOOK 状态）
- `Enter`：查看内容（BOOK 状态）
- `Esc`：关闭内容或书籍（CONTENT 或 BOOK 状态）

### 鼠标交互

- **点击书籍**（INITIAL）：打开
- **Hover 书籍**（INITIAL）：增强视觉反馈
- **点击左右箭头**（BOOK）：切换内容
- **点击封面**（BOOK）：查看内容
- **点击背景**（BOOK）：关闭书籍
- **点击关闭按钮**（CONTENT）：返回书籍

### 响应式调整

- 窗口大小改变时，如果书籍已展开，自动重新计算 layoutTransform
- 确保书籍始终居中且完整显示

## 内容管理

### 添加新内容

在 HomePage.jsx 中修改 CONTENTS 数组：

```javascript
const CONTENTS = [
  {
    id: 'article1',
    title: 'First Article',
    coverImage: '/back-view-v.webp',
    url: 'http://localhost:3000/zh/article1'
  },
  {
    id: 'article2',
    title: 'Second Article',
    coverImage: '/back-view-v-2.webp',  // 新增封面
    url: 'http://localhost:3000/zh/article2'
  }
  // 添加更多内容...
]
```

### 准备资源

对于每个新内容：
1. 准备对应的封面图片（如 `/back-view-v-2.webp`）
2. 确保 URL 指向正确的内容源
3. 可选：为不同内容准备不同的打开/翻页动画（目前共用 book-*.webp 和 fanye-*.webp）

## 开发指南

### 样式修改

所有样式位于 `src/pages/HomePage.css`：
- **状态样式**：`.breathing`、`.animating`、`.hover-enhanced` 等
- **UI 元素**：`.navigation-buttons`、`.loading-overlay`、`.error-toast` 等
- **动画**：`@keyframes breathe`、`@keyframes spin`、`@keyframes slide-in` 等

### 动画调整

在 HomePage.jsx 中的 ANIMATION_CONFIG 修改时间参数：
```javascript
const ANIMATION_CONFIG = {
  OPENING_DURATION: 300,           // OPENING 动画时长
  OPENING_FRAME_INTERVAL: 75,      // 打开动画帧间隔
  SWITCHING_DURATION: 300,         // SWITCHING 动画时长
  SWITCHING_FRAME_INTERVAL: 100,   // 翻页动画帧间隔
  LOAD_TIMEOUT: 10000,             // 加载超时
  ERROR_DISPLAY_DURATION: 3000     // 错误显示时长
}
```

### 透视参数调整

在鼠标追踪 useEffect 中：
```javascript
const rotateY = x * 8   // 修改 8 改变 Y 旋转强度
const rotateX = -y * 5  // 修改 5 改变 X 旋转强度
```

### 3D 效果调整

在 getRotateZ 函数中：
```javascript
return (frame / 3) * 20  // 修改 20 改变倾斜强度
```

## 常见任务

**添加第二篇文章：**
1. 在 CONTENTS 数组中添加新对象
2. 准备 `/back-view-v-2.webp` 封面图片
3. 确保 url 指向实际内容源

**修改 INITIAL 状态的呼吸动画：**
1. 编辑 HomePage.css 中的 `@keyframes breathe`
2. 修改动画关键帧的 transform 和 filter 值

**修改加载超时时长：**
1. 编辑 ANIMATION_CONFIG 中的 `LOAD_TIMEOUT` 值
2. 默认 10000ms，改为想要的毫秒数

**修改 3D 透视强度：**
1. 在鼠标追踪 useEffect 中修改 rotateY 和 rotateX 的系数
2. 较大的数字 = 更强的透视效果

**部署到生产环境：**
1. 更新 CONTENTS 数组中所有内容的 URL 为实际生产地址
2. 运行 `npm run build` - 输出到 `/dist`
3. 使用 `npm run preview` 在生产模式下测试
4. 部署 `/dist` 目录

## 状态机流程速查

```
用户页面加载
  ↓
INITIAL（呼吸 + 3D 透视）
  ↓ 用户点击书籍
OPENING（动画 300ms）
  ↓ 自动完成（frame=4）
BOOK（显示封面，可交互）
  ├─ 点击箭头 → SWITCHING → BOOK
  ├─ 点击封面 → LOADING → CONTENT（成功）或 BOOK（失败）
  └─ 点击背景 → INITIAL
```

## 最佳实践

✅ **保持状态清晰**：所有逻辑都通过 appState 驱动，不使用隐式状态
✅ **禁用动画期间的交互**：通过 `pointer-events: none` 防止冲突
✅ **清理 timers**：所有异步操作都有对应的 cleanup
✅ **事件委托**：避免在动画期间处理事件
✅ **响应式设计**：监听 resize 事件调整布局
