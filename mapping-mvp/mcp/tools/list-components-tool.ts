import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { z } from "zod"
import { listComponentsFromFigmaData, type InputData } from "./list-components-core"

export function registerListComponentsTool(server: McpServer) {
  server.tool(
    "list_components_in_node",
    "List component IDs and UX component names used in the given Figma data.",
    {
      figmaData: z.any(),
    },
    async (params: { figmaData: InputData | string }) => {
      const figmaData =
        typeof params.figmaData === "string"
          ? (JSON.parse(params.figmaData) as InputData)
          : (params.figmaData as InputData)

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
