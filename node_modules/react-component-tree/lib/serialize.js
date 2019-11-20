'use strict';

var _lodash = require('lodash.isempty');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.clone');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.foreach');

var _lodash6 = _interopRequireDefault(_lodash5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getComponentTreeState = function getComponentTreeState(component) {
  var state = component.state ? (0, _lodash4.default)(component.state) : {};
  var childrenStates = {};
  var childState = void 0;

  (0, _lodash6.default)(component.refs, function (child, ref) {
    childState = getComponentTreeState(child);

    if (!(0, _lodash2.default)(childState)) {
      childrenStates[ref] = childState;
    }
  });

  if (!(0, _lodash2.default)(childrenStates)) {
    state.children = childrenStates;
  }

  return state;
};

exports.serialize = function (component) {
  /**
   * Generate a snapshot with the props and state of a component combined,
   * including the state of all nested child components.
   *
   * @param {ReactComponent} component Rendered React component instance
   *
   * @returns {Object} Snapshot with component props and nested state
   */
  var snapshot = (0, _lodash4.default)(component.props);
  var state = getComponentTreeState(component);

  if (!(0, _lodash2.default)(state)) {
    snapshot.state = state;
  }

  return snapshot;
};