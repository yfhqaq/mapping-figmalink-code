import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"
import { registerListComponentsTool } from "./tools/list-components-tool"
import { registerListComponentsFromUrlTool } from "./tools/list-components-from-url-tool"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, "..")
const defaultMappingPath = path.join(projectRoot, "mapping-llm.json")
const defaultDictionaryPath = path.join(projectRoot, "mapping-llm.dictionary.json")
const usagePath = path.join(__dirname, "usage.md")

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

type FigmaNodesMap = Record<string, { document?: FigmaNode }>

type InputData = {
  fileKey?: string
  document?: FigmaNode
  nodes?: FigmaNode[] | FigmaNodesMap
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8"))
}

function extractNodeIdFromUrl(url?: string): string | undefined {
  if (!url) return undefined
  const match = url.match(/node-id=([^&]+)/)
  if (!match) return undefined
  return match[1]
}

function normalizeNodeId(nodeId: string) {
  return nodeId.replace(/-/g, ":")
}

function collectInstances(node: FigmaNode | undefined, acc: FigmaNode[]) {
  if (!node) return
  if (node.type === "INSTANCE" && node.id) {
    acc.push(node)
  }
  if (node.children && Array.isArray(node.children)) {
    node.children.forEach((child) => collectInstances(child, acc))
  }
}

function collectAllInstances(data: InputData): FigmaNode[] {
  const acc: FigmaNode[] = []
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

const server = new McpServer({
  name: "mapping-mvp-mcp",
  version: "0.1.0",
})

registerListComponentsTool(server)
registerListComponentsFromUrlTool(server)

server.tool(
  "get_mapping_usage_md",
  "Return the usage markdown for this MCP",
  {},
  async () => {
    const text = fs.readFileSync(usagePath, "utf8")
    return { content: [{ type: "text", text }] }
  },
)

server.tool(
  "get_mapping_context_json",
  "Return mapping-llm.json (and optionally its dictionary).",
  {
    mappingPath: z.string().optional(),
    includeDictionary: z.boolean().optional(),
  },
  async (params: { mappingPath?: string; includeDictionary?: boolean }) => {
    const mappingPath = params.mappingPath
      ? path.resolve(projectRoot, params.mappingPath)
      : defaultMappingPath
    if (!fs.existsSync(mappingPath)) {
      return {
        isError: true,
        content: [{ type: "text", text: `Missing mapping: ${mappingPath}` }],
      }
    }
    const mapping = readJson<LlmMapping>(mappingPath)
    if (params.includeDictionary) {
      const dictionary = fs.existsSync(defaultDictionaryPath)
        ? readJson<Record<string, unknown>>(defaultDictionaryPath)
        : null
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ mapping, dictionary }, null, 2),
          },
        ],
      }
    }
    return { content: [{ type: "text", text: JSON.stringify(mapping, null, 2) }] }
  },
)

server.tool(
  "match_and_trim_context",
  "Match Figma instances and return a trimmed mapping context for LLM usage.",
  {
    figmaData: z.any(),
    mappingPath: z.string().optional(),
    fileKey: z.string().optional(),
    includeBusinessMappings: z.boolean().optional(),
  },
  async (params: {
    figmaData: InputData | string
    mappingPath?: string
    fileKey?: string
    includeBusinessMappings?: boolean
  }) => {
    const mappingPath = params.mappingPath
      ? path.resolve(projectRoot, params.mappingPath)
      : defaultMappingPath
    if (!fs.existsSync(mappingPath)) {
      return {
        isError: true,
        content: [{ type: "text", text: `Missing mapping: ${mappingPath}` }],
      }
    }

    const mapping = readJson<LlmMapping>(mappingPath)
    const figmaData =
      typeof params.figmaData === "string"
        ? (JSON.parse(params.figmaData) as InputData)
        : (params.figmaData as InputData)

    const instances = collectAllInstances(figmaData)
    const mappingIndex = buildIndex(mapping.codeConnect)
    const businessIndex = buildBusinessIndex(mapping.businessMappings)

    const matchedEntries = new Map<string, LlmMapping["codeConnect"][number]>()
    const matchedBusiness = new Map<string, LlmMapping["businessMappings"][number]>()
    const matches = instances.map((inst) => {
      const candidates: Array<{
        entry: LlmMapping["codeConnect"][number]
        reason: "componentId" | "componentSetId"
      }> = []
      if (inst.componentId) {
        const list = mappingIndex.get(inst.componentId) || []
        list.forEach((entry) => candidates.push({ entry, reason: "componentId" }))
      }
      if (inst.componentSetId) {
        const list = mappingIndex.get(inst.componentSetId) || []
        list.forEach((entry) => candidates.push({ entry, reason: "componentSetId" }))
      }
      const unique = new Map<string, typeof candidates[number]>()
      candidates.forEach((cand) => {
        const key = cand.entry.figmaNode || cand.entry.component || "Unknown"
        if (!unique.has(key)) unique.set(key, cand)
      })
      const result = Array.from(unique.values())
      result.forEach((cand) => {
        const key = cand.entry.figmaNode || cand.entry.component || "Unknown"
        matchedEntries.set(key, cand.entry)
      })
      const biz = businessIndex.get(inst.id || "") || []
      if (params.includeBusinessMappings !== false) {
        biz.forEach((item) => matchedBusiness.set(item.id, item))
      }
      return {
        instanceId: inst.id,
        name: inst.name,
        componentId: inst.componentId,
        componentSetId: inst.componentSetId,
        matchedUx: result.map((cand) => ({
          component: cand.entry.component,
          figmaNode: cand.entry.figmaNode,
          reason: cand.reason,
        })),
      }
    })

    const trimmedContext = {
      version: mapping.version,
      generatedAt: mapping.generatedAt,
      codeConnect: Array.from(matchedEntries.values()),
      businessMappings:
        params.includeBusinessMappings === false
          ? []
          : Array.from(matchedBusiness.values()),
    }

    const stats = {
      totalInstances: instances.length,
      matchedInstances: matches.filter((m) => (m.matchedUx || []).length > 0).length,
      matchedRules: matchedEntries.size,
      matchedBusinessMappings:
        params.includeBusinessMappings === false ? 0 : matchedBusiness.size,
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ stats, matches, trimmedContext }, null, 2),
        },
      ],
    }
  },
)

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

main()
