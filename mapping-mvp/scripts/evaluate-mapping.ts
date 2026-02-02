import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

// LLM 映射的整体结构（mapping-llm.json）
// 由 generate-llm-mapping.ts 生成，作为“规则库”
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

// Figma 节点的最小字段集合（我们只关心这些字段）
type FigmaNode = {
  id?: string
  name?: string
  type?: string
  componentId?: string
  componentSetId?: string
  children?: FigmaNode[]
}

// Figma API 返回的 nodes 可能是对象形式：{ nodeId: { document } }
type FigmaNodesMap = Record<string, { document?: FigmaNode }>

// 输入 JSON 结构：来自 MCP 或 Figma API
// 兼容 document / nodes 两种格式
type InputData = {
  fileKey?: string
  document?: FigmaNode
  nodes?: FigmaNode[] | FigmaNodesMap
}

// LLM 输出的匹配结果结构（用于对比）
type LlmMatch = {
  businessNode?: string
  matchedUxNodes?: string[]
  confidence?: number
  notes?: string
}

// 业务页面里的组件实例（只保留指纹信息）
type InstanceRecord = {
  id: string
  name?: string
  type?: string
  componentId?: string
  componentSetId?: string
}

// 规则匹配的候选结果 + 命中原因
type Candidate = {
  entry: LlmMapping["codeConnect"][number]
  reason: "componentId" | "componentSetId"
}

// 统计指标，用于报告顶部的汇总
type Metrics = {
  totalInstances: number
  ruleMatched: number
  ruleMissing: number
  multiCandidate: number
  hasBusinessMapping: number
  llmProvided: number
  llmAgreed: number
  llmDisagreed: number
}

// 计算脚本所在目录，方便拼接相对路径
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, "..")

// 默认路径：规则库与输出目录
const defaultMappingPath = path.join(projectRoot, "mapping-llm.json")
const defaultOutputDir = path.join(projectRoot, "reports")

// 读取 JSON 文件并返回对象
function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8"))
}

function parseArgs() {
  // 解析命令行参数：仅支持 --key value 形式
  // 例：--input xxx.json --llm llm.json
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
  // 说明：Figma 节点 ID 通过 node-id=xxx 传递
  // 从 Figma URL 中提取 node-id 查询参数
  if (!url) return undefined
  const match = url.match(/node-id=([^&]+)/)
  if (!match) return undefined
  return match[1]
}

