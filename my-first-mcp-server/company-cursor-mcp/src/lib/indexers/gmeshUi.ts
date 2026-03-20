import fs from "node:fs";
import path from "node:path";

/**
 * gmesh-ui 组件库“索引器”（Indexer）
 *
 * 你可以把它理解为一个“把组件库源码 → 变成可查询的结构化数据”的模块。
 *
 * 为什么要做索引？
 * - 直接让 LLM 扫整个 repo：慢、容易漏、上下文太多
 * - 索引后：我们能快速回答「有哪些组件」「某个组件入口在哪」「有哪些 Props 类型」「有没有 stories / 样式文件」
 *
 * 本文件的核心思路：
 * 1) 解析组件库的显式导出表：`src/index.ts`
 *    - `export { default as SptButton } from './components/Button'`
 *    - `export type { SptButtonProps } from './components/Button'`
 * 2) 建立 Map：componentName -> 组件信息（目录、入口、types、stories、styles）
 * 3) 提供搜索：按组件名 / 类型名做简单匹配 + 打分排序
 *
 * 说明：
 * - 这里我们优先利用“显式导出表”，比“全仓库扫文件”更稳定、更准确。
 * - 后续要更强，可以把这套索引和 AST 解析结合（比如提取 props 字段结构）。
 */
export type GmeshExport = {
  exportName: string;
  exportKind: "component" | "type" | "value";
  /**
   * export 里写的路径，比如：`./components/Button`
   * 注意：这是“源码路径”（相对于 gmesh-ui/src），不是 node resolution 路径。
   */
  sourcePath: string;
};

export type GmeshComponentIndexItem = {
  /**
   * 组件的唯一标识（目前直接用 exportName）
   * 例如：SptButton
   */
  id: string;
  exportName: string;
  /**
   * 组件目录绝对路径（例如：.../gmesh-ui/src/components/Button）
   */
  componentDir?: string;
  /**
   * 组件入口文件绝对路径（例如：.../Button/index.tsx）
   * 用于快速跳转与读取组件源码。
   */
  entryFile?: string;
  /**
   * `src/index.ts` 里写的导出路径（例如：./components/Button）
   * 用于解释“这个组件从哪里导出的”。
   */
  sourceExportPath?: string;
  /**
   * 通过 `src/index.ts` 的 `export type { Xxx } from '...'` 关联到组件的类型名。
   *
   * 目前我们主要关心 Props 类型（如 `SptButtonProps`），后续也可以把事件、枚举等都收集进来。
   */
  exportedTypes: string[];
  storyFiles: string[];
  styleFiles: string[];
};

/**
 * gmesh 组件搜索结果（带分数）
 *
 * 说明：
 * - `score` 是一个“启发式分数”，用于排序；不是机器学习模型分数。
 * - `reason` 用于解释为什么命中（给人看 / 给 LLM 看都很有用）。
 */
export type GmeshScoredComponentHit = {
  item: GmeshComponentIndexItem;
  score: number;
  reason:
    | "exact-name"
    | "prefix-name"
    | "contains-name"
    | "contains-exported-type";
};

type Index = {
  byComponent: Map<string, GmeshComponentIndexItem>;
  exports: GmeshExport[];
};

export class GmeshUiIndexer {
  /**
   * repoRoot：组件库根目录（也就是包含 src/ 的那个目录）
   */
  private readonly _repoRoot: string;
  private _index: Index | null = null;

  constructor(repoRoot: string) {
    this._repoRoot = repoRoot;
  }

  /**
   * 初始化索引（读取 src/index.ts 并建立内存 Map）。
   *
   * 为什么是 async？
   * - 方便未来把索引升级为“磁盘缓存/增量更新/后台构建”，接口不需要再改。
   */
  async init() {
    this._index = this._buildIndex();
  }

  /**
   * 是否已准备好（init 是否已经完成）
   */
  isReady() {
    return this._index !== null;
  }

  /**
   * 返回所有组件（按名称排序）
   */
  listComponents(): GmeshComponentIndexItem[] {
    if (!this._index) return [];
    return Array.from(this._index.byComponent.values()).sort((a, b) =>
      a.exportName.localeCompare(b.exportName)
    );
  }

  /**
   * 简单搜索（仅返回组件项）
   *
   * 如果你希望把“为什么命中/得分多少”也返回给 Cursor/LLM，请用 `searchScored`。
   */
  search(query: string, limit: number): GmeshComponentIndexItem[] {
    if (!this._index) return [];
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const items = this.listComponents();
    const ranked = scoreAndSort(items, q).slice(0, limit).map((x) => x.item);
    return ranked;
  }

  /**
   * 带分数/原因的搜索（推荐用于 tool 输出）。
   *
   * - 你可以用 `score` 做排序
   * - 也可以把 `reason` 返回给客户端/LLM 做解释
   */
  searchScored(query: string, limit: number): GmeshScoredComponentHit[] {
    if (!this._index) return [];
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const items = this.listComponents();
    return scoreAndSort(items, q).slice(0, limit);
  }

