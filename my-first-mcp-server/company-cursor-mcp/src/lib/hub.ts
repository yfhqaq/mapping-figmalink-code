import { CompanyMcpConfig } from "./config.js";
import { expandGlobs } from "./sources/fsGlobs.js";
import { SimpleFileIndex } from "./sources/simpleFileIndex.js";
import { GmeshUiIndexer } from "./indexers/gmeshUi.js";
import { extractTypeSnippetsFromComponentDir } from "./indexers/propsExtractor.js";
import { RagService, stableChunkId } from "./rag/service.js";
import { QdrantVectorStore } from "./rag/qdrantStore.js";
import { StubEmbedder } from "./rag/embedderStub.js";
import type { RagChunk } from "./rag/types.js";
import { XenovaEmbedder } from "./rag/embedderXenova.js";
import { buildGmeshComponentChunks } from "./rag/chunkers/gmeshUiChunker.js";

export type SearchResultItem = {
  id: string;
  title: string;
  kind: "component" | "doc" | "guideline" | "figma";
  source: string;
  score: number;
  snippet?: string;
  uri?: string;
  filePath?: string;
  /**
   * 用于“组件库索引增强”的额外信息（可选）。
   *
   * 为什么放在 meta 里？
   * - 便于保持结构稳定：基础字段固定，增强字段可按需扩展
   * - 初学者更好理解：看到 meta 就知道是“额外信息”
   */
  meta?: {
    exportedTypes?: string[];
    entryFile?: string;
    componentDir?: string;
    storyFiles?: string[];
    styleFiles?: string[];
  };
};

export type ComponentDetails = {
  id: string;
  title?: string;
  description?: string;
  locations: { filePath: string; kind: "source" | "docs" | "spec" }[];
  relatedGuidelines?: SearchResultItem[];
  relatedDocs?: SearchResultItem[];
  /**
   * Props / 类型信息（第一阶段：提取代码片段，方便人类阅读）
   *
   * 后续可以扩展为：
   * - 解析 props 字段结构
   * - 默认值
   * - 运行时 props 校验（如 zod/propTypes）
   */
  props?: {
    typeSnippets: {
      typeName: string;
      filePath: string;
      snippet: string;
    }[];
  };
  notes?: string;
};

export type GuidelinesResult = {
  topic: string;
  text: string;
  references?: SearchResultItem[];
};

type SearchInput = { query: string; limit: number };

/**
 * 这里是“知识吸收层”的统一入口。
 *
 * 现在先做成可扩展的骨架：
 * - 后续可以接入：Figma exports / design tokens / Code Connect mapping / 内网文档 / 向量检索等
 * - tool 实现只调用 hub 的方法，便于演进和测试
 */
