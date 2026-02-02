export type SnippetTemplate = {
  code: Record<string, unknown>
}

export type BusinessMappingType = "snippet" | "component" | "description"

export type UxComponentRef = {
  name: string
  componentSetId?: string
  componentId?: string
  figmaNode?: string
}
