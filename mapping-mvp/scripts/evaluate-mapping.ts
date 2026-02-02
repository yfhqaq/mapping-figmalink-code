import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

type LlmMapping = {
  version: number
  generatedAt: string
  codeConnect: Array<{
    component?: string
    figmaNode?: string
    label?: string
    language?: string
    imports?: string[]
    props?: Array<{
      name: string
      kind?: string
      figmaPropName?: string
      valueMapping?: Record<string, unknown>
      layers?: string[]
    }>
  }>
  businessMappings: Array<{
    id: string
    figmaNode: string
    scope: string
    description: string
    mappingType: string
    uxComponent?: { name: string; componentSetId?: string; componentId?: string; figmaNode?: string }
    snippetTemplate?: { code: Record<string, unknown> }
  }>
}

type FigmaNode = {
  id?: string
  name?: string
  type?: string
  componentId?: string
  componentSetId?: string
  children?: FigmaNode[]
}

type InputData = {
  fileKey?: string
  document?: FigmaNode
  nodes?: FigmaNode[]
}

type LlmMatch = {
  businessNode?: string
  matchedUxNodes?: string[]
  confidence?: number
  notes?: string
}

type InstanceRecord = {
  id: string
  name?: string
  type?: string
  componentId?: string
  componentSetId?: string
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, "..")

const defaultMappingPath = path.join(projectRoot, "mapping-llm.json")
const defaultOutputDir = path.join(projectRoot, "reports")

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8"))
}

function parseArgs() {
  // 解析命令行参数：仅支持 --key value 形式
  const args = process.argv.slice(2)
  const result: Record<string, string> = {}
  for (let i = 0; i < args.length; i += 1) {
    const key = args[i]
    const value = args[i + 1]
    if (key?.startsWith("--")) {
      result[key.slice(2)] = value
      i += 1
    }
  }
  return result
}

function extractNodeIdFromUrl(url?: string): string | undefined {
  // 从 Figma URL 中提取 node-id 查询参数
  if (!url) return undefined
  const match = url.match(/node-id=([^&]+)/)
  if (!match) return undefined
  return match[1]
}

function normalizeNodeId(nodeId: string) {
  return nodeId.replace(/-/g, ":")
}

function buildFigmaLink(fileKey: string | undefined, nodeId: string) {
  // 用于报告展示的可点击链接（把 : 转回 -）
  if (!fileKey) return undefined
  const normalized = nodeId.includes(":") ? nodeId.replace(/:/g, "-") : nodeId
  return `https://www.figma.com/design/${fileKey}?node-id=${normalized}`
}

function collectInstances(node: FigmaNode | undefined, acc: InstanceRecord[]) {
  // 递归遍历节点树，只记录 INSTANCE（组件实例）
  if (!node) return
  if (node.type === "INSTANCE") {
    if (node.id) {
      acc.push({
        id: node.id,
        name: node.name,
        type: node.type,
        componentId: node.componentId,
        componentSetId: node.componentSetId,
      })
    }
  }
  if (node.children && Array.isArray(node.children)) {
    node.children.forEach((child) => collectInstances(child, acc))
  }
}

function collectAllInstances(data: InputData): InstanceRecord[] {
  const acc: InstanceRecord[] = []
  if (data.document) {
    collectInstances(data.document, acc)
  }
  if (data.nodes && Array.isArray(data.nodes)) {
    data.nodes.forEach((node) => collectInstances(node, acc))
  }
  return acc
}

function buildIndex(mapping: LlmMapping["codeConnect"]) {
  // 用 node-id 建索引，便于按 componentId/componentSetId 快速匹配
  const index = new Map<string, LlmMapping["codeConnect"][number][]>()
  mapping.forEach((entry) => {
    const nodeId = extractNodeIdFromUrl(entry.figmaNode)
    if (!nodeId) return
    const normalized = normalizeNodeId(nodeId)
    const keys = new Set([nodeId, normalized])
    keys.forEach((key) => {
      const list = index.get(key) || []
      list.push(entry)
      index.set(key, list)
    })
  })
  return index
}

function buildBusinessIndex(mappings: LlmMapping["businessMappings"]) {
  // 业务映射索引：用于把业务节点关联到业务代码片段
  const index = new Map<string, LlmMapping["businessMappings"][number][]>()
  mappings.forEach((entry) => {
    const nodeId = extractNodeIdFromUrl(entry.figmaNode)
    if (!nodeId) return
    const normalized = normalizeNodeId(nodeId)
    const keys = new Set([nodeId, normalized])
    keys.forEach((key) => {
      const list = index.get(key) || []
      list.push(entry)
      index.set(key, list)
    })
  })
  return index
}

function normalizeNodeRef(nodeRef?: string) {
  if (!nodeRef) return undefined
  const nodeId = extractNodeIdFromUrl(nodeRef) || nodeRef
  return normalizeNodeId(nodeId)
}

function readLlmMatches(pathOrEmpty?: string): LlmMatch[] {
  if (!pathOrEmpty) return []
  if (!fs.existsSync(pathOrEmpty)) {
    throw new Error(`Missing LLM match file: ${pathOrEmpty}`)
  }
  return readJson<LlmMatch[]>(pathOrEmpty)
}

function formatMapping(entry: LlmMapping["codeConnect"][number]) {
  return `- UX组件: ${entry.component || "Unknown"}\n  UX链接: ${entry.figmaNode || "Unknown"}`
}

