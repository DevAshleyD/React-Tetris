'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _loadChild2 = require('./load-child');

var _loadChild3 = _interopRequireDefault(_loadChild2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LoadChildComponent = function (_React$Component) {
  _inherits(LoadChildComponent, _React$Component);

  function LoadChildComponent() {
    _classCallCheck(this, LoadChildComponent);

    return _possibleConstructorReturn(this, (LoadChildComponent.__proto__ || Object.getPrototypeOf(LoadChildComponent)).apply(this, arguments));
  }

  _createClass(LoadChildComponent, [{
    key: 'loadChild',
    value: function loadChild(childName, a, b, c, d, e, f) {
      return _loadChild3.default.loadChild(this, childName, a, b, c, d, e, f);
    }
  }]);

  return LoadChildComponent;
}(_react2.default.Component);

module.exports = LoadChildComponent;