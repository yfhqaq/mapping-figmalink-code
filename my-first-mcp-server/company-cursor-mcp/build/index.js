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
    // --- Tools: component search/get ---
    server.registerTool("component.search", {
        title: "Search components",
        description: "Search the company component library, specs, and docs for relevant components, patterns, and usage.",
        inputSchema: {
            query: z.string().min(1).describe("Search query"),
            limit: z.number().int().min(1).max(50).default(10).optional(),
        },
    }, async ({ query, limit }, _extra) => {
        const results = await hub.searchComponents({ query, limit: limit ?? 10 });
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(results, null, 2),
                },
            ],
            structuredContent: { results },
        };
    });
    server.registerTool("component.get", {
        title: "Get component details",
        description: "Fetch component details (props, examples, file paths, related guidelines).",
        inputSchema: {
            id: z
                .string()
                .min(1)
                .describe("Component id/name returned from component.search"),
        },
    }, async ({ id }, _extra) => {
        const details = await hub.getComponent({ id });
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(details, null, 2),
                },
            ],
            structuredContent: { details },
        };
    });
    // --- Tools: guidelines/docs ---
    server.registerTool("guidelines.get", {
        title: "Get guidelines",
        description: "Get relevant company guidelines for components, styling, naming, accessibility, etc.",
        inputSchema: {
            topic: z.string().min(1).describe("Topic, e.g. 'button', 'a11y', 'tokens'"),
        },
    }, async ({ topic }, _extra) => {
        const guideline = await hub.getGuidelines({ topic });
        return {
            content: [{ type: "text", text: guideline.text }],
            structuredContent: { guideline },
        };
    });
    server.registerTool("docs.search", {
        title: "Search docs",
        description: "Search internal docs/knowledge base for relevant snippets and references.",
        inputSchema: {
            query: z.string().min(1),
            limit: z.number().int().min(1).max(50).default(10).optional(),
        },
    }, async ({ query, limit }, _extra) => {
        const results = await hub.searchDocs({ query, limit: limit ?? 10 });
        return {
            content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
            structuredContent: { results },
        };
    });
    // --- Resources (basic skeleton) ---
    server.registerResource("company-guidelines", "company://guidelines", { description: "Company engineering/design guidelines (index)" }, async (_uri) => {
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
    });
    // Start stdio server for Cursor integration.
    const transport = new StdioServerTransport();
    await server.connect(transport);
    // Important: write operational logs to stderr to avoid corrupting stdio JSON-RPC.
    console.error(`[company-cursor-mcp] running. company=${config.companyName} docs=${config.docs.paths.length} figmaSpecPaths=${config.figma.specPaths.length}`);
}
main().catch((err) => {
    console.error("[company-cursor-mcp] fatal:", err);
    process.exit(1);
});
