This MCP provides three tools to help an LLM use the mapping pipeline.

Tools

1) get_mapping_usage_md
- Purpose: return this usage document.
- Output: Markdown string.

2) get_mapping_context_json
- Purpose: return the generated mapping context JSON.
- Input:
  - mappingPath (optional): custom path to mapping JSON.
  - includeDictionary (optional): also return the dictionary JSON.
- Output: JSON string (mapping-llm.json, optionally with dictionary).

3) match_and_trim_context
- Purpose: match Figma instances against the mapping rules and return a trimmed context.
- Input:
  - figmaData: JSON object from Figma MCP or API.
  - mappingPath (optional): custom path to mapping JSON.
  - fileKey (optional): used to build links in result.
  - includeBusinessMappings (optional): include matched business mappings.
- Output: JSON string containing:
  - stats: total instances, matched instances, matched rules.
  - matches: per-instance match results (componentId/componentSetId -> UX components).
  - trimmedContext: minimal mapping context for the LLM.

Notes
- The MCP does full matching internally and only trims the context for LLM input.
- If the LLM needs more context, call get_mapping_context_json for the full rules.

4) list_components_in_node
- Purpose: list component IDs and UX component names from given Figma JSON.
- Input:
  - figmaData: JSON object from Figma MCP or API.
- Output: JSON string with component list and counts.

5) list_components_from_figma_url
- Purpose: fetch Figma data by URL, then list component IDs and UX component names.
- Input:
  - figmaUrl: Figma node URL (must include node-id).
  - token (optional): Figma API token; falls back to FIGMA_TOKEN/FIGMA_API_KEY env.
- Output: JSON string with component list and counts.
