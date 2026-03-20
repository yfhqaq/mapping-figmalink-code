import fs from "node:fs";
import path from "node:path";
// 纯 Node 的简化 glob 展开（骨架实现）
// - 支持类似：/path/to/dir/**/ *.ext（常见的递归后缀匹配）
// - 后续可以替换为 fast-glob（更完整更快）
export function expandGlobs(globs) {
    const results = [];
    for (const g of globs) {
        if (g.includes("**/*.")) {
            const [root, ext] = g.split("**/*.");
            const rootDir = root.replace(/\/+$/, "");
            if (!rootDir)
                continue;
            results.push(...walkExt(rootDir, `.${ext}`));
        }
        else if (fs.existsSync(g) && fs.statSync(g).isFile()) {
            results.push(g);
        }
        else if (fs.existsSync(g) && fs.statSync(g).isDirectory()) {
            // directory means "all files"
            results.push(...walkAll(g));
        }
    }
    return unique(results);
}
function walkAll(dir) {
    const out = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, entry.name);
        if (entry.isDirectory())
            out.push(...walkAll(p));
        else if (entry.isFile())
            out.push(p);
    }
    return out;
}
function walkExt(dir, ext) {
    const out = [];
    if (!fs.existsSync(dir))
        return out;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, entry.name);
        if (entry.isDirectory())
            out.push(...walkExt(p, ext));
        else if (entry.isFile() && p.endsWith(ext))
            out.push(p);
    }
    return out;
}
function unique(arr) {
    return Array.from(new Set(arr));
}
