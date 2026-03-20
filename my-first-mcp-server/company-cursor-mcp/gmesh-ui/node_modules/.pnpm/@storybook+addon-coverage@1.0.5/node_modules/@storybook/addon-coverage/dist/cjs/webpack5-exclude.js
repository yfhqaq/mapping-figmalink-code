"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTestExclude = createTestExclude;

var _testExclude = _interopRequireDefault(require("test-exclude"));

var _constants = require("./constants");

var _nycConfig = require("./nyc-config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function createTestExclude(opts = {}) {
  const {
    nycrcPath,
    include,
    exclude,
    extension
  } = opts;
  const cwd = opts.cwd ?? process.cwd();
  const nycConfig = await (0, _nycConfig.getNycConfig)({
    cwd,
    nycrcPath
  });
  return new _testExclude.default({
    cwd,
    include: include ?? nycConfig.include,
    exclude: exclude ?? nycConfig.exclude ?? _constants.defaultExclude,
    extension: extension ?? nycConfig.extension ?? _constants.defaultExtensions,
    excludeNodeModules: true
  });
}