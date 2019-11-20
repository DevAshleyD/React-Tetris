'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = createReduxProxy;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaults = {
  fixtureKey: 'reduxState',
  alwaysCreateStore: false,
  disableLocalState: true
};

function createReduxProxy(options) {
  var _defaults$options = _extends({}, defaults, options),
      fixtureKey = _defaults$options.fixtureKey,
      createStore = _defaults$options.createStore,
      alwaysCreateStore = _defaults$options.alwaysCreateStore,
      disableLocalState = _defaults$options.disableLocalState;

  var ReduxProxy = function (_React$Component) {
    _inherits(ReduxProxy, _React$Component);

    function ReduxProxy(props) {
      _classCallCheck(this, ReduxProxy);

      var _this = _possibleConstructorReturn(this, (ReduxProxy.__proto__ || Object.getPrototypeOf(ReduxProxy)).call(this, props));

      _this.onStoreChange = _this.onStoreChange.bind(_this);

      var fixtureReduxState = props.fixture[fixtureKey];
      if (alwaysCreateStore || fixtureReduxState) {
        _this.store = createStore(fixtureReduxState);
      }
      return _this;
    }

    _createClass(ReduxProxy, [{
      key: 'getChildContext',
      value: function getChildContext() {
        return {
          store: this.store
        };
      }
    }, {
      key: 'componentWillMount',
      value: function componentWillMount() {
        var store = this.store,
            onStoreChange = this.onStoreChange;

        if (store) {
          this.storeUnsubscribe = store.subscribe(onStoreChange);
        }
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        if (this.storeUnsubscribe) {
          this.storeUnsubscribe();
        }
      }
    }, {
      key: 'onStoreChange',
      value: function onStoreChange() {
        var onFixtureUpdate = this.props.onFixtureUpdate;

        var updatedState = this.store.getState();

        onFixtureUpdate(_defineProperty({}, fixtureKey, updatedState));
      }
    }, {
      key: 'render',
      value: function render() {
        var _props = this.props,
            nextProxy = _props.nextProxy,
            fixture = _props.fixture,
            onComponentRef = _props.onComponentRef;


        return _react2.default.createElement(nextProxy.value, _extends({}, this.props, {
          nextProxy: nextProxy.next(),
          fixture: fixture,
          onComponentRef: onComponentRef,
          // Disable StateProxy when Redux state is available, otherwise the entire
          // Redux store would be duplicated from the connect() component's state
          disableLocalState: disableLocalState && Boolean(this.store)
        }));
      }
    }]);

    return ReduxProxy;
  }(_react2.default.Component);

  ReduxProxy.propTypes = {
    nextProxy: _react2.default.PropTypes.shape({
      value: _react2.default.PropTypes.func,
      next: _react2.default.PropTypes.func
    }).isRequired,
    component: _react2.default.PropTypes.func.isRequired,
    fixture: _react2.default.PropTypes.object.isRequired,
    onComponentRef: _react2.default.PropTypes.func.isRequired,
    onFixtureUpdate: _react2.default.PropTypes.func.isRequired
  };

  ReduxProxy.childContextTypes = {
    store: _react2.default.PropTypes.object
  };

  return ReduxProxy;
}