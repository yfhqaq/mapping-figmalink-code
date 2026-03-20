"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTransformer = exports.addLoader = void 0;
const utils_1 = require("@umijs/utils");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const constants_1 = require("../../constants");
const utils_2 = require("../../utils");
const dts_1 = __importDefault(require("./dts"));
const loaders_1 = __importDefault(require("./loaders"));
const parallelLoader_1 = __importDefault(require("./parallelLoader"));
const debugLog = (0, utils_1.debug)(constants_1.DEBUG_BUNDLESS_NAME);
let parallelLoader;
const loaders = [];
/**
 * add loader
 * @param item  loader item
 */
function addLoader(item) {
    // only support simple test type currently, because the webpack condition is too complex
    // refer: https://github.com/webpack/webpack/blob/0f6c78cca174a73184fdc0d9c9c2bd376b48557c/lib/rules/RuleSetCompiler.js#L211
    if (!['string', 'function'].includes(typeof item.test) &&
        !(item.test instanceof RegExp)) {
        throw new Error(`Unsupported loader test in \`${item.id}\`, only string, function and regular expression are available.`);
    }
    loaders.push(item);
}
exports.addLoader = addLoader;
const transformers = {};
/**
 * add javascript transformer
 * @param item
 */
function addTransformer(item) {
    const mod = require(item.transformer);
    const transformer = mod.default || mod;
    transformers[item.id] = {
        fn: transformer,
        resolvePath: item.transformer,
    };
}
exports.addTransformer = addTransformer;
/**
 * replace extension for path
 */
function replacePathExt(filePath, ext) {
    const parsed = path_1.default.parse(filePath);
    return path_1.default.join(parsed.dir, `${parsed.name}${ext}`);
}
/**
 * transform specific files
 */
