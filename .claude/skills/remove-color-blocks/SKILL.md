---
name: remove-color-blocks
description: 分析截图，识别和移除图片中的大色块（通过红框标注），支持颜色宽容度匹配。
allowed-tools: Read, Bash, AskUserQuestion
allowed-paths:
  - src/**
  - public/**
---

# 移除色块 Skill

## 用途

用于清理图片中的大色块（如白色背景、浅色填充等）。用户提供截图标注需要处理的区域，该 skill 会自动识别颜色并移除。

用户可能会说：
- "帮我移除这张图片中的白色块"
- "用这个截图标注来处理图片"
- "/remove-color-blocks"
- "我标注的红框区域需要透明化"

## 前置条件

在执行此 skill 之前，应确保：
1. 用户已提供一张截图，用**红色方框标注**需要处理的色块位置
2. 用户已告知要处理的**图片文件路径**
3. 图片文件应该存在于项目中（通常在 `src/` 或 `public/` 目录）

如果缺少上述信息，使用 `AskUserQuestion` 询问用户。

## 工作流程

### Step 1. 获取必要信息

1. **检查用户是否提供了截图**
   - 查看当前消息中是否有图片
   - 如果有，这就是参考截图

2. **询问用户缺失的信息**

使用 `AskUserQuestion` 获取：
- `图片路径`: 要处理的源图片完整路径（例如 `src/components/shupath-difficult/left.webp`）
- `颜色宽容度`: 可选，默认为 15（范围 0-30）
- `最小块大小`: 可选，默认为 100（最小块像素数阈值）

### Step 2. 采样颜色识别

从截图中的红框标注区域采样 5-10 个像素点，识别主要的目标颜色。

工作原理：
1. 根据红框大约位置采样像素
2. 统计采样区域的颜色分布
3. 选择出现最频繁或视觉上最突出的浅色作为目标颜色
4. 显示找到的目标颜色给用户确认

### Step 3. 分析色块分布

使用 Python 脚本对图片进行分析：

```python
# 伪代码思路
1. 加载图片为 RGBA
2. 使用目标颜色 ± tolerance 创建掩码
3. BFS 标记所有连通分量（相邻的同色像素块）
4. 统计每个块的大小
5. 识别 >= min_block_size 的大色块
6. 显示分析结果给用户：
   - 找到的总像素数
   - 色块数量和大小分布
   - 将要移除的块数和像素数
```

### Step 4. 获取用户确认

显示分析结果后，询问用户：

```
已识别到：
  目标颜色: #XXXXXX（16进制）
  匹配像素: N 个
  色块数: M 个
  最大块: X 像素

将移除 ≥ {min_block_size} 像素的块：
  - K 个块
  - 总计 P 像素

确认继续吗？(yes/no)
```

如果用户说 `no`，提供选项调整参数：
- 增加/减少颜色宽容度
- 改变最小块大小阈值
- 取消操作

### Step 5. 执行移除操作

当用户确认后，执行 Python 脚本：

**脚本逻辑:**

```python
from PIL import Image
import numpy as np
from collections import deque

def remove_color_blocks_with_tolerance(
    image_path,
    target_color_hex,
    tolerance=15,
    min_block_size=100
):
    # 1. 加载图片转 RGBA
    img = Image.open(image_path)
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    img_array = np.array(img)

    # 2. 解析目标颜色
    target_color = np.array([
        int(target_color_hex[1:3], 16),
        int(target_color_hex[3:5], 16),
        int(target_color_hex[5:7], 16)
    ])

    # 3. 创建掩码（宽容度匹配）
    rgb = img_array[:,:,:3]
    mask = np.all(np.abs(rgb.astype(int) - target_color.astype(int)) <= tolerance, axis=2)

    # 4. BFS 标记连通分量
    height, width = mask.shape
    labeled = np.zeros((height, width), dtype=np.int32)
    label_id = 0

    for i in range(height):
        for j in range(width):
            if mask[i, j] and labeled[i, j] == 0:
                label_id += 1
                queue = deque([(i, j)])
                labeled[i, j] = label_id

                while queue:
                    y, x = queue.popleft()
                    for dy, dx in [(0, 1), (1, 0), (0, -1), (-1, 0)]:
                        ny, nx = y + dy, x + dx
                        if 0 <= ny < height and 0 <= nx < width:
                            if mask[ny, nx] and labeled[ny, nx] == 0:
                                labeled[ny, nx] = label_id
                                queue.append((ny, nx))

    # 5. 统计块大小并移除
    block_sizes = {}
    for label in range(1, label_id + 1):
        size = np.sum(labeled == label)
        block_sizes[label] = size

    removed_pixels = 0
    removed_blocks = 0
    for label, size in block_sizes.items():
        if size >= min_block_size:
            img_array[labeled == label, 3] = 0  # 设置 alpha = 0
            removed_pixels += size
            removed_blocks += 1

    # 6. 保存
    result = Image.fromarray(img_array, 'RGBA')
    result.save(image_path, 'WEBP')

    return {
        'removed_blocks': removed_blocks,
        'removed_pixels': removed_pixels,
        'total_blocks': len(block_sizes),
        'total_pixels': np.sum(mask)
    }
```

### Step 6. 显示结果

处理完成后，显示统计信息：

```
✅ 处理完成！

统计信息:
  - 识别到的匹配像素: X
  - 总色块数: Y
  - 移除的色块数: Z
  - 移除的像素数: W
  - 保留的小色块: Y - Z

文件已保存: {image_path}
```

## 参数说明

### `tolerance` - 颜色宽容度（可选）

- **默认值**: 15
- **范围**: 0-30
- **含义**: RGB 颜色的匹配偏差范围
  - `0` = 精确匹配单一颜色
  - `10-15` = 适合大多数情况，包含压缩造成的颜色变化
  - `20+` = 匹配更广泛的相近颜色

**选择建议**:
- 颜色很纯净且一致 → 使用 5-10
- 普通情况（webp 压缩） → 使用 15（推荐）
- 颜色混杂/有渐变 → 使用 20-25

### `min_block_size` - 最小块大小阈值（可选）

- **默认值**: 100
- **范围**: 1-10000
- **含义**: 只移除 ≥ 该像素数的块，小于阈值的块保留

**选择建议**:
- 精细清理（移除所有色块） → 50-100
- 保守清理（只移除明显块） → 200-500
- 非常保守（只移除大块） → 1000+

## 技术细节

### 颜色采样策略

从红框标注的区域采样多个点来识别目标颜色：

```
采样网格（以红框中心为基准）：
  - 中心：(cx, cy)
  - 四周：(cx-d, cy), (cx+d, cy), (cx, cy-d), (cx, cy+d)
  - 对角：(cx-d, cy-d), (cx+d, cy+d) 等

其中 d 是相对于红框大小的偏移量
```

### 连通分量标记（BFS）

使用广度优先搜索标记相邻的同色像素：
- 时间复杂度: O(w × h)
- 空间复杂度: O(w × h)
- 效率: 即使大图片（2048×2048）也能在几秒内完成

### Alpha 通道处理

- 将移除的像素的 alpha 值设为 0（完全透明）
- 保持 RGB 值不变（如果 alpha 恢复，颜色仍可见）
- 输出格式: RGBA WebP（支持透明）

## 常见问题

### Q: 为什么移除不彻底？

**可能原因**:
1. `tolerance` 太小 - 增加到 20-25
2. `min_block_size` 太大 - 降低到 50-100
3. 颜色实际上有多个近似值 - 尝试多次，每次针对不同的颜色

**解决方案**:
- 重新运行该 skill，调整参数
- 或者多次运行，每次移除不同的相近色块

### Q: 误删了有用的内容？

**恢复方法**:
```bash
git checkout {image_path}  # 恢复原始文件
```

然后重新运行 skill，使用更严格的参数（更小的 tolerance 或更大的 min_block_size）。

### Q: 能同时处理多个图片吗？

目前该 skill 一次只处理一个图片。如需批量处理：
1. 运行多次 skill，每次指定不同的图片路径
2. 或联系开发者扩展成批量模式

## 注意事项

✅ **推荐做法**:
- 先用一个小的 tolerance（10-15）尝试
- 检查结果后，如需更彻底，再增加 tolerance
- 始终在 Git 中跟踪图片，便于回退
- 保存截图作为参考，如果需要调整参数

❌ **避免做法**:
- 使用过大的 tolerance（>25），可能误删重要内容
- 不做确认直接执行（要求用户确认）
- 忘记备份原始文件
- 同时改变 tolerance 和 min_block_size，难以调试

## 工作流程速查

```
1. 用户提供截图 + 图片路径 + 可选参数
2. 采样并识别目标颜色 → 确认
3. 分析色块分布 → 显示结果统计
4. 用户确认 → 执行移除
5. 保存文件 → 显示完成信息
```

## 相关文档和命令

- [項目 README](../../../README.md) - 项目概述
- Git 恢复: `git checkout {file}` - 恢复文件
- Git 查看差异: `git diff {file}` - 查看改动

