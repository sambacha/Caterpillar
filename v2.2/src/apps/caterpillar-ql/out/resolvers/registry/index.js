"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _processes = _interopRequireDefault(require("./processes"));

var _models = _interopRequireDefault(require("./models"));

var _policies = _interopRequireDefault(require("./policies"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = web3 => ({
  processes: async ({
    contract
  }, {
    address
  }) => (0, _processes.default)({
    web3,
    contract,
    address
  }),
  policies: async ({
    address: registry
  }, {
    _id
  }) => (0, _policies.default)({
    registry,
    _id
  }),
  models: async ({
    contract
  }, {
    id
  }) => (0, _models.default)({
    web3,
    contract,
    id
  })
});

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvcmVnaXN0cnkvaW5kZXgudHMiXSwibmFtZXMiOlsid2ViMyIsInByb2Nlc3NlcyIsImNvbnRyYWN0IiwiYWRkcmVzcyIsInBvbGljaWVzIiwicmVnaXN0cnkiLCJfaWQiLCJtb2RlbHMiLCJpZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOzs7O2VBRWdCQSxJQUFELEtBQW1CO0FBQ2hDQyxFQUFBQSxTQUFTLEVBQUUsT0FBTztBQUFFQyxJQUFBQTtBQUFGLEdBQVAsRUFBcUI7QUFBRUMsSUFBQUE7QUFBRixHQUFyQixLQUNULHdCQUFVO0FBQUVILElBQUFBLElBQUY7QUFBUUUsSUFBQUEsUUFBUjtBQUFrQkMsSUFBQUE7QUFBbEIsR0FBVixDQUY4QjtBQUdoQ0MsRUFBQUEsUUFBUSxFQUFFLE9BQU87QUFBRUQsSUFBQUEsT0FBTyxFQUFFRTtBQUFYLEdBQVAsRUFBOEI7QUFBRUMsSUFBQUE7QUFBRixHQUE5QixLQUNSLHVCQUFTO0FBQUVELElBQUFBLFFBQUY7QUFBWUMsSUFBQUE7QUFBWixHQUFULENBSjhCO0FBS2hDQyxFQUFBQSxNQUFNLEVBQUUsT0FBTztBQUFFTCxJQUFBQTtBQUFGLEdBQVAsRUFBcUI7QUFBRU0sSUFBQUE7QUFBRixHQUFyQixLQUNOLHFCQUFPO0FBQUVSLElBQUFBLElBQUY7QUFBUUUsSUFBQUEsUUFBUjtBQUFrQk0sSUFBQUE7QUFBbEIsR0FBUDtBQU44QixDQUFuQixDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHByb2Nlc3NlcyBmcm9tICcuL3Byb2Nlc3NlcydcbmltcG9ydCBtb2RlbHMgZnJvbSAnLi9tb2RlbHMnXG5pbXBvcnQgcG9saWNpZXMgZnJvbSAnLi9wb2xpY2llcydcblxuZXhwb3J0IGRlZmF1bHQgKHdlYjMpOiBvYmplY3QgPT4gKHtcbiAgcHJvY2Vzc2VzOiBhc3luYyAoeyBjb250cmFjdCB9LCB7IGFkZHJlc3MgfSk6IFByb21pc2U8YW55W10+ID0+XG4gICAgcHJvY2Vzc2VzKHsgd2ViMywgY29udHJhY3QsIGFkZHJlc3MgfSksXG4gIHBvbGljaWVzOiBhc3luYyAoeyBhZGRyZXNzOiByZWdpc3RyeSB9LCB7IF9pZCB9KTogUHJvbWlzZTxhbnlbXT4gPT5cbiAgICBwb2xpY2llcyh7IHJlZ2lzdHJ5LCBfaWR9KSxcbiAgbW9kZWxzOiBhc3luYyAoeyBjb250cmFjdCB9LCB7IGlkIH0pOiBQcm9taXNlPGFueVtdPiA9PlxuICAgIG1vZGVscyh7IHdlYjMsIGNvbnRyYWN0LCBpZCB9KSwgIFxufSkiXX0=