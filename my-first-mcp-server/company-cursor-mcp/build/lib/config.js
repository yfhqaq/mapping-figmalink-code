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
});
function readJsonFile(filePath) {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
}
export function loadConfig() {
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
    const candidates = [];
    if (envPath)
        candidates.push(envPath);
    // candidate A: cwd/company-mcp.config.json
    candidates.push(path.join(process.cwd(), "company-mcp.config.json"));
    // candidate B: projectRoot/company-mcp.config.json
    // 当前文件在 build/lib/config.js（运行时），所以向上两级一般能回到 build/ 的上级（即 company-cursor-mcp/）
    const projectRootGuess = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..", "..", "..");
    candidates.push(path.join(projectRootGuess, "company-mcp.config.json"));
    const configPath = candidates.find((p) => fs.existsSync(p));
    if (!configPath) {
        throw new Error([
            "Config file not found.",
            "Fix options:",
            "  1) Set env COMPANY_MCP_CONFIG=/absolute/path/to/company-mcp.config.json",
            "  2) Or create company-mcp.config.json in one of these locations:",
            ...candidates.map((p) => `     - ${p}`),
        ].join("\n"));
    }
    const cfg = readJsonFile(configPath);
    const parsed = ConfigSchema.parse(cfg);
    // Normalize relative paths to be relative to the config file directory.
    const baseDir = path.dirname(configPath);
    const resolveMaybeRelative = (p) => path.isAbsolute(p) ? p : path.resolve(baseDir, p);
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
