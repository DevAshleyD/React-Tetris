'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _yargs = require('yargs');

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _webpackConfig = require('./webpack-config');

var _webpackConfig2 = _interopRequireDefault(_webpackConfig);

var _defaultWebpackConfig = require('./default-webpack-config');

var _defaultWebpackConfig2 = _interopRequireDefault(_defaultWebpackConfig);

var _importModule = require('react-cosmos-utils/lib/import-module');

var _importModule2 = _interopRequireDefault(_importModule);

var _reactCosmosConfig = require('react-cosmos-config');

var _reactCosmosConfig2 = _interopRequireDefault(_reactCosmosConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var moduleExists = function moduleExists(modulePath) {
  try {
    return modulePath && require.resolve(modulePath) && true;
  } catch (err) {
    return false;
  }
};

var arrangeExportInOutputPath = function arrangeExportInOutputPath(outputPath) {
  _fsExtra2.default.copySync(outputPath + '/bundle.js', outputPath + '/loader/bundle.js');
  _fsExtra2.default.copySync(outputPath + '/index.html', outputPath + '/loader/index.html');
  _fsExtra2.default.removeSync(outputPath + '/bundle.js');
  _fsExtra2.default.removeSync(outputPath + '/index.html');
  _fsExtra2.default.copySync(_path2.default.join(__dirname, 'static/favicon.ico'), outputPath + '/favicon.ico');
  _fsExtra2.default.copySync(_path2.default.join(__dirname, 'static/index.html'), outputPath + '/index.html');
};

module.exports = function startExport() {
  var cosmosConfigPath = _yargs.argv.config;
  var cosmosConfig = (0, _reactCosmosConfig2.default)(cosmosConfigPath);

  var webpackConfigPath = cosmosConfig.webpackConfigPath,
      outputPath = cosmosConfig.outputPath;


  var userWebpackConfig = void 0;
  if (moduleExists(webpackConfigPath)) {
    console.log('[Cosmos] Using webpack config found at ' + webpackConfigPath);
    userWebpackConfig = (0, _importModule2.default)(require(webpackConfigPath));
  } else {
    console.log('[Cosmos] No webpack config found, using default configuration');
    userWebpackConfig = (0, _defaultWebpackConfig2.default)();
  }

  var cosmosWebpackConfig = (0, _webpackConfig2.default)(userWebpackConfig, cosmosConfigPath, true);
  var compiler = (0, _webpack2.default)(cosmosWebpackConfig);

  compiler.run(function (err, stats) {
    if (err) {
      console.error('[Cosmos] Export Failed! See error below:');
      console.error(err);
    } else {
      console.log(stats);
      try {
        arrangeExportInOutputPath(outputPath);
      } catch (err) {
        console.error('[Cosmos] Export Failed! See error below:');
        console.error(err);
      }
      console.log('[Cosmos] Export Complete! Find the exported files here:\n' + outputPath);
    }
  });
};