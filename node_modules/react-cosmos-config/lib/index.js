'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = getCosmosConfig;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _slash = require('slash');

var _slash2 = _interopRequireDefault(_slash);

var _resolveFrom = require('resolve-from');

var _resolveFrom2 = _interopRequireDefault(_resolveFrom);

var _importModule = require('react-cosmos-utils/lib/import-module');

var _importModule2 = _interopRequireDefault(_importModule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var resolveUserPath = function resolveUserPath(userPath, rootPath) {
  return (0, _slash2.default)(_path2.default.isAbsolute(userPath) ? userPath : (0, _resolveFrom2.default)(rootPath, userPath) || _path2.default.join(rootPath, userPath));
};

var defaults = {
  componentPaths: [],
  fixturePaths: [],
  globalImports: [],
  hmrPlugin: true,
  hostname: 'localhost',
  hot: true,
  ignore: [],
  port: 8989,
  proxies: [],
  webpackConfigPath: 'webpack.config',
  outputPath: 'cosmos-export'
};

function getCosmosConfig() {
  var configPath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'cosmos.config';

  var normalizedConfigPath = resolveUserPath(configPath, process.cwd());
  var userConfig = (0, _importModule2.default)(require(normalizedConfigPath));
  var rootPath = _path2.default.dirname(normalizedConfigPath);

  var config = _extends({}, defaults, userConfig);
  var resolvedConfig = Object.keys(config).reduce(function (result, key) {
    if (['componentPaths', 'fixturePaths', 'globalImports', 'proxies'].indexOf(key) > -1) {
      result[key] = config[key].map(function (path) {
        return resolveUserPath(path, rootPath);
      });
    } else if (['publicPath', 'webpackConfigPath', 'outputPath'].indexOf(key) > -1) {
      result[key] = resolveUserPath(config[key], rootPath);
    } else {
      result[key] = config[key];
    }

    return result;
  }, {});

  return resolvedConfig;
}