export function createKnowledgeHub(config: CompanyMcpConfig) {
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

  /**
   * RAG 初始化（可选）
   *
   * - enabled=false：不启动向量检索
   * - enabled=true：初始化 Qdrant collection（如果不存在会创建）
   *
   * 现在 embedding 用 stub（占位），后续你接入真实 embedding 后再打开 enabled。
   */
  const rag =
    config.rag.enabled
      ? new RagService({
          // 根据配置选择 embedder：
          // - stub：占位（不产生真实 embedding）
          // - xenova：本地开源 embedding（真实可用）
          embedder:
            config.rag.embedding.provider === "xenova"
              ? new XenovaEmbedder({
                  model: config.rag.embedding.model,
                  dimension: config.rag.embedding.dimension,
                  localFilesOnly: config.rag.embedding.localFilesOnly,
                  cacheDir: config.rag.embedding.cacheDir,
                })
              : new StubEmbedder(config.rag.embedding.dimension),
          store: new QdrantVectorStore({
            url: config.rag.qdrant.url,
            apiKey: config.rag.qdrant.apiKey,
            collection: config.rag.qdrant.collection,
            dimension: config.rag.embedding.dimension,
          }),
        })
      : null;

  const initPromise = (async () => {
    await Promise.all([
      docsIndex.init(),
      figmaIndex.init(),
      gmesh.init(),
      rag?.init() ?? Promise.resolve(),
    ]);
  })();

  return {
    async _ensureInit() {
      await initPromise;
    },

    async searchComponents(input: SearchInput): Promise<SearchResultItem[]> {
      await initPromise;

      const limit = input.limit;

      // 使用“带分数”的搜索：这样返回给 Cursor/LLM 的结果排序更合理
      // （完全匹配 > 前缀匹配 > 包含匹配 > 类型名命中）
      const gmeshHits = gmesh.searchScored(input.query, Math.max(10, limit));
      const docHits = await docsIndex.search(input.query, Math.max(10, limit));
      const figmaHits = await figmaIndex.search(input.query, Math.max(10, limit));

      const results: SearchResultItem[] = [];

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
          snippet:
            it.exportedTypes.length > 0
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

    async getComponent(input: { id: string }): Promise<ComponentDetails> {
      await initPromise;

      const g = gmesh.get(input.id);
      if (g) {
        // 关键增强：从组件目录中把 Props/相关 type 的定义片段抽取出来
        const typeSnippets =
          g.componentDir && g.exportedTypes.length > 0
            ? extractTypeSnippetsFromComponentDir(g.componentDir, g.exportedTypes, {
                maxFilesPerComponent: 120,
                maxLinesPerSnippet: 140,
              })
            : [];

        const locations: ComponentDetails["locations"] = [];
        if (g.entryFile) locations.push({ filePath: g.entryFile, kind: "source" });
        for (const f of g.storyFiles) locations.push({ filePath: f, kind: "docs" });
        for (const f of g.styleFiles) locations.push({ filePath: f, kind: "source" });

        return {
          id: g.exportName,
          title: g.exportName,
          locations,
          props: {
            typeSnippets,
          },
          notes:
            `组件库索引（gmesh-ui）命中。\n` +
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
        notes:
          "未命中组件库索引：当前只返回命中文档/文件。后续会补齐：解析导出、props、示例、token、figma mapping。",
      };
    },

    async getGuidelines(input: { topic: string }): Promise<GuidelinesResult> {
      await initPromise;

      const hits = await docsIndex.search(input.topic, 5);
      return {
        topic: input.topic,
        text:
          hits[0]?.snippet ??
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

    async searchDocs(input: SearchInput): Promise<SearchResultItem[]> {
      await initPromise;

      // 1) 如果开启了 RAG（并且你已经把 docs chunks 写进 Qdrant），优先走向量检索
      if (rag) {
        const results = await rag.search(input.query, input.limit);
        if (results.length > 0) {
          return results.map((r) => ({
            id: r.id,
            title: r.meta.title ?? r.id,
            kind: "doc",
            source: "rag:qdrant",
            score: r.score,
            snippet: r.text.slice(0, 240),
            uri: r.meta.uri,
            filePath: r.meta.filePath,
            meta: {
              entryFile: r.meta.filePath,
              exportedTypes: r.meta.tags,
            },
          }));
        }
      }

      // 2) 没开 RAG 或者 RAG 没命中，就退回全文检索
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

    async getGuidelinesIndex(): Promise<{ topics: string[] }> {
      return { topics: ["a11y", "tokens", "naming", "button", "form"] };
    },

    /**
     * （预留）把文档写入向量库：
     *
     * 目前我们只提供一个最简单的“把 docsIndex 的文件内容当作 chunk”的方式。
     * 后续你会想升级：
     * - md/mdx 按标题分块
     * - 代码按组件/函数分块
     */
    async ragReindexDocs(): Promise<{ upserted: number }> {
      if (!rag) return { upserted: 0 };

      // 这里复用 docsIndex 的底层文件列表：简单粗暴当 chunk
      // （为了教学清晰，先这样；后续再换更专业的 chunker）
      const filePaths = expandGlobs(config.docs.paths);
      const chunks: RagChunk[] = [];

      for (const filePath of filePaths) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const fs = await import("node:fs");
          const text = fs.readFileSync(filePath, "utf8");

          const meta: RagChunk["meta"] = {
            sourceKind: "docs",
            title: filePath.split("/").pop(),
            filePath,
            uri: `file://${filePath}`,
          };

          chunks.push({
            id: stableChunkId({ text, meta }),
            text,
            meta,
          });
        } catch {
          // ignore bad file
        }
      }

      await rag.upsertChunks(chunks);
      return { upserted: chunks.length };
    },

    /**
     * 把 gmesh-ui 组件库写入向量库（RAG）
     *
     * 成熟经验（为什么要这样做）：
     * - 组件库“结构化索引”负责：组件名/入口/Props 类型名（精确）
     * - 向量索引负责：语义检索（“危险按钮/带 tooltip 的按钮/按钮 loading 防抖”）
     *
     * 所以我们把每个组件拆成多个 chunk：
     * - summary
     * - props snippets
     * - stories/mdx
     * - entry preview
     */
    async ragReindexComponents(): Promise<{ upserted: number }> {
      if (!rag) return { upserted: 0 };
      await initPromise;

      const components = gmesh.listComponents();
      const chunks: RagChunk[] = [];

      for (const c of components) {
        // 取出 props snippets（复用我们之前的抽取器）
        const typeSnippets =
          c.componentDir && c.exportedTypes.length > 0
            ? extractTypeSnippetsFromComponentDir(c.componentDir, c.exportedTypes, {
                maxFilesPerComponent: 120,
                maxLinesPerSnippet: 140,
              })
            : [];

        chunks.push(
          ...buildGmeshComponentChunks({
            exportName: c.exportName,
            entryFile: c.entryFile,
            componentDir: c.componentDir,
            exportedTypes: c.exportedTypes,
            storyFiles: c.storyFiles,
            styleFiles: c.styleFiles,
            typeSnippets,
          })
        );
      }

      await rag.upsertChunks(chunks);
      return { upserted: chunks.length };
    },
  };
}


