import { defaultExclude, defaultExtensions } from "./constants";
import { createTestExclude } from "./webpack5-exclude";
import { getNycConfig } from "./nyc-config";
import { createInstrumenter } from "istanbul-lib-instrument";
export const viteFinal = async (viteConfig, options) => {
  var _options$istanbul, _options$istanbul2, _options$istanbul3;

  const istanbul = require("vite-plugin-istanbul");

  console.log("[addon-coverage] Adding istanbul plugin to Vite config");
  viteConfig.build = viteConfig.build || {};
  viteConfig.build.sourcemap = true;
  viteConfig.plugins ||= [];
  viteConfig.plugins.push(istanbul({
    forceBuildInstrument: options.configType === "PRODUCTION",
    ...options.istanbul,
    include: Array.from(((_options$istanbul = options.istanbul) === null || _options$istanbul === void 0 ? void 0 : _options$istanbul.include) || []),
    exclude: [options.configDir + "/**", ...defaultExclude, ...Array.from(((_options$istanbul2 = options.istanbul) === null || _options$istanbul2 === void 0 ? void 0 : _options$istanbul2.exclude) || [])],
    extension: ((_options$istanbul3 = options.istanbul) === null || _options$istanbul3 === void 0 ? void 0 : _options$istanbul3.extension) || defaultExtensions
  }));
  return viteConfig;
};
const defaultOptions = {
  preserveComments: true,
  produceSourceMap: true,
  autoWrap: true,
  esModules: true,
  compact: false
};
export const webpackFinal = async (webpackConfig, options) => {
  var _options$istanbul4;

  webpackConfig.module.rules ||= [];
  const nycConfig = await getNycConfig(options.istanbul);
  const extensions = ((_options$istanbul4 = options.istanbul) === null || _options$istanbul4 === void 0 ? void 0 : _options$istanbul4.extension) ?? nycConfig.extension ?? defaultExtensions;
  console.log("[addon-coverage] Adding istanbul loader to Webpack config");
  const testExclude = await createTestExclude(options.istanbul);
  let instrumenterOptions = Object.assign(defaultOptions, options.istanbul);
  let instrumenter = createInstrumenter(instrumenterOptions);
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