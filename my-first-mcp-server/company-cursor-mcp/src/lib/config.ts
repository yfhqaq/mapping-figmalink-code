import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

const ConfigSchema = z.object({
  companyName: z.string().min(1).default("Company"),
  figma: z.object({
    specPaths: z.array(z.string().min(1)).default([]),
  }),
  componentLibrary: z.object({
    repoRoot: z.string().min(1),
    includeGlobs: z.array(z.string().min(1)).default(["**/*.{ts,tsx,js,jsx,md,mdx}"]),
    excludeGlobs: z
      .array(z.string().min(1))
      .default(["**/node_modules/**", "**/dist/**", "**/.next/**"]),
  }),
  docs: z.object({
    paths: z.array(z.string().min(1)).default([]),
  }),
  /**
   * RAG（向量检索）配置：Qdrant + Embedding
   *
   * 初学者提示：
   * - enabled=false 时，系统会退回到“全文/规则检索”
   * - 等你把 Qdrant/embedding 配好再打开
   */
  rag: z
    .object({
      enabled: z.boolean().default(false),
      qdrant: z.object({
        url: z.string().min(1).default("http://localhost:6333"),
        apiKey: z.string().min(1).optional(),
        collection: z.string().min(1).default("company-cursor-mcp"),
      }),
      embedding: z.object({
        /**
         * 这里先做“占位”：你后续可以接入 OpenAI/Azure/公司内部服务
         * stub: 使用 StubEmbedder（不会报错，但检索无意义）
         */
        provider: z.enum(["stub", "xenova"]).default("stub"),
        /**
         * xenova provider 的模型 id（HuggingFace 风格）
         * 推荐：
         * - Xenova/all-MiniLM-L6-v2  (384)
         * - Xenova/bge-small-en-v1.5 (384)
         */
        model: z.string().min(1).default("Xenova/all-MiniLM-L6-v2"),
        /**
         * 是否仅本地加载模型文件（离线/内网场景）
         */
        localFilesOnly: z.boolean().default(false),
        /**
         * 模型缓存目录（可选）
         */
        cacheDir: z.string().min(1).optional(),
        dimension: z.number().int().min(2).default(8),
      }),
    })
    .default({
      enabled: false,
      qdrant: { url: "http://localhost:6333", collection: "company-cursor-mcp" },
      embedding: {
        provider: "stub",
        model: "Xenova/all-MiniLM-L6-v2",
        localFilesOnly: false,
        dimension: 8
      },
    }),
});

export type CompanyMcpConfig = z.infer<typeof ConfigSchema>;

function readJsonFile(filePath: string): unknown {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

export function loadConfig(): CompanyMcpConfig {
  /**
   * 配置文件定位策略（尽量“少踩坑”）：
   *
   * 1) 如果用户显式设置了环境变量 `COMPANY_MCP_CONFIG`，就以它为准（最明确）
   * 2) 否则尝试下面这些常见位置：
   *    - 当前工作目录（process.cwd()）下的 company-mcp.config.json
   *    - **程序所在目录**（build/lib/config.js）往上两级：company-cursor-mcp/company-mcp.config.json
   *
   * 为什么要支持“程序所在目录”？
   * - Cursor 启动 MCP 时，cwd 往往不是你的项目目录
   * - 如果只看 cwd，就会经常找不到配置文件
   */
  const envPath = process.env.COMPANY_MCP_CONFIG?.trim();

  const candidates: string[] = [];
  if (envPath) candidates.push(envPath);

  // candidate A: cwd/company-mcp.config.json
  candidates.push(path.join(process.cwd(), "company-mcp.config.json"));

  // candidate B: projectRoot/company-mcp.config.json
  // 当前文件在 build/lib/config.js（运行时），所以向上两级一般能回到 build/ 的上级（即 company-cursor-mcp/）
  const projectRootGuess = path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    "..",
    "..",
    ".."
  );
  candidates.push(path.join(projectRootGuess, "company-mcp.config.json"));

  const configPath = candidates.find((p) => fs.existsSync(p));
  if (!configPath) {
    throw new Error(
      [
        "Config file not found.",
        "Fix options:",
        "  1) Set env COMPANY_MCP_CONFIG=/absolute/path/to/company-mcp.config.json",
        "  2) Or create company-mcp.config.json in one of these locations:",
        ...candidates.map((p) => `     - ${p}`),
      ].join("\n")
    );
  }

  const cfg = readJsonFile(configPath);
  const parsed = ConfigSchema.parse(cfg);

  // Normalize relative paths to be relative to the config file directory.
  const baseDir = path.dirname(configPath);
  const resolveMaybeRelative = (p: string) =>
    path.isAbsolute(p) ? p : path.resolve(baseDir, p);

  return {
    ...parsed,
    componentLibrary: {
      ...parsed.componentLibrary,
      repoRoot: resolveMaybeRelative(parsed.componentLibrary.repoRoot),
    },
    docs: {
      ...parsed.docs,
      paths: parsed.docs.paths.map(resolveMaybeRelative),
    },
    figma: {
      ...parsed.figma,
      specPaths: parsed.figma.specPaths.map(resolveMaybeRelative),
    },
  };
}


