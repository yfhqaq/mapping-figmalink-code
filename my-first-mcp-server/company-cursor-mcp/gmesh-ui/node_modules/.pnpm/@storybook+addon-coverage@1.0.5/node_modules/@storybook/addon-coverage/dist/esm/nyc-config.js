// @ts-expect-error no types
import { loadNycConfig } from "@istanbuljs/load-nyc-config";
export async function getNycConfig(opts = {}) {
  const cwd = opts.cwd ?? process.cwd();
  return loadNycConfig({
    cwd,
    nycrcPath: opts.nycrcPath
  });
}