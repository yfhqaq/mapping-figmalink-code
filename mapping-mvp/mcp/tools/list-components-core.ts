export type FigmaNode = {
  id?: string
  name?: string
  type?: string
  componentId?: string
  componentSetId?: string
  children?: FigmaNode[]
}

export type FigmaNodesMap = Record<string, { document?: FigmaNode }>

export type FigmaComponent = {
  id?: string
  name?: string
  componentSetId?: string
}

export type FigmaComponentSet = {
  id?: string
  name?: string
}

export type InputData = {
  document?: FigmaNode
  nodes?: FigmaNode[] | FigmaNodesMap
  components?: Record<string, FigmaComponent>
  componentSets?: Record<string, FigmaComponentSet>
}

type ComponentRow = {
  componentId?: string
  componentName?: string
  componentSetId?: string
  componentSetName?: string
  count: number
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

function buildComponentMaps(data: InputData) {
  const componentNameById = new Map<string, string>()
  const componentSetNameById = new Map<string, string>()
  const componentSetIdByComponentId = new Map<string, string>()

  const components = data.components ? Object.values(data.components) : []
  const componentSets = data.componentSets ? Object.values(data.componentSets) : []

  components.forEach((comp) => {
    if (comp.id) {
      componentNameById.set(comp.id, comp.name || "")
      if (comp.componentSetId) {
        componentSetIdByComponentId.set(comp.id, comp.componentSetId)
      }
    }
  })

  componentSets.forEach((set) => {
    if (set.id) {
      componentSetNameById.set(set.id, set.name || "")
    }
  })

  return { componentNameById, componentSetNameById, componentSetIdByComponentId }
}

export function listComponentsFromFigmaData(figmaData: InputData) {
  const instances = collectAllInstances(figmaData)
  const { componentNameById, componentSetNameById, componentSetIdByComponentId } =
    buildComponentMaps(figmaData)

  const counts = new Map<string, number>()
  const rows = new Map<string, ComponentRow>()

  instances.forEach((inst) => {
    const componentId = inst.componentId
    const componentSetId =
      inst.componentSetId || (componentId ? componentSetIdByComponentId.get(componentId) : undefined)
    const componentName = componentId ? componentNameById.get(componentId) : undefined
    const componentSetName = componentSetId ? componentSetNameById.get(componentSetId) : undefined

    const key = componentId ? `component:${componentId}` : componentSetId ? `set:${componentSetId}` : inst.id || ""
    if (!key) return

    const nextCount = (counts.get(key) || 0) + 1
    counts.set(key, nextCount)

    rows.set(key, {
      componentId,
      componentName: componentName || inst.name,
      componentSetId,
      componentSetName,
      count: nextCount,
    })
  })

  const components = Array.from(rows.values()).sort((a, b) => b.count - a.count)

  const stats = {
    totalInstances: instances.length,
    uniqueComponents: components.length,
  }

  return { stats, components }
}
