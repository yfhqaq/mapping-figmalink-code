/*
    MIT License http://www.opensource.org/licenses/mit-license.php
    Author Tobias Koppers @sokra and Zackary Jackson @ScriptedAlchemy
*/
'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const normalize_webpack_path_1 = require("@module-federation/sdk/normalize-webpack-path");
const options_1 = require("../container/options");
const ProvideForSharedDependency_1 = __importDefault(require("./ProvideForSharedDependency"));
const ProvideSharedDependency_1 = __importDefault(require("./ProvideSharedDependency"));
const ProvideSharedModuleFactory_1 = __importDefault(require("./ProvideSharedModuleFactory"));
const FederationRuntimePlugin_1 = __importDefault(require("../container/runtime/FederationRuntimePlugin"));
const utils_1 = require("../../utils");
const WebpackError = require((0, normalize_webpack_path_1.normalizeWebpackPath)('webpack/lib/WebpackError'));
const validate = (0, utils_1.createSchemaValidation)(
//eslint-disable-next-line
require('../../schemas/sharing/ProvideSharedPlugin.check.js').validate, () => require('../../schemas/sharing/ProvideSharedPlugin').default, {
    name: 'Provide Shared Plugin',
    baseDataPath: 'options',
});
/**
 * @typedef {Object} ProvideOptions
 * @property {string} shareKey
 * @property {string | string[]} shareScope
 * @property {string | undefined | false} version
 * @property {boolean} eager
 * @property {string} [request] The actual request to use for importing the module
 */
