# Company Cursor MCP (framework)

这是一个 **可集成到 Cursor 的 MCP Server** 工程骨架。目标：吸收公司 Figma 组件规范、组件库代码、组件库规范、知识库文档，并通过 MCP 工具/资源把这些上下文提供给 Cursor，从而让生成代码更贴合公司规范。

## 运行（本地）

在该目录下：

```bash
pnpm install
pnpm build
pnpm start
```

默认使用 stdio transport（Cursor 也是通过 stdio 方式对接 MCP）。

## 配置

复制一份示例配置：

```bash
cp company-mcp.config.example.json company-mcp.config.json
```

运行时通过环境变量指定配置路径：

- `COMPANY_MCP_CONFIG`: 配置文件绝对路径（推荐）

## 在 Cursor 里集成（示例）

在 Cursor 的 MCP 配置中添加一个 server（示例字段名可能因 Cursor 版本略有不同）：

```json
{
  "command": "node",
  "args": ["/ABSOLUTE/PATH/company-cursor-mcp/build/index.js"],
  "env": {
    "COMPANY_MCP_CONFIG": "/ABSOLUTE/PATH/company-cursor-mcp/company-mcp.config.json"
  }
}
```

## 现阶段提供的能力（骨架）

- tools
  - `component.search`: 在组件库/文档里搜索组件相关信息（先用占位实现）
  - `component.get`: 获取指定组件详情（先用占位实现）
  - `guidelines.get`: 获取规范/约定（先用占位实现）
  - `docs.search`: 搜索知识库/文档（先用占位实现）

后续我们会把：

- Figma 规范解析（变量/组件属性/尺寸/色值/交互）
- 组件库代码索引（导出、props、示例、样式 token）
- 规范/知识库文档检索（全文、语义向量、分层缓存）
- “生成代码”相关的 prompt / tool 组合策略

逐步补齐。


