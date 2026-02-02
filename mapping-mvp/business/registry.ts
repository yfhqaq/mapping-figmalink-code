import { Scope } from "./scopes"
import { BusinessMappingType, SnippetTemplate, UxComponentRef } from "./templates"

export type BusinessMapping = {
  id: string
  figmaNode: string
  scope: Scope
  description: string
  mappingType: BusinessMappingType
  uxComponent?: UxComponentRef
  snippetTemplate?: SnippetTemplate
}

export function defineBusinessMapping(mapping: BusinessMapping): BusinessMapping {
  return mapping
}
