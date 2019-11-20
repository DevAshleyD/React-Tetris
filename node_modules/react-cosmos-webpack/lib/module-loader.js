'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _slash = require('slash');

var _slash2 = _interopRequireDefault(_slash);

var _loaderUtils = require('loader-utils');

var _loaderUtils2 = _interopRequireDefault(_loaderUtils);

var _traverse = require('traverse');

var _traverse2 = _interopRequireDefault(_traverse);

var _reactCosmosConfig = require('react-cosmos-config');

var _reactCosmosConfig2 = _interopRequireDefault(_reactCosmosConfig);

var _reactCosmosVoyager = require('react-cosmos-voyager');

var _reactCosmosVoyager2 = _interopRequireDefault(_reactCosmosVoyager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var jsonLoader = (0, _slash2.default)(require.resolve('json-loader'));

var getRequirePath = function getRequirePath(filePath) {
  return _path2.default.extname(filePath) === '.json' ? jsonLoader + '!' + filePath : filePath;
};

var convertPathToRequireCall = function convertPathToRequireCall(p) {
  return 'require(\'' + getRequirePath(p) + '\')';
};

var convertPathMapToRequireCalls = function convertPathMapToRequireCalls(paths) {
  var props = [];

  Object.keys(paths).forEach(function (key) {
    var val = paths[key];
    var newVal = typeof val === 'string' ? convertPathToRequireCall(val) : convertPathMapToRequireCalls(val);

    props.push('\'' + key + '\':' + newVal);
  });

  return '{' + props.join(',') + '}';
};

var convertPathListToRequireCalls = function convertPathListToRequireCalls(paths) {
  return '[' + paths.map(convertPathToRequireCall).join(',') + ']';
};

var getUniqueDirsOfUserModules = function getUniqueDirsOfUserModules(components, fixtures) {
  var dirs = new Set();

  (0, _traverse2.default)(components).forEach(function (val) {
    if (typeof val === 'string') {
      dirs.add(_path2.default.dirname(val));
    }
  });
  (0, _traverse2.default)(fixtures).forEach(function (val) {
    if (typeof val === 'string') {
      dirs.add(_path2.default.dirname(val));
    }
  });

  return [].concat(_toConsumableArray(dirs));
};

var convertDirPathsToContextCalls = function convertDirPathsToContextCalls(dirPaths) {
  return '[' + dirPaths.map(function (dirPath) {
    return 'require.context(\'' + dirPath + '\', false, /\\.jsx?$/)';
  }) + ']';
};

/**
 * Inject require calls in bundle for each component/fixture path and
 * require.context calls for each dir with user modules. Tells webpack to
 * - Bundle all necessary component/fixture modules
 * - Watch for (and react to) added and changed component/fixture files
 */
module.exports = function embedModules(source) {
  var _this = this;

  var _loaderUtils$parseQue = _loaderUtils2.default.parseQuery(this.query),
      cosmosConfigPath = _loaderUtils$parseQue.cosmosConfigPath;

  var cosmosConfig = (0, _reactCosmosConfig2.default)(cosmosConfigPath);

  var _getFilePaths = (0, _reactCosmosVoyager2.default)(cosmosConfig),
      components = _getFilePaths.components,
      fixtures = _getFilePaths.fixtures;

  var proxies = cosmosConfig.proxies;

  var contexts = getUniqueDirsOfUserModules(components, fixtures);

  contexts.forEach(function (dirPath) {
    // This ensures this loader is invalidated whenever a new component/fixture
    // file is created or renamed, which leads succesfully uda ...
    _this.addDependency(dirPath);
  });

  return source.replace(/COMPONENTS/g, convertPathMapToRequireCalls(components)).replace(/FIXTURES/g, convertPathMapToRequireCalls(fixtures)).replace(/PROXIES/g, convertPathListToRequireCalls(proxies)).replace(/CONTEXTS/g, convertDirPathsToContextCalls(contexts));
};