  get(exportName: string): GmeshComponentIndexItem | null {
    if (!this._index) return null;
    return this._index.byComponent.get(exportName) ?? null;
  }

  /**
   * 构建索引的主流程（核心函数）
   *
   * 读者可以把它当成：
   * - 输入：src/index.ts 的导出表
   * - 输出：byComponent Map（方便 O(1) 通过组件名拿信息）
   */
  private _buildIndex(): Index {
    const exports = this._parseRootExports();

    const byComponent = new Map<string, GmeshComponentIndexItem>();

    // Build component items based on:
    //   export { default as SptButton } from './components/Button';
    //
    // 说明：
    // - gmesh-ui 是“显式导出表”，所以我们优先信任 src/index.ts，而不是全仓库扫文件。
    for (const exp of exports) {
      // 注意：MCP 的 stdio 通信会占用 stdout。
      // 在 MCP 进程里用 console.log 可能污染协议，导致 Cursor 断连/报错。
      // 如果你需要调试，请用 `DEBUG_GMESH_INDEXER=1` 打开 stderr 日志。
      if (process.env.DEBUG_GMESH_INDEXER === "1") {
        console.error("[gmesh-indexer] export:", exp);
      }
      if (exp.exportKind !== "component") continue;

      const componentDir = this._resolveComponentDir(exp.sourcePath);
      const entryFile = findEntryFile(componentDir);
      const storyFiles = componentDir ? findMatchingFiles(componentDir, /\.(stories\.(t|j)sx?|mdx)$/) : [];
      const styleFiles = componentDir ? findMatchingFiles(componentDir, /\.(less|css|scss|sass)$/) : [];

      byComponent.set(exp.exportName, {
        id: exp.exportName,
        exportName: exp.exportName,
        componentDir: componentDir ?? undefined,
        entryFile: entryFile ?? undefined,
        sourceExportPath: exp.sourcePath,
        exportedTypes: [],
        storyFiles,
        styleFiles,
      });
    }

    // Attach type exports like:
    //   export type { SptButtonProps } from './components/Button';
    //
    // 这里我们通过名称规则，把 `SptButtonProps` 归到 `SptButton` 组件上。
    for (const exp of exports) {
      if (exp.exportKind !== "type") continue;
      const component = guessComponentFromTypeExport(exp.exportName);
      if (!component) continue;
      const item = byComponent.get(component);
      if (!item) continue;
      item.exportedTypes.push(exp.exportName);
    }

    // Dedup types
    for (const item of byComponent.values()) {
      item.exportedTypes = Array.from(new Set(item.exportedTypes)).sort();
    }

    return { byComponent, exports };
  }

  /**
   * 解析 src/index.ts 的导出语句，抽取出我们关心的信息。
   *
   * 当前只处理最常见三类：
   * 1) export { default as X } from '...'
   * 2) export { default as X, ... } from '...'
   * 3) export type { A, B } from '...'
   *
   * 为什么用正则而不是 AST？
   * - 这里“导出表”通常格式稳定，用正则更轻量、更易读。
   * - 如果后续导出写法变复杂，再升级为 TS AST。
   */
  private _parseRootExports(): GmeshExport[] {
    const rootIndex = path.join(this._repoRoot, "src", "index.ts");
    if (!fs.existsSync(rootIndex)) return [];

    const code = fs.readFileSync(rootIndex, "utf8");
    const lines = code.split(/\r?\n/);

    const out: GmeshExport[] = [];

    // 1) export { default as X } from './components/YYY';
    const reDefaultAs = /^\s*export\s*\{\s*default\s+as\s+([A-Za-z0-9_]+)[^}]*\}\s*from\s*['"]([^'"]+)['"]\s*;?\s*$/;
    // 2) export { default as X, ... } from './components/YYY';
    const reDefaultAsMulti = /^\s*export\s*\{\s*default\s+as\s+([A-Za-z0-9_]+)\s*,.*\}\s*from\s*['"]([^'"]+)['"]\s*;?\s*$/;
    // 3) export type { A, B } from './components/YYY';
    const reExportType = /^\s*export\s+type\s*\{\s*([^}]+)\s*\}\s*from\s*['"]([^'"]+)['"]\s*;?\s*$/;

    for (const line of lines) {
      const m1 = line.match(reDefaultAs) ?? line.match(reDefaultAsMulti);
      if (m1) {
        out.push({
          exportName: m1[1]!,
          exportKind: "component",
          sourcePath: m1[2]!,
        });
        continue;
      }

      const m2 = line.match(reExportType);
      if (m2) {
        const names = m2[1]!
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .map((s) => s.replace(/^type\s+/, ""));
        for (const n of names) {
          out.push({
            exportName: n,
            exportKind: "type",
            sourcePath: m2[2]!,
          });
        }
      }
    }

    return out;
  }

  /**
   * 把 `src/index.ts` 里写的相对路径（例如 `./components/Button`）
   * 解析成“组件目录”的绝对路径。
   *
   * 这里做了几个 fallback，是为了兼容不同写法：
   * - sourcePath 指向目录
   * - sourcePath 指向文件（比如 ./components/Button/index.tsx）
   */
  private _resolveComponentDir(sourcePath: string): string | null {
    // gmesh root exports use './components/XXX'
    // normalize: remove leading './'
    const rel = sourcePath.replace(/^\.\//, "");
    const abs = path.join(this._repoRoot, "src", rel);
    if (fs.existsSync(abs) && fs.statSync(abs).isDirectory()) return abs;
    // Sometimes it's a file path; use dirname.
    if (fs.existsSync(abs) && fs.statSync(abs).isFile()) return path.dirname(abs);
    // Try when sourcePath points to directory under src directly
    const abs2 = path.join(this._repoRoot, rel);
    if (fs.existsSync(abs2) && fs.statSync(abs2).isDirectory()) return abs2;
    if (fs.existsSync(abs2) && fs.statSync(abs2).isFile()) return path.dirname(abs2);
    return null;
  }
}

