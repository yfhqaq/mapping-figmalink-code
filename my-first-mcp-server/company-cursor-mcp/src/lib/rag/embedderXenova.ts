import type { Embedder } from "./types.js";

/**
 * 真实 Embedding：@xenova/transformers（开源，本地推理）
 *
 * 为什么推荐它？
 * - 纯 JS/TS，可在 Node 里跑
 * - 支持 sentence-transformers 等模型（常用 embedding 模型）
 * - 不需要调用外部 API（适合公司内网/离线场景）
 *
 * 重要说明（初学者必看）：
 * 1) 模型文件通常需要下载（默认会从 HuggingFace 下载并缓存）
 * 2) 你也可以提前把模型下载到本地，再用 localFilesOnly=true 离线加载
 * 3) 本项目用 ESM，所以用 dynamic import + @ts-ignore，避免你没装依赖时编辑器全红
 */

export type XenovaEmbedderOptions = {
  /**
   * 推荐模型（体积小、速度快、效果好）：
   * - "Xenova/all-MiniLM-L6-v2"（维度 384）
   * - "Xenova/bge-small-en-v1.5"（维度 384）
   *
   * 你也可以换成公司内训模型（只要 transformers.js 能加载）。
   */
  model: string;

  /**
   * embedding 向量维度（必须和模型一致）
   * 例如 all-MiniLM-L6-v2 的维度是 384
   */
  dimension: number;

  /**
   * 是否仅从本地加载（不走网络下载）
   * - true：要求你提前把模型文件准备好（离线/内网场景常用）
   * - false：允许自动下载并缓存
   */
  localFilesOnly?: boolean;

  /**
   * 模型缓存目录（可选）
   * - 不传：使用默认缓存目录
   * - 传入：你可以把缓存统一放到一个地方，便于管理
   */
  cacheDir?: string;
};

export class XenovaEmbedder implements Embedder {
  dimension: number;

  private readonly model: string;
  private readonly localFilesOnly: boolean;
  private readonly cacheDir?: string;

  // transformers.js 的 pipeline 实例（feature-extraction）
  private extractorPromise: Promise<any> | null = null;

  constructor(opts: XenovaEmbedderOptions) {
    this.model = opts.model;
    this.dimension = opts.dimension;
    this.localFilesOnly = opts.localFilesOnly ?? false;
    this.cacheDir = opts.cacheDir;
  }

  /**
   * 延迟初始化 pipeline
   *
   * 这样做的好处：
   * - rag.enabled=false 时不会触发任何模型加载
   * - 第一次真正需要 embedding 时才加载模型
   */
  private _getExtractor(): Promise<any> {
    if (this.extractorPromise) return this.extractorPromise;

    // @ts-ignore - 依赖未安装时，TS 会报找不到模块；运行时安装后正常
    this.extractorPromise = import("@xenova/transformers").then(async (m: any) => {
      // feature-extraction pipeline 会输出 token-level embeddings（通常是 [seq_len, dim]）
      // 我们用 mean pooling 汇总成句向量。
      const pipeline = m.pipeline;

      const extractor = await pipeline("feature-extraction", this.model, {
        // 这些参数在 transformers.js 里常用：
        // - quantized: 可选，量化能加速但可能影响精度
        // - local_files_only: 控制是否允许下载
        // - cache_dir: 指定缓存目录
        local_files_only: this.localFilesOnly,
        cache_dir: this.cacheDir,
      });

      return extractor;
    });

    return this.extractorPromise;
  }

  /**
   * 把一批文本转为向量。
   *
   * 关键点（成熟经验）：
   * - 真实 embedding 要做“归一化”（normalize），这样 cosine 距离更稳定
   * - 输入文本最好做长度控制（太长会变慢；一般 chunk 200~800 tokens 更合适）
   */
  async embed(texts: string[]): Promise<number[][]> {
    const extractor = await this._getExtractor();

    const vectors: number[][] = [];

    for (const text of texts) {
      // 返回通常是 token embedding（多维数组），不同版本可能略有差异
      const output = await extractor(text, {
        pooling: "none", // 我们自己做 pooling，便于教学和可控
        normalize: false,
      });

      // transformers.js 的 output 常见形式：{ data: number[][], dims: [seq_len, dim] }
      // 也可能直接给出 nested array。这里写一个尽量兼容的解析。
      const tokenMatrix = coerceTo2D(output);
      const pooled = meanPool(tokenMatrix);
      const normed = l2Normalize(pooled);

      if (normed.length !== this.dimension) {
        throw new Error(
          `Embedding dimension mismatch: got=${normed.length}, expected=${this.dimension}. Check model/dimension config.`
        );
      }

      vectors.push(normed);
    }

    return vectors;
  }
}

/**
 * 把 extractor 输出“尽量转成二维数组 [seq_len][dim]”
 */
function coerceTo2D(output: any): number[][] {
  // case 1: { data, dims }
  if (output && Array.isArray(output.data) && output.dims?.length === 2) {
    const [seqLen, dim] = output.dims;
    const flat: number[] = output.data;
    const out: number[][] = [];
    for (let i = 0; i < seqLen; i++) {
      out.push(flat.slice(i * dim, (i + 1) * dim));
    }
    return out;
  }

  // case 2: already 2D
  if (Array.isArray(output) && Array.isArray(output[0])) return output as number[][];

  // case 3: pipeline wrapper object
  if (output?.last_hidden_state) return coerceTo2D(output.last_hidden_state);

  throw new Error("Unexpected extractor output format (cannot coerce to 2D).");
}

/**
 * mean pooling：把 token embeddings 平均成一句话的向量
 */
function meanPool(matrix: number[][]): number[] {
  if (matrix.length === 0) return [];
  const dim = matrix[0]!.length;
  const sum = new Array(dim).fill(0);

  for (const row of matrix) {
    for (let j = 0; j < dim; j++) sum[j] += row[j] ?? 0;
  }
  for (let j = 0; j < dim; j++) sum[j] /= matrix.length;
  return sum;
}

/**
 * L2 归一化：让向量长度为 1（cosine 相似度更稳定）
 */
function l2Normalize(vec: number[]): number[] {
  let s = 0;
  for (const v of vec) s += v * v;
  const norm = Math.sqrt(s) || 1;
  return vec.map((v) => v / norm);
}


