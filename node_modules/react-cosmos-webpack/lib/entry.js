'use strict';

/* global window */

var loaderUri = './loader/index.html';
var pathname = window.location.pathname;

var isLoader = pathname.match(/loader\/index\.html$/);

// This has to be done before React is imported. We do it before importing
// anything which might import React
// https://github.com/facebook/react-devtools/issues/76#issuecomment-128091900
if (isLoader && process.env.NODE_ENV === 'development') {
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.parent.__REACT_DEVTOOLS_GLOBAL_HOOK__;
}

var _require = require('react-cosmos'),
    startLoader = _require.startLoader,
    startPlayground = _require.startPlayground;

// eslint-disable-next-line no-undef


var _COSMOS_CONFIG = COSMOS_CONFIG,
    containerQuerySelector = _COSMOS_CONFIG.containerQuerySelector;


var start = function start() {
  // Module is imported whenever this function is called, making sure the
  // lastest module version is used after a HMR update
  var getUserModules = require('./user-modules').default;

  var _getUserModules = getUserModules(),
      components = _getUserModules.components,
      fixtures = _getUserModules.fixtures,
      proxies = _getUserModules.proxies;

  if (isLoader) {
    startLoader({
      proxies: proxies,
      components: components,
      fixtures: fixtures,
      containerQuerySelector: containerQuerySelector
    });
  } else {
    startPlayground({
      fixtures: fixtures,
      loaderUri: loaderUri
    });
  }
};

start();

if (module.hot) {
  module.hot.accept('./user-modules', function () {
    start();
  });
}