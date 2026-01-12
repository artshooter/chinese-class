# 记念刘和珍君 设计文档

## 内容理解

鲁迅1926年的悼文，纪念"三·一八惨案"中遇害的刘和珍。文章分七个部分，如七封信、七张纸。

**情感走向**：沉痛 → 回忆 → 愤怒 → 爆发 → 归于希望

## 设计概念

### 核心隐喻：七张信纸

- 七个章节 = 七张民国风信纸
- 翻页切换 = 阅读鲁迅写下的文字
- 深色背景 = 深夜伏案的氛围

### 实现说明

**重要**：文本内容直接放在图片上。编码时只需实现：
1. 图片切换逻辑（七张信纸图片轮播）
2. 返回按钮
3. 四周氛围样式

不需要处理文字排版，复用已有的图片切换逻辑即可。

## 视觉风格

### 信纸图片（由设计提供）

- 泛黄/米白纸张，有轻微纹理
- 细红线边框（民国信纸风格）
- 宋体黑墨字
- 每张右下角有红色印章风格章节号：「壹」~「柒」
- 文件命名：`page-1.webp` ~ `page-7.webp`

### 背景氛围

| 元素 | 说明 |
|------|------|
| 背景色 | 深褐/暗棕 `#1a1512`，如老旧书桌 |
| 暗角 | 四周径向渐变变暗，聚焦中央信纸 |
| 烛光（可选） | 微弱暖光从一侧照来，轻微摇曳 |

### 纸张状态递进（图片设计参考）

| 章节 | 纸张状态 |
|------|----------|
| 一~三 | 干净、平整 |
| 四~五 | 轻微褶皱，边缘微微泛红 |
| 六 | 红晕最明显（"沉默中爆发"） |
| 七 | 回归平静，留有淡淡痕迹 |

## 交互设计

### 翻页切换

- 左右箭头 / 左右滑动 / 键盘方向键
- 切换效果：简单淡入淡出即可
- 可选：轻微的纸张翻起 3D 效果

### 返回按钮

- 位置：左上角或右上角
- 样式：简洁，与氛围协调（暗色/半透明）

### 页码指示

- 底部显示当前页 / 总页数：「三 / 七」
- 或用七个小点指示

## 响应式考虑

### 桌面端
- 信纸居中，保持原始比例
- 左右留有背景空间，显示暗角氛围

### 移动端
- 信纸占满宽度，上下留背景
- 支持左右滑动翻页
- 返回按钮不遮挡内容

## 技术实现

### 组件结构

```
jinian-liuhezhenjun/
├── Content.jsx       # 主组件（图片切换 + 氛围）
├── Hero.jsx          # 可选：首屏标题页
├── design.md         # 设计文档
└── assets/
    ├── page-1.webp   # 第一章信纸图
    ├── page-2.webp
    ├── ...
    └── page-7.webp
```

### Content.jsx 实现要点

```jsx
// 核心逻辑：
// 1. 图片数组
const pages = [
  '/jinian-liuhezhenjun/page-1.webp',
  // ...
  '/jinian-liuhezhenjun/page-7.webp'
]

// 2. 当前页状态
const [currentPage, setCurrentPage] = useState(0)

// 3. 翻页函数
const goNext = () => setCurrentPage(p => Math.min(p + 1, 6))
const goPrev = () => setCurrentPage(p => Math.max(p - 1, 0))

// 4. 渲染：背景氛围 + 信纸图片 + 导航 + 返回按钮
```

### 氛围样式

```css
/* 背景 */
.atmosphere {
  background: #1a1512;
  min-height: 100vh;
}

/* 暗角效果 */
.vignette {
  position: fixed;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    transparent 40%,
    rgba(0, 0, 0, 0.6) 100%
  );
  pointer-events: none;
}

/* 信纸容器 */
.paper-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
}

/* 信纸图片 */
.paper-image {
  max-height: 85vh;
  max-width: 90vw;
  object-fit: contain;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}
```

### 可选：烛光效果

```css
.candle-glow {
  position: fixed;
  top: 20%;
  left: 10%;
  width: 200px;
  height: 200px;
  background: radial-gradient(
    circle,
    rgba(255, 200, 100, 0.15) 0%,
    transparent 70%
  );
  animation: flicker 3s ease-in-out infinite;
  pointer-events: none;
}

@keyframes flicker {
  0%, 100% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}
```

## 封面图

**文件**：`public/jinian-liuhezhenjun.webp`

**风格**：
- 深色背景
- 一张泛黄信纸的一角
- 或：七张信纸叠放的俯视图
- 可见部分文字："记念刘和珍君"
