export const scopes = [
  "Table.columns",
  "Table.toolBarRender",
  "Table.search",
  "Form.items",
  "Toolbar.actions",
] as const

export type Scope = (typeof scopes)[number]
