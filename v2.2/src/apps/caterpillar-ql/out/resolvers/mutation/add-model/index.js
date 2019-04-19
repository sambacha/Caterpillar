"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _debug2 = _interopRequireDefault(require("debug"));

var _registryContract = _interopRequireDefault(require("../../util/registry-contract"));

var _parseModel = _interopRequireDefault(require("./parse-model"));

var _sources = _interopRequireDefault(require("./sources"));

var _compile = _interopRequireDefault(require("../../util/compile"));

var _registerModel = _interopRequireDefault(require("./deployment/register-model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var debug = (0, _debug2["default"])('caterpillarql:add-model');

var _default =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(_ref) {
    var bpmn, registry, web3, contract, model, output;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            bpmn = _ref.bpmn, registry = _ref.registry, web3 = _ref.web3;
            _context.next = 3;
            return (0, _registryContract["default"])({
              address: registry,
              web3: web3
            });

          case 3:
            contract = _context.sent;
            // nasty!!!
            model = {
              bpmn: bpmn
            };
            _context.next = 7;
            return (0, _parseModel["default"])(model);

          case 7:
            output = (0, _compile["default"])(_objectSpread({}, _sources["default"], _defineProperty({}, model.id, {
              content: model.solidity
            })));

            if (!(!output.contracts || Object.keys(output.contracts).length === 0)) {
              _context.next = 12;
              break;
            }

            debug('COMPILATION ERROR IN SMART CONTRACTS');
            debug(output.errors);
            throw new Error('COMPILATION ERROR IN SMART CONTRACTS');

          case 12:
            return _context.abrupt("return", (0, _registerModel["default"])(web3, contract, model, output.contracts));

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvbXV0YXRpb24vYWRkLW1vZGVsL2luZGV4LnRzIl0sIm5hbWVzIjpbImRlYnVnIiwiYnBtbiIsInJlZ2lzdHJ5Iiwid2ViMyIsImFkZHJlc3MiLCJjb250cmFjdCIsIm1vZGVsIiwib3V0cHV0Iiwic291cmNlcyIsImlkIiwiY29udGVudCIsInNvbGlkaXR5IiwiY29udHJhY3RzIiwiT2JqZWN0Iiwia2V5cyIsImxlbmd0aCIsImVycm9ycyIsIkVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLEtBQUssR0FBRyx3QkFBTyx5QkFBUCxDQUFkOzs7Ozs7OzBCQUVlO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNiQyxZQUFBQSxJQURhLFFBQ2JBLElBRGEsRUFFYkMsUUFGYSxRQUViQSxRQUZhLEVBR2JDLElBSGEsUUFHYkEsSUFIYTtBQUFBO0FBQUEsbUJBS1Usa0NBQWlCO0FBQ3RDQyxjQUFBQSxPQUFPLEVBQUVGLFFBRDZCO0FBRXRDQyxjQUFBQSxJQUFJLEVBQUpBO0FBRnNDLGFBQWpCLENBTFY7O0FBQUE7QUFLUEUsWUFBQUEsUUFMTztBQVViO0FBQ01DLFlBQUFBLEtBWE8sR0FXQztBQUNaTCxjQUFBQSxJQUFJLEVBQUpBO0FBRFksYUFYRDtBQUFBO0FBQUEsbUJBY1AsNEJBQVdLLEtBQVgsQ0FkTzs7QUFBQTtBQWVQQyxZQUFBQSxNQWZPLEdBZUUsMkNBQ1ZDLG1CQURVLHNCQUVaRixLQUFLLENBQUNHLEVBRk0sRUFFRDtBQUNWQyxjQUFBQSxPQUFPLEVBQUVKLEtBQUssQ0FBQ0s7QUFETCxhQUZDLEdBZkY7O0FBQUEsa0JBcUJULENBQUNKLE1BQU0sQ0FBQ0ssU0FBUixJQUFxQkMsTUFBTSxDQUFDQyxJQUFQLENBQVlQLE1BQU0sQ0FBQ0ssU0FBbkIsRUFBOEJHLE1BQTlCLEtBQXlDLENBckJyRDtBQUFBO0FBQUE7QUFBQTs7QUFzQlhmLFlBQUFBLEtBQUssQ0FBQyxzQ0FBRCxDQUFMO0FBQ0FBLFlBQUFBLEtBQUssQ0FBQ08sTUFBTSxDQUFDUyxNQUFSLENBQUw7QUF2Qlcsa0JBd0JMLElBQUlDLEtBQUosQ0FBVSxzQ0FBVixDQXhCSzs7QUFBQTtBQUFBLDZDQWtDTiwrQkFBY2QsSUFBZCxFQUFvQkUsUUFBcEIsRUFBOEJDLEtBQTlCLEVBQXFDQyxNQUFNLENBQUNLLFNBQTVDLENBbENNOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZnMgZnJvbSAnZnMnXG5pbXBvcnQgc29sYyBmcm9tICdzb2xjJ1xuaW1wb3J0IF9kZWJ1ZyBmcm9tICdkZWJ1ZydcblxuaW1wb3J0IHJlZ2lzdHJ5Q29udHJhY3QgZnJvbSAnLi4vLi4vdXRpbC9yZWdpc3RyeS1jb250cmFjdCdcbmltcG9ydCBwYXJzZU1vZGVsIGZyb20gJy4vcGFyc2UtbW9kZWwnXG5pbXBvcnQgc291cmNlcyBmcm9tICcuL3NvdXJjZXMnXG5pbXBvcnQgY29tcGlsZSBmcm9tICcuLi8uLi91dGlsL2NvbXBpbGUnXG5pbXBvcnQgcmVnaXN0ZXJNb2RlbCBmcm9tICcuL2RlcGxveW1lbnQvcmVnaXN0ZXItbW9kZWwnXG5cbmNvbnN0IGRlYnVnID0gX2RlYnVnKCdjYXRlcnBpbGxhcnFsOmFkZC1tb2RlbCcpXG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jICh7XG4gIGJwbW4sXG4gIHJlZ2lzdHJ5LFxuICB3ZWIzLFxufSk6IFByb21pc2U8b2JqZWN0PiA9PiB7XG4gIGNvbnN0IGNvbnRyYWN0ID0gYXdhaXQgcmVnaXN0cnlDb250cmFjdCh7XG4gICAgYWRkcmVzczogcmVnaXN0cnksXG4gICAgd2ViMyxcbiAgfSlcblxuICAvLyBuYXN0eSEhIVxuICBjb25zdCBtb2RlbCA9IHtcbiAgICBicG1uLFxuICB9XG4gIGF3YWl0IHBhcnNlTW9kZWwobW9kZWwpXG4gIGNvbnN0IG91dHB1dCA9IGNvbXBpbGUoe1xuICAgIC4uLnNvdXJjZXMsXG4gICAgW21vZGVsLmlkXToge1xuICAgICAgY29udGVudDogbW9kZWwuc29saWRpdHksXG4gICAgfVxuICB9KVxuICBpZiAoIW91dHB1dC5jb250cmFjdHMgfHwgT2JqZWN0LmtleXMob3V0cHV0LmNvbnRyYWN0cykubGVuZ3RoID09PSAwKSB7XG4gICAgZGVidWcoJ0NPTVBJTEFUSU9OIEVSUk9SIElOIFNNQVJUIENPTlRSQUNUUycpO1xuICAgIGRlYnVnKG91dHB1dC5lcnJvcnMpO1xuICAgIHRocm93IG5ldyBFcnJvcignQ09NUElMQVRJT04gRVJST1IgSU4gU01BUlQgQ09OVFJBQ1RTJylcbiAgfVxuICAvLyB0aGlzIGRvZXMgbm90aGluZ1xuICAvKk9iamVjdC5rZXlzKG91dHB1dC5jb250cmFjdHMpLmZvckVhY2goa2V5ID0+IHtcbiAgICBsZXQgYnl0ZWNvZGUgPSAnMHgnICsgb3V0cHV0LmNvbnRyYWN0c1trZXldLmJ5dGVjb2RlO1xuICAgIHZhciBnYXNFc3RpbWF0ZSA9IHdlYjMuZXRoLmVzdGltYXRlR2FzKHtkYXRhOiBieXRlY29kZX0pO1xuICAgIC8vIGNvbnNvbGUubG9nKFwiLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXCIpO1xuICAgIC8vIGNvbnNvbGUubG9nKFwiQ29udHJhY3QgTmFtZTogXCIgKyBrZXkuc3BsaXQoJzonKVsxXSk7XG4gICAgLy8gY29uc29sZS5sb2coXCJHYXMgRXN0aW1hdGlvbjogXCIgKyBnYXNFc3RpbWF0ZSk7XG4gIH0pOyovXG4gIHJldHVybiByZWdpc3Rlck1vZGVsKHdlYjMsIGNvbnRyYWN0LCBtb2RlbCwgb3V0cHV0LmNvbnRyYWN0cyk7XG59Il19