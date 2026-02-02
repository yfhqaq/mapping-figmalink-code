import { spawnSync } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, "..")

type Args = {
  input?: string
  figmaUrl?: string
  token?: string
  llm?: string
  fileKey?: string
  output?: string
  skipParse?: boolean
  skipGenerate?: boolean
}

function parseArgs(): Args {
  // 简单解析命令行参数：支持 --key value 和布尔开关
  const args = process.argv.slice(2)
  const result: Args = {}
  for (let i = 0; i < args.length; i += 1) {
    const key = args[i]
    const value = args[i + 1]
    if (key === "--skip-parse") {
      result.skipParse = true
      continue
    }
    if (key === "--skip-generate") {
      result.skipGenerate = true
      continue
    }
    if (key?.startsWith("--")) {
      ;(result as Record<string, string>)[key.slice(2)] = value
      i += 1
    }
  }
  return result
}

function run(command: string, args: string[]) {
  // 运行子命令，失败即退出（保证流水线可控）
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    stdio: "inherit",
    shell: false,
  })
  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

function main() {
  // 串联 parse -> generate -> evaluate 的评估流水线
  const args = parseArgs()
  if (!args.input && !args.figmaUrl) {
    throw new Error("Missing --input <figma-json> or --figmaUrl <url>")
  }

  if (!args.skipParse) {
    run("pnpm", ["run", "codeconnect:parse"])
  }
  if (!args.skipGenerate) {
    run("pnpm", ["run", "mapping:generate"])
  }

  let inputPath = args.input
  // 只给了链接时，先自动拉取 JSON 作为输入
  if (!inputPath && args.figmaUrl) {
    const fetchArgs = ["run", "mapping:fetch", "--", "--figmaUrl", args.figmaUrl]
    if (args.token) fetchArgs.push("--token", args.token)
    run("pnpm", fetchArgs)
    const fileKeyMatch = args.figmaUrl.match(/figma\.com\/(?:design|file)\/([^/]+)/)
    const nodeMatch = args.figmaUrl.match(/node-id=([^&]+)/)
    if (fileKeyMatch && nodeMatch) {
      inputPath = path.join(
        projectRoot,
        "tmp",
        `figma-${fileKeyMatch[1]}-${nodeMatch[1]}.json`
      )
    }
  }

  if (!inputPath) {
    throw new Error("Failed to resolve input JSON path")
  }

  const evalArgs = ["run", "mapping:evaluate", "--", "--input", inputPath]
  if (args.llm) evalArgs.push("--llm", args.llm)
  if (args.fileKey) evalArgs.push("--fileKey", args.fileKey)
  if (args.output) evalArgs.push("--output", args.output)

  run("pnpm", evalArgs)
}

main()
