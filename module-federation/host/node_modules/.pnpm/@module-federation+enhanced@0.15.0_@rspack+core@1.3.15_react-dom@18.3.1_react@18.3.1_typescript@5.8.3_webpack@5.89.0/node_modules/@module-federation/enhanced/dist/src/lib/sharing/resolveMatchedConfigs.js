"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveMatchedConfigs = resolveMatchedConfigs;
/*
    MIT License http://www.opensource.org/licenses/mit-license.php
    Author Tobias Koppers @sokra, Zackary Jackson @ScriptedAlchemy
*/
const normalize_webpack_path_1 = require("@module-federation/sdk/normalize-webpack-path");
const ModuleNotFoundError = require((0, normalize_webpack_path_1.normalizeWebpackPath)('webpack/lib/ModuleNotFoundError'));
const LazySet = require((0, normalize_webpack_path_1.normalizeWebpackPath)('webpack/lib/util/LazySet'));
const RELATIVE_REQUEST_REGEX = /^\.\.?(\/|$)/;
const ABSOLUTE_PATH_REGEX = /^(\/|[A-Za-z]:\\|\\\\)/;
const RESOLVE_OPTIONS = {
    dependencyType: 'esm',
};
function createCompositeKey(request, config) {
    if (config.issuerLayer) {
        return `(${config.issuerLayer})${request}`;
        // layer unlikely to be used, issuerLayer is what factorize provides
        // which is what we need to create a matching key for
    }
    else if (config.layer) {
        return `(${config.layer})${request}`;
    }
    else {
        return request;
    }
}
// TODO: look at passing dedicated request key instead of infer from object key
async function resolveMatchedConfigs(compilation, configs) {
    const resolved = new Map();
    const unresolved = new Map();
    const prefixed = new Map();
    const resolveContext = {
        fileDependencies: new LazySet(),
        contextDependencies: new LazySet(),
        missingDependencies: new LazySet(),
    };
    const resolver = compilation.resolverFactory.get('normal', RESOLVE_OPTIONS);
    const context = compilation.compiler.context;
    await Promise.all(configs.map(([request, config]) => {
        const resolveRequest = config.request || request;
        if (RELATIVE_REQUEST_REGEX.test(resolveRequest)) {
            // relative request
            return new Promise((resolve) => {
                resolver.resolve({}, context, resolveRequest, resolveContext, (err, result) => {
                    if (err || result === false) {
                        err = err || new Error(`Can't resolve ${resolveRequest}`);
                        compilation.errors.push(new ModuleNotFoundError(null, err, {
                            name: `shared module ${resolveRequest}`,
                        }));
                        return resolve();
                    }
                    resolved.set(result, config);
                    resolve();
                });
            });
        }
        else if (ABSOLUTE_PATH_REGEX.test(resolveRequest)) {
            // absolute path
            resolved.set(resolveRequest, config);
            return undefined;
        }
        else if (resolveRequest.endsWith('/')) {
            // module request prefix
            const key = createCompositeKey(resolveRequest, config);
            prefixed.set(key, config);
            return undefined;
        }
        else {
            // module request
            const key = createCompositeKey(resolveRequest, config);
            unresolved.set(key, config);
            return undefined;
        }
    }));
    compilation.contextDependencies.addAll(resolveContext.contextDependencies);
    compilation.fileDependencies.addAll(resolveContext.fileDependencies);
    compilation.missingDependencies.addAll(resolveContext.missingDependencies);
    return { resolved, unresolved, prefixed };
}
//# sourceMappingURL=resolveMatchedConfigs.js.map