# 组件注册表配置指南

## 概述

为了避免每次运行命令时都需要输入 token 和 figmaUrl，我们提供了配置文件支持。你可以将常用的配置保存在 `figma-registry.config.json` 中。

## 配置文件

### 创建配置文件

1. 复制示例配置文件：
   ```bash
   cp figma-registry.config.example.json figma-registry.config.json
   ```

2. 编辑 `figma-registry.config.json`，填入你的配置：
   ```json
   {
     "defaultToken": "your-figma-api-token",
     "defaultFigmaUrl": "https://www.figma.com/design/...",
     "presets": {
       "preset-name": {
         "name": "预设名称",
         "figmaUrl": "https://www.figma.com/design/...",
         "description": "预设描述"
       }
     }
   }
   ```

### 配置字段说明

- **defaultToken** (可选): 默认的 Figma API Token
- **defaultFigmaUrl** (可选): 默认的 Figma URL
- **presets** (可选): 预设配置对象
  - **preset-name**: 预设的键名（用于命令行引用）
    - **name**: 预设的显示名称
    - **figmaUrl**: Figma 页面链接
    - **description**: 预设描述（可选）

## 使用方法

### 1. 使用预设（推荐）

```bash
# 列出所有可用预设
npm run mapping:list-presets

# 使用预设运行
npm run mapping:update-registry -- --preset sds-time-picker
```

### 2. 使用默认配置

如果配置了 `defaultFigmaUrl` 和 `defaultToken`，可以直接运行：

```bash
npm run mapping:update-registry
```

### 3. 命令行参数（优先级最高）

命令行参数会覆盖配置文件的值：

```bash
# 使用预设，但覆盖 token
npm run mapping:update-registry -- --preset sds-time-picker --token <other-token>

# 直接指定 URL（会使用配置文件中的 defaultToken）
npm run mapping:update-registry -- --figmaUrl <url>

# 同时指定 URL 和 token
npm run mapping:update-registry -- --figmaUrl <url> --token <token>
```

## 优先级顺序

配置的优先级从高到低：

1. **命令行参数** (`--figmaUrl`, `--token`, `--preset`)
2. **配置文件** (`figma-registry.config.json`)
3. **环境变量** (`FIGMA_API_KEY` 或 `FIGMA_TOKEN`)

## 安全提示

⚠️ **重要**: `figma-registry.config.json` 已添加到 `.gitignore`，不会被提交到 Git 仓库。

如果你需要分享配置示例，请使用 `figma-registry.config.example.json`（不包含真实的 token）。

## 示例

### 示例 1: 添加多个预设

```json
{
  "defaultToken": "your-token",
  "presets": {
    "sds-time-picker": {
      "name": "SDS 时间选择器",
      "figmaUrl": "https://www.figma.com/design/...",
      "description": "SDS 组件库 - 时间选择器页面"
    },
    "sds-button": {
      "name": "SDS 按钮组件",
      "figmaUrl": "https://www.figma.com/design/...",
      "description": "SDS 组件库 - 按钮组件集合"
    },
    "business-page": {
      "name": "业务页面示例",
      "figmaUrl": "https://www.figma.com/design/...",
      "description": "业务页面示例"
    }
  }
}
```

### 示例 2: 使用预设

```bash
# 查看所有预设
npm run mapping:list-presets

# 输出：
# 可用的预设：
#   sds-time-picker: SDS 时间选择器
#     SDS 组件库 - 时间选择器页面
#   sds-button: SDS 按钮组件
#     SDS 组件库 - 按钮组件集合
#   business-page: 业务页面示例
#     业务页面示例

# 使用预设
npm run mapping:update-registry -- --preset sds-time-picker
```

## 常见问题

### Q: 如何获取 Figma API Token？

A: 访问 https://www.figma.com/developers/api#access-tokens 创建你的 API Token。

### Q: 配置文件在哪里？

A: 配置文件位于项目根目录：`mapping-mvp/figma-registry.config.json`

### Q: 如果预设不存在会怎样？

A: 脚本会显示错误信息，并提示使用 `--list-presets` 查看所有可用预设。

### Q: 可以同时使用预设和命令行参数吗？

A: 可以。例如：`npm run mapping:update-registry -- --preset sds-time-picker --token <other-token>`

## 相关文档

- [组件注册表使用指南](./component-registry-guide.md)
- [组件注册表 JSON 结构说明](./component-registry-schema.md)
