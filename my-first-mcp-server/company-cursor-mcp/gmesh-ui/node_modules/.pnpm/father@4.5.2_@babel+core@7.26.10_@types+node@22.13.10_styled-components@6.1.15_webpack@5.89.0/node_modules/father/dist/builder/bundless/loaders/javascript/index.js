"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTransformer = void 0;
const utils_1 = require("@umijs/utils");
const dts_1 = require("../../dts");
const transformers = {};
/**
 * add javascript transformer
 * @param item
 */
function addTransformer(item) {
    const mod = require(item.transformer);
    const transformer = mod.default || mod;
    transformers[item.id] = transformer;
}
exports.addTransformer = addTransformer;
/**
 * builtin javascript loader
 */
const jsLoader = function (content) {
    const transformer = this.transformers[this.config.transformer];
    if (typeof transformer.fn !== 'function') {
        const mod = require(this.transformers[this.config.transformer]
            .resolvePath);
        transformer.fn = mod.default || mod;
    }
    const outputOpts = {};
    // specify output ext for non-js file
    if (/\.(jsx|tsx?)$/.test(this.resource)) {
        outputOpts.ext = '.js';
    }
    // mark for output declaration file
    const tsconfig = /\.tsx?$/.test(this.resource)
        ? (0, dts_1.getTsconfig)(this.context)
        : undefined;
    if ((tsconfig === null || tsconfig === void 0 ? void 0 : tsconfig.options.declaration) &&
        (tsconfig === null || tsconfig === void 0 ? void 0 : tsconfig.fileNames.includes((0, utils_1.winPath)(this.resource)))) {
        outputOpts.declaration = true;
    }
    const ret = transformer.fn.call({
        config: this.config,
        pkg: this.pkg,
        paths: {
            cwd: this.cwd,
            fileAbsPath: this.resource,
            itemDistAbsPath: this.itemDistAbsPath,
        },
    }, content.toString());
    // handle async transformer
    if (ret instanceof Promise) {
        const cb = this.async();
        ret.then((r) => {
            outputOpts.map = r[1];
            this.setOutputOptions(outputOpts);
            cb(null, r[0]);
        }, (e) => cb(e));
    }
    else {
        outputOpts.map = ret[1];
        this.setOutputOptions(outputOpts);
        return ret[0];
    }
};
exports.default = jsLoader;
