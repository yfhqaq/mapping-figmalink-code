export const scopes = [
  "Table.columns",
  "Table.toolBarRender",
  "Table.search",
  "Form.items",
  "Toolbar.actions",
  "SptTable.columns",
  "SptTable.toolbarRender",
  "SptTable.search",
  "SptTable.component",
  "SptTabs.items",
  "SptPageContainer.wrap",
  "SptPageContainer.tabs",
] as const

export type Scope = (typeof scopes)[number]
