"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNycConfig = getNycConfig;

var _loadNycConfig = require("@istanbuljs/load-nyc-config");

// @ts-expect-error no types
async function getNycConfig(opts = {}) {
  const cwd = opts.cwd ?? process.cwd();
  return (0, _loadNycConfig.loadNycConfig)({
    cwd,
    nycrcPath: opts.nycrcPath
  });
}