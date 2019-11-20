'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _uri = require('./uri');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var getCurrentLocation = function getCurrentLocation() {
  return window.location.href;
};

var Router = function () {
  function Router(options) {
    _classCallCheck(this, Router);

    this.options = options;

    this.routeLink = this.routeLink.bind(this);
    this.onPopState = this.onPopState.bind(this);

    window.addEventListener('popstate', this.onPopState);

    // The initial render is done instantly when the Router instance is created
    this.loadParams((0, _uri.parseLocation)(getCurrentLocation()));
  }

  _createClass(Router, [{
    key: 'stop',
    value: function stop() {
      window.removeEventListener('popstate', this.onPopState);
    }
  }, {
    key: 'routeLink',
    value: function routeLink(event) {
      /**
       * Any <a> tag can have this method bound to its onClick event to have
       * their corresponding href location picked up by the built-in Router
       * implementation, which uses pushState to switch between Components
       * instead of reloading pages.
       */
      event.preventDefault();

      this.pushLocation(event.currentTarget.href);
    }
  }, {
    key: 'goTo',
    value: function goTo(location) {
      this.pushLocation(location);
    }
  }, {
    key: 'onPopState',
    value: function onPopState() {
      var location = getCurrentLocation();
      var params = (0, _uri.parseLocation)(location);

      this.loadParams(params);
    }
  }, {
    key: 'pushLocation',
    value: function pushLocation(location) {
      // Old-school refreshes are made when pushState isn't supported
      if (!window.history.pushState) {
        window.location = location;
        return;
      }

      // Create a history entry for the new component
      window.history.pushState({}, '', location);

      this.loadParams((0, _uri.parseLocation)(location));
    }
  }, {
    key: 'loadParams',
    value: function loadParams(params) {
      var _options = this.options,
          getComponentClass = _options.getComponentClass,
          getComponentProps = _options.getComponentProps,
          container = _options.container,
          onChange = _options.onChange;

      var ComponentClass = getComponentClass(params);
      var props = _extends({}, getComponentProps(params), {
        // Always send the components a reference to the router. This makes it
        // possible for a component to change the page through the router and
        // not have to rely on any sort of globals
        // TODO: Send only methods instead
        router: this
      });
      var componentElement = _react2.default.createElement(ComponentClass, props);

      _reactDom2.default.render(componentElement, container);

      if (typeof onChange === 'function') {
        onChange.call(this, params);
      }
    }
  }]);

  return Router;
}();

exports.default = Router;