---
name: generate-design
description: 根据课文内容分析生成设计文档(design.md)，遵循 DESIGN_GUIDE.md 的设计原则。
allowed-tools: Read, Write, Glob, AskUserQuestion
allowed-paths:
  - docs/**
  - src/components/**
---

# 生成设计文档 Skill

## 用途

当用户想要为已有的课文内容生成设计文档时使用。用户可能会说：
- "生成设计文档 [article-name]"
- "帮我设计 [article-name]"
- "/generate-design [article-name]"
- "创建 design.md"

## 前置条件

在执行此 skill 之前，应确保：
- 课文目录 `src/components/[article-name]/` 已存在
- 课文内容 `src/components/[article-name]/content.md` 已存在

如果缺少 content.md，提示用户先手动创建目录并放入课文内容。

## 工作流程

### Step 1. 确定课文名称

1. 从用户消息中解析 article-name
2. 如果未提供，使用 Glob 搜索 `src/components/*/content.md` 列出可用课文
3. 向用户展示列表，让用户选择

### Step 2. 读取源文件

读取以下文件：
1. `src/components/[article-name]/content.md` - 课文原始内容
2. `docs/DESIGN_GUIDE.md` - 设计规范

### Step 3. 分析课文内容

按照 DESIGN_GUIDE.md 的设计流程进行分析：

1. **阅读内容**：仔细阅读课文，理解主题和情绪
2. **记录感受**：写下第一直觉
   - 看到什么画面？
   - 什么颜色？
   - 什么感觉？
3. **寻找机会**：
   - 哪些地方可以加交互？
   - 有没有核心隐喻可以用？

### Step 4. 生成 design.md

生成设计文档，包含以下部分：

```markdown
# [课文标题] 设计文档

## 内容理解

[对课文主题、情感、核心意象的理解]

## 设计直觉

[第一印象：画面、颜色、感觉]

## 视觉风格

### 色彩方案
[主色、辅色、背景色等]

### 字体选择
[标题字体、正文字体]

### 视觉元素
[背景、装饰、图形等]

## 交互设计

[需要添加的交互元素和效果]

## 沉浸式设计

[如果有核心隐喻，描述如何转化为设计]

## 响应式考虑

[桌面端和移动端的不同处理]

## 技术实现

### 组件规划
[需要创建的组件列表]

### 动画方案
[使用的动画技术和效果]

### 关键实现点
[需要特别注意的技术细节]
```

### Step 5. 保存并确认

1. 将 design.md 保存到 `src/components/[article-name]/design.md`
2. 向用户展示生成的设计文档
3. 询问是否满意，如需调整则修改后再次展示
4. 用户确认后完成

## 注意事项

- 必须先阅读 DESIGN_GUIDE.md，严格遵循其中的设计原则和流程
- 设计要从内容本身提取灵感，不要套用模板
- 交互应帮助理解内容，而不是炫技
- 如果找不到合适的隐喻，传统的垂直滚动也完全可以
- 始终考虑响应式设计，桌面端和移动端同等重要
