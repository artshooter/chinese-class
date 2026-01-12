# 雨巷 设计文档

## 内容理解

戴望舒1927年的成名作，中国现代诗歌经典。诗人撑着油纸伞在悠长寂寥的雨巷中彷徨，希望遇到一个丁香一样的姑娘。她如梦般飘过，最终消散在雨巷尽头。

**核心意象**：
- 雨巷 - 悠长、寂寥、青石板路
- 油纸伞 - 古典、忧郁
- 丁香 - 愁怨、淡紫、芬芳
- 姑娘 - 梦幻、飘渺、哀怨

**情感走向**：期盼 → 相遇 → 擦肩 → 消散 → 依然期盼（首尾呼应，但"逢着"变"飘过"）

**结构**：七节，可分为七张图或合并为更少

## 设计概念

### 核心隐喻：雨巷漫步

- 翻页 = 在雨巷中前行
- 每一页 = 雨巷中的一个瞬间
- 雨 = 贯穿始终的氛围元素

### 实现说明

**重要**：文本内容直接放在图片上。编码时只需实现：
1. 图片切换逻辑
2. 返回按钮
3. 四周氛围样式
4. **雨滴动效**（核心特色）

## 视觉风格

### 整体氛围

| 元素 | 说明 |
|------|------|
| 色调 | 灰蓝、青灰、淡紫，冷色朦胧 |
| 质感 | 水墨晕染、雨雾迷蒙 |
| 光线 | 阴天柔光，无强烈明暗对比 |

### 色彩方案

| 角色 | 颜色 | 说明 |
|------|------|------|
| 背景主色 | `#2a3a4a` | 雨天的灰蓝 |
| 雨巷色 | `#4a5a6a` ~ `#3a4a5a` | 青石板、老墙 |
| 丁香色 | `#b8a9c9` / `#9b8bb0` | 淡紫，姑娘出现时点缀 |
| 油纸伞 | `#e8dcc8` | 米白/淡黄 |
| 文字 | `#f0f0f0` | 白色，略带透明 |

### 图片设计参考（由设计提供）

**风格**：水墨/国风插画，或朦胧摄影风格

**内容建议**：
| 页码 | 诗节 | 画面建议 |
|------|------|----------|
| 1 | 一 | 雨巷入口，油纸伞，独行身影 |
| 2 | 二 | 丁香花特写，雨滴，朦胧 |
| 3 | 三 | 雨巷深处，两个身影，相向而行 |
| 4 | 四 | 姑娘走近，太息般的眼光 |
| 5 | 五 | 擦肩而过，如梦飘过 |
| 6 | 六 | 姑娘远去，消散在雨中 |
| 7 | 七 | 回到开头，雨巷依旧，独自彷徨 |

**文件命名**：`page-1.webp` ~ `page-7.webp`（或合并为更少页数）

## 交互设计

### 翻页切换

- 左右箭头 / 滑动 / 键盘方向键
- 切换效果：淡入淡出，稍慢（0.5s），如梦如幻
- 可选：轻微的水波纹过渡效果

### 雨滴动效（核心）

页面上持续有细雨飘落：
- 细密、斜向、轻柔
- 半透明白色/浅灰
- 不遮挡内容，作为氛围层

### 返回按钮

- 位置：左上角
- 样式：半透明白色，与雨天氛围融合

### 页码指示

- 底部小点或「三 / 七」
- 半透明，不抢眼

## 响应式考虑

### 桌面端
- 图片居中，保持比例
- 左右留有灰蓝背景
- 雨滴效果全屏

### 移动端
- 图片占满宽度
- 支持左右滑动
- 雨滴效果简化（减少数量，保证性能）

## 技术实现

### 组件结构

```
rain-alley/
├── Content.jsx       # 主组件
├── design.md         # 设计文档
├── content.md        # 原始诗歌内容
└── assets/
    ├── page-1.webp
    ├── ...
    └── page-7.webp
```

### Content.jsx 实现要点

```jsx
// 1. 图片数组
const pages = [
  '/rain-alley/page-1.webp',
  // ...
]

// 2. 当前页状态
const [currentPage, setCurrentPage] = useState(0)

// 3. 渲染：雨滴层 + 图片 + 导航 + 返回按钮
```

### 氛围样式

```css
/* 背景 */
.rain-alley-container {
  background: linear-gradient(180deg, #2a3a4a 0%, #1a2a3a 100%);
  min-height: 100vh;
  overflow: hidden;
  position: relative;
}

/* 图片容器 */
.page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
}

/* 图片 */
.page-image {
  max-height: 85vh;
  max-width: 90vw;
  object-fit: contain;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.page-image.active {
  opacity: 1;
}
```

### 雨滴效果

```css
/* 雨滴容器 */
.rain-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

/* 单个雨滴 */
.raindrop {
  position: absolute;
  width: 1px;
  height: 15px;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(255, 255, 255, 0.3)
  );
  animation: fall linear infinite;
}

@keyframes fall {
  0% {
    transform: translateY(-20px) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) translateX(20px);
    opacity: 0;
  }
}
```

```jsx
// 雨滴组件
const RainEffect = () => {
  const drops = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 1 + Math.random() * 0.5
  }))

  return (
    <div className="rain-layer">
      {drops.map(drop => (
        <div
          key={drop.id}
          className="raindrop"
          style={{
            left: `${drop.left}%`,
            animationDelay: `${drop.delay}s`,
            animationDuration: `${drop.duration}s`
          }}
        />
      ))}
    </div>
  )
}
```

### 可选：丁香花瓣飘落

在姑娘出现的页面（第3-5页），可以加入淡紫色花瓣飘落效果：

```css
.petal {
  position: absolute;
  width: 8px;
  height: 8px;
  background: rgba(184, 169, 201, 0.6);
  border-radius: 50% 0 50% 50%;
  animation: petal-fall 4s ease-in-out infinite;
}

@keyframes petal-fall {
  0% {
    transform: translateY(-10px) rotate(0deg);
    opacity: 0;
  }
  20% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(100vh) rotate(360deg) translateX(30px);
    opacity: 0;
  }
}
```

## 封面图

**文件**：`public/rain-alley.webp`

**风格建议**：
- 灰蓝色调的雨巷
- 一把油纸伞
- 细雨迷蒙
- 朦胧、诗意
- 可见"雨巷"二字或不出现文字

## 设计参考

**意境关键词**：
- 江南雨巷、青石板路
- 白墙黛瓦、老旧篱墙
- 油纸伞、丁香花
- 朦胧、如梦、忧郁

**避免**：
- 过于明亮的色彩
- 现代元素
- 具象的人脸（保持朦胧感）
