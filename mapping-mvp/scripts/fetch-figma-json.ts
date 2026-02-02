import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

type Args = {
  figmaUrl?: string
  out?: string
  token?: string
  depth?: string
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, "..")

function parseArgs(): Args {
  const args = process.argv.slice(2)
  const result: Args = {}
  for (let i = 0; i < args.length; i += 1) {
    const key = args[i]
    const value = args[i + 1]
    if (key?.startsWith("--")) {
      ;(result as Record<string, string>)[key.slice(2)] = value
      i += 1
    }
  }
  return result
}

function extractFileKey(url: string) {
  // 从 figma.com/design|file/<fileKey>/... 中提取 fileKey
  const match = url.match(/figma\.com\/(?:design|file)\/([^/]+)/)
  return match?.[1]
}

function extractNodeId(url: string) {
  // 从 URL 查询参数中提取 node-id
  const match = url.match(/node-id=([^&]+)/)
  return match?.[1]
}

async function fetchJson(url: string, token: string) {
  // 使用个人 Token 调用 Figma API
  const res = await fetch(url, {
    headers: { "X-Figma-Token": token },
  })
  if (!res.ok) {
    throw new Error(`Figma API error ${res.status}: ${await res.text()}`)
  }
  return res.json()
}

async function main() {
  // 解析参数并做基础校验
  const args = parseArgs()
  const figmaUrl = args.figmaUrl
  if (!figmaUrl) {
    throw new Error("Missing --figmaUrl <url>")
  }

  const fileKey = extractFileKey(figmaUrl)
  if (!fileKey) {
    throw new Error("Unable to extract fileKey from figmaUrl")
  }

  const nodeId = extractNodeId(figmaUrl)
  if (!nodeId) {
    throw new Error("Missing node-id in figmaUrl")
  }

  // Token 可来自命令行或环境变量
  const token = args.token || process.env.FIGMA_API_KEY || process.env.FIGMA_TOKEN
  if (!token) {
    throw new Error("Missing Figma API token (FIGMA_API_KEY or --token)")
  }

  // 使用 Figma nodes API 拉取节点 JSON
  const normalizedNodeId = nodeId.replace(/-/g, ":")
  const apiUrl = `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${normalizedNodeId}`
  const data = await fetchJson(apiUrl, token)

  // 保存到 tmp，供后续评估脚本直接使用
  const outputPath =
    args.out || path.join(projectRoot, "tmp", `figma-${fileKey}-${nodeId}.json`)
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, JSON.stringify({ fileKey, nodes: data.nodes }, null, 2))
  console.log(`Wrote: ${outputPath}`)
}

main()