function main() {
  // 加载输入并生成“规则 vs LLM”的对比报告
  const args = parseArgs()
  const inputPath = args.input
  if (!inputPath) {
    throw new Error("Missing --input <figma-mcp-json-path>")
  }

  const mappingPath = args.mapping || defaultMappingPath
  const llmPath = args.llm
  const outputPath = args.output
  const fileKey = args.fileKey

  if (!fs.existsSync(mappingPath)) {
    throw new Error(`Missing mapping: ${mappingPath}. Run 'pnpm run mapping:generate' first.`)
  }

  const llmMapping = readJson<LlmMapping>(mappingPath)
  const inputData = readJson<InputData>(inputPath)
  const instances = collectAllInstances(inputData)
  const llmMatches = readLlmMatches(llmPath)

  const mappingIndex = buildIndex(llmMapping.codeConnect)
  const businessIndex = buildBusinessIndex(llmMapping.businessMappings)

  const matched: string[] = []
  const missing: string[] = []
  const multiCandidate: string[] = []
  const llmCompare: string[] = []

  // 将 LLM 匹配结果按业务节点归一化后索引
  const llmIndex = new Map<string, LlmMatch>()
  llmMatches.forEach((match) => {
    const key = normalizeNodeRef(match.businessNode)
    if (key) {
      llmIndex.set(key, match)
    }
  })

  instances.forEach((inst) => {
    // 规则匹配：按 componentId/componentSetId 查映射
    const candidates = [
      ...(inst.componentId ? mappingIndex.get(inst.componentId) || [] : []),
      ...(inst.componentSetId ? mappingIndex.get(inst.componentSetId) || [] : []),
    ]

    // 业务映射：按业务节点 id 查业务代码片段
    const businessCandidates = businessIndex.get(inst.id) || []
    const uniqueCandidates = Array.from(new Set(candidates))

    const instanceLink = buildFigmaLink(fileKey || inputData.fileKey, inst.id)
    const instKey = normalizeNodeId(inst.id)
    const llmMatch = llmIndex.get(instKey)
    // 未命中任何 UX 组件，归为“匹配失败”
    if (uniqueCandidates.length === 0) {
      missing.push(
        `- 业务节点: ${inst.name || inst.id}\n  业务链接: ${instanceLink || inst.id}\n  componentId: ${
          inst.componentId || "-"
        }\n  componentSetId: ${inst.componentSetId || "-"}`
      )
      if (llmMatch) {
        llmCompare.push(
          `- 业务节点: ${inst.name || inst.id}\n  业务链接: ${
            instanceLink || inst.id
          }\n  规则匹配: 无\n  LLM匹配: ${(
            llmMatch.matchedUxNodes || []
          ).join(", ") || "无"}\n  LLM置信度: ${
            llmMatch.confidence ?? "未提供"
          }\n  LLM备注: ${llmMatch.notes || "无"}`
        )
      }
      return
    }

    const lines: string[] = []
    lines.push(`- 业务节点: ${inst.name || inst.id}`)
    lines.push(`  业务链接: ${instanceLink || inst.id}`)
    uniqueCandidates.forEach((entry) => {
      lines.push(`  ${formatMapping(entry)}`)
    })
    businessCandidates.forEach((biz) => {
      lines.push(
        `  业务映射: ${biz.id} (scope: ${biz.scope})\n  业务映射链接: ${biz.figmaNode}`
      )
    })
    // 命中记录进入“匹配成功”
    matched.push(lines.join("\n"))

    // 多候选时单独归类，方便人工裁定
    if (uniqueCandidates.length > 1) {
      multiCandidate.push(lines.join("\n"))
    }

    if (llmMatch) {
      const ruleUx = uniqueCandidates
        .map((entry) => entry.figmaNode || entry.component || "Unknown")
        .join(", ")
      llmCompare.push(
        `- 业务节点: ${inst.name || inst.id}\n  业务链接: ${
          instanceLink || inst.id
        }\n  规则匹配: ${ruleUx || "无"}\n  LLM匹配: ${(
          llmMatch.matchedUxNodes || []
        ).join(", ") || "无"}\n  LLM置信度: ${
          llmMatch.confidence ?? "未提供"
        }\n  LLM备注: ${llmMatch.notes || "无"}`
      )
    }
  })

  const outputLines: string[] = []
  outputLines.push("# 匹配评估报告")
  outputLines.push("")
  outputLines.push(`- 实例总数: ${instances.length}`)
  outputLines.push(`- 匹配成功: ${matched.length}`)
  outputLines.push(`- 匹配失败: ${missing.length}`)
  outputLines.push(`- 多候选: ${multiCandidate.length}`)
  outputLines.push("")
  outputLines.push("## 匹配结果")
  outputLines.push(matched.length ? matched.join("\n\n") : "无")
  outputLines.push("")
  outputLines.push("## 多候选列表")
  outputLines.push(multiCandidate.length ? multiCandidate.join("\n\n") : "无")
  outputLines.push("")
  outputLines.push("## 匹配失败")
  outputLines.push(missing.length ? missing.join("\n\n") : "无")
  outputLines.push("")
  outputLines.push("## LLM 对比")
  outputLines.push(llmCompare.length ? llmCompare.join("\n\n") : "无")

  const report = outputLines.join("\n")
  if (outputPath) {
    fs.writeFileSync(outputPath, report)
    console.log(`Wrote: ${outputPath}`)
  } else {
    const today = new Date().toISOString().slice(0, 10)
    const defaultOutput = path.join(defaultOutputDir, `evaluation-report-${today}.md`)
    fs.mkdirSync(defaultOutputDir, { recursive: true })
    fs.writeFileSync(defaultOutput, report)
    console.log(`Wrote: ${defaultOutput}`)
  }
}

main()
