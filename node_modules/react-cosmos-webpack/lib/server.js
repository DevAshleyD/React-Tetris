'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackDevMiddleware = require('webpack-dev-middleware');

var _webpackDevMiddleware2 = _interopRequireDefault(_webpackDevMiddleware);

var _webpackHotMiddleware = require('webpack-hot-middleware');

var _webpackHotMiddleware2 = _interopRequireDefault(_webpackHotMiddleware);

var _yargs = require('yargs');

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

var getPublicPath = function getPublicPath(cosmosConfig, userWebpackConfig) {
  return cosmosConfig.publicPath || userWebpackConfig.devServer && userWebpackConfig.devServer.contentBase;
};

module.exports = function startServer() {
  var cosmosConfigPath = _yargs.argv.config;
  var cosmosConfig = (0, _reactCosmosConfig2.default)(cosmosConfigPath);

  var hostname = cosmosConfig.hostname,
      hot = cosmosConfig.hot,
      port = cosmosConfig.port,
      webpackConfigPath = cosmosConfig.webpackConfigPath;


  var userWebpackConfig = void 0;
  if (moduleExists(webpackConfigPath)) {
    console.log('[Cosmos] Using webpack config found at ' + webpackConfigPath);
    userWebpackConfig = (0, _importModule2.default)(require(webpackConfigPath));
  } else {
    console.log('[Cosmos] No webpack config found, using default configuration');
    userWebpackConfig = (0, _defaultWebpackConfig2.default)();
  }

  var cosmosWebpackConfig = (0, _webpackConfig2.default)(userWebpackConfig, cosmosConfigPath);
  var compiler = (0, _webpack2.default)(cosmosWebpackConfig);
  var app = (0, _express2.default)();

  app.use((0, _webpackDevMiddleware2.default)(compiler, {
    publicPath: '/loader/',
    noInfo: true
  }));

  if (hot) {
    app.use((0, _webpackHotMiddleware2.default)(compiler));
  }

  var publicPath = getPublicPath(cosmosConfig, userWebpackConfig);
  if (publicPath) {
    console.log('[Cosmos] Serving static files from ' + publicPath);
    app.use('/loader/', _express2.default.static(publicPath));
  }

  app.get('/', function (req, res) {
    res.sendFile(_path2.default.join(__dirname, 'static/index.html'));
  });

  app.get('/favicon.ico', function (req, res) {
    res.sendFile(_path2.default.join(__dirname, 'static/favicon.ico'));
  });

  app.listen(port, hostname, function (err) {
    if (err) {
      throw err;
    }
    console.log('[Cosmos] See you at http://' + hostname + ':' + port + '/');
  });
};