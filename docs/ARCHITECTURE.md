# 架构设计与编码规范

## 核心理念

**沉浸式翻书体验** - 模拟在教室里打开语文课本的体验，每篇课文都是独立的设计作品。

---

## 技术栈

- React 19
- Vite 7
- Tailwind CSS v4
- Framer Motion
- CSS Transforms（3D 透视效果）

---

## 文件系统架构

```
src/
├── pages/
│   ├── HomePage.jsx           # 状态机核心，翻书交互
│   └── HomePage.css           # 首页样式
│
├── components/
│   └── [article-name]/        # 课文组件目录
│       ├── content.md         # 课文原始内容（用户提供）
│       ├── design.md          # 设计文档（generate-design 生成）
│       ├── Hero.jsx           # 封面/头部组件
│       ├── Content.jsx        # 课文主体内容
│       └── *.jsx              # 其他自定义组件
│
public/
├── [article-name].webp        # 课文封面图（用于翻书界面）
├── book-*.webp                # 打开书籍动画帧
├── fanye-*.webp               # 翻页动画帧
└── table.webp                 # 桌子背景

docs/
├── ARCHITECTURE.md            # 本文档
└── DESIGN_GUIDE.md            # 设计规范
```

---

## 核心约定

### 组件结构

每篇课文在 `src/components/[article-name]/` 下包含：

| 文件 | 必需 | 说明 |
|------|------|------|
| `content.md` | 是 | 课文原始内容（用户手动放置） |
| `design.md` | 是 | 设计文档（generate-design 生成） |
| `Hero.jsx` | 是 | 封面/头部组件 |
| `Content.jsx` | 是 | 课文主体内容组件 |
| `*.jsx` | 否 | 其他自定义组件（根据设计需求） |

### Content.jsx 规范

```jsx
'use client'

import { motion } from 'framer-motion'

export default function Content({ onClose }) {
  return (
    <motion.div
      className="..."
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* 关闭/返回按钮 */}
      <button onClick={onClose}>返回</button>

      {/* 课文内容 */}
      <article>
        {/* 完整保留原文，禁止删减 */}
      </article>
    </motion.div>
  )
}
```

**关键要求：**
- 必须接收 `onClose` prop 用于返回
- 使用 Framer Motion 添加进入动画
- 完整保留课文原文，禁止删减
- 支持响应式布局

### Hero.jsx 规范

Hero 组件用于课文详情页顶部，**必须包含默认渐入动画**：

```jsx
import { motion } from 'framer-motion'
import heroImg from './hero-image.webp'

export default function Hero() {
  return (
    <div className="relative w-full h-auto overflow-hidden bg-[背景色]">
      {/* 背景图片 - 必须有渐入动画 */}
      <motion.div
        className="relative z-0 w-full h-auto"
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <img src={heroImg} alt="Hero" className="w-full h-auto" />
      </motion.div>

      {/* 底部渐变过渡 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 z-10 bg-gradient-to-b from-transparent to-[内容背景色]" />
    </div>
  )
}
```

**渐入动画参数**：
- `scale: 1.15 → 1` 图片从放大 15% 柔和缩小到原始大小
- `duration: 1.5s` 持续 1.5 秒
- `ease: [0.25, 0.1, 0.25, 1]` 柔和的贝塞尔曲线

### 内容注册

课文需要在 `HomePage.jsx` 的 CONTENTS 数组中注册：

```jsx
// 1. 导入组件
import NewArticleContent from '../components/new-article/Content.jsx'

// 2. 添加到 CONTENTS 数组
const CONTENTS = [
  // ... 现有内容
  {
    id: 'new-article',
    title: '课文标题',
    coverImage: '/new-article.webp',
    Component: NewArticleContent
  }
]
```

### 封面图规范

- **格式**：webp
- **位置**：`public/[article-name].webp`
- **命名**：与 article-name 一致
- **开发时**：可复制现有封面图（如 `back-view.webp`）作为占位，后续替换

---

## 样式约定

### Tailwind CSS

- 使用 Tailwind CSS 编写样式
- 支持响应式设计（`md:`, `lg:` 等断点）
- 避免内联样式，除非动态计算

### 响应式断点

```
sm: 640px   - 小屏手机
md: 768px   - 平板
lg: 1024px  - 小屏桌面
xl: 1280px  - 标准桌面
```

### 动画

- 使用 Framer Motion 处理复杂动画
- 简单动画可用 CSS transitions
- 注意移动端性能

---

## 状态机架构

HomePage 使用 7 状态机管理交互流程：

```
INITIAL (书籍关闭)
  ↓ 点击
OPENING (打开动画)
  ↓ 完成
BOOK (书籍打开)
  ├─ 左右箭头 → SWITCHING → BOOK
  ├─ 点击封面 → LOADING → CONTENT
  └─ 点击背景 → CLOSING → INITIAL
```

详见 [CLAUDE.md](../CLAUDE.md) 中的完整状态机文档。

---

## 设计驱动开发

### 流程

1. **用户提供 content.md** → 放入 `src/components/[article-name]/`
2. **生成 design.md** → 使用 `/generate-design` skill
3. **生成组件代码** → 使用 `/generate-webpage` skill
4. **替换封面图** → 用户手动替换 `public/[article-name].webp`

### 设计文档优先

编码前必须先有 design.md，从设计文档中获取：
- 视觉风格（色彩、字体、背景）
- 交互设计（需要哪些动效和交互）
- 组件规划（需要创建哪些额外组件）

详见 [DESIGN_GUIDE.md](./DESIGN_GUIDE.md)

---

## 代码规范

### 命名约定

| 类型 | 格式 | 示例 |
|------|------|------|
| 目录名 | kebab-case | `farewell-to-cambridge` |
| 组件文件 | PascalCase.jsx | `Content.jsx`, `Hero.jsx` |
| 组件导入名 | PascalCase | `FarewellContent` |
| CONTENTS id | kebab-case | `'farewell-to-cambridge'` |

### 组件导入

```jsx
// 正确：从 Content.jsx 导入默认导出
import FarewellContent from '../components/farewell-to-cambridge/Content.jsx'

// 组件命名规则：[PascalCase文章名]Content
// farewell-to-cambridge → FarewellContent
// back-view → BackViewContent
```

### 禁止事项

- 禁止删减课文原文内容
- 禁止硬编码中文文本到组件外部（组件内部可以）
- 禁止在动画期间响应用户交互
- 禁止使用 TypeScript（本项目使用 JavaScript）

---

## 相关文档

- [DESIGN_GUIDE.md](./DESIGN_GUIDE.md) - 设计规范与创意来源
- [CLAUDE.md](../CLAUDE.md) - AI 协作入口与状态机详解
