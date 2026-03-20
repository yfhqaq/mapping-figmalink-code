import crypto from "node:crypto";

import type { Embedder, RagChunk, RagSearchHit, VectorStore } from "./types.js";

/**
 * RagService：把 “embedding + vector store” 组合成一个更好用的服务层。
 *
 * 你可以把它理解为：
 * - buildIndex(chunks): 把文档块写进向量库
 * - search(query): 把用户 query -> embedding -> 向量检索 -> 返回 hits
 *
 * 注意：这个 service 不关心 “chunks 从哪里来”。
 * - chunks 的来源由更上层决定（docs/figma/props/组件库…）
 */
export class RagService {
  private readonly embedder: Embedder;
  private readonly store: VectorStore;

  constructor(opts: { embedder: Embedder; store: VectorStore }) {
    this.embedder = opts.embedder;
    this.store = opts.store;
  }

  async init() {
    await this.store.init();
  }

  /**
   * 构建/更新索引
   *
   * 说明：
   * - id 必须稳定，否则每次 build 会生成大量重复 point
   * - 我们提供一个 helper：stableChunkId(meta + text)
   */
  async upsertChunks(chunks: RagChunk[]) {
    if (chunks.length === 0) return;
    const vectors = await this.embedder.embed(chunks.map((c) => c.text));
    await this.store.upsert(chunks, vectors);
  }

  async search(query: string, limit: number): Promise<RagSearchHit[]> {
    const [vector] = await this.embedder.embed([query]);
    if (!vector) return [];
    return await this.store.search(vector, limit);
  }
}

/**
 * 生成稳定 chunk id（便于 upsert）
 */
export function stableChunkId(input: {
  text: string;
  meta: RagChunk["meta"];
}): string {
  const payload = JSON.stringify({ text: input.text, meta: input.meta });
  return crypto.createHash("sha1").update(payload).digest("hex");
}


