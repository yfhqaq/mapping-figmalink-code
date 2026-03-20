import type { Embedder } from "./types.js";

/**
 * 一个“占位用”的 embedder：
 * - 不做真实 embedding
 * - 主要用于：框架先跑通（不接外部服务也能启动）
 *
 * 注意：
 * - 真实项目里你会替换成 OpenAI/Azure/内部 embedding 服务
 * - stub 的向量是全 0，会导致检索没意义（但不会报错）
 */
export class StubEmbedder implements Embedder {
  dimension: number;

  constructor(dimension = 8) {
    this.dimension = dimension;
  }

  async embed(texts: string[]): Promise<number[][]> {
    // 解释：
    // - 返回全 0 向量，检索没有意义（所有向量相似度一样）
    // - 但框架链路（切块 -> embed -> upsert -> search）能跑通
    return texts.map(() => new Array(this.dimension).fill(0));
  }
}


