'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PropsProxy = function (_React$Component) {
  _inherits(PropsProxy, _React$Component);

  function PropsProxy() {
    _classCallCheck(this, PropsProxy);

    return _possibleConstructorReturn(this, (PropsProxy.__proto__ || Object.getPrototypeOf(PropsProxy)).apply(this, arguments));
  }

  _createClass(PropsProxy, [{
    key: 'render',

    /**
     * The final proxy in the chain that renders the selected component.
     */
    value: function render() {
      var _props = this.props,
          component = _props.component,
          fixture = _props.fixture,
          onComponentRef = _props.onComponentRef;


      return _react2.default.createElement(component, _extends({}, fixture.props, {
        ref: onComponentRef
      }), fixture.children);
    }
  }]);

  return PropsProxy;
}(_react2.default.Component);

exports.default = PropsProxy;


PropsProxy.propTypes = {
  component: _react2.default.PropTypes.func.isRequired,
  fixture: _react2.default.PropTypes.object.isRequired,
  onComponentRef: _react2.default.PropTypes.func.isRequired
};