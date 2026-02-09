import https from "node:https"

type Args = {
  figmaUrl?: string
  sdsFileKey?: string
  token?: string
}

type FigmaNode = {
  id?: string
  name?: string
  type?: string
  componentId?: string
  componentSetId?: string
  children?: FigmaNode[]
}

type FigmaNodesResponse = {
  nodes?: Record<string, { document?: FigmaNode }>
}

type FigmaComponentsResponse = {
  meta?: {
    components?: Array<{
      node_id?: string
      name?: string
      component_set_id?: string
    }>
  }
}

type FigmaComponentSetsResponse = {
  meta?: {
    component_sets?: Array<{
      node_id?: string
      name?: string
    }>
  }
}

function parseArgs(): Args {
  const args = process.argv.slice(2)
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

function buildBaseUrl(url: string) {
  return url.split("?")[0]
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

function collectInstances(node: FigmaNode | undefined, acc: FigmaNode[]) {
  if (!node) return
  if (node.type === "INSTANCE") {
    acc.push(node)
  }
  if (node.children && Array.isArray(node.children)) {
    node.children.forEach((child) => collectInstances(child, acc))
  }
}

async function main() {
  const args = parseArgs()
  const figmaUrl = args.figmaUrl
  if (!figmaUrl) {
    throw new Error("Missing --figmaUrl <url>")
  }

  const sdsFileKey = args.sdsFileKey || "JU4Freq42yQFn1GTe97pLy"
  const fileKey = extractFileKey(figmaUrl)
  if (!fileKey) {
    throw new Error("Unable to extract fileKey from figmaUrl")
  }

  const nodeId = extractNodeId(figmaUrl)
  if (!nodeId) {
    throw new Error("Missing node-id in figmaUrl")
  }

  const token = args.token || process.env.FIGMA_API_KEY || process.env.FIGMA_TOKEN
  if (!token) {
    throw new Error("Missing Figma API token (FIGMA_API_KEY or --token)")
  }

  const normalizedNodeId = normalizeNodeId(nodeId)
  const nodesUrl = `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${normalizedNodeId}`
  const componentsUrl = `https://api.figma.com/v1/files/${fileKey}/components`
  const componentSetsUrl = `https://api.figma.com/v1/files/${fileKey}/component_sets`

  const [nodesPayload, componentsPayload, componentSetsPayload] = await Promise.all([
    fetchJson(nodesUrl, token) as Promise<FigmaNodesResponse>,
    fetchJson(componentsUrl, token) as Promise<FigmaComponentsResponse>,
    fetchJson(componentSetsUrl, token) as Promise<FigmaComponentSetsResponse>,
  ])

  // 组件/组件集名称索引（用于输出更友好）
  const componentNameById = new Map<string, string>()
  const componentSetNameById = new Map<string, string>()
  componentsPayload.meta?.components?.forEach((comp) => {
    if (comp.node_id) {
      componentNameById.set(comp.node_id, comp.name || "")
    }
    if (comp.component_set_id && comp.name) {
      componentSetNameById.set(comp.component_set_id, comp.name)
    }
  })
  componentSetsPayload.meta?.component_sets?.forEach((set) => {
    if (set.node_id) componentSetNameById.set(set.node_id, set.name || "")
  })

  // 收集页面实例
  const instances: FigmaNode[] = []
  Object.values(nodesPayload.nodes || {}).forEach((wrapper) => {
    collectInstances(wrapper?.document, instances)
  })

  // 拉取 SDS 组件库的全部组件/组件集 ID
  const sdsComponentsUrl = `https://api.figma.com/v1/files/${sdsFileKey}/components`
  const sdsComponentSetsUrl = `https://api.figma.com/v1/files/${sdsFileKey}/component_sets`
  const [sdsComponents, sdsComponentSets] = await Promise.all([
    fetchJson(sdsComponentsUrl, token) as Promise<FigmaComponentsResponse>,
    fetchJson(sdsComponentSetsUrl, token) as Promise<FigmaComponentSetsResponse>,
  ])

  const sdsIds = new Set<string>()
  sdsComponents.meta?.components?.forEach((comp) => {
    if (comp.node_id) sdsIds.add(comp.node_id)
    if (comp.component_set_id) sdsIds.add(comp.component_set_id)
  })
  sdsComponentSets.meta?.component_sets?.forEach((set) => {
    if (set.node_id) sdsIds.add(set.node_id)
  })

  const baseUrl = buildBaseUrl(figmaUrl)
  const matched = []
  const unmatched = []

  for (const inst of instances) {
    const componentId = inst.componentId
    const componentSetId = inst.componentSetId
    const hit =
      (componentId && sdsIds.has(componentId)) ||
      (componentSetId && sdsIds.has(componentSetId))

    const row = {
      instanceId: inst.id,
      instanceName: inst.name,
      componentId,
      componentName: componentId ? componentNameById.get(componentId) : undefined,
      componentSetId,
      componentSetName: componentSetId ? componentSetNameById.get(componentSetId) : undefined,
      instanceUrl: inst.id ? `${baseUrl}?node-id=${inst.id.replace(/:/g, "-")}` : undefined,
    }

    if (hit) matched.push(row)
    else unmatched.push(row)
  }

  console.log(
    JSON.stringify(
      {
        sdsFileKey,
        instanceCount: instances.length,
        matchedCount: matched.length,
        unmatchedCount: unmatched.length,
        matched,
        unmatched,
      },
      null,
      2,
    ),
  )
}

main()
