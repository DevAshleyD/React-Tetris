'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _createLoaderElement = require('./create-loader-element');

var _createLoaderElement2 = _interopRequireDefault(_createLoaderElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var domContainer = void 0;

var createDomContainer = function createDomContainer() {
  if (!domContainer) {
    domContainer = document.createElement('div');
    Object.assign(domContainer.style, {
      position: 'absolute',
      width: '100%',
      height: '100%'
    });
    document.body.appendChild(domContainer);
  }

  return domContainer;
};

exports.default = function (_ref) {
  var proxies = _ref.proxies,
      components = _ref.components,
      fixtures = _ref.fixtures,
      containerQuerySelector = _ref.containerQuerySelector;

  var container = containerQuerySelector ? document.querySelector(containerQuerySelector) : createDomContainer();

  _reactDom2.default.render((0, _createLoaderElement2.default)({
    proxies: proxies,
    components: components,
    fixtures: fixtures
  }), container);
};