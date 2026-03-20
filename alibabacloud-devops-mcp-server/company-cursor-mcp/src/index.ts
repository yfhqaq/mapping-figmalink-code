#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { loadConfig } from "./lib/config.js";
import { createKnowledgeHub } from "./lib/hub.js";

async function main() {
  const config = loadConfig();
  const hub = await createKnowledgeHub(config);

  const server = new McpServer({
    name: "company-cursor-mcp",
    version: "0.1.0",
  });

  /**
   * Tool naming compatibility:
   *
   * - This MCP originally used "dot" names (component.search).
   * - Some clients (or other MCP servers) expect "underscore" names (component_search).
   * - To avoid breaking either side, we register BOTH aliases mapping to the same handlers.
   */

  // --- Tools: component search/get ---
  const componentSearchDef = {
    title: "Search components",
    description:
      "Search the company component library, specs, and docs for relevant components, patterns, and usage.",
    inputSchema: {
      query: z.string().min(1).describe("Search query"),
      limit: z.number().int().min(1).max(50).default(10).optional(),
    },
  };
  const componentSearchHandler = async ({ query, limit }: { query: string; limit?: number }, _extra: unknown) => {
    const results = await hub.searchComponents({ query, limit: limit ?? 10 });
    return {
      content: [{ type: "text" as const, text: JSON.stringify(results, null, 2) }],
      structuredContent: { results },
    };
  };
  server.registerTool("component.search", componentSearchDef, componentSearchHandler);
  server.registerTool("component_search", componentSearchDef, componentSearchHandler);

  const componentGetDef = {
    title: "Get component details",
    description: "Fetch component details (props, examples, file paths, related guidelines).",
    inputSchema: {
      id: z.string().min(1).describe("Component id/name returned from component.search"),
    },
  };
  const componentGetHandler = async ({ id }: { id: string }, _extra: unknown) => {
    const details = await hub.getComponent({ id });
    return {
      content: [{ type: "text" as const, text: JSON.stringify(details, null, 2) }],
      structuredContent: { details },
    };
  };
  server.registerTool("component.get", componentGetDef, componentGetHandler);
  server.registerTool("component_get", componentGetDef, componentGetHandler);

  // --- Tools: guidelines/docs ---
  const guidelinesGetDef = {
    title: "Get guidelines",
    description: "Get relevant company guidelines for components, styling, naming, accessibility, etc.",
    inputSchema: {
      topic: z.string().min(1).describe("Topic, e.g. 'button', 'a11y', 'tokens'"),
    },
  };
  const guidelinesGetHandler = async ({ topic }: { topic: string }, _extra: unknown) => {
    const guideline = await hub.getGuidelines({ topic });
    return {
      content: [{ type: "text" as const, text: guideline.text }],
      structuredContent: { guideline },
    };
  };
  server.registerTool("guidelines.get", guidelinesGetDef, guidelinesGetHandler);
  server.registerTool("guidelines_get", guidelinesGetDef, guidelinesGetHandler);

  const docsSearchDef = {
    title: "Search docs",
    description: "Search internal docs/knowledge base for relevant snippets and references.",
    inputSchema: {
      query: z.string().min(1),
      limit: z.number().int().min(1).max(50).default(10).optional(),
    },
  };
  const docsSearchHandler = async ({ query, limit }: { query: string; limit?: number }, _extra: unknown) => {
    const results = await hub.searchDocs({ query, limit: limit ?? 10 });
    return {
      content: [{ type: "text" as const, text: JSON.stringify(results, null, 2) }],
      structuredContent: { results },
    };
  };
  server.registerTool("docs.search", docsSearchDef, docsSearchHandler);
  server.registerTool("docs_search", docsSearchDef, docsSearchHandler);

  // --- Tools: RAG index maintenance (optional) ---
  // 初学者说明：
  // - RAG 的“检索”要先有“索引”
  // - 这个工具用于把 docs（config.docs.paths）写入向量库
  // - 现在 embedding 是 stub，占位；你接入真实 embedding 后再启用 rag.enabled
  server.registerTool(
    "rag.reindexDocs",
    {
      title: "Reindex docs into vector store",
      description:
        "Build/update vector index for docs. Requires rag.enabled=true in config.",
      inputSchema: {},
    },
    async (_args, _extra) => {
      const result = await hub.ragReindexDocs();
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        structuredContent: { result },
      };
    }
  );

  server.registerTool(
    "rag.reindexComponents",
    {
      title: "Reindex component library into vector store",
      description:
        "Build/update vector index for gmesh-ui component library. Requires rag.enabled=true in config.",
      inputSchema: {},
    },
    async (_args, _extra) => {
      const result = await hub.ragReindexComponents();
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        structuredContent: { result },
      };
    }
  );

  // --- Resources (basic skeleton) ---
  server.registerResource(
    "company-guidelines",
    "company://guidelines",
    { description: "Company engineering/design guidelines (index)" },
    async (_uri) => {
      const index = await hub.getGuidelinesIndex();
      return {
        contents: [
          {
            uri: "company://guidelines",
            mimeType: "application/json",
            text: JSON.stringify(index, null, 2),
          },
        ],
      };
    }
  );

  // Start stdio server for Cursor integration.
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Important: write operational logs to stderr to avoid corrupting stdio JSON-RPC.
  console.error(
    `[company-cursor-mcp] running. company=${config.companyName} docs=${config.docs.paths.length} figmaSpecPaths=${config.figma.specPaths.length}`
  );
}

main().catch((err) => {
  console.error("[company-cursor-mcp] fatal:", err);
  process.exit(1);
});


