"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _processes3 = _interopRequireDefault(require("./processes"));

var _models3 = _interopRequireDefault(require("./models"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = function _default(web3) {
  return {
    processes: function () {
      var _processes2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(_ref) {
        var registry;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                registry = _ref.address;
                return _context.abrupt("return", (0, _processes3["default"])({
                  web3: web3,
                  registry: registry
                }));

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function processes(_x) {
        return _processes2.apply(this, arguments);
      }

      return processes;
    }(),
    models: function () {
      var _models2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(_ref2) {
        var registry;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                registry = _ref2.address;
                return _context2.abrupt("return", (0, _models3["default"])({
                  web3: web3,
                  registry: registry
                }));

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function models(_x2) {
        return _models2.apply(this, arguments);
      }

      return models;
    }()
  };
};

exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvcmVnaXN0cnkvaW5kZXgudHMiXSwibmFtZXMiOlsid2ViMyIsInByb2Nlc3NlcyIsInJlZ2lzdHJ5IiwiYWRkcmVzcyIsIm1vZGVscyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOzs7Ozs7OztlQUVlLGtCQUFDQSxJQUFEO0FBQUEsU0FBbUI7QUFDaENDLElBQUFBLFNBQVM7QUFBQTtBQUFBO0FBQUEsOEJBQUU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQWtCQyxnQkFBQUEsUUFBbEIsUUFBU0MsT0FBVDtBQUFBLGlEQUNULDRCQUFVO0FBQUVILGtCQUFBQSxJQUFJLEVBQUpBLElBQUY7QUFBUUUsa0JBQUFBLFFBQVEsRUFBUkE7QUFBUixpQkFBVixDQURTOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE9BQUY7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsT0FEdUI7QUFHaENFLElBQUFBLE1BQU07QUFBQTtBQUFBO0FBQUEsOEJBQUU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQWtCRixnQkFBQUEsUUFBbEIsU0FBU0MsT0FBVDtBQUFBLGtEQUNOLHlCQUFPO0FBQUVILGtCQUFBQSxJQUFJLEVBQUpBLElBQUY7QUFBUUUsa0JBQUFBLFFBQVEsRUFBUkE7QUFBUixpQkFBUCxDQURNOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE9BQUY7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFIMEIsR0FBbkI7QUFBQSxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHByb2Nlc3NlcyBmcm9tICcuL3Byb2Nlc3NlcydcbmltcG9ydCBtb2RlbHMgZnJvbSAnLi9tb2RlbHMnXG5cbmV4cG9ydCBkZWZhdWx0ICh3ZWIzKTogb2JqZWN0ID0+ICh7XG4gIHByb2Nlc3NlczogYXN5bmMgKHsgYWRkcmVzczogcmVnaXN0cnkgfSk6IFByb21pc2U8YW55W10+ID0+XG4gICAgcHJvY2Vzc2VzKHsgd2ViMywgcmVnaXN0cnkgfSksXG4gIG1vZGVsczogYXN5bmMgKHsgYWRkcmVzczogcmVnaXN0cnkgfSk6IFByb21pc2U8YW55W10+ID0+XG4gICAgbW9kZWxzKHsgd2ViMywgcmVnaXN0cnkgfSlcbn0pIl19