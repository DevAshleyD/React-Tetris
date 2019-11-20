'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _lodash = require('lodash.omit');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.isempty');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.foreach');

var _lodash6 = _interopRequireDefault(_lodash5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.render = function (options) {
  /**
   * Render a component and reproduce a state snapshot by recursively injecting
   * the nested state into the component tree it generates.
   *
   * @param {Object} options
   * @param {ReactClass} options.component
   * @param {Object} options.snapshot
   * @param {DOMElement} options.container
   *
   * @returns {ReactComponent} Reference to the rendered component
   */
  var props = (0, _lodash2.default)(options.snapshot, 'state', 'children');
  var state = options.snapshot.state;
  var children = options.snapshot.children;

  var element = _react2.default.createElement(options.component, props, children);
  // TODO: Use callback ref: https://facebook.github.io/react/docs/top-level-api.html#reactdom.render

  var component = _reactDom2.default.render(element, options.container);

  if (!(0, _lodash4.default)(state)) {
    exports.injectState(component, state);
  }

  return component;
};

exports.injectState = function (component, state) {
  var rootState = (0, _lodash2.default)(state, 'children');
  var childrenStates = state.children;

  component.setState(rootState, function () {
    if ((0, _lodash4.default)(childrenStates)) {
      return;
    }

    (0, _lodash6.default)(component.refs, function (child, ref) {
      if (!(0, _lodash4.default)(childrenStates[ref])) {
        exports.injectState(child, childrenStates[ref]);
      }
    });
  });
};