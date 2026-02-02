# ComponentId Cache

Purpose:
- Avoid re-fetching the full component registry for every page match.
- Provide a local lookup from `componentId` / `componentSetId` to names and file keys.

How to fill:
1) Use MCP to fetch the UX component library file metadata (components + componentSets).
2) Copy the mapping into `component-index.json` under the file key.

Suggested structure:
```
{
  "version": 1,
  "files": {
    "FILE_KEY": {
      "components": {
        "25:414": { "name": "类型=常规 Tab, 选中=Yes", "componentSetId": "25:407" }
      },
      "componentSets": {
        "25:407": { "name": ".Tab元素" }
      }
    }
  }
}
```

How it is used:
- When matching a business page, read `INSTANCE.componentId`.
- Look up `componentId` in this cache to get the stable component name.
- Map that name (or componentSetId) to a front-end component via `.figma.tsx`.
