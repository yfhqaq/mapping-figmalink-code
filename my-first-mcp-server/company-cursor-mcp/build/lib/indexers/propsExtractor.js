import fs from "node:fs";
import path from "node:path";
const DEFAULT_OPTIONS = {
    maxFilesPerComponent: 80,
    maxLinesPerSnippet: 120,
};
/**
 * 在一个组件目录中，为多个 typeName 抽取定义片段。
 *
 * 典型用法：
 * - 组件导出中有 `export type { SptButtonProps } from './components/Button'`
 * - 那么 componentDir=.../components/Button
 * - typeNames=['SptButtonProps']
 */
export function extractTypeSnippetsFromComponentDir(componentDir, typeNames, opts) {
    const options = { ...DEFAULT_OPTIONS, ...(opts ?? {}) };
    if (!fs.existsSync(componentDir))
        return [];
    if (!fs.statSync(componentDir).isDirectory())
        return [];
    // 1) 收集候选文件：组件目录下的 .ts/.tsx（包含一层子目录）
    const candidates = collectCandidateFiles(componentDir).slice(0, options.maxFilesPerComponent);
    const results = [];
    // 2) 对每个 typeName，按文件顺序扫描，找到第一个命中的定义
    for (const typeName of typeNames) {
        const hit = findFirstTypeDefinition(candidates, typeName, options);
        if (hit)
            results.push(hit);
    }
    return results;
}
function collectCandidateFiles(componentDir) {
    const out = [];
    // 组件的常见入口文件优先（更可能定义/导出 Props）
    const preferred = [
        "index.ts",
        "index.tsx",
        "types.ts",
        "type.ts",
        "index.d.ts",
    ].map((f) => path.join(componentDir, f));
    for (const p of preferred) {
        if (isTsLikeFile(p))
            out.push(p);
    }
    // 再补全：组件目录下所有 ts/tsx 文件（含一层子目录）
    for (const entry of safeReadDir(componentDir)) {
        const abs = path.join(componentDir, entry.name);
        if (entry.isFile() && isTsLikeFile(abs))
            out.push(abs);
        if (entry.isDirectory()) {
            for (const child of safeReadDir(abs)) {
                const abs2 = path.join(abs, child.name);
                if (child.isFile() && isTsLikeFile(abs2))
                    out.push(abs2);
            }
        }
    }
    // 去重 + 稳定顺序
    return Array.from(new Set(out));
}
function findFirstTypeDefinition(files, typeName, options) {
    // 逐文件扫描：找到第一个命中就停止
    // 这样做的好处：快、稳定；缺点：如果同名类型在多个文件重复定义，可能拿到不是你想要的那个。
    // （后续可升级为：优先入口文件、优先 export 的那个定义等）
    for (const filePath of files) {
        let text;
        try {
            text = fs.readFileSync(filePath, "utf8");
        }
        catch {
            continue;
        }
        const snippet = extractTypeSnippetFromFile(text, typeName, options);
        if (!snippet)
            continue;
        return { typeName, filePath, snippet };
    }
    return null;
}
/**
 * 从单个文件内容里提取 `typeName` 的定义片段。
 *
 * 支持两种最常见写法：
 * - export interface XxxProps { ... }
 * - export type XxxProps = { ... } / export type XxxProps = Something;
 */
function extractTypeSnippetFromFile(fileText, typeName, options) {
    const lines = fileText.split(/\r?\n/);
    // 简单匹配：interface 或 type 定义行
    const re = new RegExp(String.raw `^\s*(export\s+)?(interface|type)\s+${escapeRegExp(typeName)}\b`);
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i] ?? "";
        if (!re.test(line))
            continue;
        // 取上方注释（JSDoc / // 注释），帮助理解
        const commentStart = findLeadingCommentStart(lines, i);
        const start = commentStart ?? i;
        // 从当前行向下提取一个“代码块”
        const block = takeDefinitionBlock(lines, i, options.maxLinesPerSnippet);
        if (!block)
            return null;
        const merged = lines.slice(start, Math.min(lines.length, block.endLine + 1));
        return merged.join("\n").trim();
    }
    return null;
}
function findLeadingCommentStart(lines, definitionLine) {
    // 向上找连续的注释行（最多回溯 10 行，避免把无关内容也吞进去）
    let start = definitionLine;
    let steps = 0;
    while (start - 1 >= 0 && steps < 10) {
        const prev = (lines[start - 1] ?? "").trim();
        // 这里兼容两类注释：
        // 1) 单行注释：// ...
        // 2) 多行注释（JSDoc）：/ ** ... * /
        if (prev.startsWith("//") ||
            prev.startsWith("*") ||
            prev.startsWith("/*") ||
            prev.startsWith("/**")) {
            start--;
            steps++;
            continue;
        }
        // 空行也允许（JSDoc 上面可能有空行）
        if (prev === "") {
            start--;
            steps++;
            continue;
        }
        break;
    }
    return start !== definitionLine ? start : null;
}
function takeDefinitionBlock(lines, definitionLine, maxLines) {
    const head = lines[definitionLine] ?? "";
    // 1) interface：通常是花括号块
    if (/\binterface\b/.test(head)) {
        return takeBraceBlock(lines, definitionLine, maxLines);
    }
    // 2) type：可能是对象字面量，也可能是别名到其它类型
    //    我们采用策略：
    //    - 如果后续出现 { ... }，用花括号匹配
    //    - 否则一直到遇到分号 ';' 结束
    const joined = lines.slice(definitionLine, definitionLine + maxLines).join("\n");
    if (joined.includes("{")) {
        const brace = takeBraceBlock(lines, definitionLine, maxLines);
        if (brace) {
            // type Xxx = { ... };
            // 有些文件会在 } 之后再跟 ';'，我们顺便向后吃掉同一行的分号（粗略处理）
            return { endLine: brace.endLine };
        }
    }
    // fallback: eat until a line that contains ';'
    const end = Math.min(lines.length - 1, definitionLine + maxLines - 1);
    for (let i = definitionLine; i <= end; i++) {
        if ((lines[i] ?? "").includes(";"))
            return { endLine: i };
    }
    return { endLine: end };
}
function takeBraceBlock(lines, definitionLine, maxLines) {
    let depth = 0;
    let seenOpening = false;
    const end = Math.min(lines.length - 1, definitionLine + maxLines - 1);
    for (let i = definitionLine; i <= end; i++) {
        const line = lines[i] ?? "";
        for (const ch of line) {
            if (ch === "{") {
                depth++;
                seenOpening = true;
            }
            else if (ch === "}") {
                depth--;
            }
        }
        // 当我们已经看到开括号，并且深度回到 0，则块结束
        if (seenOpening && depth <= 0)
            return { endLine: i };
    }
    // 没找到闭合，返回 null 代表提取失败（避免返回半截）
    return null;
}
function isTsLikeFile(p) {
    try {
        if (!fs.existsSync(p))
            return false;
        if (!fs.statSync(p).isFile())
            return false;
        return p.endsWith(".ts") || p.endsWith(".tsx") || p.endsWith(".d.ts");
    }
    catch {
        return false;
    }
}
function safeReadDir(dir) {
    try {
        return fs.readdirSync(dir, { withFileTypes: true });
    }
    catch {
        return [];
    }
}
function escapeRegExp(s) {
    // 把字符串转义成可以安全放进 RegExp 的形式
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
