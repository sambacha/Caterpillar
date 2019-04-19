"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ramda = require("ramda");

var _hexToId = _interopRequireDefault(require("../../util/hex-to-id"));

var _repo = require("../../repo");

var _findRoleMap = _interopRequireDefault(require("./find-role-map"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var bindings = {
  0: 'UNBOUND',
  1: 'RELEASING',
  2: 'NOMINATED',
  3: 'BOUND'
};

var _default = function _default(_ref) {
  var web3 = _ref.web3,
      registryContract = _ref.registryContract;
  return (
    /*#__PURE__*/
    function () {
      var _ref2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(contractAddress, role) {
        var _ref3, _ref4, _ref4$, indexToRole, accessControlAbi, roleIndexMap, accessControlAddr, runtimePolicyContract, roles;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.t0 = _repo.policy;
                _context.next = 3;
                return registryContract.methods.bindingPolicyFor(contractAddress).call().then((0, _hexToId["default"])(web3));

              case 3:
                _context.t1 = _context.sent;
                _context.t2 = {
                  _id: _context.t1
                };
                _context.next = 7;
                return _context.t0.find.call(_context.t0, _context.t2);

              case 7:
                _ref3 = _context.sent;
                _ref4 = _slicedToArray(_ref3, 1);
                _ref4$ = _ref4[0];
                indexToRole = _ref4$.indexToRole;
                accessControlAbi = _ref4$.accessControlAbi;
                roleIndexMap = (0, _findRoleMap["default"])(indexToRole);
                _context.next = 15;
                return registryContract.methods.findRuntimePolicy(contractAddress).call();

              case 15:
                accessControlAddr = _context.sent;

                if (!(accessControlAddr.toString() === '0x0000000000000000000000000000000000000000')) {
                  _context.next = 18;
                  break;
                }

                return _context.abrupt("return", []);

              case 18:
                runtimePolicyContract = new web3.eth.Contract(JSON.parse(accessControlAbi), accessControlAddr);
                runtimePolicyContract.transactionConfirmationBlocks = 1;
                _context.next = 22;
                return Promise.all(indexToRole.filter(function (r) {
                  return r;
                }).filter(function (r) {
                  return r === role || !role;
                }).map(function (r) {
                  return runtimePolicyContract.methods.roleState(roleIndexMap.get(r), contractAddress).call().then(function (result) {
                    return {
                      role: r,
                      binding: bindings[(0, _ramda.compose)(web3.utils.hexToNumber, web3.utils.toHex)(result)]
                    };
                  });
                }));

              case 22:
                roles = _context.sent;

                if (!(role && !roles.length)) {
                  _context.next = 25;
                  break;
                }

                return _context.abrupt("return", [{
                  role: role,
                  binding: 'UNDEFINED'
                }]);

              case 25:
                return _context.abrupt("return", roles);

              case 26:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x, _x2) {
        return _ref2.apply(this, arguments);
      };
    }()
  );
};

exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvcHJvY2Vzcy1jb250cmFjdC9yZXNvdXJjZXMvaW5kZXgudHMiXSwibmFtZXMiOlsiYmluZGluZ3MiLCJ3ZWIzIiwicmVnaXN0cnlDb250cmFjdCIsImNvbnRyYWN0QWRkcmVzcyIsInJvbGUiLCJwb2xpY3kiLCJtZXRob2RzIiwiYmluZGluZ1BvbGljeUZvciIsImNhbGwiLCJ0aGVuIiwiX2lkIiwiZmluZCIsImluZGV4VG9Sb2xlIiwiYWNjZXNzQ29udHJvbEFiaSIsInJvbGVJbmRleE1hcCIsImZpbmRSdW50aW1lUG9saWN5IiwiYWNjZXNzQ29udHJvbEFkZHIiLCJ0b1N0cmluZyIsInJ1bnRpbWVQb2xpY3lDb250cmFjdCIsImV0aCIsIkNvbnRyYWN0IiwiSlNPTiIsInBhcnNlIiwidHJhbnNhY3Rpb25Db25maXJtYXRpb25CbG9ja3MiLCJQcm9taXNlIiwiYWxsIiwiZmlsdGVyIiwiciIsIm1hcCIsInJvbGVTdGF0ZSIsImdldCIsInJlc3VsdCIsImJpbmRpbmciLCJ1dGlscyIsImhleFRvTnVtYmVyIiwidG9IZXgiLCJyb2xlcyIsImxlbmd0aCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsUUFBUSxHQUFHO0FBQ2YsS0FBRyxTQURZO0FBRWYsS0FBRyxXQUZZO0FBR2YsS0FBRyxXQUhZO0FBSWYsS0FBRztBQUpZLENBQWpCOztlQU9lO0FBQUEsTUFDYkMsSUFEYSxRQUNiQSxJQURhO0FBQUEsTUFFYkMsZ0JBRmEsUUFFYkEsZ0JBRmE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsOEJBR0MsaUJBQ2RDLGVBRGMsRUFFZEMsSUFGYztBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsOEJBT0hDLFlBUEc7QUFBQTtBQUFBLHVCQVFESCxnQkFBZ0IsQ0FDeEJJLE9BRFEsQ0FFUkMsZ0JBRlEsQ0FFU0osZUFGVCxFQUUwQkssSUFGMUIsR0FHUkMsSUFIUSxDQUdILHlCQUFRUixJQUFSLENBSEcsQ0FSQzs7QUFBQTtBQUFBO0FBQUE7QUFRWlMsa0JBQUFBLEdBUlk7QUFBQTtBQUFBO0FBQUEsbUNBT0lDLElBUEo7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFLWkMsZ0JBQUFBLFdBTFksVUFLWkEsV0FMWTtBQU1aQyxnQkFBQUEsZ0JBTlksVUFNWkEsZ0JBTlk7QUFjUkMsZ0JBQUFBLFlBZFEsR0FjTyw2QkFBWUYsV0FBWixDQWRQO0FBQUE7QUFBQSx1QkFnQmtCVixnQkFBZ0IsQ0FDN0NJLE9BRDZCLENBRTdCUyxpQkFGNkIsQ0FFWFosZUFGVyxFQUc3QkssSUFINkIsRUFoQmxCOztBQUFBO0FBZ0JSUSxnQkFBQUEsaUJBaEJROztBQUFBLHNCQW9CWEEsaUJBQWlCLENBQUNDLFFBQWxCLE9BQWlDLDRDQXBCdEI7QUFBQTtBQUFBO0FBQUE7O0FBQUEsaURBcUJMLEVBckJLOztBQUFBO0FBd0JSQyxnQkFBQUEscUJBeEJRLEdBd0JnQixJQUFJakIsSUFBSSxDQUFDa0IsR0FBTCxDQUFTQyxRQUFiLENBQzVCQyxJQUFJLENBQUNDLEtBQUwsQ0FBV1QsZ0JBQVgsQ0FENEIsRUFFNUJHLGlCQUY0QixDQXhCaEI7QUE0QmRFLGdCQUFBQSxxQkFBcUIsQ0FBQ0ssNkJBQXRCLEdBQXNELENBQXREO0FBNUJjO0FBQUEsdUJBOEJNQyxPQUFPLENBQUNDLEdBQVIsQ0FDbEJiLFdBQVcsQ0FDUmMsTUFESCxDQUVJLFVBQUFDLENBQUM7QUFBQSx5QkFBSUEsQ0FBSjtBQUFBLGlCQUZMLEVBSUdELE1BSkgsQ0FLSSxVQUFBQyxDQUFDO0FBQUEseUJBQUlBLENBQUMsS0FBS3ZCLElBQU4sSUFBYyxDQUFDQSxJQUFuQjtBQUFBLGlCQUxMLEVBT0d3QixHQVBILENBUUksVUFBQUQsQ0FBQztBQUFBLHlCQUNDVCxxQkFBcUIsQ0FDbEJaLE9BREgsQ0FFR3VCLFNBRkgsQ0FHSWYsWUFBWSxDQUFDZ0IsR0FBYixDQUFpQkgsQ0FBakIsQ0FISixFQUlJeEIsZUFKSixFQU1HSyxJQU5ILEdBT0dDLElBUEgsQ0FRSSxVQUFBc0IsTUFBTTtBQUFBLDJCQUFLO0FBQ1QzQixzQkFBQUEsSUFBSSxFQUFFdUIsQ0FERztBQUVUSyxzQkFBQUEsT0FBTyxFQUFFaEMsUUFBUSxDQUNmLG9CQUNFQyxJQUFJLENBQUNnQyxLQUFMLENBQVdDLFdBRGIsRUFFRWpDLElBQUksQ0FBQ2dDLEtBQUwsQ0FBV0UsS0FGYixFQUdFSixNQUhGLENBRGU7QUFGUixxQkFBTDtBQUFBLG1CQVJWLENBREQ7QUFBQSxpQkFSTCxDQURrQixDQTlCTjs7QUFBQTtBQThCUkssZ0JBQUFBLEtBOUJROztBQUFBLHNCQTZEVmhDLElBQUksSUFBSSxDQUFDZ0MsS0FBSyxDQUFDQyxNQTdETDtBQUFBO0FBQUE7QUFBQTs7QUFBQSxpREE4REwsQ0FBQztBQUNOakMsa0JBQUFBLElBQUksRUFBSkEsSUFETTtBQUVONEIsa0JBQUFBLE9BQU8sRUFBRTtBQUZILGlCQUFELENBOURLOztBQUFBO0FBQUEsaURBbUVQSSxLQW5FTzs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxPQUhEOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY29tcG9zZSB9IGZyb20gJ3JhbWRhJ1xuaW1wb3J0IGhleFRvSWQgZnJvbSAnLi4vLi4vdXRpbC9oZXgtdG8taWQnXG5pbXBvcnQgeyBwb2xpY3kgfSBmcm9tICcuLi8uLi9yZXBvJ1xuaW1wb3J0IGZpbmRSb2xlTWFwIGZyb20gJy4vZmluZC1yb2xlLW1hcCdcblxuY29uc3QgYmluZGluZ3MgPSB7XG4gIDA6ICdVTkJPVU5EJyxcbiAgMTogJ1JFTEVBU0lORycsXG4gIDI6ICdOT01JTkFURUQnLFxuICAzOiAnQk9VTkQnXG59XG5cbmV4cG9ydCBkZWZhdWx0ICh7XG4gIHdlYjMsXG4gIHJlZ2lzdHJ5Q29udHJhY3QsXG59KTogRnVuY3Rpb24gPT4gYXN5bmMgKFxuICBjb250cmFjdEFkZHJlc3MsXG4gIHJvbGUsXG4pOiBQcm9taXNlPGFueT4gPT4ge1xuICBjb25zdCBbe1xuICAgIGluZGV4VG9Sb2xlLFxuICAgIGFjY2Vzc0NvbnRyb2xBYmksXG4gIH1dID0gYXdhaXQgcG9saWN5LmZpbmQoe1xuICAgIF9pZDogYXdhaXQgcmVnaXN0cnlDb250cmFjdFxuICAgICAgLm1ldGhvZHNcbiAgICAgIC5iaW5kaW5nUG9saWN5Rm9yKGNvbnRyYWN0QWRkcmVzcykuY2FsbCgpXG4gICAgICAudGhlbihoZXhUb0lkKHdlYjMpKVxuICB9KVxuXG4gIGNvbnN0IHJvbGVJbmRleE1hcCA9IGZpbmRSb2xlTWFwKGluZGV4VG9Sb2xlKTtcblxuICBjb25zdCBhY2Nlc3NDb250cm9sQWRkciA9IGF3YWl0IHJlZ2lzdHJ5Q29udHJhY3RcbiAgICAubWV0aG9kc1xuICAgIC5maW5kUnVudGltZVBvbGljeShjb250cmFjdEFkZHJlc3MpXG4gICAgLmNhbGwoKVxuICBpZihhY2Nlc3NDb250cm9sQWRkci50b1N0cmluZygpID09PSAnMHgwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwJykge1xuICAgIHJldHVybiBbXVxuICB9XG5cbiAgY29uc3QgcnVudGltZVBvbGljeUNvbnRyYWN0ID0gbmV3IHdlYjMuZXRoLkNvbnRyYWN0KFxuICAgIEpTT04ucGFyc2UoYWNjZXNzQ29udHJvbEFiaSksXG4gICAgYWNjZXNzQ29udHJvbEFkZHIsXG4gIClcbiAgcnVudGltZVBvbGljeUNvbnRyYWN0LnRyYW5zYWN0aW9uQ29uZmlybWF0aW9uQmxvY2tzID0gMTtcblxuICBjb25zdCByb2xlcyA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgIGluZGV4VG9Sb2xlXG4gICAgICAuZmlsdGVyKFxuICAgICAgICByID0+IHIsXG4gICAgICApICBcbiAgICAgIC5maWx0ZXIoXG4gICAgICAgIHIgPT4gciA9PT0gcm9sZSB8fCAhcm9sZSxcbiAgICAgIClcbiAgICAgIC5tYXAoXG4gICAgICAgIHIgPT5cbiAgICAgICAgICBydW50aW1lUG9saWN5Q29udHJhY3RcbiAgICAgICAgICAgIC5tZXRob2RzXG4gICAgICAgICAgICAucm9sZVN0YXRlKFxuICAgICAgICAgICAgICByb2xlSW5kZXhNYXAuZ2V0KHIpLFxuICAgICAgICAgICAgICBjb250cmFjdEFkZHJlc3NcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5jYWxsKClcbiAgICAgICAgICAgIC50aGVuKFxuICAgICAgICAgICAgICByZXN1bHQgPT4gKHtcbiAgICAgICAgICAgICAgICByb2xlOiByLFxuICAgICAgICAgICAgICAgIGJpbmRpbmc6IGJpbmRpbmdzW1xuICAgICAgICAgICAgICAgICAgY29tcG9zZShcbiAgICAgICAgICAgICAgICAgICAgd2ViMy51dGlscy5oZXhUb051bWJlcixcbiAgICAgICAgICAgICAgICAgICAgd2ViMy51dGlscy50b0hleFxuICAgICAgICAgICAgICAgICAgKShyZXN1bHQpXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIClcbiAgICAgIClcbiAgKVxuICBcbiAgaWYgKHJvbGUgJiYgIXJvbGVzLmxlbmd0aCkge1xuICAgIHJldHVybiBbe1xuICAgICAgcm9sZSxcbiAgICAgIGJpbmRpbmc6ICdVTkRFRklORUQnLFxuICAgIH1dXG4gIH1cbiAgcmV0dXJuIHJvbGVzXG59XG4gICAgXG4iXX0=