function scoreComponent(it: GmeshComponentIndexItem, q: string): number {
  const name = it.exportName.toLowerCase();
  if (name === q) return 10;
  if (name.startsWith(q)) return 6;
  if (name.includes(q)) return 3;
  for (const t of it.exportedTypes) {
    const tt = t.toLowerCase();
    if (tt === q) return 4;
    if (tt.includes(q)) return 2;
  }
  return 0;
}

/**
 * 给一组组件打分并排序（分数高的排前面）
 *
 * 排序策略（从强到弱）：
 * 1) 组件名完全匹配
 * 2) 组件名前缀匹配
 * 3) 组件名包含匹配
 * 4) exportedTypes（常见是 Props 类型名）包含匹配
 */
function scoreAndSort(items: GmeshComponentIndexItem[], q: string): GmeshScoredComponentHit[] {
  const hits: GmeshScoredComponentHit[] = [];

  for (const it of items) {
    const name = it.exportName.toLowerCase();

    if (name === q) {
      hits.push({ item: it, score: 10, reason: "exact-name" });
      continue;
    }
    if (name.startsWith(q)) {
      hits.push({ item: it, score: 6, reason: "prefix-name" });
      continue;
    }
    if (name.includes(q)) {
      hits.push({ item: it, score: 3, reason: "contains-name" });
      continue;
    }

    // 最后才用类型名命中（比如搜 "SptButtonProps"）
    const typeHit = it.exportedTypes.some((t) => t.toLowerCase().includes(q));
    if (typeHit) {
      hits.push({ item: it, score: 2, reason: "contains-exported-type" });
    }
  }

  hits.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.item.exportName.localeCompare(b.item.exportName);
  });

  return hits;
}

function guessComponentFromTypeExport(typeName: string): string | null {
  // common patterns:
  // - SptButtonProps -> SptButton
  // - SptTabsProps -> SptTabs
  // - SpotterTransferProps -> (unknown)
  const suffixes = ["Props", "Prop", "Type", "Types", "Options", "Option", "Context"];
  for (const s of suffixes) {
    if (typeName.endsWith(s)) return typeName.slice(0, -s.length);
  }
  return null;
}

function findEntryFile(componentDir: string | null): string | null {
  if (!componentDir) return null;
  const candidates = [
    "index.ts",
    "index.tsx",
    "index.js",
    "index.jsx",
    "index.mdx",
    "index.md",
  ];
  for (const c of candidates) {
    const p = path.join(componentDir, c);
    if (fs.existsSync(p) && fs.statSync(p).isFile()) return p;
  }
  // fallback: first tsx in dir
  const files = safeReadDir(componentDir);
  const tsx = files.find((f) => f.endsWith(".tsx"));
  return tsx ? path.join(componentDir, tsx) : null;
}

function findMatchingFiles(dir: string, re: RegExp): string[] {
  const out: string[] = [];
  for (const entry of safeReadDir(dir)) {
    const p = path.join(dir, entry);
    try {
      const st = fs.statSync(p);
      if (st.isDirectory()) {
        // keep shallow to avoid pulling huge trees; most gmesh components are shallow
        for (const entry2 of safeReadDir(p)) {
          const p2 = path.join(p, entry2);
          if (fs.existsSync(p2) && fs.statSync(p2).isFile() && re.test(entry2)) out.push(p2);
        }
      } else if (st.isFile() && re.test(entry)) {
        out.push(p);
      }
    } catch {
      // ignore
    }
  }
  return out;
}

function safeReadDir(dir: string): string[] {
  try {
    return fs.readdirSync(dir);
  } catch {
    return [];
  }
}


