declare module "node:fs" {
  const fs: any
  export = fs
}

declare module "node:path" {
  const path: any
  export = path
}

declare module "node:url" {
  export function fileURLToPath(url: string | URL): string
}

declare const process: {
  argv: string[]
  cwd(): string
  exit(code?: number): never
  env: Record<string, string | undefined>
}

declare module "node:child_process" {
  export function spawnSync(
    command: string,
    args: string[],
    options: {
      cwd?: string
      stdio?: "inherit" | "ignore" | "pipe"
      shell?: boolean
    }
  ): { status: number | null }
}

declare const fetch: any
