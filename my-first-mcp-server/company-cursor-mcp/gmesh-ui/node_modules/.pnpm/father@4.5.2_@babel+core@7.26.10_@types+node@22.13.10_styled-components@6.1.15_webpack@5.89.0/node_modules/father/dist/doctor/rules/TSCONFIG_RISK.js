"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@umijs/utils");
const path_1 = __importDefault(require("path"));
const dts_1 = require("../../builder/bundless/dts");
exports.default = (api) => {
    api.addRegularCheckup(({ bundlessConfigs }) => {
        if (bundlessConfigs.length) {
            const tsconfigPath = (0, dts_1.getTsconfigPath)(api.cwd);
            // only check when tsconfig.json is in cwd
            const tsconfig = (tsconfigPath === null || tsconfigPath === void 0 ? void 0 : tsconfigPath.includes((0, utils_1.winPath)(api.cwd))) && (0, dts_1.getTsconfig)(api.cwd);
            if (tsconfig && tsconfig.options.declaration) {
                const inputs = bundlessConfigs.map((c) => c.input);
                const files = tsconfig.fileNames.map((f) => (0, utils_1.winPath)(path_1.default.relative(api.cwd, f)));
                if (files.every((f) => inputs.every((i) => !f.startsWith(i)))) {
                    return {
                        type: 'error',
                        problem: 'No source file included in tsconfig.json, so even if the `declaration` option is enabled, no `.d.ts` dist files will be generated',
                        solution: "Add source directory to tsconfig.json `include` option, or disable the `declaration` option if you don't need `.d.ts` dist files",
                    };
                }
            }
        }
    });
};
