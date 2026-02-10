import fs from "node:fs"
import path from "node:path"
import https from "node:https"
import { fileURLToPath } from "node:url"
import { listComponentsFromFigmaData, type InputData } from "../mcp/tools/list-components-core"

/**
 * 更新组件注册表
 * 
 * 用法：
 *   npm run mapping:update-registry -- --figmaUrl <url> --token <token>
 * 
 * 功能：
 *   1. 从 Figma URL 提取组件列表
 *   2. 按组件集合分组
 *   3. 更新或创建组件注册表 JSON 文件
 */

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, "..")
const registryDir = path.join(projectRoot, "data", "component-registry")
const schemaDocPath = path.join(projectRoot, "docs", "component-registry-schema.md")
const mappingJsonPath = path.join(projectRoot, "mapping-llm.json")
const configPath = path.join(projectRoot, "figma-registry.config.json")
const envPath = path.join(projectRoot, "data", ".env")

type RegistryConfig = {
  defaultToken?: string
  defaultFigmaUrl?: string
  presets?: Record<string, {
    name: string
    figmaUrl: string
    description?: string
  }>
}

function loadConfig(): RegistryConfig {
  if (!fs.existsSync(configPath)) {
    return {}
  }
  try {
    return JSON.parse(fs.readFileSync(configPath, "utf8"))
  } catch {
    return {}
  }
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

// 确保注册表目录存在
if (!fs.existsSync(registryDir)) {
  fs.mkdirSync(registryDir, { recursive: true })
}

type ComponentInfo = {
  componentId: string
  componentName: string
  componentSetId?: string
  figmaLink: string
  count: number
}

type ComponentRegistry = {
  schema: {
    version: string
    description: string
    fields: Record<string, string>
  }
  componentSetId: string | null
  componentSetName: string
  componentSetDescription: string
  fileKey: string
  discoveredAt: string
  lastUpdatedAt: string
  discoveredFrom: {
    figmaUrl: string
    nodeId: string
  }
  components: Array<{
    componentId: string
    componentName: string
    figmaLink: string
    mapped: boolean
    mappingFile?: string
    frontendComponent?: string
    firstSeenAt: string
    lastSeenAt: string
    usageCount: number
  }>
}

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

function buildFigmaLink(fileKey: string, nodeId: string) {
  const normalized = nodeId.includes(":") ? nodeId.replace(/:/g, "-") : nodeId
  return `https://www.figma.com/design/${fileKey}/SDS-%E9%80%9A%E7%94%A8-UI-%E7%BB%84%E4%BB%B6%E5%BA%93-v4.0.0?node-id=${normalized}`
}

function readMappedComponents(): Map<string, { mappingFile?: string; frontendComponent?: string }> {
  if (!fs.existsSync(mappingJsonPath)) {
    return new Map()
  }
  const mapping = JSON.parse(fs.readFileSync(mappingJsonPath, "utf8"))
  const mapped = new Map<string, { mappingFile?: string; frontendComponent?: string }>()
  
  mapping.codeConnect?.forEach((entry: { figmaNode?: string; component?: string }) => {
    const nodeId = extractNodeIdFromUrl(entry.figmaNode)
    if (nodeId) {
      const normalized = normalizeNodeId(nodeId)
      // 尝试从 figmaNode 提取映射文件路径
      const mappingFile = entry.figmaNode?.includes("src/figma") 
        ? entry.figmaNode 
        : undefined
      mapped.set(normalized, {
        mappingFile,
        frontendComponent: entry.component,
      })
      mapped.set(nodeId, {
        mappingFile,
        frontendComponent: entry.component,
      })
    }
  })
  
  return mapped
}

function extractNodeIdFromUrl(url?: string): string | undefined {
  if (!url) return undefined
  const match = url.match(/node-id=([^&]+)/)
  return match?.[1]
}

function getComponentSetKey(component: ComponentInfo): string {
  // 优先使用 componentSetId
  if (component.componentSetId) {
    return component.componentSetId
  }
  
  // 按名称前缀分组
  const name = component.componentName
  if (name.startsWith("说明型/")) {
    return "说明型"
  }
  if (name.startsWith(".")) {
    const prefix = name.split("/")[0] || name.split(" ")[0] || name
    return prefix
  }
  
  // 其他情况使用组件名称作为 key
  return name.split("/")[0] || name
}

function getComponentSetDescription(componentSetKey: string, components: ComponentInfo[]): string {
  if (componentSetKey.startsWith("说明型")) {
    return "说明型组件集合，包含各种说明性文本和图标组件"
  }
  if (componentSetKey.startsWith(".")) {
    return `${componentSetKey} 组件集合`
  }
  if (components.length > 0 && components[0].componentSetId) {
    return `组件集合：${components[0].componentName.split("/")[0]}`
  }
  return `组件集合：${componentSetKey}`
}

function sanitizeFileName(key: string): string {
  // 将特殊字符替换为下划线，用于文件名
  return key.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, "_")
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

  const normalizedNodeId = normalizeNodeId(nodeId)
  const nodesUrl = `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${normalizedNodeId}`
  const componentsUrl = `https://api.figma.com/v1/files/${fileKey}/components`
  const componentSetsUrl = `https://api.figma.com/v1/files/${fileKey}/component_sets`

  const [nodesPayload, componentsPayload, componentSetsPayload] = await Promise.all([
    fetchJson(nodesUrl, token) as Promise<FigmaApiNodesResponse>,
    fetchJson(componentsUrl, token) as Promise<FigmaApiComponentsResponse>,
    fetchJson(componentSetsUrl, token) as Promise<FigmaApiComponentSetsResponse>,
  ])

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

  const result = listComponentsFromFigmaData(figmaData, {
    includeNestedInstances: process.env.FIGMA_TOP_LEVEL_ONLY !== "1",
  })
  
  // 获取组件集合信息
  const componentSetMap = new Map<string, string>()
  componentsPayload.meta?.components?.forEach((comp) => {
    if (comp.node_id && comp.component_set_id) {
      componentSetMap.set(comp.node_id, comp.component_set_id)
    }
  })
  
  return result.components
    .filter((comp): comp is { componentId: string; componentName: string; count: number } =>
      Boolean(comp.componentId && comp.componentName),
    )
    .map((comp) => {
    const normalizedId = normalizeNodeId(comp.componentId)
    const componentSetId = componentSetMap.get(normalizedId) || componentSetMap.get(comp.componentId)
    return {
      componentId: comp.componentId,
      componentName: comp.componentName,
      componentSetId,
      figmaLink: buildFigmaLink(fileKey, comp.componentId),
      count: comp.count,
    }
  })
}

