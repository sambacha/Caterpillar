"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _repo = require("../repo");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = function _default(web3) {
  return {
    accounts: function () {
      var _accounts = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", web3.eth.personal.getAccounts().then(function (accounts) {
                  return accounts;
                }));

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function accounts() {
        return _accounts.apply(this, arguments);
      }

      return accounts;
    }(),
    policies: function () {
      var _policies = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", _repo.policy.find());

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function policies() {
        return _policies.apply(this, arguments);
      }

      return policies;
    }(),
    processes: function () {
      var _processes = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                return _context3.abrupt("return", _repo.process.find());

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function processes() {
        return _processes.apply(this, arguments);
      }

      return processes;
    }(),
    registries: function () {
      var _registries = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4() {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt("return", _repo.registry.find());

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function registries() {
        return _registries.apply(this, arguments);
      }

      return registries;
    }(),
    roleTasks: function () {
      var _roleTasks = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee5() {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                return _context5.abrupt("return", _repo.roleTask.find());

              case 1:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function roleTasks() {
        return _roleTasks.apply(this, arguments);
      }

      return roleTasks;
    }()
  };
};

exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvcXVlcnkvaW5kZXgudHMiXSwibmFtZXMiOlsid2ViMyIsImFjY291bnRzIiwiZXRoIiwicGVyc29uYWwiLCJnZXRBY2NvdW50cyIsInRoZW4iLCJwb2xpY2llcyIsInBvbGljeSIsImZpbmQiLCJwcm9jZXNzZXMiLCJwcm9jZXNzIiwicmVnaXN0cmllcyIsInJlZ2lzdHJ5Iiwicm9sZVRhc2tzIiwicm9sZVRhc2siXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7Ozs7O2VBT2Usa0JBQUNBLElBQUQ7QUFBQSxTQUFtQjtBQUNoQ0MsSUFBQUEsUUFBUTtBQUFBO0FBQUE7QUFBQSw4QkFBRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsaURBQ1JELElBQUksQ0FBQ0UsR0FBTCxDQUFTQyxRQUFULENBQWtCQyxXQUFsQixHQUFnQ0MsSUFBaEMsQ0FDRSxVQUFDSixRQUFEO0FBQUEseUJBQ0VBLFFBREY7QUFBQSxpQkFERixDQURROztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE9BQUY7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsT0FEd0I7QUFNaENLLElBQUFBLFFBQVE7QUFBQTtBQUFBO0FBQUEsOEJBQUU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGtEQUNSQyxhQUFPQyxJQUFQLEVBRFE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsT0FBRjs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxPQU53QjtBQVFoQ0MsSUFBQUEsU0FBUztBQUFBO0FBQUE7QUFBQSw4QkFBRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsa0RBQ1RDLGNBQVFGLElBQVIsRUFEUzs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxPQUFGOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBLE9BUnVCO0FBVWhDRyxJQUFBQSxVQUFVO0FBQUE7QUFBQTtBQUFBLDhCQUFFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxrREFDVkMsZUFBU0osSUFBVCxFQURVOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE9BQUY7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsT0FWc0I7QUFZaENLLElBQUFBLFNBQVM7QUFBQTtBQUFBO0FBQUEsOEJBQUU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGtEQUNUQyxlQUFTTixJQUFULEVBRFM7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsT0FBRjs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQVp1QixHQUFuQjtBQUFBLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICByZWdpc3RyeSxcbiAgcm9sZVRhc2ssXG4gIHBvbGljeSxcbiAgcHJvY2Vzc1xufSBmcm9tICcuLi9yZXBvJ1xuXG5leHBvcnQgZGVmYXVsdCAod2ViMyk6IG9iamVjdCA9PiAoe1xuICBhY2NvdW50czogYXN5bmMgKCk6IFByb21pc2U8c3RyaW5nW10+ID0+XG4gICAgd2ViMy5ldGgucGVyc29uYWwuZ2V0QWNjb3VudHMoKS50aGVuKFxuICAgICAgKGFjY291bnRzKTogc3RyaW5nW10gPT5cbiAgICAgICAgYWNjb3VudHMsXG4gICAgKSxcbiAgcG9saWNpZXM6IGFzeW5jICgpOiBQcm9taXNlPGFueVtdPiA9PlxuICAgIHBvbGljeS5maW5kKCksXG4gIHByb2Nlc3NlczogYXN5bmMgKCk6IFByb21pc2U8YW55W10+ID0+XG4gICAgcHJvY2Vzcy5maW5kKCksXG4gIHJlZ2lzdHJpZXM6IGFzeW5jICgpOiBQcm9taXNlPGFueVtdPiA9PlxuICAgIHJlZ2lzdHJ5LmZpbmQoKSxcbiAgcm9sZVRhc2tzOiBhc3luYyAoKTogUHJvbWlzZTxhbnlbXT4gPT5cbiAgICByb2xlVGFzay5maW5kKCksXG59KSJdfQ==