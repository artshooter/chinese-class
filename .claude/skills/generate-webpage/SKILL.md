---
name: generate-webpage
description: 根据 content.md 和 design.md 生成完整的课文组件，并更新 HomePage.jsx 的 CONTENTS 数组。
allowed-tools: Read, Write, Edit, Glob, Bash, AskUserQuestion
allowed-paths:
  - docs/**
  - src/**
  - public/**
---

# 生成网页 Skill

## 用途

当用户想要根据已有的课文内容和设计文档生成网页时使用。用户可能会说：
- "生成网页 [article-name]"
- "帮我把 [article-name] 做成页面"
- "/generate-webpage [article-name]"
- "创建页面 [article-name]"

## 前置条件

在执行此 skill 之前，应确保：
1. 课文目录 `src/components/[article-name]/` 已存在
2. 课文内容 `src/components/[article-name]/content.md` 已存在
3. 设计文档 `src/components/[article-name]/design.md` 已存在

如果缺少这些文件，提示用户：
- 缺少 content.md → 请先手动创建目录并放入课文内容
- 缺少 design.md → 建议使用 `/generate-design` skill 生成设计文档

## 工作流程

### Step 1. 确定课文名称

1. 从用户消息中解析 article-name
2. 如果未提供，使用 Glob 搜索 `src/components/*/design.md` 列出可用课文
3. 向用户展示列表，让用户选择

### Step 2. 读取源文件

读取以下文件：
1. `src/components/[article-name]/content.md` - 课文原始内容
2. `src/components/[article-name]/design.md` - 设计文档
3. `docs/ARCHITECTURE.md` - 技术架构与编码规范
4. `src/pages/HomePage.jsx` - 了解现有 CONTENTS 结构

### Step 3. 分析设计文档

从 design.md 中提取关键信息：
- **视觉风格**：色彩、字体、背景等
- **交互设计**：需要哪些交互组件
- **组件规划**：需要创建哪些自定义组件
- **动画方案**：使用的动画技术

### Step 4. 创建封面占位图

创建一个纯白的 webp 占位图：

```bash
# 使用 ImageMagick 创建纯白占位图
magick -size 400x600 xc:white public/[article-name].webp
```

如果没有 ImageMagick，使用 sips（macOS 自带）：

```bash
# 创建一个临时的白色图片
sips -z 600 400 --out public/[article-name].webp /path/to/white-placeholder.webp
```

或者提示用户手动添加占位图。

### Step 5. 创建组件文件

在 `src/components/[article-name]/` 目录下创建：

#### 5.1 Content.jsx（必需）

```jsx
import { motion } from 'framer-motion'

export default function Content({ onClose }) {
  return (
    <motion.div
      className="min-h-screen bg-[背景色] text-[文字色]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 返回按钮 */}
      <button
        onClick={onClose}
        className="fixed top-4 left-4 z-50 ..."
      >
        返回
      </button>

      {/* 课文内容 - 完整保留原文 */}
      <article className="...">
        {/* 根据 design.md 实现 */}
      </article>
    </motion.div>
  )
}
```

**关键要求：**
- 必须接收并使用 `onClose` prop
- 使用 Framer Motion 添加进入/退出动画
- 完整保留课文原文，禁止删减
- 遵循 design.md 中的视觉风格
- 支持响应式布局

#### 5.2 Hero.jsx（必需）

Hero 组件用于页面顶部，**必须包含默认渐入动画**：

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
        <img
          src={heroImg}
          alt="Hero Image"
          className="w-full h-auto"
        />
      </motion.div>

      {/* 底部渐变过渡（推荐，与内容区域平滑衔接） */}
      <div className="absolute bottom-0 left-0 right-0 h-32 z-10 bg-gradient-to-b from-transparent to-[内容背景色]" />
    </div>
  )
}
```

**渐入动画参数说明**：
- `initial={{ scale: 1.15 }}` - 初始放大 15%
- `animate={{ scale: 1 }}` - 过渡到原始大小
- `transition.duration: 1.5` - 持续 1.5 秒
- `ease: [0.25, 0.1, 0.25, 1]` - 柔和的贝塞尔曲线

#### 5.3 其他组件

根据 design.md 中的组件规划创建额外组件。

### Step 6. 更新 HomePage.jsx

编辑 `src/pages/HomePage.jsx`：

#### 6.1 添加导入

在文件顶部的导入区域添加：

```jsx
import [PascalName]Content from '../components/[article-name]/Content.jsx'
```

命名规则：
- `back-view` → `BackViewContent`
- `farewell-to-cambridge` → `FarewellContent`
- `er-tu` → `ErTuContent`

#### 6.2 更新 CONTENTS 数组

在 CONTENTS 数组中添加新条目：

```jsx
const CONTENTS = [
  // ... 现有内容
  {
    id: '[article-name]',
    title: '[课文标题]',
    coverImage: '/[article-name].webp',
    Component: [PascalName]Content
  }
]
```

### Step 7. 验收测试

#### 7.1 检测开发服务器

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173 --max-time 3
```

- 如果返回 `200` 或 `000`（连接成功但无内容）：服务器可能已运行
- 如果连接失败：提示用户运行 `npm run dev`

#### 7.2 构建验证

```bash
npm run build
```

确保没有编译错误。

#### 7.3 检查清单

- [ ] Content.jsx 存在且有 onClose prop
- [ ] Hero.jsx 存在
- [ ] 封面占位图 public/[article-name].webp 存在
- [ ] HomePage.jsx 已导入组件
- [ ] CONTENTS 数组已更新
- [ ] 课文原文完整保留

### Step 8. 完成提示

向用户报告：

1. ✅ 已创建的文件列表
2. ✅ 已更新的文件列表
3. ⚠️ 需要用户手动完成：
   - 替换封面图 `public/[article-name].webp`
4. 📝 下一步：运行 `npm run dev` 预览效果

## 代码规范

### 必须遵守

- 完整保留课文原文，禁止删减
- Content 组件必须接收 `onClose` prop
- 使用 Framer Motion 处理动画
- 使用 Tailwind CSS 编写样式
- 支持响应式设计（桌面端和移动端）
- 遵循 design.md 中定义的视觉风格

### 命名约定

| 类型 | 格式 | 示例 |
|------|------|------|
| 目录名 | kebab-case | `farewell-to-cambridge` |
| 组件文件 | PascalCase.jsx | `Content.jsx` |
| 导入变量 | PascalCase | `FarewellContent` |
| CONTENTS id | kebab-case | `'farewell-to-cambridge'` |

### 禁止事项

- 禁止删减课文原文内容
- 禁止使用 TypeScript
- 禁止遗漏 onClose prop

## 注意事项

- 交互应帮助理解内容，而不是炫技
- 参考现有课文组件（如 `back-view`、`guxiang`、`farewell-to-cambridge`）的实现模式
- 遇到问题时使用 AskUserQuestion 询问用户
- 封面图使用纯白占位，用户后续自行替换

## 相关文档

- [ARCHITECTURE.md](docs/ARCHITECTURE.md) - 技术架构与编码规范
- [DESIGN_GUIDE.md](docs/DESIGN_GUIDE.md) - 设计规范
