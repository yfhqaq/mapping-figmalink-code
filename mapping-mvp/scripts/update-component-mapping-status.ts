import fs from "node:fs"
import path from "node:path"
import https from "node:https"
import { fileURLToPath } from "node:url"
import { listComponentsFromFigmaData, type InputData } from "../mcp/tools/list-components-core"

/**
 * 更新组件映射状态文档
 * 
 * 用法：
 *   npm run mapping:update-status -- --figmaUrl <url> --token <token>
 * 
 * 功能：
 *   1. 从 Figma URL 提取组件列表
 *   2. 检查哪些组件已映射
 *   3. 更新 component-mapping-status.md 文档
 */

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, "..")
const statusDocPath = path.join(projectRoot, "docs", "component-mapping-status.md")
const mappingJsonPath = path.join(projectRoot, "mapping-llm.json")
const envPath = path.join(projectRoot, "data", ".env")

type FigmaApiNodesResponse = {
  nodes?: Record<string, { document?: InputData["document"] }>
}

type FigmaApiComponentsResponse = {
  meta?: {
    components?: Array<{
      node_id?: string
      name?: string
      component_set_id?: string
    }>
  }
}

type FigmaApiComponentSetsResponse = {
  meta?: {
    component_sets?: Array<{
      node_id?: string
      name?: string
    }>
  }
}

function extractFileKey(url: string) {
  const match = url.match(/figma\.com\/(?:design|file)\/([^/]+)/)
  return match?.[1]
}

function extractNodeId(url: string) {
  const match = url.match(/node-id=([^&]+)/)
  return match?.[1]
}

function normalizeNodeId(nodeId: string) {
  return nodeId.replace(/-/g, ":")
}

function fetchJson(url: string, token: string) {
  return new Promise<unknown>((resolve, reject) => {
    const req = https.request(
      url,
      {
        method: "GET",
        headers: { "X-Figma-Token": token },
      },
      (res: any) => {
        let data = ""
        res.on("data", (chunk: any) => {
          data += chunk
        })
        res.on("end", () => {
          if (res.statusCode && res.statusCode >= 400) {
            reject(new Error(`Figma API error ${res.statusCode}: ${data}`))
            return
          }
          try {
            resolve(JSON.parse(data))
          } catch (error) {
            reject(error)
          }
        })
      },
    )
    req.on("error", reject)
    req.end()
  })
}

function loadEnvFile() {
  if (!fs.existsSync(envPath)) {
    return
  }
  const content = fs.readFileSync(envPath, "utf8")
  content.split("\n").forEach((line: string) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) {
      return
    }
    const index = trimmed.indexOf("=")
    if (index <= 0) {
      return
    }
    const key = trimmed.slice(0, index).trim()
    const value = trimmed.slice(index + 1).trim()
    if (key && value && !process.env[key]) {
      process.env[key] = value
    }
  })
}

function parseFigmaUrls(raw?: string): string[] {
  if (!raw) return []
  return raw
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean)
}

type ComponentInfo = {
  componentId: string
  componentName: string
  figmaLink: string
  count?: number
}

type MappingEntry = {
  figmaNode?: string
  component?: string
}

function extractNodeIdFromUrl(url?: string): string | undefined {
  if (!url) return undefined
  const match = url.match(/node-id=([^&]+)/)
  return match?.[1]
}

function buildFigmaLink(fileKey: string, nodeId: string) {
  const normalized = nodeId.includes(":") ? nodeId.replace(/:/g, "-") : nodeId
  return `https://www.figma.com/design/${fileKey}/SDS-%E9%80%9A%E7%94%A8-UI-%E7%BB%84%E4%BB%B6%E5%BA%93-v4.0.0?node-id=${normalized}`
}

function readMappedComponents(): Map<string, MappingEntry> {
  // 读取 mapping-llm.json，提取已映射的组件
  if (!fs.existsSync(mappingJsonPath)) {
    return new Map()
  }
  const mapping = JSON.parse(fs.readFileSync(mappingJsonPath, "utf8"))
  const mapped = new Map<string, MappingEntry>()
  
  mapping.codeConnect?.forEach((entry: MappingEntry) => {
    const nodeId = extractNodeIdFromUrl(entry.figmaNode)
    if (nodeId) {
      const normalized = normalizeNodeId(nodeId)
      mapped.set(normalized, entry)
      mapped.set(nodeId, entry) // 同时存储两种格式
    }
  })
  
  return mapped
}

function checkComponentMapped(componentId: string, mapped: Map<string, MappingEntry>): boolean {
  const normalized = normalizeNodeId(componentId)
  return mapped.has(normalized) || mapped.has(componentId)
}