function normalizeNodeId(nodeId: string) {
  // 统一格式：把 1-2 变成 1:2，便于匹配
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
  // 兼容两种输入结构：
  // 1) document: FigmaNode
  // 2) nodes: FigmaNode[] | { id: { document } }
  const acc: InstanceRecord[] = []
  if (data.document) {
    collectInstances(data.document, acc)
  }
  if (data.nodes) {
    if (Array.isArray(data.nodes)) {
      data.nodes.forEach((node) => collectInstances(node, acc))
    } else {
      Object.values(data.nodes).forEach((nodeWrapper) => {
        if (nodeWrapper?.document) {
          collectInstances(nodeWrapper.document, acc)
        }
      })
    }
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
  // 统一 LLM 输出里的节点引用（可能是 URL 或 id）
  if (!nodeRef) return undefined
  const nodeId = extractNodeIdFromUrl(nodeRef) || nodeRef
  return normalizeNodeId(nodeId)
}

function readLlmMatches(pathOrEmpty?: string): LlmMatch[] {
  // LLM 对比结果是可选输入：没传则返回空数组
  if (!pathOrEmpty) return []
  if (!fs.existsSync(pathOrEmpty)) {
    throw new Error(`Missing LLM match file: ${pathOrEmpty}`)
  }
  return readJson<LlmMatch[]>(pathOrEmpty)
}

function formatMapping(entry: LlmMapping["codeConnect"][number]) {
  // 把单个规则候选格式化成报告中的一行
  return `- UX组件: ${entry.component || "Unknown"}\n  UX链接: ${entry.figmaNode || "Unknown"}`
}

function calcConfidence(reason: Candidate["reason"], candidateCount: number) {
  // 置信度是经验值：componentId > componentSetId，多候选会降低
  const base = reason === "componentId" ? 0.9 : 0.8
  const penalty = Math.min(0.2, Math.max(0, candidateCount - 1) * 0.05)
  return Math.max(0.5, +(base - penalty).toFixed(2))
}

function buildMetrics(): Metrics {
  // 初始化所有统计指标，后续在循环中累加
  return {
    totalInstances: 0,
    ruleMatched: 0,
    ruleMissing: 0,
    multiCandidate: 0,
    hasBusinessMapping: 0,
    llmProvided: 0,
    llmAgreed: 0,
    llmDisagreed: 0,
  }
}

function main() {
  // 核心流程：
  // 1) 读映射规则（mapping-llm.json）
  // 2) 读 Figma 节点 JSON（MCP/API 输出）
  // 3) 抽取所有 INSTANCE
  // 4) 规则匹配 + 业务映射 + LLM 对比
  // 5) 输出报告
  const args = parseArgs()
  const inputPath = args.input
  if (!inputPath) {
    throw new Error("Missing --input <figma-mcp-json-path>")
  }

  const mappingPath = args.mapping || defaultMappingPath
  const llmPath = args.llm
  const outputPath = args.output
  const fileKey = args.fileKey

  // 没有规则库则无法评估
  if (!fs.existsSync(mappingPath)) {
    throw new Error(`Missing mapping: ${mappingPath}. Run 'pnpm run mapping:generate' first.`)
  }

  // 读取映射上下文（规则库）
  const llmMapping = readJson<LlmMapping>(mappingPath)
  // 读取 Figma 节点数据（来自 MCP 或 API）
  const inputData = readJson<InputData>(inputPath)
  // 把节点树中的 INSTANCE 抽出来作为“业务组件候选”
  const instances = collectAllInstances(inputData)
  // 读取 LLM 输出的匹配结果（用于对比）
  const llmMatches = readLlmMatches(llmPath)

  // 组件映射索引：用于把 componentId/componentSetId 映射回 UX 组件
  const mappingIndex = buildIndex(llmMapping.codeConnect)
  // 业务映射索引：用于把业务节点映射到代码片段（scope）
  const businessIndex = buildBusinessIndex(llmMapping.businessMappings)

  // 报告内容分四块：匹配成功 / 失败 / 多候选 / LLM对比
  const matched: string[] = []
  const missing: string[] = []
  const multiCandidate: string[] = []
  const llmCompare: string[] = []
  // 汇总指标：用于报告顶部的统计行
  const metrics = buildMetrics()

  // 将 LLM 匹配结果按业务节点归一化后索引
  // 这样可以 O(1) 找到“某个业务节点”的 LLM 结果
  const llmIndex = new Map<string, LlmMatch>()
  llmMatches.forEach((match) => {
    const key = normalizeNodeRef(match.businessNode)
    if (key) {
      llmIndex.set(key, match)
    }
  })

  // 遍历每个 INSTANCE，做规则匹配 + 业务映射 + LLM 对比
  instances.forEach((inst) => {
    metrics.totalInstances += 1
    // 规则匹配：按 componentId/componentSetId 查映射
    const candidates: Candidate[] = []
    if (inst.componentId) {
      const list = mappingIndex.get(inst.componentId) || []
      list.forEach((entry) => candidates.push({ entry, reason: "componentId" }))
    }
    if (inst.componentSetId) {
      const list = mappingIndex.get(inst.componentSetId) || []
      list.forEach((entry) => candidates.push({ entry, reason: "componentSetId" }))
    }

    // 业务映射：按业务节点 id 查业务代码片段（可选）
    const businessCandidates = businessIndex.get(inst.id) || []
    if (businessCandidates.length > 0) {
      metrics.hasBusinessMapping += 1
    }
    // 去重候选：同一个 UX 组件可能被多个指纹命中
    const candidateMap = new Map<string, Candidate>()
    candidates.forEach((cand) => {
      const key = cand.entry.figmaNode || cand.entry.component || "Unknown"
      if (!candidateMap.has(key)) {
        candidateMap.set(key, cand)
      }
    })
    const uniqueCandidates = Array.from(candidateMap.values())

    // 为报告生成可点击的业务节点链接
    const instanceLink = buildFigmaLink(fileKey || inputData.fileKey, inst.id)
    const instKey = normalizeNodeId(inst.id)
    // LLM 是否给出了该节点的匹配结果
    const llmMatch = llmIndex.get(instKey)
    if (llmMatch) {
      metrics.llmProvided += 1
    }
    // 未命中任何 UX 组件，归为“匹配失败”
    if (uniqueCandidates.length === 0) {
      metrics.ruleMissing += 1
      const missReason =
        inst.componentId || inst.componentSetId
          ? "映射缺失"
          : "无指纹（非组件实例或未使用组件库）"
      missing.push(
        `- 业务节点: ${inst.name || inst.id}\n  业务链接: ${instanceLink || inst.id}\n  失败原因: ${missReason}\n  componentId: ${
          inst.componentId || "-"
        }\n  componentSetId: ${inst.componentSetId || "-"}`
      )
      if (llmMatch) {
        metrics.llmDisagreed += 1
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

    // 命中规则，记录为“匹配成功”
    metrics.ruleMatched += 1
    const lines: string[] = []
    lines.push(`- 业务节点: ${inst.name || inst.id}`)
    lines.push(`  业务链接: ${instanceLink || inst.id}`)
    uniqueCandidates.forEach((cand) => {
      const confidence = calcConfidence(cand.reason, uniqueCandidates.length)
      lines.push(`  ${formatMapping(cand.entry)}`)
      lines.push(`  命中原因: ${cand.reason}`)
      lines.push(`  规则置信度: ${confidence}`)
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
      metrics.multiCandidate += 1
    }

    if (llmMatch) {
      // LLM vs 规则的简单一致性判定（是否有交集）
      const ruleUx = uniqueCandidates
        .map((cand) => cand.entry.figmaNode || cand.entry.component || "Unknown")
        .join(", ")
      const llmUx = (llmMatch.matchedUxNodes || []).join(", ")
      const agreed =
        llmMatch.matchedUxNodes &&
        llmMatch.matchedUxNodes.some((ux) => ruleUx.includes(ux))
      if (agreed) {
        metrics.llmAgreed += 1
      } else {
        metrics.llmDisagreed += 1
      }
      llmCompare.push(
        `- 业务节点: ${inst.name || inst.id}\n  业务链接: ${
          instanceLink || inst.id
        }\n  规则匹配: ${ruleUx || "无"}\n  LLM匹配: ${llmUx || "无"}\n  LLM置信度: ${
          llmMatch.confidence ?? "未提供"
        }\n  LLM备注: ${llmMatch.notes || "无"}`
      )
    }
  })

  const outputLines: string[] = []
  outputLines.push("# 匹配评估报告")
  outputLines.push("")
  outputLines.push(`- 实例总数: ${metrics.totalInstances}`)
  outputLines.push(`- 匹配成功: ${metrics.ruleMatched}`)
  outputLines.push(`- 匹配失败: ${metrics.ruleMissing}`)
  outputLines.push(`- 多候选: ${metrics.multiCandidate}`)
  outputLines.push(`- 含业务映射: ${metrics.hasBusinessMapping}`)
  outputLines.push(`- LLM输出数: ${metrics.llmProvided}`)
  outputLines.push(`- LLM一致: ${metrics.llmAgreed}`)
  outputLines.push(`- LLM不一致: ${metrics.llmDisagreed}`)
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
