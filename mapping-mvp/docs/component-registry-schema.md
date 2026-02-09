# 组件注册表 JSON 结构说明

## 文件组织

- 所有组件注册表 JSON 文件存储在 `mapping-mvp/data/component-registry/` 目录下
- 每个组件集合（Component Set）对应一个独立的 JSON 文件
- 文件名格式：`{componentSetId}.json` 或 `{componentSetName}.json`（如果没有 componentSetId）

## JSON 结构

```json
{
  "schema": {
    "version": "1.0.0",
    "description": "组件注册表数据结构说明",
    "fields": {
      "componentSetId": "组件集合的唯一标识符（Figma componentSetId），如果组件不属于任何集合则为 null",
      "componentSetName": "组件集合的名称（Figma 中的名称）",
      "componentSetDescription": "组件集合的描述，说明这是什么类型的组件集合",
      "fileKey": "Figma 文件 Key（用于构建链接）",
      "discoveredAt": "首次发现时间（ISO 8601 格式）",
      "lastUpdatedAt": "最后更新时间（ISO 8601 格式）",
      "discoveredFrom": {
        "figmaUrl": "发现该组件集合的 Figma 页面链接",
        "nodeId": "发现该组件集合的页面节点 ID"
      },
      "components": "组件列表数组",
      "components[].componentId": "组件的唯一标识符（Figma componentId）",
      "components[].componentName": "组件的名称（Figma 中的名称）",
      "components[].figmaLink": "组件的 Figma 链接（可直接访问）",
      "components[].mapped": "是否已映射（boolean）",
      "components[].mappingFile": "映射文件路径（如果已映射）",
      "components[].frontendComponent": "前端组件名称（如果已映射）",
      "components[].firstSeenAt": "首次发现时间（ISO 8601 格式）",
      "components[].lastSeenAt": "最后发现时间（ISO 8601 格式）",
      "components[].usageCount": "使用次数（在发现的页面中出现次数）"
    }
  },
  "componentSetId": "16586:179850",
  "componentSetName": "Button Component Set",
  "componentSetDescription": "按钮组件集合，包含多种类型的按钮（一级、二级、文本、链接等）",
  "fileKey": "JU4Freq42yQFn1GTe97pLy",
  "discoveredAt": "2026-02-09T02:00:00.000Z",
  "lastUpdatedAt": "2026-02-09T02:30:00.000Z",
  "discoveredFrom": {
    "figmaUrl": "https://www.figma.com/design/...",
    "nodeId": "16649-28156"
  },
  "components": [
    {
      "componentId": "16586:179851",
      "componentName": "Button/Primary",
      "figmaLink": "https://www.figma.com/design/...",
      "mapped": true,
      "mappingFile": "src/figma/Button.figma.tsx",
      "frontendComponent": "Button",
      "firstSeenAt": "2026-02-09T02:00:00.000Z",
      "lastSeenAt": "2026-02-09T02:30:00.000Z",
      "usageCount": 5
    }
  ]
}
```

## 组件集合分类规则

1. **有 componentSetId 的组件**：按 `componentSetId` 分组
2. **无 componentSetId 的组件**：按组件名称前缀分组（如 "说明型/"、".辅助说明" 等）
3. **独立组件**：如果组件既无 componentSetId，也无法归类到已知集合，则创建独立文件

## 更新逻辑

- **新组件集合**：创建新的 JSON 文件
- **已存在的组件集合**：
  - 新组件：push 到 `components` 数组
  - 已存在的组件：更新 `lastSeenAt`、`usageCount`、`mapped` 等信息
  - 更新 `lastUpdatedAt` 时间戳