function generateStatusMarkdown(
  components: ComponentInfo[],
  mapped: Map<string, MappingEntry>,
  sourceUrl?: string,
  sourceNodeId?: string
): string {
  const fileKey = "JU4Freq42yQFn1GTe97pLy"
  const lines: string[] = []
  
  lines.push("# 组件映射状态文档")
  lines.push("")
  lines.push("本文档记录 SDS 组件库中各组件的映射状态，包括组件 ID、名称、Figma 链接和映射状态。")
  lines.push("")
  lines.push("## 文档说明")
  lines.push("")
  lines.push("- **组件 ID**: Figma 组件的唯一标识符（格式：`pageId:nodeId`）")
  lines.push("- **组件名称**: UX 组件在 Figma 中的名称")
  lines.push("- **Figma 链接**: 可直接访问的组件链接")
  lines.push("- **映射状态**: ")
  lines.push("  - ✅ 已映射：已创建 `.figma.tsx` 映射文件")
  lines.push("  - ❌ 未映射：尚未创建映射文件")
  lines.push("  - 🔄 待确认：需要确认是否映射")
  lines.push("")
  lines.push("---")
  lines.push("")
  
  // 分类：已映射 vs 未映射
  const mappedComponents: ComponentInfo[] = []
  const unmappedComponents: ComponentInfo[] = []
  
  components.forEach((comp) => {
    if (checkComponentMapped(comp.componentId, mapped)) {
      mappedComponents.push(comp)
    } else {
      unmappedComponents.push(comp)
    }
  })
  
  // 已映射组件
  if (mappedComponents.length > 0) {
    lines.push("## 已映射组件")
    lines.push("")
    lines.push("| 组件 ID | 组件名称 | Figma 链接 | 前端组件 |")
    lines.push("|---------|---------|-----------|---------|")
    mappedComponents.forEach((comp) => {
      const entry = mapped.get(normalizeNodeId(comp.componentId))
      const componentName = entry?.component || "Unknown"
      lines.push(
        `| \`${comp.componentId}\` | ${comp.componentName} | [链接](${comp.figmaLink}) | \`${componentName}\` |`
      )
    })
    lines.push("")
  }
  
  // 未映射组件
  if (unmappedComponents.length > 0) {
    lines.push("## 未映射组件")
    lines.push("")
    
    // 按类型分组
    const typeGroups = new Map<string, ComponentInfo[]>()
    unmappedComponents.forEach((comp) => {
      const type = comp.componentName.split("/")[0] || comp.componentName.split(".")[0] || "其他"
      const list = typeGroups.get(type) || []
      list.push(comp)
      typeGroups.set(type, list)
    })
    
    typeGroups.forEach((comps, type) => {
      lines.push(`### ${type}组件`)
      lines.push("")
      lines.push("| 组件 ID | 组件名称 | Figma 链接 | 映射状态 | 备注 |")
      lines.push("|---------|---------|-----------|---------|------|")
      comps.forEach((comp) => {
        const count = comp.count ? `（出现 ${comp.count} 次）` : ""
        lines.push(
          `| \`${comp.componentId}\` | ${comp.componentName} | [链接](${comp.figmaLink}) | ❌ 未映射 | ${comp.componentName}${count} |`
        )
      })
      lines.push("")
    })
  }
  
  // 发现来源
  if (sourceUrl || sourceNodeId) {
    lines.push("---")
    lines.push("")
    lines.push("## 发现来源")
    lines.push("")
    if (sourceUrl) {
      lines.push(`**页面链接**: [查看页面](${sourceUrl})`)
      lines.push("")
    }
    if (sourceNodeId) {
      lines.push(`**页面节点 ID**: \`${sourceNodeId}\``)
      lines.push("")
    }
    lines.push("**统计信息**:")
    lines.push(`- 总实例数: ${components.reduce((sum, c) => sum + (c.count || 0), 0)}`)
    lines.push(`- 唯一组件数: ${components.length}`)
    lines.push(`- 已映射组件数: ${mappedComponents.length}`)
    lines.push(`- 未映射组件数: ${unmappedComponents.length}`)
    lines.push("")
  }
  
  // 映射步骤
  lines.push("---")
  lines.push("")
  lines.push("## 映射步骤")
  lines.push("")
  lines.push("如需映射这些组件，请按以下步骤操作：")
  lines.push("")
  lines.push("1. **确认前端组件**")
  lines.push("   - 查看 Figma 链接，了解组件的视觉和功能")
  lines.push("   - 确定对应的前端组件（可能是 Ant Design、自定义组件库等）")
  lines.push("")
  lines.push("2. **创建映射文件**")
  lines.push("   - 在 `src/figma/` 目录下创建对应的 `.figma.tsx` 文件")
  lines.push("   - 参考已有映射文件的格式（如 `Button.figma.tsx`）")
  lines.push("")
  lines.push("3. **更新配置**")
  lines.push("   - 在 `figma.config.json` 中添加组件的 URL 占位符（如 `<FIGMA_TIME_DISPLAY>`）")
  lines.push("   - 在映射文件中使用该占位符")
  lines.push("")
  lines.push("4. **生成映射**")
  lines.push("   ```bash")
  lines.push("   npm run codeconnect:parse")
  lines.push("   npm run mapping:generate")
  lines.push("   ```")
  lines.push("")
  lines.push("5. **更新本文档**")
  lines.push("   - 将组件状态从 ❌ 未映射 改为 ✅ 已映射")
  lines.push("   - 添加映射文件路径和前端组件名称")
  lines.push("")
  
  // 更新记录
  lines.push("---")
  lines.push("")
  lines.push("## 更新记录")
  lines.push("")
  const today = new Date().toISOString().slice(0, 10)
  lines.push(`- **${today}**: 文档更新，记录 ${components.length} 个组件的映射状态`)
  lines.push("")
  
  return lines.join("\n")
}

