"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _registry = _interopRequireDefault(require("./registry"));

var _model = _interopRequireDefault(require("./model"));

var _policy = _interopRequireDefault(require("./policy"));

var _roleTask = _interopRequireDefault(require("./role-task"));

var _process = _interopRequireDefault(require("./process"));

var _workItem = _interopRequireDefault(require("./work-item"));

var _nominate = _interopRequireDefault(require("./nominate"));

var _release = _interopRequireDefault(require("./release"));

var _voteNominate = _interopRequireDefault(require("./vote-nominate"));

var _voteRelease = _interopRequireDefault(require("./vote-release"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const mutate = web3 => func => async (_, params) => func(_objectSpread({}, params, {
  web3
}));

var _default = web3 => ({
  registry: mutate(web3)(_registry.default),
  model: mutate(web3)(_model.default),
  process: mutate(web3)(_process.default),
  policy: mutate(web3)(_policy.default),
  roleTask: mutate(web3)(_roleTask.default),
  nominate: mutate(web3)(_nominate.default),
  release: mutate(web3)(_release.default),
  voteNominate: mutate(web3)(_voteNominate.default),
  voteRelease: mutate(web3)(_voteRelease.default),
  workItem: mutate(web3)(_workItem.default)
});

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvbXV0YXRpb24vaW5kZXgudHMiXSwibmFtZXMiOlsibXV0YXRlIiwid2ViMyIsImZ1bmMiLCJfIiwicGFyYW1zIiwicmVnaXN0cnkiLCJtb2RlbCIsInByb2Nlc3MiLCJwb2xpY3kiLCJyb2xlVGFzayIsIm5vbWluYXRlIiwicmVsZWFzZSIsInZvdGVOb21pbmF0ZSIsInZvdGVSZWxlYXNlIiwid29ya0l0ZW0iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7QUFFQSxNQUFNQSxNQUFNLEdBQUdDLElBQUksSUFDakJDLElBQUksSUFDRixPQUNFQyxDQURGLEVBRUVDLE1BRkYsS0FJSUYsSUFBSSxtQkFDQ0UsTUFERDtBQUVGSCxFQUFBQTtBQUZFLEdBTlo7O2VBV2dCQSxJQUFELEtBQW1CO0FBQ2hDSSxFQUFBQSxRQUFRLEVBQUVMLE1BQU0sQ0FBQ0MsSUFBRCxDQUFOLENBQWFJLGlCQUFiLENBRHNCO0FBRWhDQyxFQUFBQSxLQUFLLEVBQUVOLE1BQU0sQ0FBQ0MsSUFBRCxDQUFOLENBQWFLLGNBQWIsQ0FGeUI7QUFHaENDLEVBQUFBLE9BQU8sRUFBRVAsTUFBTSxDQUFDQyxJQUFELENBQU4sQ0FBYU0sZ0JBQWIsQ0FIdUI7QUFJaENDLEVBQUFBLE1BQU0sRUFBRVIsTUFBTSxDQUFDQyxJQUFELENBQU4sQ0FBYU8sZUFBYixDQUp3QjtBQUtoQ0MsRUFBQUEsUUFBUSxFQUFFVCxNQUFNLENBQUNDLElBQUQsQ0FBTixDQUFhUSxpQkFBYixDQUxzQjtBQU1oQ0MsRUFBQUEsUUFBUSxFQUFFVixNQUFNLENBQUNDLElBQUQsQ0FBTixDQUFhUyxpQkFBYixDQU5zQjtBQU9oQ0MsRUFBQUEsT0FBTyxFQUFFWCxNQUFNLENBQUNDLElBQUQsQ0FBTixDQUFhVSxnQkFBYixDQVB1QjtBQVFoQ0MsRUFBQUEsWUFBWSxFQUFFWixNQUFNLENBQUNDLElBQUQsQ0FBTixDQUFhVyxxQkFBYixDQVJrQjtBQVNoQ0MsRUFBQUEsV0FBVyxFQUFFYixNQUFNLENBQUNDLElBQUQsQ0FBTixDQUFhWSxvQkFBYixDQVRtQjtBQVVoQ0MsRUFBQUEsUUFBUSxFQUFFZCxNQUFNLENBQUNDLElBQUQsQ0FBTixDQUFhYSxpQkFBYjtBQVZzQixDQUFuQixDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHJlZ2lzdHJ5IGZyb20gJy4vcmVnaXN0cnknXG5pbXBvcnQgbW9kZWwgZnJvbSAnLi9tb2RlbCdcbmltcG9ydCBwb2xpY3kgZnJvbSAnLi9wb2xpY3knXG5pbXBvcnQgcm9sZVRhc2sgZnJvbSAnLi9yb2xlLXRhc2snXG5pbXBvcnQgcHJvY2VzcyBmcm9tICcuL3Byb2Nlc3MnXG5pbXBvcnQgd29ya0l0ZW0gZnJvbSAnLi93b3JrLWl0ZW0nXG5pbXBvcnQgbm9taW5hdGUgZnJvbSAnLi9ub21pbmF0ZSdcbmltcG9ydCByZWxlYXNlIGZyb20gJy4vcmVsZWFzZSdcbmltcG9ydCB2b3RlTm9taW5hdGUgZnJvbSAnLi92b3RlLW5vbWluYXRlJ1xuaW1wb3J0IHZvdGVSZWxlYXNlIGZyb20gJy4vdm90ZS1yZWxlYXNlJ1xuXG5jb25zdCBtdXRhdGUgPSB3ZWIzID0+XG4gIGZ1bmMgPT5cbiAgICBhc3luYyAoXG4gICAgICBfLFxuICAgICAgcGFyYW1zLFxuICAgICk6UHJvbWlzZTxhbnk+ID0+XG4gICAgICAgIGZ1bmMoe1xuICAgICAgICAgIC4uLnBhcmFtcyxcbiAgICAgICAgICB3ZWIzLFxuICAgICAgICB9KVxuXG5leHBvcnQgZGVmYXVsdCAod2ViMyk6IG9iamVjdCA9PiAoe1xuICByZWdpc3RyeTogbXV0YXRlKHdlYjMpKHJlZ2lzdHJ5KSxcbiAgbW9kZWw6IG11dGF0ZSh3ZWIzKShtb2RlbCksXG4gIHByb2Nlc3M6IG11dGF0ZSh3ZWIzKShwcm9jZXNzKSxcbiAgcG9saWN5OiBtdXRhdGUod2ViMykocG9saWN5KSxcbiAgcm9sZVRhc2s6IG11dGF0ZSh3ZWIzKShyb2xlVGFzayksXG4gIG5vbWluYXRlOiBtdXRhdGUod2ViMykobm9taW5hdGUpLFxuICByZWxlYXNlOiBtdXRhdGUod2ViMykocmVsZWFzZSksXG4gIHZvdGVOb21pbmF0ZTogbXV0YXRlKHdlYjMpKHZvdGVOb21pbmF0ZSksXG4gIHZvdGVSZWxlYXNlOiBtdXRhdGUod2ViMykodm90ZVJlbGVhc2UpLFxuICB3b3JrSXRlbTogbXV0YXRlKHdlYjMpKHdvcmtJdGVtKVxufSkiXX0=