function loadRegistry(filePath: string): ComponentRegistry | null {
  if (!fs.existsSync(filePath)) {
    return null
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"))
  } catch {
    return null
  }
}

function saveRegistry(filePath: string, registry: ComponentRegistry) {
  fs.writeFileSync(filePath, JSON.stringify(registry, null, 2), "utf8")
}

function createSchema(): ComponentRegistry["schema"] {
  return {
    version: "1.0.0",
    description: "组件注册表数据结构说明",
    fields: {
      componentSetId: "组件集合的唯一标识符（Figma componentSetId），如果组件不属于任何集合则为 null",
      componentSetName: "组件集合的名称（Figma 中的名称）",
      componentSetDescription: "组件集合的描述，说明这是什么类型的组件集合",
      fileKey: "Figma 文件 Key（用于构建链接）",
      discoveredAt: "首次发现时间（ISO 8601 格式）",
      lastUpdatedAt: "最后更新时间（ISO 8601 格式）",
      "discoveredFrom.figmaUrl": "发现该组件集合的 Figma 页面链接",
      "discoveredFrom.nodeId": "发现该组件集合的页面节点 ID",
      "components": "组件列表数组",
      "components[].componentId": "组件的唯一标识符（Figma componentId）",
      "components[].componentName": "组件的名称（Figma 中的名称）",
      "components[].figmaLink": "组件的 Figma 链接（可直接访问）",
      "components[].mapped": "是否已映射（boolean）",
      "components[].mappingFile": "映射文件路径（如果已映射）",
      "components[].frontendComponent": "前端组件名称（如果已映射）",
      "components[].firstSeenAt": "首次发现时间（ISO 8601 格式）",
      "components[].lastSeenAt": "最后发现时间（ISO 8601 格式）",
      "components[].usageCount": "使用次数（在发现的页面中出现次数）",
    },
  }
}

