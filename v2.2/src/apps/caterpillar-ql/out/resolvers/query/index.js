"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _caterpillarLib = require("caterpillar-lib");

var _repo = require("../repo");

var _hexToId = _interopRequireDefault(require("../util/hex-to-id"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = web3 => ({
  accounts: async () => web3.eth.personal.getAccounts().then(accounts => accounts),
  processes: async (_, {
    _id
  }) => _repo.process.find(_objectSpread({}, _id && {
    _id
  })),
  registries: async (_, {
    _id
  }) => _repo.registry.find(_objectSpread({}, _id && {
    _id
  })).then(rs => rs // ? shouldnt be needed?
  .filter(({
    abi
  }) => abi).map(r => _objectSpread({}, r._doc, {
    contract: (0, _caterpillarLib.registryContract)({
      hexToId: (0, _hexToId.default)(web3),
      web3
    })(r)
  }))),
  roleTasks: async (_, {
    _id
  }) => _repo.roleTask.find(_objectSpread({}, _id && {
    _id
  }))
});

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvcXVlcnkvaW5kZXgudHMiXSwibmFtZXMiOlsid2ViMyIsImFjY291bnRzIiwiZXRoIiwicGVyc29uYWwiLCJnZXRBY2NvdW50cyIsInRoZW4iLCJwcm9jZXNzZXMiLCJfIiwiX2lkIiwicHJvY2VzcyIsImZpbmQiLCJyZWdpc3RyaWVzIiwicmVnaXN0cnkiLCJycyIsImZpbHRlciIsImFiaSIsIm1hcCIsInIiLCJfZG9jIiwiY29udHJhY3QiLCJoZXhUb0lkIiwicm9sZVRhc2tzIiwicm9sZVRhc2siXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFFQTs7QUFNQTs7Ozs7Ozs7ZUFFZ0JBLElBQUQsS0FBbUI7QUFDaENDLEVBQUFBLFFBQVEsRUFBRSxZQUNSRCxJQUFJLENBQUNFLEdBQUwsQ0FBU0MsUUFBVCxDQUFrQkMsV0FBbEIsR0FBZ0NDLElBQWhDLENBQ0dKLFFBQUQsSUFDRUEsUUFGSixDQUY4QjtBQU1oQ0ssRUFBQUEsU0FBUyxFQUFFLE9BQU9DLENBQVAsRUFBVTtBQUFFQyxJQUFBQTtBQUFGLEdBQVYsS0FDVEMsY0FBUUMsSUFBUixtQkFBaUJGLEdBQUcsSUFBSTtBQUFFQSxJQUFBQTtBQUFGLEdBQXhCLEVBUDhCO0FBUWhDRyxFQUFBQSxVQUFVLEVBQUUsT0FBT0osQ0FBUCxFQUFVO0FBQUVDLElBQUFBO0FBQUYsR0FBVixLQUNWSSxlQUNHRixJQURILG1CQUNZRixHQUFHLElBQUk7QUFBRUEsSUFBQUE7QUFBRixHQURuQixHQUVHSCxJQUZILENBR0lRLEVBQUUsSUFBSUEsRUFBRSxDQUNOO0FBRE0sR0FFTEMsTUFGRyxDQUdGLENBQUM7QUFBRUMsSUFBQUE7QUFBRixHQUFELEtBQWFBLEdBSFgsRUFLSEMsR0FMRyxDQU1GQyxDQUFDLHNCQUVNQSxDQUFDLENBQUNDLElBRlI7QUFHR0MsSUFBQUEsUUFBUSxFQUFFLHNDQUFpQjtBQUN6QkMsTUFBQUEsT0FBTyxFQUFFLHNCQUFRcEIsSUFBUixDQURnQjtBQUV6QkEsTUFBQUE7QUFGeUIsS0FBakIsRUFHUGlCLENBSE87QUFIYixJQU5DLENBSFYsQ0FUOEI7QUE0QmhDSSxFQUFBQSxTQUFTLEVBQUUsT0FBT2QsQ0FBUCxFQUFVO0FBQUVDLElBQUFBO0FBQUYsR0FBVixLQUNUYyxlQUFTWixJQUFULG1CQUFrQkYsR0FBRyxJQUFJO0FBQUVBLElBQUFBO0FBQUYsR0FBekI7QUE3QjhCLENBQW5CLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyByZWdpc3RyeUNvbnRyYWN0IH0gZnJvbSAnY2F0ZXJwaWxsYXItbGliJ1xuXG5pbXBvcnQge1xuICByZWdpc3RyeSxcbiAgcm9sZVRhc2ssXG4gIHByb2Nlc3Ncbn0gZnJvbSAnLi4vcmVwbydcblxuaW1wb3J0IGhleFRvSWQgZnJvbSAnLi4vdXRpbC9oZXgtdG8taWQnXG5cbmV4cG9ydCBkZWZhdWx0ICh3ZWIzKTogb2JqZWN0ID0+ICh7XG4gIGFjY291bnRzOiBhc3luYyAoKTogUHJvbWlzZTxzdHJpbmdbXT4gPT5cbiAgICB3ZWIzLmV0aC5wZXJzb25hbC5nZXRBY2NvdW50cygpLnRoZW4oXG4gICAgICAoYWNjb3VudHMpOiBzdHJpbmdbXSA9PlxuICAgICAgICBhY2NvdW50cyxcbiAgICApLFxuICBwcm9jZXNzZXM6IGFzeW5jIChfLCB7IF9pZCB9KTogUHJvbWlzZTxhbnlbXT4gPT5cbiAgICBwcm9jZXNzLmZpbmQoey4uLl9pZCAmJiB7IF9pZCB9fSksXG4gIHJlZ2lzdHJpZXM6IGFzeW5jIChfLCB7IF9pZCB9KTogUHJvbWlzZTxhbnlbXT4gPT5cbiAgICByZWdpc3RyeVxuICAgICAgLmZpbmQoey4uLl9pZCAmJiB7IF9pZCB9fSlcbiAgICAgIC50aGVuKFxuICAgICAgICBycyA9PiByc1xuICAgICAgICAgIC8vID8gc2hvdWxkbnQgYmUgbmVlZGVkP1xuICAgICAgICAgIC5maWx0ZXIoXG4gICAgICAgICAgICAoeyBhYmkgfSkgPT4gYWJpLFxuICAgICAgICAgIClcbiAgICAgICAgICAubWFwKFxuICAgICAgICAgICAgciA9PlxuICAgICAgICAgICAgICAoe1xuICAgICAgICAgICAgICAgIC4uLnIuX2RvYyxcbiAgICAgICAgICAgICAgICBjb250cmFjdDogcmVnaXN0cnlDb250cmFjdCh7XG4gICAgICAgICAgICAgICAgICBoZXhUb0lkOiBoZXhUb0lkKHdlYjMpLFxuICAgICAgICAgICAgICAgICAgd2ViMyxcbiAgICAgICAgICAgICAgICB9KShyKSxcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgKSxcbiAgICAgICksXG4gIHJvbGVUYXNrczogYXN5bmMgKF8sIHsgX2lkIH0pOiBQcm9taXNlPGFueVtdPiA9PlxuICAgIHJvbGVUYXNrLmZpbmQoey4uLl9pZCAmJiB7IF9pZCB9fSksXG59KSJdfQ==