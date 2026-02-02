---
title: Figma Link + Image to Code Workflow
description: Orchestrate UI-to-code from links and/or images with MCP support.
globs:
  - "**/*"
---

When a user message includes a Figma link and/or UI screenshot(s), follow this workflow.

Priority rules:
- If a Figma link is present, attempt link-based parsing first.
- If link parsing or image fetching fails, report the failure and ask for a screenshot.
- If only screenshots are present, proceed with image-based analysis.

Workflow:
1) Parse Figma link (if provided):
   - Use MCP to fetch node data (`mcp_Framelink_Figma_MCP_get_figma_data`).
   - If node-id is present, set depth=4 for page analysis; depth=2 for single components.
   - If link parsing fails, report and request a screenshot.
2) Fetch image from Figma link (if possible):
   - If MCP provides image nodes, use image download tool to fetch a PNG for visual context.
   - If image fetch fails, report and request a screenshot.
3) UI region decomposition:
   - Use MCP node data (preferred) and/or image to identify major regions
     (header, filters, table, toolbar, pagination, modals, etc.).
4) Component/Business mapping:
   - Map regions to components using existing mapping context:
     - `mapping-mvp/llm-context.md`
     - `mapping-mvp/src/figma/*.figma.tsx`
   - Apply composite rules when multiple UX components map to one code component.
5) Code generation:
   - Generate code using mapped components and inferred props.
   - If ambiguous, emit best-effort code and clearly list unknowns.

This workflow enhances code generation using mapping context; it should not restrict
creative code generation when mapping data is missing.
If the user requests to disable this behavior, do not run this workflow until re-enabled.
