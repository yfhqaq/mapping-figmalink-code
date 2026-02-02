# 评估模块使用说明

## 1. 先生成映射
```
pnpm run codeconnect:parse
pnpm run mapping:generate
```

## 2. 生成 Figma 节点 JSON
用 MCP 拉取页面节点，保存为 JSON（示例：`tmp/figma-page.json`）。

## 3. 运行评估
```
pnpm run mapping:evaluate -- --input tmp/figma-page.json --fileKey <FIGMA_FILE_KEY>
```

可选参数：
- `--output <path>`：指定报告输出路径  
- `--mapping <path>`：指定 mapping-llm.json 路径  
- `--llm <path>`：指定 LLM 匹配结果 JSON  

## 4. 输出说明
报告默认输出到：
```
mapping-mvp/reports/evaluation-report-YYYY-MM-DD.md
```

报告包含：
- 匹配成功列表（业务组件链接 + UX 组件链接）
- 多候选列表
- 匹配失败列表
- LLM 对比结果（规则匹配 vs LLM 匹配）

## 5. LLM 匹配结果 JSON 格式
LLM 输出一个数组，每项描述一个业务节点的匹配结果：
```json
[
  {
    "businessNode": "https://www.figma.com/design/<fileKey>?node-id=123-456",
    "matchedUxNodes": [
      "https://www.figma.com/design/<fileKey>?node-id=789-1011"
    ],
    "confidence": 0.82,
    "notes": "复合规则：筛选区 + 表格 + 工具栏"
  }
]
```

## 6. 一键流程（解析 + 生成 + 评估）
如果你已经有 MCP 输出的 JSON，可直接跑：
```
pnpm run mapping:pipeline -- --input tmp/figma-page.json --fileKey <FIGMA_FILE_KEY> --llm tmp/llm-match.json
```

可选参数：
- `--skip-parse`：跳过 code connect parse
- `--skip-generate`：跳过 mapping 生成

## 7. 直接用 Figma 链接（自动拉取 JSON）
```
pnpm run mapping:pipeline -- --figmaUrl <FIGMA_LINK> --llm tmp/llm-match.json
```

需要设置 Figma Token（任选其一）：
- 环境变量：`FIGMA_API_KEY` 或 `FIGMA_TOKEN`
- 或命令行：`--token <YOUR_TOKEN>`