async function updateRegistryForUrl(figmaUrl: string, token: string) {
  console.log(`\n处理 Figma URL: ${figmaUrl}`)
  console.log("正在获取组件列表...")
  const components = await fetchComponentsFromFigma(figmaUrl, token)
  console.log(`找到 ${components.length} 个唯一组件`)

  console.log("正在检查映射状态...")
  const mapped = readMappedComponents()

  const fileKey = extractFileKey(figmaUrl)!
  const nodeId = extractNodeId(figmaUrl)!
  const now = new Date().toISOString()

  // 按组件集合分组
  const componentSetMap = new Map<string, ComponentInfo[]>()
  components.forEach((comp) => {
    const key = getComponentSetKey(comp)
    const list = componentSetMap.get(key) || []
    list.push(comp)
    componentSetMap.set(key, list)
  })

  console.log(`发现 ${componentSetMap.size} 个组件集合`)

  // 处理每个组件集合
  for (const [setKey, setComponents] of componentSetMap) {
    const fileName = sanitizeFileName(setKey) + ".json"
    const filePath = path.join(registryDir, fileName)

    let registry = loadRegistry(filePath)

    if (!registry) {
      // 创建新的注册表
      const firstComponent = setComponents[0]
      registry = {
        schema: createSchema(),
        componentSetId: firstComponent.componentSetId || null,
        componentSetName: setKey,
        componentSetDescription: getComponentSetDescription(setKey, setComponents),
        fileKey,
        discoveredAt: now,
        lastUpdatedAt: now,
        discoveredFrom: {
          figmaUrl,
          nodeId,
        },
        components: [],
      }
      console.log(`创建新组件集合: ${setKey}`)
    } else {
      // 更新现有注册表
      registry.lastUpdatedAt = now
      console.log(`更新组件集合: ${setKey}`)
    }

    // 更新组件列表
    setComponents.forEach((comp) => {
      const normalizedId = normalizeNodeId(comp.componentId)
      const mappedInfo = mapped.get(normalizedId) || mapped.get(comp.componentId)
      const existingIndex = registry.components.findIndex(
        (c) => normalizeNodeId(c.componentId) === normalizedId || c.componentId === comp.componentId
      )

      const componentData = {
        componentId: comp.componentId,
        componentName: comp.componentName,
        figmaLink: comp.figmaLink,
        mapped: !!mappedInfo,
        mappingFile: mappedInfo?.mappingFile,
        frontendComponent: mappedInfo?.frontendComponent,
        firstSeenAt: existingIndex >= 0 ? registry.components[existingIndex].firstSeenAt : now,
        lastSeenAt: now,
        usageCount: comp.count,
      }

      if (existingIndex >= 0) {
        // 更新现有组件（保留首次发现时间，更新其他信息）
        registry.components[existingIndex] = {
          ...registry.components[existingIndex],
          ...componentData,
          firstSeenAt: registry.components[existingIndex].firstSeenAt, // 保留首次发现时间
          usageCount: Math.max(registry.components[existingIndex].usageCount, comp.count), // 取最大值
        }
      } else {
        // 添加新组件
        registry.components.push(componentData)
      }
    })

    // 保存注册表
    saveRegistry(filePath, registry)
    console.log(`  ✅ 已保存: ${fileName} (${registry.components.length} 个组件)`)
  }
}

async function main() {
  loadEnvFile()
  const args = process.argv.slice(2)
  const config = loadConfig()

  // 解析命令行参数
  let figmaUrl: string | undefined
  let token: string | undefined
  let presetName: string | undefined

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === "--figmaUrl" && args[i + 1]) {
      figmaUrl = args[i + 1]
      i++
    } else if (arg === "--token" && args[i + 1]) {
      token = args[i + 1]
      i++
    } else if (arg === "--preset" && args[i + 1]) {
      presetName = args[i + 1]
      i++
    } else if (arg === "--list-presets") {
      // 列出所有预设
      console.log("\n可用的预设：")
      if (config.presets && Object.keys(config.presets).length > 0) {
        Object.entries(config.presets).forEach(([key, preset]) => {
          console.log(`  ${key}: ${preset.name}`)
          if (preset.description) {
            console.log(`    ${preset.description}`)
          }
        })
      } else {
        console.log("  暂无预设，请在 figma-registry.config.json 中添加")
      }
      console.log("\n使用方法：")
      console.log("  npm run mapping:update-registry -- --preset <preset-name>")
      console.log("  npm run mapping:update-registry -- --figmaUrl <url>")
      process.exit(0)
    }
  }

  // 如果指定了预设，从预设中获取 figmaUrl
  if (presetName && config.presets?.[presetName]) {
    figmaUrl = config.presets[presetName].figmaUrl
    console.log(`使用预设: ${config.presets[presetName].name}`)
  } else if (presetName) {
    console.error(`错误: 未找到预设 "${presetName}"`)
    console.error("使用 --list-presets 查看所有可用预设")
    process.exit(1)
  }

  // 如果没有提供 figmaUrl，尝试使用默认值
  if (!figmaUrl) {
    figmaUrl = config.defaultFigmaUrl || process.env.FIGMA_URL
  }

  // 如果没有提供 token，尝试从配置、环境变量获取
  if (!token) {
    token = config.defaultToken || process.env.FIGMA_API_KEY || process.env.FIGMA_TOKEN
  }

  const urlList = figmaUrl ? [figmaUrl] : parseFigmaUrls(process.env.FIGMA_URLS)

  // 验证必需参数
  if (!urlList.length) {
    console.error("错误: 未提供 Figma URL")
    console.error("\n使用方法：")
    console.error("  1. 使用预设: npm run mapping:update-registry -- --preset <preset-name>")
    console.error("  2. 直接指定: npm run mapping:update-registry -- --figmaUrl <url>")
    console.error("  3. 通过环境变量: FIGMA_URLS")
    console.error("  4. 查看预设: npm run mapping:update-registry -- --list-presets")
    console.error("\n也可以在 figma-registry.config.json 中设置 defaultFigmaUrl")
    process.exit(1)
  }

  if (!token) {
    console.error("错误: 未提供 Figma API Token")
    console.error("\n可以通过以下方式提供：")
    console.error("  1. 命令行参数: --token <token>")
    console.error("  2. 配置文件: figma-registry.config.json 中的 defaultToken")
    console.error("  3. 环境变量: FIGMA_API_KEY 或 FIGMA_TOKEN")
    process.exit(1)
  }

  for (const url of urlList) {
    await updateRegistryForUrl(url, token)
  }

  console.log(`\n✅ 所有组件集合已更新到: ${registryDir}`)
}

main().catch(console.error)
