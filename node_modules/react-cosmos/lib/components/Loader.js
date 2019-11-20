'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash.merge');

var _lodash2 = _interopRequireDefault(_lodash);

var _unserializableParts = require('react-cosmos-utils/lib/unserializable-parts');

var _unserializableParts2 = _interopRequireDefault(_unserializableParts);

var _linkedList = require('react-cosmos-utils/lib/linked-list');

var _linkedList2 = _interopRequireDefault(_linkedList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var getUpdateId = function getUpdateId() {
  return Date.now();
};

var hasInitialFixture = function hasInitialFixture(_ref) {
  var component = _ref.component,
      fixture = _ref.fixture;
  return Boolean(component && fixture);
};

var getFixtureState = function getFixtureState(_ref2) {
  var fixtures = _ref2.fixtures,
      component = _ref2.component,
      fixture = _ref2.fixture,
      fixtureBody = _ref2.fixtureBody;

  if (!hasInitialFixture({ component: component, fixture: fixture })) {
    // Nothing is rendered until parent frame says so
    return {
      component: null,
      fixture: {
        unserializable: {},
        serializable: {}
      },
      fixtureUpdateId: 0
    };
  }

  var _splitUnserializableP = (0, _unserializableParts2.default)(fixtures[component][fixture]),
      unserializable = _splitUnserializableP.unserializable,
      serializable = _splitUnserializableP.serializable;

  return {
    component: component,
    fixture: {
      unserializable: unserializable,
      serializable: fixtureBody || serializable
    },
    // Used as React Element key to ensure loaded components are rebuilt on
    // every fixture change (instead of reusing instance and going down the
    // componentWillReceiveProps route)
    fixtureUpdateId: getUpdateId()
  };
};

var Loader = function (_React$Component) {
  _inherits(Loader, _React$Component);

  /**
   * Isolated loader for React components.
   *
   * Renders components using fixtures and Proxy middleware. Supports two modes:
   * 1. Controlled programatically by a parent frame (via postMessage protocol).
   * 2. Initialized via props (component & fixture)
   *
   * It both receives fixture changes from parent frame and sends fixture
   * updates bubbled up from proxy chain (due to state changes) to parent frame.
   */
  function Loader(props) {
    _classCallCheck(this, Loader);

    var _this = _possibleConstructorReturn(this, (Loader.__proto__ || Object.getPrototypeOf(Loader)).call(this, props));

    _this.onMessage = _this.onMessage.bind(_this);

    // Cache linked list to reuse between lifecycles (proxy list never changes)
    _this.firstProxy = (0, _linkedList2.default)(props.proxies);

    _this.state = getFixtureState(props);
    return _this;
  }

  _createClass(Loader, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (!hasInitialFixture(this.props)) {
        window.addEventListener('message', this.onMessage, false);

        // Let parent know loader is ready to render
        parent.postMessage({ type: 'frameReady' }, '*');
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (!hasInitialFixture(this.props)) {
        window.removeEventListener('message', this.onMessage);
      }
    }
  }, {
    key: 'onMessage',
    value: function onMessage(_ref3) {
      var data = _ref3.data;

      if (data.type === 'fixtureLoad') {
        var component = data.component,
            fixture = data.fixture,
            fixtureBody = data.fixtureBody;


        this.setState(getFixtureState({
          fixtures: this.props.fixtures,
          component: component,
          fixture: fixture,
          fixtureBody: fixtureBody
        }));
      }
    }
  }, {
    key: 'onFixtureUpdate',
    value: function onFixtureUpdate(fixtureBody) {
      parent.postMessage({
        type: 'fixtureUpdate',
        fixtureBody: fixtureBody
      }, '*');
    }
  }, {
    key: 'render',
    value: function render() {
      var props = this.props,
          state = this.state,
          firstProxy = this.firstProxy,
          onFixtureUpdate = this.onFixtureUpdate;
      var components = props.components;
      var component = state.component,
          fixture = state.fixture,
          fixtureUpdateId = state.fixtureUpdateId;


      if (!component) {
        return null;
      }

      return _react2.default.createElement(firstProxy.value, {
        key: fixtureUpdateId,
        nextProxy: firstProxy.next(),
        component: components[component],
        fixture: (0, _lodash2.default)(fixture.unserializable, fixture.serializable),
        onComponentRef: function onComponentRef() {/* noope */},
        onFixtureUpdate: onFixtureUpdate
      });
    }
  }]);

  return Loader;
}(_react2.default.Component);

Loader.propTypes = {
  components: _react2.default.PropTypes.object.isRequired,
  fixtures: _react2.default.PropTypes.object.isRequired,
  proxies: _react2.default.PropTypes.array.isRequired,
  component: _react2.default.PropTypes.string,
  fixture: _react2.default.PropTypes.string
};

exports.default = Loader;