async function transformFiles(files, opts) {
    try {
        let count = 0;
        let bundlessPromises = [];
        let declarationFileMap = new Map();
        // process all matched items
        for (let item of files) {
            const config = opts.configProvider.getConfigForFile(item);
            const itemAbsPath = path_1.default.join(opts.cwd, item);
            if (config) {
                let itemDistPath = path_1.default.join(config.output, path_1.default.relative(config.input, item));
                let itemDistAbsPath = path_1.default.join(opts.cwd, itemDistPath);
                const parentPath = path_1.default.dirname(itemDistAbsPath);
                // create parent directory if not exists
                if (!fs_1.default.existsSync(parentPath)) {
                    fs_1.default.mkdirSync(parentPath, { recursive: true });
                }
                const loaderArgs = {
                    fileAbsPath: itemAbsPath,
                    fileDistPath: itemDistPath,
                    loaders,
                    transformers,
                    opts: {
                        config,
                        pkg: opts.configProvider.pkg,
                        cwd: opts.cwd,
                        itemDistAbsPath,
                    },
                };
                if (config.parallel) {
                    parallelLoader || (parallelLoader = (0, parallelLoader_1.default)());
                    for (const key in transformers) {
                        if (loaderArgs.transformers.hasOwnProperty(key)) {
                            delete transformers[key].fn;
                        }
                    }
                    bundlessPromises.push(parallelLoader.run(loaderArgs));
                }
                else {
                    bundlessPromises.push((0, loaders_1.default)(loaderArgs));
                }
                count += 1;
            }
            else {
                debugLog(`No config matches ${utils_1.chalk.gray(item)}, skip`);
            }
        }
        const results = await Promise.all(bundlessPromises);
        utils_1.lodash.forEach(results, (item) => {
            if (item) {
                declarationFileMap.set(item[0], item[1]);
            }
        });
        if (declarationFileMap.size) {
            utils_2.logger.quietExpect.event(`Generate declaration file${declarationFileMap.size > 1 ? 's' : ''}...`);
            const declarations = await (0, dts_1.default)([...declarationFileMap.keys()], {
                cwd: opts.cwd,
            });
            declarations.forEach((item) => {
                fs_1.default.writeFileSync(path_1.default.join(declarationFileMap.get(item.sourceFile), item.file), item.content, 'utf-8');
            });
        }
        return count;
    }
    catch (err) {
        if (opts.watch) {
            utils_2.logger.error(err.message);
            return 0;
        }
        else {
            throw err;
        }
    }
}
async function bundless(opts) {
    const statusText = `Bundless for ${utils_1.chalk.yellow(opts.configProvider.input)} directory to ${utils_1.chalk.yellow(opts.configProvider.configs[0].format)} format`;
    utils_2.logger.info(statusText);
    const startTime = Date.now();
    let count = 0;
    if (!opts.incremental) {
        const matches = utils_1.glob.sync(`${opts.configProvider.input}/**`, {
            cwd: opts.cwd,
            ignore: constants_1.DEFAULT_BUNDLESS_IGNORES,
            nodir: true,
        });
        count = await transformFiles(matches, opts);
    }
    if (!opts.watch) {
        // output result for normal mode
        utils_2.logger.quietExpect.event(`Transformed successfully in ${Date.now() - startTime} ms (${count} files)`);
    }
    else {
        // watching for watch mode
        utils_2.logger.quietExpect.event(`Start watching ${opts.configProvider.input} directory...`);
        // debounce transform to combine multiple changes
        const handleTransform = (() => {
            const pendingSet = new Set();
            const startTransform = utils_1.lodash.debounce(() => {
                transformFiles([...pendingSet], opts);
                pendingSet.clear();
                utils_2.logger.quietOnly.info(statusText);
            }, constants_1.WATCH_DEBOUNCE_STEP);
            return (filePath) => {
                pendingSet.add(filePath);
                startTransform();
            };
        })();
        const watcher = utils_1.chokidar
            .watch(opts.configProvider.input, {
            cwd: opts.cwd,
            ignoreInitial: true,
            ignored: constants_1.DEFAULT_BUNDLESS_IGNORES,
            // to avoid catch temp file from some special file-system
            // ex. a.txt => a.txt.12344345 in CloudIDE
            awaitWriteFinish: {
                stabilityThreshold: 20,
                pollInterval: 10,
            },
        })
            .on('add', handleTransform)
            .on('change', handleTransform)
            .on('unlink', (rltFilePath) => {
            const isTsFile = /\.tsx?$/.test(rltFilePath);
            const config = opts.configProvider.getConfigForFile(rltFilePath);
            // no config means it was ignored in current compile-time
            // such as esm file in cjs compile-time
            if (config) {
                const fileDistAbsPath = path_1.default.join(opts.cwd, config.output, path_1.default.relative(config.input, rltFilePath));
                // TODO: collect real emit files
                const relatedFiles = isTsFile
                    ? [
                        replacePathExt(fileDistAbsPath, '.js'),
                        replacePathExt(fileDistAbsPath, '.d.ts'),
                        replacePathExt(fileDistAbsPath, '.d.ts.map'),
                    ]
                    : [fileDistAbsPath];
                const relatedMainFile = relatedFiles.find((item) => fs_1.default.existsSync(item));
                if (relatedMainFile) {
                    relatedFiles.forEach((file) => utils_1.rimraf.sync(file));
                    utils_2.logger.quietExpect.event(`Bundless ${utils_1.chalk.gray(path_1.default.relative(opts.cwd, relatedMainFile))} is removed`);
                }
            }
        })
            .on('unlinkDir', (rltDirPath) => {
            const config = opts.configProvider.getConfigForFile(rltDirPath);
            // no config means it was ignored in current compile-time
            // such as esm file in cjs compile-time
            if (config) {
                const dirDistAbsPath = path_1.default.join(opts.cwd, config.output, path_1.default.relative(config.input, rltDirPath));
                // there are file removal logs above, so we don't need to log here
                utils_1.rimraf.sync(dirDistAbsPath);
            }
        });
        return watcher;
    }
}
exports.default = bundless;
