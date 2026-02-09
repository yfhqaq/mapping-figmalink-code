# 组件映射状态文档

本文档记录 SDS 组件库中各组件的映射状态，包括组件 ID、名称、Figma 链接和映射状态。

## 文档说明

- **组件 ID**: Figma 组件的唯一标识符（格式：`pageId:nodeId`）
- **组件名称**: UX 组件在 Figma 中的名称
- **Figma 链接**: 可直接访问的组件链接
- **映射状态**: 
  - ✅ 已映射：已创建 `.figma.tsx` 映射文件
  - ❌ 未映射：尚未创建映射文件
  - 🔄 待确认：需要确认是否映射

---

## 未映射组件

### 说明型组件

| 组件 ID | 组件名称 | Figma 链接 | 映射状态 | 备注 |
|---------|---------|-----------|---------|------|
| `26451:23304` | 说明型/time | [链接](https://www.figma.com/design/JU4Freq42yQFn1GTe97pLy/SDS-%E9%80%9A%E7%94%A8-UI-%E7%BB%84%E4%BB%B6%E5%BA%93-v4.0.0?node-id=26451-23304) | ❌ 未映射 | 说明型/time（出现 15 次） |
| `26451:23010` | 说明型/swap-right | [链接](https://www.figma.com/design/JU4Freq42yQFn1GTe97pLy/SDS-%E9%80%9A%E7%94%A8-UI-%E7%BB%84%E4%BB%B6%E5%BA%93-v4.0.0?node-id=26451-23010) | ❌ 未映射 | 说明型/swap-right（出现 6 次） |

### .辅助说明组件

| 组件 ID | 组件名称 | Figma 链接 | 映射状态 | 备注 |
|---------|---------|-----------|---------|------|
| `16595:182171` | .辅助说明 | [链接](https://www.figma.com/design/JU4Freq42yQFn1GTe97pLy/SDS-%E9%80%9A%E7%94%A8-UI-%E7%BB%84%E4%BB%B6%E5%BA%93-v4.0.0?node-id=16595-182171) | ❌ 未映射 | .辅助说明（出现 3 次） |

### .时间选择器内容组件

| 组件 ID | 组件名称 | Figma 链接 | 映射状态 | 备注 |
|---------|---------|-----------|---------|------|
| `16649:28168` | .时间选择器内容 | [链接](https://www.figma.com/design/JU4Freq42yQFn1GTe97pLy/SDS-%E9%80%9A%E7%94%A8-UI-%E7%BB%84%E4%BB%B6%E5%BA%93-v4.0.0?node-id=16649-28168) | ❌ 未映射 | .时间选择器内容（出现 1 次） |
| `16649:28230` | .时间选择器内容 | [链接](https://www.figma.com/design/JU4Freq42yQFn1GTe97pLy/SDS-%E9%80%9A%E7%94%A8-UI-%E7%BB%84%E4%BB%B6%E5%BA%93-v4.0.0?node-id=16649-28230) | ❌ 未映射 | .时间选择器内容（出现 1 次） |
| `16649:28199` | .时间选择器内容 | [链接](https://www.figma.com/design/JU4Freq42yQFn1GTe97pLy/SDS-%E9%80%9A%E7%94%A8-UI-%E7%BB%84%E4%BB%B6%E5%BA%93-v4.0.0?node-id=16649-28199) | ❌ 未映射 | .时间选择器内容（出现 1 次） |

---

## 发现来源

**页面链接**: [查看页面](https://www.figma.com/design/JU4Freq42yQFn1GTe97pLy/SDS-%E9%80%9A%E7%94%A8-UI-%E7%BB%84%E4%BB%B6%E5%BA%93-v4.0.0?node-id=16649-28156&t=8QnOLWtLj3QgC0SC-4)

**页面节点 ID**: `16649-28156`

**统计信息**:
- 总实例数: 27
- 唯一组件数: 6
- 已映射组件数: 0
- 未映射组件数: 6

---

## 映射步骤

如需映射这些组件，请按以下步骤操作：

1. **确认前端组件**
   - 查看 Figma 链接，了解组件的视觉和功能
   - 确定对应的前端组件（可能是 Ant Design、自定义组件库等）

2. **创建映射文件**
   - 在 `src/figma/` 目录下创建对应的 `.figma.tsx` 文件
   - 参考已有映射文件的格式（如 `Button.figma.tsx`）

3. **更新配置**
   - 在 `figma.config.json` 中添加组件的 URL 占位符（如 `<FIGMA_TIME_DISPLAY>`）
   - 在映射文件中使用该占位符

4. **生成映射**
   ```bash
   npm run codeconnect:parse
   npm run mapping:generate
   ```

5. **更新本文档**
   - 将组件状态从 ❌ 未映射 改为 ✅ 已映射
   - 添加映射文件路径和前端组件名称

---

## 更新记录

- **2026-02-09**: 文档更新，记录 6 个组件的映射状态
