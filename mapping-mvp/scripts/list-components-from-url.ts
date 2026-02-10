import https from "node:https"
import { listComponentsFromFigmaData, type InputData } from "../mcp/tools/list-components-core"

type Args = {
  figmaUrl?: string
  token?: string
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

function parseArgs(): Args {
  const args = process.argv.slice(2)
  const topLevelOnly = args.includes("--topLevelOnly")
  const result: Args = {}
  for (let i = 0; i < args.length; i += 1) {
    const key = args[i]
    const value = args[i + 1]
    if (key?.startsWith("--")) {
      ;(result as Record<string, string>)[key.slice(2)] = value
      i += 1
    }
  }
  return result
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

async function main() {
  // 解析命令行参数（支持 --figmaUrl 和 --token）
  const args = parseArgs()
  const figmaUrl = args.figmaUrl
  if (!figmaUrl) {
    throw new Error("Missing --figmaUrl <url>")
  }

  // 解析 fileKey 与 node-id（用于拼 Figma API 请求）
  const fileKey = extractFileKey(figmaUrl)
  if (!fileKey) {
    throw new Error("Unable to extract fileKey from figmaUrl")
  }
  const nodeId = extractNodeId(figmaUrl)
  if (!nodeId) {
    throw new Error("Missing node-id in figmaUrl")
  }

  // Token 优先读命令行，其次读环境变量
  const token = args.token || process.env.FIGMA_API_KEY || process.env.FIGMA_TOKEN
  if (!token) {
    throw new Error("Missing Figma API token (FIGMA_API_KEY or --token)")
  }

  // 拉取节点、组件、组件集三类数据，确保能还原 UX 名称
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

  // 输出：组件ID + UX 名称 + 使用次数
  const result = listComponentsFromFigmaData(figmaData, {
    includeNestedInstances: !topLevelOnly,
  })
  console.log(JSON.stringify(result, null, 2))
}

main()
