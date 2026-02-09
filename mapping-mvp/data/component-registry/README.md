# 组件注册表目录

本目录存储所有组件集合的注册表 JSON 文件。

## 文件组织

- 每个组件集合对应一个独立的 JSON 文件
- 文件名格式：`{组件集合名称}.json`（特殊字符会被替换为下划线）
- 例如：
  - `说明型.json` - 说明型组件集合
  - `_辅助说明.json` - 辅助说明组件集合
  - `_时间选择器内容.json` - 时间选择器内容组件集合

## JSON 结构

每个 JSON 文件包含：

1. **schema** - 字段字典，说明每个字段的含义
2. **componentSetId** - 组件集合 ID（如果有）
3. **componentSetName** - 组件集合名称
4. **componentSetDescription** - 组件集合描述
5. **fileKey** - Figma 文件 Key
6. **discoveredAt** - 首次发现时间
7. **lastUpdatedAt** - 最后更新时间
8. **discoveredFrom** - 发现来源（Figma URL 和节点 ID）
9. **components** - 组件列表数组

## 更新逻辑

- **新组件集合**：创建新的 JSON 文件
- **已存在的组件集合**：
  - 新组件：push 到 `components` 数组
  - 已存在的组件：更新 `lastSeenAt`、`usageCount`、`mapped` 等信息
  - 更新 `lastUpdatedAt` 时间戳

## 使用方法

```bash
# 更新组件注册表
npm run mapping:update-registry -- --figmaUrl <url> --token <token>
```

## 用途

1. **组件评估**：为后续的组件评估提供数据基础
2. **组件存储**：统一存储所有发现的组件集合信息
3. **映射追踪**：追踪哪些组件已映射，哪些未映射
4. **使用统计**：记录组件在不同页面中的使用次数
