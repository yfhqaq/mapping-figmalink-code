"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultExclude = exports.defaultExtensions = void 0;
const commonExtensions = [".js", ".cjs", ".mjs", ".ts", ".cts", ".mts"];
const defaultExtensions = [...commonExtensions, ".tsx", ".jsx", ".vue", ".svelte"];
exports.defaultExtensions = defaultExtensions;
const testFileExtensions = defaultExtensions.map(extension => extension.slice(1)).join(",");
const configFileExtensions = commonExtensions.map(extension => extension.slice(1)).join(",");
const defaultExclude = ["**/node_modules/**", ".storybook/**", "coverage/**", "packages/*/test{,s}/**", "**/*.d.ts", "**/*.mock.*", "test{,s}/**", `test{,-*}.{${testFileExtensions}}`, `**/*{.,-}{spec,story,stories,types}.{${testFileExtensions}}`, "**/__tests__/**", "**/*-entry.js",
/* Exclude common development tool configuration files */
`**/{ava,babel,nyc}.config.{${configFileExtensions}}`, `**/{jest,vitest}.config.{${configFileExtensions}}`, `**/{karma,rollup,webpack,vite}.config.{${configFileExtensions}}`, `**/.{eslint,mocha}rc.{${configFileExtensions}}`];
exports.defaultExclude = defaultExclude;