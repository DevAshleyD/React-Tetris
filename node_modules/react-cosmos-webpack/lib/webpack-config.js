'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = getWebpackConfig;

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _lodash = require('lodash.omit');

var _lodash2 = _interopRequireDefault(_lodash);

var _reactCosmosConfig = require('react-cosmos-config');

var _reactCosmosConfig2 = _interopRequireDefault(_reactCosmosConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Extend the user config to create the Loader config. Namely,
 * - Replace the entry and output
 * - Enable hot reloading
 * - Embed the config path to make user configs available on the client-side
 */
function getWebpackConfig(userWebpackConfig, cosmosConfigPath) {
  var shouldExport = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var cosmosConfig = (0, _reactCosmosConfig2.default)(cosmosConfigPath);

  var containerQuerySelector = cosmosConfig.containerQuerySelector,
      globalImports = cosmosConfig.globalImports,
      hmrPlugin = cosmosConfig.hmrPlugin,
      hot = cosmosConfig.hot,
      outputPath = cosmosConfig.outputPath;


  var entry = [].concat(_toConsumableArray(globalImports));

  if (hot && !shouldExport) {
    // It's crucial for Cosmos to not depend on any user loader. This way the
    // webpack configs can point solely to the user deps for loaders.
    entry.push(require.resolve('webpack-hot-middleware/client') + '?reload=true');
  }

  entry.push(require.resolve('./entry'));

  var output = {
    path: shouldExport ? outputPath : '/',
    filename: 'bundle.js',
    publicPath: shouldExport ? './' : '/loader/'
  };

  // To support webpack 1 and 2 configuration formats. So we use the one that user passes
  var webpackRulesOptionName = userWebpackConfig.module && userWebpackConfig.module.rules ? 'rules' : 'loaders';
  var rules = userWebpackConfig.module && userWebpackConfig.module[webpackRulesOptionName] ? [].concat(_toConsumableArray(userWebpackConfig.module[webpackRulesOptionName])) : [];
  var plugins = userWebpackConfig.plugins ? [].concat(_toConsumableArray(userWebpackConfig.plugins)) : [];

  rules.push({
    loader: require.resolve('./module-loader'),
    include: require.resolve('./user-modules'),
    query: {
      cosmosConfigPath: cosmosConfigPath
    }
  });

  plugins.push(new _webpack2.default.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(shouldExport ? 'production' : 'development')
    }
  }));

  plugins.push(new _webpack2.default.DefinePlugin({
    COSMOS_CONFIG: JSON.stringify({
      // Config options that are available inside the client bundle. Warning:
      // Must be serializable!
      containerQuerySelector: containerQuerySelector
    })
  }));

  if (hmrPlugin && !shouldExport) {
    plugins.push(new _webpack2.default.HotModuleReplacementPlugin());
  }

  return _extends({}, userWebpackConfig, {
    entry: entry,
    output: output,
    module: _extends({}, (0, _lodash2.default)(userWebpackConfig.module, 'rules', 'loaders'), _defineProperty({}, webpackRulesOptionName, rules)),
    plugins: plugins
  });
}