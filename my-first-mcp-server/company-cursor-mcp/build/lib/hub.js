import { expandGlobs } from "./sources/fsGlobs.js";
import { SimpleFileIndex } from "./sources/simpleFileIndex.js";
import { GmeshUiIndexer } from "./indexers/gmeshUi.js";
import { extractTypeSnippetsFromComponentDir } from "./indexers/propsExtractor.js";
/**
 * 这里是“知识吸收层”的统一入口。
 *
 * 现在先做成可扩展的骨架：
 * - 后续可以接入：Figma exports / design tokens / Code Connect mapping / 内网文档 / 向量检索等
 * - tool 实现只调用 hub 的方法，便于演进和测试
 */
export function createKnowledgeHub(config) {
    const docsFiles = expandGlobs(config.docs.paths);
    const figmaSpecFiles = expandGlobs(config.figma.specPaths);
    const docsIndex = new SimpleFileIndex({
        name: "docs",
        kind: "docs",
        filePaths: docsFiles,
    });
    const figmaIndex = new SimpleFileIndex({
        name: "figmaSpec",
        kind: "figmaSpec",
        filePaths: figmaSpecFiles,
    });
    // Enhanced: gmesh-ui export-aware indexer (fast + high quality)
    const gmesh = new GmeshUiIndexer(config.componentLibrary.repoRoot);
    const initPromise = (async () => {
        await Promise.all([docsIndex.init(), figmaIndex.init(), gmesh.init()]);
    })();
    return {
        async _ensureInit() {
            await initPromise;
        },
        async searchComponents(input) {
            await initPromise;
            const limit = input.limit;
            // 使用“带分数”的搜索：这样返回给 Cursor/LLM 的结果排序更合理
            // （完全匹配 > 前缀匹配 > 包含匹配 > 类型名命中）
            const gmeshHits = gmesh.searchScored(input.query, Math.max(10, limit));
            const docHits = await docsIndex.search(input.query, Math.max(10, limit));
            const figmaHits = await figmaIndex.search(input.query, Math.max(10, limit));
            const results = [];
            // --- 1) 组件库命中（高优先级） ---
            // 对于 gmesh-ui，我们不仅返回名字，还尽量把：
            // - 入口文件（entryFile）
            // - 相关 Props 类型名（exportedTypes）
            // - story/style 文件
            // 一起带上，方便 Cursor 在生成代码时“看得到规范”和“找得到示例”。
            for (const hit of gmeshHits) {
                const it = hit.item;
                results.push({
                    id: it.exportName,
                    title: it.exportName,
                    kind: "component",
                    source: "gmesh-ui",
                    score: hit.score,
                    snippet: it.exportedTypes.length > 0
                        ? `reason=${hit.reason}; types: ${it.exportedTypes.join(", ")}`
                        : undefined,
                    uri: it.entryFile ? `file://${it.entryFile}` : undefined,
                    filePath: it.entryFile,
                    meta: {
                        exportedTypes: it.exportedTypes,
                        entryFile: it.entryFile,
                        componentDir: it.componentDir,
                        storyFiles: it.storyFiles,
                        styleFiles: it.styleFiles,
                    },
                });
            }
            // --- 2) docs/figma 命中（低优先级） ---
            for (const h of docHits) {
                results.push({
                    id: h.chunk.id,
                    title: h.chunk.title ?? h.chunk.id,
                    kind: "doc",
                    source: h.chunk.kind,
                    score: h.score,
                    snippet: h.snippet,
                    uri: h.chunk.uri,
                    filePath: h.chunk.filePath,
                });
            }
            for (const h of figmaHits) {
                results.push({
                    id: h.chunk.id,
                    title: h.chunk.title ?? h.chunk.id,
                    kind: "figma",
                    source: h.chunk.kind,
                    score: h.score,
                    snippet: h.snippet,
                    uri: h.chunk.uri,
                    filePath: h.chunk.filePath,
                });
            }
            return results.slice(0, limit);
        },
        async getComponent(input) {
            await initPromise;
            const g = gmesh.get(input.id);
            if (g) {
                // 关键增强：从组件目录中把 Props/相关 type 的定义片段抽取出来
                const typeSnippets = g.componentDir && g.exportedTypes.length > 0
                    ? extractTypeSnippetsFromComponentDir(g.componentDir, g.exportedTypes, {
                        maxFilesPerComponent: 120,
                        maxLinesPerSnippet: 140,
                    })
                    : [];
                const locations = [];
                if (g.entryFile)
                    locations.push({ filePath: g.entryFile, kind: "source" });
                for (const f of g.storyFiles)
                    locations.push({ filePath: f, kind: "docs" });
                for (const f of g.styleFiles)
                    locations.push({ filePath: f, kind: "source" });
                return {
                    id: g.exportName,
                    title: g.exportName,
                    locations,
                    props: {
                        typeSnippets,
                    },
                    notes: `组件库索引（gmesh-ui）命中。\n` +
                        `types: ${g.exportedTypes.join(", ") || "(none)"}\n` +
                        `sourceExportPath: ${g.sourceExportPath ?? "(unknown)"}`,
                };
            }
            const chunk = (await figmaIndex.getById(input.id)) ?? (await docsIndex.getById(input.id));
            return {
                id: input.id,
                title: chunk?.title ?? input.id,
                description: chunk?.text ? chunk.text.slice(0, 200) : undefined,
                locations: chunk?.filePath
                    ? [{ filePath: chunk.filePath, kind: chunk.kind === "docs" ? "docs" : chunk.kind === "figmaSpec" ? "spec" : "source" }]
                    : [],
                notes: "未命中组件库索引：当前只返回命中文档/文件。后续会补齐：解析导出、props、示例、token、figma mapping。",
            };
        },
        async getGuidelines(input) {
            await initPromise;
            const hits = await docsIndex.search(input.topic, 5);
            return {
                topic: input.topic,
                text: hits[0]?.snippet ??
                    `TODO: implement guidelines lookup for topic="${input.topic}"`,
                references: hits.map((h) => ({
                    id: h.chunk.id,
                    title: h.chunk.title ?? h.chunk.id,
                    kind: "guideline",
                    source: h.chunk.kind,
                    score: h.score,
                    snippet: h.snippet,
                    uri: h.chunk.uri,
                    filePath: h.chunk.filePath,
                })),
            };
        },
        async searchDocs(input) {
            await initPromise;
            const hits = await docsIndex.search(input.query, input.limit);
            return hits.map((h) => ({
                id: h.chunk.id,
                title: h.chunk.title ?? h.chunk.id,
                kind: "doc",
                source: h.chunk.kind,
                score: h.score,
                snippet: h.snippet,
                uri: h.chunk.uri,
                filePath: h.chunk.filePath,
            }));
        },
        async getGuidelinesIndex() {
            return { topics: ["a11y", "tokens", "naming", "button", "form"] };
        },
    };
}
