import type { RagChunk, RagSearchHit, VectorStore } from "./types.js";

/**
 * Qdrant Vector Store（向量存储实现）
 *
 * 这里做的事情：
 * - 确保 collection 存在（按 embedding 维度创建）
 * - upsert：把 (vector + payload) 写进去
 * - search：按向量相似度查询
 *
 * Qdrant 的核心概念：
 * - collection：类似“表”
 * - point：一条记录，包含 id + vector + payload
 * - payload：你附带的元数据（filePath/componentName/tags…）
 */

export type QdrantStoreOptions = {
    url: string; // 例如 http://localhost:6333
    apiKey?: string;
    collection: string;
    dimension: number;
};

export class QdrantVectorStore implements VectorStore {
    /**
     * 这里用 Promise<any> 的原因：
     * - 让项目在“还没 install @qdrant/js-client-rest”时也能通过 TypeScript（避免编辑器红）
     * - rag.enabled=false 时完全不会用到 Qdrant，这样框架可先跑通
     * - 真要用 RAG 时，执行 pnpm install 后就能正常工作
     */
    private readonly clientPromise: Promise<any>;
    private readonly collection: string;
    private readonly dimension: number;

    constructor(opts: QdrantStoreOptions) {
        // ESM 动态导入：避免在未安装依赖时直接崩溃
        // @ts-ignore - 依赖未安装时，TypeScript 会报“找不到模块”，这里忽略即可（运行时安装后正常）
        this.clientPromise = import("@qdrant/js-client-rest").then((m: any) => {
            return new m.QdrantClient({
                url: opts.url,
                apiKey: opts.apiKey,
            });
        });
        
        this.collection = opts.collection;
        this.dimension = opts.dimension;
    }

    /**
     * 初始化：如果 collection 不存在就创建。
     */
    async init(): Promise<void> {
        const client = await this.clientPromise;
        const exists = await client.collectionExists(this.collection);
        if (exists.exists) return;

        // 这里我们用 cosine 相似度（向量检索常用）
        await client.createCollection(this.collection, {
            vectors: {
                size: this.dimension,
                distance: "Cosine",
            },
        });
    }

    /**
     * 写入/更新向量（upsert）
     */
    async upsert(chunks: RagChunk[], vectors: number[][]): Promise<void> {
        if (chunks.length !== vectors.length) {
            throw new Error("upsert: chunks.length must equal vectors.length");
        }

        const points = chunks.map((c, i) => ({
            id: c.id,
            vector: vectors[i]!,
            payload: {
                text: c.text,
                ...c.meta,
            },
        }));

        const client = await this.clientPromise;
        await client.upsert(this.collection, {
            wait: true,
            points,
        });
    }

    /**
     * 相似度搜索
     */
    async search(vector: number[], limit: number): Promise<RagSearchHit[]> {
        const client = await this.clientPromise;
        const res = await client.search(this.collection, {
            vector,
            limit,
            with_payload: true,
        });

        return (res ?? []).map((p: any) => {
            const payload = (p.payload ?? {}) as any;
            const text = typeof payload.text === "string" ? payload.text : "";

            // 我们把 payload 里的字段尽量还原成 RagSearchHit 结构
            const meta = {
                sourceKind: payload.sourceKind,
                title: payload.title,
                componentName: payload.componentName,
                filePath: payload.filePath,
                uri: payload.uri,
                tags: payload.tags,
            } as RagChunk["meta"];

            return {
                id: String(p.id),
                score: p.score ?? 0,
                text,
                meta,
            };
        });
    }
}


