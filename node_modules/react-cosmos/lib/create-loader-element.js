'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _loadModules = require('./load-modules');

var _Loader = require('./components/Loader');

var _Loader2 = _interopRequireDefault(_Loader);

var _PropsProxy = require('./components/proxies/PropsProxy');

var _PropsProxy2 = _interopRequireDefault(_PropsProxy);

var _StateProxy = require('./components/proxies/StateProxy');

var _StateProxy2 = _interopRequireDefault(_StateProxy);

var _importModule = require('react-cosmos-utils/lib/import-module');

var _importModule2 = _interopRequireDefault(_importModule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var initProxy = function initProxy(proxy) {
  return (0, _importModule2.default)(proxy)();
};

exports.default = function (_ref) {
  var proxies = _ref.proxies,
      components = _ref.components,
      fixtures = _ref.fixtures,
      component = _ref.component,
      fixture = _ref.fixture;
  return _react2.default.createElement(_Loader2.default, {
    components: (0, _loadModules.loadComponents)(components),
    fixtures: (0, _loadModules.loadFixtures)(fixtures),
    component: component,
    fixture: fixture,
    proxies: [].concat(_toConsumableArray(proxies.map(initProxy)), [
    // Loaded by default in all configs
    (0, _StateProxy2.default)(),
    // The final proxy in the chain simply renders the selected component
    _PropsProxy2.default])
  });
};