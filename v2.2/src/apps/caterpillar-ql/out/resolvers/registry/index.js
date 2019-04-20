"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _processes = _interopRequireDefault(require("./processes"));

var _models = _interopRequireDefault(require("./models"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = web3 => ({
  processes: async ({
    address: registry
  }) => (0, _processes.default)({
    web3,
    registry
  }),
  models: async ({
    address: registry
  }) => (0, _models.default)({
    web3,
    registry
  })
});

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvcmVnaXN0cnkvaW5kZXgudHMiXSwibmFtZXMiOlsid2ViMyIsInByb2Nlc3NlcyIsImFkZHJlc3MiLCJyZWdpc3RyeSIsIm1vZGVscyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOzs7O2VBRWdCQSxJQUFELEtBQW1CO0FBQ2hDQyxFQUFBQSxTQUFTLEVBQUUsT0FBTztBQUFFQyxJQUFBQSxPQUFPLEVBQUVDO0FBQVgsR0FBUCxLQUNULHdCQUFVO0FBQUVILElBQUFBLElBQUY7QUFBUUcsSUFBQUE7QUFBUixHQUFWLENBRjhCO0FBR2hDQyxFQUFBQSxNQUFNLEVBQUUsT0FBTztBQUFFRixJQUFBQSxPQUFPLEVBQUVDO0FBQVgsR0FBUCxLQUNOLHFCQUFPO0FBQUVILElBQUFBLElBQUY7QUFBUUcsSUFBQUE7QUFBUixHQUFQO0FBSjhCLENBQW5CLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcHJvY2Vzc2VzIGZyb20gJy4vcHJvY2Vzc2VzJ1xuaW1wb3J0IG1vZGVscyBmcm9tICcuL21vZGVscydcblxuZXhwb3J0IGRlZmF1bHQgKHdlYjMpOiBvYmplY3QgPT4gKHtcbiAgcHJvY2Vzc2VzOiBhc3luYyAoeyBhZGRyZXNzOiByZWdpc3RyeSB9KTogUHJvbWlzZTxhbnlbXT4gPT5cbiAgICBwcm9jZXNzZXMoeyB3ZWIzLCByZWdpc3RyeSB9KSxcbiAgbW9kZWxzOiBhc3luYyAoeyBhZGRyZXNzOiByZWdpc3RyeSB9KTogUHJvbWlzZTxhbnlbXT4gPT5cbiAgICBtb2RlbHMoeyB3ZWIzLCByZWdpc3RyeSB9KVxufSkiXX0=