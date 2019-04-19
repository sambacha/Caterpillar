"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _addRegistry3 = _interopRequireDefault(require("./add-registry"));

var _addModel3 = _interopRequireDefault(require("./add-model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = function _default(web3) {
  return {
    addRegistry: function () {
      var _addRegistry2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", (0, _addRegistry3["default"])({
                  web3: web3
                }));

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function addRegistry() {
        return _addRegistry2.apply(this, arguments);
      }

      return addRegistry;
    }(),
    addModel: function () {
      var _addModel2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(_, _ref) {
        var bpmn, registry;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                bpmn = _ref.bpmn, registry = _ref.registry;
                return _context2.abrupt("return", (0, _addModel3["default"])({
                  bpmn: bpmn,
                  registry: registry,
                  web3: web3
                }));

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function addModel(_x, _x2) {
        return _addModel2.apply(this, arguments);
      }

      return addModel;
    }()
  };
};

exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvbXV0YXRpb24vaW5kZXgudHMiXSwibmFtZXMiOlsid2ViMyIsImFkZFJlZ2lzdHJ5IiwiYWRkTW9kZWwiLCJfIiwiYnBtbiIsInJlZ2lzdHJ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7Ozs7Ozs7O2VBRWUsa0JBQUNBLElBQUQ7QUFBQSxTQUFtQjtBQUNoQ0MsSUFBQUEsV0FBVztBQUFBO0FBQUE7QUFBQSw4QkFBRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsaURBQ1gsOEJBQVk7QUFBRUQsa0JBQUFBLElBQUksRUFBSkE7QUFBRixpQkFBWixDQURXOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE9BQUY7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsT0FEcUI7QUFHaENFLElBQUFBLFFBQVE7QUFBQTtBQUFBO0FBQUEsOEJBQUUsa0JBQ1JDLENBRFE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR05DLGdCQUFBQSxJQUhNLFFBR05BLElBSE0sRUFJTkMsUUFKTSxRQUlOQSxRQUpNO0FBQUEsa0RBT04sMkJBQVM7QUFDUEQsa0JBQUFBLElBQUksRUFBSkEsSUFETztBQUVQQyxrQkFBQUEsUUFBUSxFQUFSQSxRQUZPO0FBR1BMLGtCQUFBQSxJQUFJLEVBQUpBO0FBSE8saUJBQVQsQ0FQTTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxPQUFGOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBSHdCLEdBQW5CO0FBQUEsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBhZGRSZWdpc3RyeSBmcm9tICcuL2FkZC1yZWdpc3RyeSdcbmltcG9ydCBhZGRNb2RlbCBmcm9tICcuL2FkZC1tb2RlbCdcblxuZXhwb3J0IGRlZmF1bHQgKHdlYjMpOiBvYmplY3QgPT4gKHtcbiAgYWRkUmVnaXN0cnk6IGFzeW5jICgpOiBQcm9taXNlPGFueT4gPT5cbiAgICBhZGRSZWdpc3RyeSh7IHdlYjMgfSksXG4gIGFkZE1vZGVsOiBhc3luYyAoXG4gICAgXyxcbiAgICB7XG4gICAgICBicG1uLFxuICAgICAgcmVnaXN0cnksXG4gICAgfSxcbiAgKTpQcm9taXNlPGFueT4gPT5cbiAgICAgIGFkZE1vZGVsKHtcbiAgICAgICAgYnBtbixcbiAgICAgICAgcmVnaXN0cnksXG4gICAgICAgIHdlYjMsXG4gICAgICB9KSxcbn0pIl19