async function fetchComponentsFromFigma(figmaUrl: string, token: string): Promise<ComponentInfo[]> {
  const fileKey = extractFileKey(figmaUrl)
  if (!fileKey) {
    throw new Error("Unable to extract fileKey from figmaUrl")
  }
  const nodeId = extractNodeId(figmaUrl)
  if (!nodeId) {
    throw new Error("Missing node-id in figmaUrl")
  }

  // 拉取节点、组件、组件集三类数据
  const normalizedNodeId = normalizeNodeId(nodeId)
  const nodesUrl = `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${normalizedNodeId}`
  const componentsUrl = `https://api.figma.com/v1/files/${fileKey}/components`
  const componentSetsUrl = `https://api.figma.com/v1/files/${fileKey}/component_sets`

  const [nodesPayload, componentsPayload, componentSetsPayload] = await Promise.all([
    fetchJson(nodesUrl, token) as Promise<FigmaApiNodesResponse>,
    fetchJson(componentsUrl, token) as Promise<FigmaApiComponentsResponse>,
    fetchJson(componentSetsUrl, token) as Promise<FigmaApiComponentSetsResponse>,
  ])

  // 将 API 结果转成 listComponentsFromFigmaData 可用的结构
  const components: InputData["components"] = {}
  componentsPayload.meta?.components?.forEach((comp) => {
    if (!comp.node_id) return
    components[comp.node_id] = {
      id: comp.node_id,
      name: comp.name,
      componentSetId: comp.component_set_id,
    }
  })

  const componentSets: InputData["componentSets"] = {}
  componentSetsPayload.meta?.component_sets?.forEach((set) => {
    if (!set.node_id) return
    componentSets[set.node_id] = {
      id: set.node_id,
      name: set.name,
    }
  })

  const figmaData: InputData = {
    nodes: nodesPayload.nodes,
    components,
    componentSets,
  }

  // 获取组件列表
  const result = listComponentsFromFigmaData(figmaData, {
    includeNestedInstances: process.env.FIGMA_TOP_LEVEL_ONLY !== "1",
  })
  
  // 转换为 ComponentInfo 格式
  return result.components
    .filter((comp): comp is { componentId: string; componentName: string; count: number } =>
      Boolean(comp.componentId && comp.componentName),
    )
    .map((comp) => ({
      componentId: comp.componentId,
      componentName: comp.componentName,
      figmaLink: buildFigmaLink(fileKey, comp.componentId),
      count: comp.count,
    }))
}

async function main() {
  loadEnvFile()
  const args = process.argv.slice(2)
  const figmaUrlIndex = args.indexOf("--figmaUrl")
  const tokenIndex = args.indexOf("--token")
  
  const figmaUrl = figmaUrlIndex >= 0 ? args[figmaUrlIndex + 1] : undefined
  const token =
    tokenIndex >= 0
      ? args[tokenIndex + 1]
      : process.env.FIGMA_API_KEY || process.env.FIGMA_TOKEN
  
  const urlList = figmaUrl ? [figmaUrl] : parseFigmaUrls(process.env.FIGMA_URLS)

  if (!urlList.length) {
    console.error("Usage: npm run mapping:update-status -- --figmaUrl <url> [--token <token>]")
    console.error("Or set FIGMA_URLS in data/.env for batch mode")
    process.exit(1)
  }
  
  if (!token) {
    console.error("Missing Figma API token (FIGMA_API_KEY or --token)")
    process.exit(1)
  }

  let lastMarkdown = ""
  for (const url of urlList) {
    console.log(`\n处理 Figma URL: ${url}`)
    console.log("正在获取组件列表...")
    const components = await fetchComponentsFromFigma(url, token)
    console.log(`找到 ${components.length} 个唯一组件`)

    console.log("正在检查映射状态...")
    const mapped = readMappedComponents()

    const nodeId = extractNodeId(url)
    console.log("正在生成文档...")
    lastMarkdown = generateStatusMarkdown(components, mapped, url, nodeId)
  }

  if (lastMarkdown) {
    fs.writeFileSync(statusDocPath, lastMarkdown, "utf8")
    console.log(`✅ 文档已更新: ${statusDocPath}`)
  }
}

main().catch(console.error)
