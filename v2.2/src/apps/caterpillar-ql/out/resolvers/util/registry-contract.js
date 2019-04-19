"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _repo = require("../repo");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(_ref) {
    var web3, address, _ref3, _ref4, abi, c;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            web3 = _ref.web3, address = _ref.address;
            _context.next = 3;
            return _repo.registry.find({
              address: address
            });

          case 3:
            _ref3 = _context.sent;
            _ref4 = _slicedToArray(_ref3, 1);
            abi = _ref4[0].abi;

            if (!abi) {
              _context.next = 10;
              break;
            }

            c = new web3.eth.Contract(JSON.parse(abi), address);
            c.transactionConfirmationBlocks = 1;
            return _context.abrupt("return", c);

          case 10:
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvdXRpbC9yZWdpc3RyeS1jb250cmFjdC50cyJdLCJuYW1lcyI6WyJ3ZWIzIiwiYWRkcmVzcyIsInJlZ2lzdHJ5IiwiZmluZCIsImFiaSIsImMiLCJldGgiLCJDb250cmFjdCIsIkpTT04iLCJwYXJzZSIsInRyYW5zYWN0aW9uQ29uZmlybWF0aW9uQmxvY2tzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7MEJBRWU7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNiQSxZQUFBQSxJQURhLFFBQ2JBLElBRGEsRUFFYkMsT0FGYSxRQUViQSxPQUZhO0FBQUE7QUFBQSxtQkFJV0MsZUFDckJDLElBRHFCLENBQ2hCO0FBQUVGLGNBQUFBLE9BQU8sRUFBUEE7QUFBRixhQURnQixDQUpYOztBQUFBO0FBQUE7QUFBQTtBQUlKRyxZQUFBQSxHQUpJLFlBSUpBLEdBSkk7O0FBQUEsaUJBTVRBLEdBTlM7QUFBQTtBQUFBO0FBQUE7O0FBT0xDLFlBQUFBLENBUEssR0FPQSxJQUFJTCxJQUFJLENBQUNNLEdBQUwsQ0FBU0MsUUFBYixDQUFzQkMsSUFBSSxDQUFDQyxLQUFMLENBQVdMLEdBQVgsQ0FBdEIsRUFBdUNILE9BQXZDLENBUEE7QUFRWEksWUFBQUEsQ0FBQyxDQUFDSyw2QkFBRixHQUFrQyxDQUFsQztBQVJXLDZDQVNKTCxDQVRJOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyByZWdpc3RyeSB9IGZyb20gJy4uL3JlcG8nXG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jICh7XG4gIHdlYjMsXG4gIGFkZHJlc3MsXG59KTogUHJvbWlzZTxhbnk+ID0+IHtcbiAgY29uc3QgW3sgYWJpIH1dID0gYXdhaXQgcmVnaXN0cnlcbiAgICAuZmluZCh7IGFkZHJlc3MgfSlcbiAgaWYgKGFiaSkge1xuICAgIGNvbnN0IGMgPSAgbmV3IHdlYjMuZXRoLkNvbnRyYWN0KEpTT04ucGFyc2UoYWJpKSwgYWRkcmVzcylcbiAgICBjLnRyYW5zYWN0aW9uQ29uZmlybWF0aW9uQmxvY2tzID0gMVxuICAgIHJldHVybiBjXG4gIH1cbn0iXX0=