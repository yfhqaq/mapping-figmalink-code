/**
 * RAG 类型定义（Retrieval-Augmented Generation）
 *
 * 这是一个“框架层”文件：只放类型与接口，不放业务逻辑。
 * 好处：
 * - 结构清晰，初学者容易理解
 * - 以后想替换实现（比如换向量库/换 embedding 服务）不会牵一发动全身
 */

export type RagChunk = {
  /**
   * chunk 唯一 id（建议稳定：同一段内容每次索引构建都能生成同一个 id）
   */
  id: string;

  /**
   * 用于检索的文本内容（会被做 embedding）
   */
  text: string;

  /**
   * 可追溯来源：让生成结果“有据可查”
   */
  meta: {
    sourceKind: "docs" | "figmaSpec" | "componentRepo" | "componentProps";
    title?: string;
    componentName?: string;
    filePath?: string;
    uri?: string;
    tags?: string[];
  };
};

export type RagSearchHit = {
  id: string;
  score: number;
  text: string;
  meta: RagChunk["meta"];
};

/**
 * Embedding 接口：把文本变成向量（float[]）
 *
 * 重要：这里仅定义接口，不绑定到具体厂商（OpenAI/Azure/内部服务都能接）。
 */
export type Embedder = {
  /**
   * 向量维度（例如 1536/3072…）
   * Qdrant 需要在 collection 创建时知道维度。
   */
  dimension: number;

  /**
   * 把多段文本转换为向量（批量）
   */
  embed(texts: string[]): Promise<number[][]>;
};

/**
 * VectorStore 接口：向量数据库能力抽象（Qdrant 只是其中一种实现）
 */
export type VectorStore = {
  init(): Promise<void>;
  upsert(chunks: RagChunk[], vectors: number[][]): Promise<void>;
  search(vector: number[], limit: number): Promise<RagSearchHit[]>;
};


