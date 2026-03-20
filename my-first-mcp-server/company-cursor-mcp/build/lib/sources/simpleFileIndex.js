import fs from "node:fs";
import path from "node:path";
/**
 * 极简全文索引（只做 contains 匹配 + 简单打分）。
 * 后续可以替换为：
 * - ripgrep / sqlite fts / elastic
 * - 向量索引（embedding）+ rerank
 */
export class SimpleFileIndex {
    _name;
    _kind;
    _filePaths;
    _chunks = [];
    _byId = new Map();
    constructor(opts) {
        this._name = opts.name;
        this._kind = opts.kind;
        this._filePaths = opts.filePaths;
    }
    get name() {
        return this._name;
    }
    async init() {
        const chunks = [];
        for (const filePath of this._filePaths) {
            try {
                const text = fs.readFileSync(filePath, "utf8");
                const id = `${this._name}:${filePath}`;
                chunks.push({
                    id,
                    kind: this._kind,
                    title: path.basename(filePath),
                    filePath,
                    uri: filePath.startsWith("/") ? `file://${filePath}` : undefined,
                    text,
                });
            }
            catch {
                // ignore unreadable
            }
        }
        this._chunks = chunks;
        this._byId = new Map(chunks.map((c) => [c.id, c]));
    }
    async getById(id) {
        return this._byId.get(id) ?? null;
    }
    async search(query, limit) {
        const q = query.trim().toLowerCase();
        if (!q)
            return [];
        const hits = [];
        for (const chunk of this._chunks) {
            const hay = chunk.text.toLowerCase();
            const idx = hay.indexOf(q);
            if (idx === -1)
                continue;
            const score = 1 / (1 + idx / 2000); // 越靠前越高
            const snippet = this._makeSnippet(chunk.text, idx, q.length);
            hits.push({ chunk, score, snippet });
        }
        hits.sort((a, b) => b.score - a.score);
        return hits.slice(0, limit);
    }
    _makeSnippet(text, idx, len) {
        const start = Math.max(0, idx - 80);
        const end = Math.min(text.length, idx + len + 160);
        return text.slice(start, end).replace(/\s+/g, " ").trim();
    }
}
