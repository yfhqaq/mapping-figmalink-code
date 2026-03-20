import fs from "node:fs";
import path from "node:path";

import type { RagChunk } from "../types.js";

/**
 * gmesh-ui 组件库切块（chunking）策略
 *
 * 市面上比较成熟的经验是：**不要把整份组件源码一次性 embedding**
 * 原因：
 * - 太长：embedding 成本高、质量反而下降（信息太杂）
 * - 查询时：难以命中“恰好相关”的那部分
 *
 * 更推荐的做法（本文件实现的就是这个）：
 * - 以“组件”为单位组织 chunk（每个组件多个 chunk）
 * - 把“最有用的信息”单独成块：
 *   1) 组件简介/导出名（短文本）
 *   2) Props 类型定义片段（对生成代码最关键）
 *   3) Story / MDX 示例（对用法最关键）
 *   4) 入口文件的头部（少量，通常含 imports/接口/默认值）
 *
 * chunk 大小经验（粗略）：
 * - 每块 500~2000 字符是比较舒服的起点（后续可按 token 更精确）
 */

export type GmeshComponentForChunking = {
  exportName: string;
  entryFile?: string;
  componentDir?: string;
  exportedTypes: string[];
  storyFiles: string[];
  styleFiles: string[];
  // 从 propsExtractor 得到的 snippet（可选）
  typeSnippets?: { typeName: string; filePath: string; snippet: string }[];
};

export type GmeshChunkOptions = {
  maxCharsPerChunk?: number;
  maxEntryPreviewLines?: number;
};

const DEFAULT_OPTS: Required<GmeshChunkOptions> = {
  maxCharsPerChunk: 1600,
  maxEntryPreviewLines: 80,
};

export function buildGmeshComponentChunks(
  component: GmeshComponentForChunking,
  opts?: GmeshChunkOptions
): RagChunk[] {
  const o = { ...DEFAULT_OPTS, ...(opts ?? {}) };

  const chunks: RagChunk[] = [];

  // 1) 组件“卡片摘要”（很短，但非常有助于语义检索）
  chunks.push({
    id: `gmesh:${component.exportName}:summary`,
    text: [
      `Component: ${component.exportName}`,
      component.exportedTypes.length ? `Types: ${component.exportedTypes.join(", ")}` : "",
      component.entryFile ? `Entry: ${component.entryFile}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    meta: {
      sourceKind: "componentRepo",
      title: component.exportName,
      componentName: component.exportName,
      filePath: component.entryFile,
      uri: component.entryFile ? `file://${component.entryFile}` : undefined,
      tags: ["component", "summary"],
    },
  });

  // 2) Props/type snippets（对生成代码最关键）
  for (const snip of component.typeSnippets ?? []) {
    for (const part of splitText(snip.snippet, o.maxCharsPerChunk)) {
      chunks.push({
        id: `gmesh:${component.exportName}:type:${snip.typeName}:${hashSuffix(part)}`,
        text: part,
        meta: {
          sourceKind: "componentProps",
          title: `${component.exportName} / ${snip.typeName}`,
          componentName: component.exportName,
          filePath: snip.filePath,
          uri: snip.filePath ? `file://${snip.filePath}` : undefined,
          tags: ["component", "props", "type", snip.typeName],
        },
      });
    }
  }

  // 3) Story/MDX（示例）
  for (const f of component.storyFiles ?? []) {
    const text = safeReadFile(f);
    if (!text) continue;

    for (const part of splitText(text, o.maxCharsPerChunk)) {
      chunks.push({
        id: `gmesh:${component.exportName}:story:${path.basename(f)}:${hashSuffix(part)}`,
        text: part,
        meta: {
          sourceKind: "docs",
          title: `${component.exportName} story: ${path.basename(f)}`,
          componentName: component.exportName,
          filePath: f,
          uri: `file://${f}`,
          tags: ["component", "story", "example"],
        },
      });
    }
  }

  // 4) 入口文件 preview（只取头部 N 行，避免太长）
  if (component.entryFile) {
    const preview = readHeadLines(component.entryFile, o.maxEntryPreviewLines);
    if (preview) {
      chunks.push({
        id: `gmesh:${component.exportName}:entryPreview`,
        text: preview,
        meta: {
          sourceKind: "componentRepo",
          title: `${component.exportName} entry preview`,
          componentName: component.exportName,
          filePath: component.entryFile,
          uri: `file://${component.entryFile}`,
          tags: ["component", "entry", "code"],
        },
      });
    }
  }

  return chunks;
}

function safeReadFile(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
}

function readHeadLines(filePath: string, maxLines: number): string | null {
  const text = safeReadFile(filePath);
  if (!text) return null;
  return text.split(/\r?\n/).slice(0, maxLines).join("\n");
}

function splitText(text: string, maxChars: number): string[] {
  const t = text.trim();
  if (!t) return [];
  if (t.length <= maxChars) return [t];

  // 简单策略：按段落拆，再按长度拼装
  const paras = t.split(/\n\s*\n/);
  const out: string[] = [];
  let buf = "";

  for (const p of paras) {
    if ((buf + "\n\n" + p).length <= maxChars) {
      buf = buf ? buf + "\n\n" + p : p;
      continue;
    }
    if (buf) out.push(buf);
    if (p.length <= maxChars) {
      buf = p;
    } else {
      // 段落本身也超长：再按硬切
      for (let i = 0; i < p.length; i += maxChars) {
        out.push(p.slice(i, i + maxChars));
      }
      buf = "";
    }
  }
  if (buf) out.push(buf);
  return out;
}

function hashSuffix(s: string) {
  // 不需要强哈希，这里用一个轻量的“稳定后缀”避免 id 冲突
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h.toString(16);
}


