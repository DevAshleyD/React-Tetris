'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  Mixin: require('./load-child-mixin'),
  // React <0.13 didn't have ES6 classes
  Component: _react2.default.Component ? require('./load-child-component') : null,
  loadChild: require('./load-child'),
  serialize: require('./serialize').serialize,
  render: require('./render').render,
  injectState: require('./render').injectState
};