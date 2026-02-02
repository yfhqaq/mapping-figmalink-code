import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { businessMappings } from "../business"

type CodeConnectProp = {
  kind?: string
  args?: {
    figmaPropName?: string
    valueMapping?: Record<string, unknown>
    layers?: string[]
  }
}

type CodeConnectDoc = {
  component?: string
  figmaNode?: string
  label?: string
  language?: string
  templateData?: {
    imports?: string[]
    props?: Record<string, CodeConnectProp | string>
  }
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, "..")

const inputPath = path.join(projectRoot, "code-connect.json")
const outputPath = path.join(projectRoot, "mapping-llm.json")
const dictionaryPath = path.join(projectRoot, "mapping-llm.dictionary.json")

function readJson(filePath: string): CodeConnectDoc[] {
  // 读取 code-connect.json（Code Connect 解析产物）
  return JSON.parse(fs.readFileSync(filePath, "utf8"))
}

function normalizeProps(props: Record<string, CodeConnectProp | string> = {}) {
  // 将 props 规整成 LLM 友好的精简结构
  return Object.entries(props).map(([name, def]) => {
    if (def && typeof def === "string") {
      return { name, kind: "literal", value: def }
    }
    const defObj = def as CodeConnectProp
    const args = defObj?.args || {}
    return {
      name,
      kind: defObj?.kind || "unknown",
      figmaPropName: args.figmaPropName,
      valueMapping: args.valueMapping,
      layers: args.layers,
    }
  })
}

function toLlmMapping(codeConnectJson: CodeConnectDoc[]) {
  // 把 Code Connect JSON 转换成“可读 + 可用”的映射数据
  return codeConnectJson.map((doc) => ({
    component: doc.component,
    figmaNode: doc.figmaNode,
    label: doc.label,
    language: doc.language,
    imports: doc.templateData?.imports || [],
    props: normalizeProps(doc.templateData?.props),
  }))
}

function buildDictionary() {
  // 字段字典：帮助 LLM 理解 JSON 中每个字段的语义
  return {
    version: 1,
    fields: {
      component: "前端组件名。",
      figmaNode: "Figma 节点链接（指向组件实例或组件集）。",
      label: "Code Connect 标签（如 React）。",
      language: "代码语言（typescript/…）。",
      imports: "生成代码需要的 import 列表。",
      props: "组件 props 的映射描述。",
      "props[].name": "props 名称。",
      "props[].kind": "映射类型（enum/boolean/string/children/literal）。",
      "props[].figmaPropName": "Figma 侧的属性名。",
      "props[].valueMapping": "Figma 变体值到代码值的映射表。",
      "props[].layers": "children 映射时的子层名称数组。",
      businessMappings: "业务代码映射（在组件映射之后进行的二次增强）。",
      "businessMappings[].scope": "业务代码插入的使用场景，如 Table.columns。",
      "businessMappings[].description": "场景描述（人类可读）。",
      "businessMappings[].mappingType": "映射类型（snippet/component/description）。",
      "businessMappings[].uxComponent": "对应的 UX 组件引用（用于业务映射与 UX 组件关联）。",
      "businessMappings[].snippetTemplate": "业务代码片段模板。",
      "businessMappings[].figmaNode": "对应的 Figma 节点链接。",
    },
  }
}

function main() {
  // 生成 mapping-llm.json + mapping-llm.dictionary.json
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Missing input: ${inputPath}. Run 'pnpm run codeconnect:parse' first.`)
  }

  const codeConnectJson = readJson(inputPath)
  const llmMapping = {
    version: 1,
    generatedAt: new Date().toISOString(),
    codeConnect: toLlmMapping(codeConnectJson),
    businessMappings,
  }

  fs.writeFileSync(outputPath, JSON.stringify(llmMapping, null, 2))
  fs.writeFileSync(dictionaryPath, JSON.stringify(buildDictionary(), null, 2))
  console.log(`Wrote: ${path.relative(projectRoot, outputPath)}`)
  console.log(`Wrote: ${path.relative(projectRoot, dictionaryPath)}`)
}

main()
