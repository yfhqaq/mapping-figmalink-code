import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import https from "node:https"
import { z } from "zod"
import { listComponentsFromFigmaData, type InputData } from "./list-components-core"

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

type FigmaApiNodesResponse = {
  nodes?: Record<string, { document?: InputData["document"] }>
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

function buildComponentsMap(payload: FigmaApiComponentsResponse) {
  const map: InputData["components"] = {}
  payload.meta?.components?.forEach((comp) => {
    if (!comp.node_id) return
    map[comp.node_id] = {
      id: comp.node_id,
      name: comp.name,
      componentSetId: comp.component_set_id,
    }
  })
  return map
}

function buildComponentSetsMap(payload: FigmaApiComponentSetsResponse) {
  const map: InputData["componentSets"] = {}
  payload.meta?.component_sets?.forEach((set) => {
    if (!set.node_id) return
    map[set.node_id] = {
      id: set.node_id,
      name: set.name,
    }
  })
  return map
}

export function registerListComponentsFromUrlTool(server: McpServer) {
  server.tool(
    "list_components_from_figma_url",
    "Fetch Figma data by URL, then list component IDs and UX component names.",
    {
      figmaUrl: z.string(),
      token: z.string().optional(),
    },
    async (params: { figmaUrl: string; token?: string }) => {
      const fileKey = extractFileKey(params.figmaUrl)
      if (!fileKey) {
        return {
          isError: true,
          content: [{ type: "text", text: "Unable to extract fileKey from figmaUrl" }],
        }
      }

      const nodeId = extractNodeId(params.figmaUrl)
      if (!nodeId) {
        return {
          isError: true,
          content: [{ type: "text", text: "Missing node-id in figmaUrl" }],
        }
      }

      const token =
        params.token || process.env.FIGMA_API_KEY || process.env.FIGMA_TOKEN
      if (!token) {
        return {
          isError: true,
          content: [{ type: "text", text: "Missing Figma API token" }],
        }
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

      const figmaData: InputData = {
        nodes: nodesPayload.nodes,
        components: buildComponentsMap(componentsPayload),
        componentSets: buildComponentSetsMap(componentSetsPayload),
      }

      const { stats, components } = listComponentsFromFigmaData(figmaData)

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ stats, components }, null, 2),
          },
        ],
      }
    },
  )
}
