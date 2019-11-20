'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = startPlayground;

var _loadModules = require('./load-modules');

var _reactQuerystringRouter = require('react-querystring-router');

var _reactComponentPlayground = require('react-component-playground');

var _reactComponentPlayground2 = _interopRequireDefault(_reactComponentPlayground);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getTitleForFixture = function getTitleForFixture(params) {
  var component = params.component,
      fixture = params.fixture;

  var title = 'React Cosmos';

  // Set document title to the name of the selected fixture
  if (component && fixture) {
    return component + ':' + fixture + ' \u2013 ' + title;
  }

  return title;
};

var domContainer = void 0;

var createDomContainer = function createDomContainer() {
  if (!domContainer) {
    domContainer = document.createElement('div');
    document.body.appendChild(domContainer);
  }
  return domContainer;
};

function startPlayground(_ref) {
  var fixtures = _ref.fixtures,
      loaderUri = _ref.loaderUri;

  return new _reactQuerystringRouter.Router({
    container: createDomContainer(),
    getComponentClass: function getComponentClass() {
      return _reactComponentPlayground2.default;
    },
    getComponentProps: function getComponentProps(params) {
      return _extends({}, params, {
        fixtures: (0, _loadModules.loadFixtures)(fixtures),
        loaderUri: loaderUri
      });
    },
    onChange: function onChange(params) {
      document.title = getTitleForFixture(params);
    }
  });
}