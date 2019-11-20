'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = createStateProxy;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash.isequal');

var _lodash2 = _interopRequireDefault(_lodash);

var _reactComponentTree = require('react-component-tree');

var _reactComponentTree2 = _interopRequireDefault(_reactComponentTree);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaults = {
  fixtureKey: 'state',
  // How often to read current state of loaded component and report it up the
  // chain of proxies
  updateInterval: 500
};

function createStateProxy(options) {
  var _defaults$options = _extends({}, defaults, options),
      fixtureKey = _defaults$options.fixtureKey,
      updateInterval = _defaults$options.updateInterval;

  var StateProxy = function (_React$Component) {
    _inherits(StateProxy, _React$Component);

    function StateProxy(props) {
      _classCallCheck(this, StateProxy);

      var _this = _possibleConstructorReturn(this, (StateProxy.__proto__ || Object.getPrototypeOf(StateProxy)).call(this, props));

      _this.onComponentRef = _this.onComponentRef.bind(_this);
      _this.onStateUpdate = _this.onStateUpdate.bind(_this);
      return _this;
    }

    _createClass(StateProxy, [{
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        clearTimeout(this.timeoutId);
      }
    }, {
      key: 'onComponentRef',
      value: function onComponentRef(componentRef) {
        var _props = this.props,
            fixture = _props.fixture,
            onComponentRef = _props.onComponentRef,
            disableLocalState = _props.disableLocalState;

        // Ref callbacks are also called on unmount with null value

        if (componentRef && !disableLocalState) {
          // Load initial state right after component renders
          var fixtureState = fixture[fixtureKey];
          if (fixtureState) {
            _reactComponentTree2.default.injectState(componentRef, fixtureState);
            this.scheduleStateUpdate();
          } else {
            var initialState = this.getStateTree(componentRef);
            // No need to poll for state changes if entire component tree is stateless
            if (initialState) {
              this.updateState(initialState);
            }
          }
        }

        if (!componentRef) {
          clearTimeout(this.timeoutId);
        }

        // Bubble up component ref
        onComponentRef(this.componentRef = componentRef);
      }
    }, {
      key: 'onStateUpdate',
      value: function onStateUpdate() {
        this.updateState(this.getStateTree(this.componentRef));
      }
    }, {
      key: 'getStateTree',
      value: function getStateTree(componentRef) {
        return _reactComponentTree2.default.serialize(componentRef).state;
      }
    }, {
      key: 'updateState',
      value: function updateState(updatedState) {
        var _props2 = this.props,
            fixture = _props2.fixture,
            onFixtureUpdate = _props2.onFixtureUpdate;


        if (!(0, _lodash2.default)(updatedState, fixture.state)) {
          onFixtureUpdate({
            state: updatedState
          });
        }

        this.scheduleStateUpdate();
      }
    }, {
      key: 'scheduleStateUpdate',
      value: function scheduleStateUpdate() {
        // TODO: Find a better way than polling to hook into state changes
        this.timeoutId = setTimeout(this.onStateUpdate, updateInterval);
      }
    }, {
      key: 'render',
      value: function render() {
        var props = this.props,
            onComponentRef = this.onComponentRef;
        var nextProxy = props.nextProxy;


        return _react2.default.createElement(nextProxy.value, _extends({}, props, {
          nextProxy: nextProxy.next(),
          onComponentRef: onComponentRef
        }));
      }
    }]);

    return StateProxy;
  }(_react2.default.Component);

  StateProxy.defaultProps = {
    // Parent proxies can enable this flag to disable this proxy
    disableLocalState: false
  };

  StateProxy.propTypes = {
    nextProxy: _react2.default.PropTypes.shape({
      value: _react2.default.PropTypes.func,
      next: _react2.default.PropTypes.func
    }).isRequired,
    component: _react2.default.PropTypes.func.isRequired,
    fixture: _react2.default.PropTypes.object.isRequired,
    onComponentRef: _react2.default.PropTypes.func.isRequired,
    onFixtureUpdate: _react2.default.PropTypes.func.isRequired,
    disableLocalState: _react2.default.PropTypes.bool
  };

  return StateProxy;
}