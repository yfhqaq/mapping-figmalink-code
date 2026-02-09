# 组件注册表使用指南

## 概述

组件注册表系统用于统一存储和管理所有发现的 Figma 组件集合信息，为后续的组件评估和映射追踪提供数据基础。

## 核心特性

1. **字段字典**：每个 JSON 文件都包含 `schema` 字段，详细说明每个字段的含义
2. **按集合分组**：不同组件集合存储在不同的 JSON 文件中
3. **增量更新**：
   - 新组件集合：创建新文件
   - 已存在的组件集合：更新信息，新组件 push，已存在组件更新
4. **映射追踪**：自动检查组件是否已映射，记录映射文件路径和前端组件名称

## 文件结构

```
mapping-mvp/
├── data/
│   └── component-registry/          # 组件注册表目录
│       ├── README.md                # 目录说明
│       ├── 说明型.json              # 说明型组件集合
│       ├── _辅助说明.json           # 辅助说明组件集合
│       └── _时间选择器内容.json     # 时间选择器内容组件集合
└── docs/
    ├── component-registry-schema.md  # JSON 结构详细说明
    └── component-registry-guide.md  # 本使用指南
```

## JSON 结构

每个组件注册表 JSON 文件包含以下字段：

### 顶层字段

- `schema` - 字段字典，说明所有字段的含义
- `componentSetId` - 组件集合 ID（Figma componentSetId），如果组件不属于任何集合则为 `null`
- `componentSetName` - 组件集合名称
- `componentSetDescription` - 组件集合描述
- `fileKey` - Figma 文件 Key
- `discoveredAt` - 首次发现时间（ISO 8601 格式）
- `lastUpdatedAt` - 最后更新时间（ISO 8601 格式）
- `discoveredFrom` - 发现来源
  - `figmaUrl` - Figma 页面链接
  - `nodeId` - 页面节点 ID
- `components` - 组件列表数组

### 组件对象字段

- `componentId` - 组件唯一标识符（Figma componentId）
- `componentName` - 组件名称
- `figmaLink` - Figma 链接（可直接访问）
- `mapped` - 是否已映射（boolean）
- `mappingFile` - 映射文件路径（如果已映射）
- `frontendComponent` - 前端组件名称（如果已映射）
- `firstSeenAt` - 首次发现时间（ISO 8601 格式）
- `lastSeenAt` - 最后发现时间（ISO 8601 格式）
- `usageCount` - 使用次数（在发现的页面中出现次数）

## 使用方法

### 更新组件注册表

```bash
npm run mapping:update-registry -- --figmaUrl <url> --token <token>
```

**参数说明**：
- `--figmaUrl`：Figma 页面链接（必需）
- `--token`：Figma API Token（可选，也可通过环境变量 `FIGMA_API_KEY` 或 `FIGMA_TOKEN` 提供）

**示例**：
```bash
npm run mapping:update-registry -- \
  --figmaUrl "https://www.figma.com/design/..." \
  --token "your-token"
```

### 更新逻辑

1. **新组件集合**：
   - 创建新的 JSON 文件
   - 文件名基于组件集合名称（特殊字符替换为下划线）
   - 设置 `discoveredAt` 和 `lastUpdatedAt` 为当前时间

2. **已存在的组件集合**：
   - 更新 `lastUpdatedAt` 为当前时间
   - 遍历新发现的组件：
     - **新组件**：push 到 `components` 数组，设置 `firstSeenAt` 和 `lastSeenAt` 为当前时间
     - **已存在的组件**：更新 `lastSeenAt` 为当前时间，`usageCount` 取最大值，更新 `mapped`、`mappingFile`、`frontendComponent` 等信息

## 组件集合分类规则

1. **有 componentSetId 的组件**：按 `componentSetId` 分组
2. **无 componentSetId 的组件**：按组件名称前缀分组
   - `说明型/` → `说明型` 集合
   - `.辅助说明` → `.辅助说明` 集合
   - 其他情况使用组件名称的第一部分作为集合名称

## 应用场景

1. **组件评估**：为后续的组件评估提供数据基础
2. **映射追踪**：追踪哪些组件已映射，哪些未映射
3. **使用统计**：记录组件在不同页面中的使用次数
4. **历史追踪**：记录组件的首次发现时间和最后发现时间

## 注意事项

1. **文件命名**：特殊字符会被替换为下划线，确保文件名合法
2. **时间戳**：所有时间使用 ISO 8601 格式（UTC）
3. **增量更新**：`firstSeenAt` 和 `discoveredAt` 不会被覆盖，保留首次发现时间
4. **映射状态**：自动从 `mapping-llm.json` 读取映射状态

## 相关文档

- [组件注册表 JSON 结构说明](./component-registry-schema.md)
- [组件映射状态文档](./component-mapping-status.md)