/** @typedef {Map<string, { config: ProvideOptions, version: string | undefined | false }>} ResolvedProvideMap */
// Helper function to create composite key
function createLookupKey(request, config) {
    if (config.layer) {
        return `(${config.layer})${request}`;
    }
    return request;
}
class ProvideSharedPlugin {
    /**
     * @param {ProvideSharedPluginOptions} options options
     */
    constructor(options) {
        validate(options);
        this._provides = (0, options_1.parseOptions)(options.provides, (item) => {
            if (Array.isArray(item))
                throw new Error('Unexpected array of provides');
            /** @type {ProvidesConfig} */
            const result = {
                shareKey: item,
                version: undefined,
                shareScope: options.shareScope || 'default',
                eager: false,
                requiredVersion: false,
                strictVersion: false,
                singleton: false,
                layer: undefined,
                request: item,
            };
            return result;
        }, (item, key) => {
            const request = item.request || key;
            return {
                shareScope: item.shareScope || options.shareScope || 'default',
                shareKey: item.shareKey || request,
                version: item.version,
                eager: !!item.eager,
                requiredVersion: item.requiredVersion,
                strictVersion: item.strictVersion,
                singleton: !!item.singleton,
                layer: item.layer,
                request,
            };
        });
        this._provides.sort(([a], [b]) => {
            if (a < b)
                return -1;
            if (b < a)
                return 1;
            return 0;
        });
    }
    /**
     * Apply the plugin
     * @param {Compiler} compiler the compiler instance
     * @returns {void}
     */
    apply(compiler) {
        new FederationRuntimePlugin_1.default().apply(compiler);
        process.env['FEDERATION_WEBPACK_PATH'] =
            process.env['FEDERATION_WEBPACK_PATH'] || (0, normalize_webpack_path_1.getWebpackPath)(compiler);
        const compilationData = new WeakMap();
        compiler.hooks.compilation.tap('ProvideSharedPlugin', (compilation, { normalModuleFactory }) => {
            const resolvedProvideMap = new Map();
            const matchProvides = new Map();
            const prefixMatchProvides = new Map();
            for (const [request, config] of this._provides) {
                const actualRequest = config.request || request;
                const lookupKey = createLookupKey(actualRequest, config);
                if (/^(\/|[A-Za-z]:\\|\\\\|\.\.?(\/|$))/.test(actualRequest)) {
                    // relative request
                    resolvedProvideMap.set(lookupKey, {
                        config,
                        version: config.version,
                    });
                }
                else if (/^(\/|[A-Za-z]:\\|\\\\)/.test(actualRequest)) {
                    // absolute path
                    resolvedProvideMap.set(lookupKey, {
                        config,
                        version: config.version,
                    });
                }
                else if (actualRequest.endsWith('/')) {
                    // module request prefix
                    prefixMatchProvides.set(lookupKey, config);
                }
                else {
                    // module request
                    matchProvides.set(lookupKey, config);
                }
            }
            compilationData.set(compilation, resolvedProvideMap);
            const provideSharedModule = (key, config, resource, resourceResolveData) => {
                let version = config.version;
                if (version === undefined) {
                    let details = '';
                    if (!resourceResolveData) {
                        details = `No resolve data provided from resolver.`;
                    }
                    else {
                        const descriptionFileData = resourceResolveData.descriptionFileData;
                        if (!descriptionFileData) {
                            details =
                                'No description file (usually package.json) found. Add description file with name and version, or manually specify version in shared config.';
                        }
                        else if (!descriptionFileData.version) {
                            details = `No version in description file (usually package.json). Add version to description file ${resourceResolveData.descriptionFilePath}, or manually specify version in shared config.`;
                        }
                        else {
                            version = descriptionFileData.version;
                        }
                    }
                    if (!version) {
                        const error = new WebpackError(`No version specified and unable to automatically determine one. ${details}`);
                        error.file = `shared module ${key} -> ${resource}`;
                        compilation.warnings.push(error);
                    }
                }
                const lookupKey = createLookupKey(resource, config);
                resolvedProvideMap.set(lookupKey, {
                    config,
                    version,
                    resource,
                });
            };
            normalModuleFactory.hooks.module.tap('ProvideSharedPlugin', (module, { resource, resourceResolveData }, resolveData) => {
                const moduleLayer = module.layer;
                const lookupKey = createLookupKey(resource || '', {
                    layer: moduleLayer || undefined,
                });
                if (resource && resolvedProvideMap.has(lookupKey)) {
                    return module;
                }
                const { request } = resolveData;
                {
                    const requestKey = createLookupKey(request, {
                        layer: moduleLayer || undefined,
                    });
                    const config = matchProvides.get(requestKey);
                    if (config !== undefined && resource) {
                        provideSharedModule(request, config, resource, resourceResolveData);
                        resolveData.cacheable = false;
                    }
                }
                for (const [prefix, config] of prefixMatchProvides) {
                    const lookup = config.request || prefix;
                    if (request.startsWith(lookup) && resource) {
                        const remainder = request.slice(lookup.length);
                        provideSharedModule(resource, {
                            ...config,
                            shareKey: config.shareKey + remainder,
                        }, resource, resourceResolveData);
                        resolveData.cacheable = false;
                    }
                }
                return module;
            });
        });
        compiler.hooks.finishMake.tapPromise('ProvideSharedPlugin', async (compilation) => {
            const resolvedProvideMap = compilationData.get(compilation);
            if (!resolvedProvideMap)
                return;
            await Promise.all(Array.from(resolvedProvideMap, ([resourceKey, { config, version, resource }]) => {
                return new Promise((resolve, reject) => {
                    compilation.addInclude(compiler.context, new ProvideSharedDependency_1.default(config.shareScope, config.shareKey, version || false, resource || resourceKey, config.eager, config.requiredVersion, config.strictVersion, config.singleton, config.layer), {
                        name: undefined,
                    }, (err) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve();
                    });
                });
            }));
        });
        compiler.hooks.compilation.tap('ProvideSharedPlugin', (compilation, { normalModuleFactory }) => {
            compilation.dependencyFactories.set(ProvideForSharedDependency_1.default, normalModuleFactory);
            compilation.dependencyFactories.set(ProvideSharedDependency_1.default, new ProvideSharedModuleFactory_1.default());
        });
    }
}
exports.default = ProvideSharedPlugin;
//# sourceMappingURL=ProvideSharedPlugin.js.map