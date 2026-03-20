"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IFatherBundlessTypes = exports.IFatherPlatformTypes = exports.IFatherJSTransformerTypes = exports.IFatherBuildTypes = void 0;
var IFatherBuildTypes;
(function (IFatherBuildTypes) {
    IFatherBuildTypes["BUNDLE"] = "bundle";
    IFatherBuildTypes["BUNDLESS"] = "bundless";
})(IFatherBuildTypes || (exports.IFatherBuildTypes = IFatherBuildTypes = {}));
var IFatherJSTransformerTypes;
(function (IFatherJSTransformerTypes) {
    IFatherJSTransformerTypes["BABEL"] = "babel";
    IFatherJSTransformerTypes["ESBUILD"] = "esbuild";
    IFatherJSTransformerTypes["SWC"] = "swc";
})(IFatherJSTransformerTypes || (exports.IFatherJSTransformerTypes = IFatherJSTransformerTypes = {}));
var IFatherPlatformTypes;
(function (IFatherPlatformTypes) {
    IFatherPlatformTypes["NODE"] = "node";
    IFatherPlatformTypes["BROWSER"] = "browser";
})(IFatherPlatformTypes || (exports.IFatherPlatformTypes = IFatherPlatformTypes = {}));
var IFatherBundlessTypes;
(function (IFatherBundlessTypes) {
    IFatherBundlessTypes["ESM"] = "esm";
    IFatherBundlessTypes["CJS"] = "cjs";
})(IFatherBundlessTypes || (exports.IFatherBundlessTypes = IFatherBundlessTypes = {}));
