"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// The following constants are replaced at compile-time (through module-loader)
// with a map of require calls with absolute paths, derived from user conf.
// By the time webpack analyzes this file to build the dependency tree
// all paths will be embedded and webpack will register watchers for each
// context (which will update the bundle automatically when files are added or
// changed).

// eslint-disable-next-line no-undef, no-unused-expressions
CONTEXTS;

var getUserModules = function getUserModules() {
  return {
    /* eslint-disable no-undef */
    components: COMPONENTS,
    fixtures: FIXTURES,
    proxies: PROXIES
  };
};

exports.default = getUserModules;