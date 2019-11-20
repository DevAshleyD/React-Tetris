'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _reactTestRenderer = require('react-test-renderer');

var _reactTestRenderer2 = _interopRequireDefault(_reactTestRenderer);

var _reactCosmosConfig = require('react-cosmos-config');

var _reactCosmosConfig2 = _interopRequireDefault(_reactCosmosConfig);

var _reactCosmosVoyager = require('react-cosmos-voyager');

var _reactCosmosVoyager2 = _interopRequireDefault(_reactCosmosVoyager);

var _reactCosmos = require('react-cosmos');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var keys = Object.keys;


var importFileTree = function importFileTree(filePaths) {
  return keys(filePaths).reduce(function (acc, name) {
    return _extends({}, acc, _defineProperty({}, name, require(filePaths[name])));
  }, {});
};

exports.default = function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      cosmosConfigPath = _ref.cosmosConfigPath;

  var cosmosConfig = (0, _reactCosmosConfig2.default)(cosmosConfigPath);
  var filePaths = (0, _reactCosmosVoyager2.default)(cosmosConfig);

  var proxies = cosmosConfig.proxies.map(function (proxy) {
    return require(proxy);
  });
  var components = importFileTree(filePaths.components);
  var fixtures = keys(filePaths.fixtures).reduce(function (acc, component) {
    return _extends({}, acc, _defineProperty({}, component, importFileTree(filePaths.fixtures[component])));
  }, {});

  keys(fixtures).forEach(function (component) {
    var componentFixtures = fixtures[component];
    keys(componentFixtures).forEach(function (fixture) {
      test(component + ':' + fixture, function () {
        var tree = _reactTestRenderer2.default.create((0, _reactCosmos.createLoaderElement)({
          components: components,
          fixtures: fixtures,
          proxies: proxies,
          component: component,
          fixture: fixture
        })).toJSON();
        expect(tree).toMatchSnapshot();
      });
    });
  });
};