"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.webpackFinal = exports.viteFinal = void 0;

var _constants = require("./constants");

var _webpack5Exclude = require("./webpack5-exclude");

var _nycConfig = require("./nyc-config");

var _istanbulLibInstrument = require("istanbul-lib-instrument");

const viteFinal = async (viteConfig, options) => {
  var _options$istanbul, _options$istanbul2, _options$istanbul3;

  const istanbul = require("vite-plugin-istanbul");

  console.log("[addon-coverage] Adding istanbul plugin to Vite config");
  viteConfig.build = viteConfig.build || {};
  viteConfig.build.sourcemap = true;
  viteConfig.plugins || (viteConfig.plugins = []);
  viteConfig.plugins.push(istanbul({
    forceBuildInstrument: options.configType === "PRODUCTION",
    ...options.istanbul,
    include: Array.from(((_options$istanbul = options.istanbul) === null || _options$istanbul === void 0 ? void 0 : _options$istanbul.include) || []),
    exclude: [options.configDir + "/**", ..._constants.defaultExclude, ...Array.from(((_options$istanbul2 = options.istanbul) === null || _options$istanbul2 === void 0 ? void 0 : _options$istanbul2.exclude) || [])],
    extension: ((_options$istanbul3 = options.istanbul) === null || _options$istanbul3 === void 0 ? void 0 : _options$istanbul3.extension) || _constants.defaultExtensions
  }));
  return viteConfig;
};

exports.viteFinal = viteFinal;
const defaultOptions = {
  preserveComments: true,
  produceSourceMap: true,
  autoWrap: true,
  esModules: true,
  compact: false
};

const webpackFinal = async (webpackConfig, options) => {
  var _webpackConfig$module, _options$istanbul4;

  (_webpackConfig$module = webpackConfig.module).rules || (_webpackConfig$module.rules = []);
  const nycConfig = await (0, _nycConfig.getNycConfig)(options.istanbul);
  const extensions = ((_options$istanbul4 = options.istanbul) === null || _options$istanbul4 === void 0 ? void 0 : _options$istanbul4.extension) ?? nycConfig.extension ?? _constants.defaultExtensions;
  console.log("[addon-coverage] Adding istanbul loader to Webpack config");
  const testExclude = await (0, _webpack5Exclude.createTestExclude)(options.istanbul);
  let instrumenterOptions = Object.assign(defaultOptions, options.istanbul);
  let instrumenter = (0, _istanbulLibInstrument.createInstrumenter)(instrumenterOptions);
  webpackConfig.module.rules.unshift({
    test: new RegExp(extensions === null || extensions === void 0 ? void 0 : extensions.join("|").replace(/\./g, "\\.")),
    loader: require.resolve("./loader/webpack5-istanbul-loader"),
    enforce: "post",
    options: { ...(options.istanbul ?? {}),
      instrumenter
    },
    include: modulePath => testExclude.shouldInstrument(modulePath)
  });
  return webpackConfig;
};

exports.webpackFinal = webpackFinal;