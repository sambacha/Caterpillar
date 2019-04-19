"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _repo = require("../repo");

var _registryContract = _interopRequireDefault(require("../util/registry-contract"));

var _instanceState = _interopRequireDefault(require("../process-contract/instance-state"));

var _debug = _interopRequireDefault(require("debug"));

var _hexToId = _interopRequireDefault(require("../util/hex-to-id"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
    var web3, address, contract, instances, instanceStates, bundleFors;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            web3 = _ref.web3, address = _ref.registry;
            _context.next = 3;
            return (0, _registryContract["default"])({
              address: address,
              web3: web3
            });

          case 3:
            contract = _context.sent;

            if (!contract) {
              _context.next = 18;
              break;
            }

            _context.next = 7;
            return contract.methods.allInstances.call();

          case 7:
            instances = _context.sent;

            if (!instances) {
              _context.next = 18;
              break;
            }

            (0, _debug["default"])('caterpillarql:processes')({
              instances: instances
            });
            _context.next = 12;
            return Promise.all(instances.map(function (address) {
              return (0, _instanceState["default"])({
                web3: web3,
                registryContract: contract
              })(address);
            }));

          case 12:
            instanceStates = _context.sent;
            (0, _debug["default"])('caterpillarql:processes')({
              instanceStates: instanceStates
            });
            _context.next = 16;
            return Promise.all(instances.map(function (instance) {
              return contract.methods.bundleFor(instance).call().then(function (bundleFor) {
                return {
                  instance: instance,
                  bundleFor: (0, _hexToId["default"])(web3)(bundleFor)
                };
              });
            }));

          case 16:
            bundleFors = _context.sent;
            return _context.abrupt("return", Promise.all(bundleFors.map(function (_ref3) {
              var bundleFor = _ref3.bundleFor,
                  instance = _ref3.instance;
              return _repo.process.find({
                _id: bundleFor
              }).then(function (_ref4) {
                var _ref5 = _slicedToArray(_ref4, 1),
                    _ref5$ = _ref5[0],
                    bpmnModel = _ref5$.bpmnModel,
                    name = _ref5$.rootProcessName;

                return {
                  address: instance,
                  id: bundleFor,
                  bpmnModel: bpmnModel,
                  registryContract: contract,
                  name: name
                };
              });
            })));

          case 18:
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvcmVnaXN0cnkvcHJvY2Vzc2VzLnRzIl0sIm5hbWVzIjpbIndlYjMiLCJhZGRyZXNzIiwicmVnaXN0cnkiLCJjb250cmFjdCIsIm1ldGhvZHMiLCJhbGxJbnN0YW5jZXMiLCJjYWxsIiwiaW5zdGFuY2VzIiwiUHJvbWlzZSIsImFsbCIsIm1hcCIsInJlZ2lzdHJ5Q29udHJhY3QiLCJpbnN0YW5jZVN0YXRlcyIsImluc3RhbmNlIiwiYnVuZGxlRm9yIiwidGhlbiIsImJ1bmRsZUZvcnMiLCJwcm9jZXNzIiwiZmluZCIsIl9pZCIsImJwbW5Nb2RlbCIsIm5hbWUiLCJyb290UHJvY2Vzc05hbWUiLCJpZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7MEJBRWU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ2JBLFlBQUFBLElBRGEsUUFDYkEsSUFEYSxFQUVIQyxPQUZHLFFBRWJDLFFBRmE7QUFBQTtBQUFBLG1CQUlVLGtDQUFpQjtBQUN0Q0QsY0FBQUEsT0FBTyxFQUFQQSxPQURzQztBQUV0Q0QsY0FBQUEsSUFBSSxFQUFKQTtBQUZzQyxhQUFqQixDQUpWOztBQUFBO0FBSVBHLFlBQUFBLFFBSk87O0FBQUEsaUJBUVRBLFFBUlM7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQSxtQkFTYUEsUUFBUSxDQUFDQyxPQUFULENBQWlCQyxZQUFqQixDQUE4QkMsSUFBOUIsRUFUYjs7QUFBQTtBQVNMQyxZQUFBQSxTQVRLOztBQUFBLGlCQVVQQSxTQVZPO0FBQUE7QUFBQTtBQUFBOztBQVdULG1DQUFNLHlCQUFOLEVBQWlDO0FBQUVBLGNBQUFBLFNBQVMsRUFBVEE7QUFBRixhQUFqQztBQVhTO0FBQUEsbUJBWW9CQyxPQUFPLENBQUNDLEdBQVIsQ0FDM0JGLFNBQVMsQ0FDTkcsR0FESCxDQUVJLFVBQUFULE9BQU87QUFBQSxxQkFBSSwrQkFBYztBQUN2QkQsZ0JBQUFBLElBQUksRUFBSkEsSUFEdUI7QUFFdkJXLGdCQUFBQSxnQkFBZ0IsRUFBRVI7QUFGSyxlQUFkLEVBR1JGLE9BSFEsQ0FBSjtBQUFBLGFBRlgsQ0FEMkIsQ0FacEI7O0FBQUE7QUFZSFcsWUFBQUEsY0FaRztBQXFCVCxtQ0FBTSx5QkFBTixFQUFpQztBQUFFQSxjQUFBQSxjQUFjLEVBQWRBO0FBQUYsYUFBakM7QUFyQlM7QUFBQSxtQkFzQmdCSixPQUFPLENBQUNDLEdBQVIsQ0FDdkJGLFNBQVMsQ0FDTkcsR0FESCxDQUVJLFVBQUNHLFFBQUQ7QUFBQSxxQkFDRVYsUUFBUSxDQUFDQyxPQUFULENBQWlCVSxTQUFqQixDQUEyQkQsUUFBM0IsRUFBcUNQLElBQXJDLEdBQ0dTLElBREgsQ0FFSSxVQUFDRCxTQUFEO0FBQUEsdUJBQXdCO0FBQ3RCRCxrQkFBQUEsUUFBUSxFQUFSQSxRQURzQjtBQUV0QkMsa0JBQUFBLFNBQVMsRUFBRSx5QkFBUWQsSUFBUixFQUFjYyxTQUFkO0FBRlcsaUJBQXhCO0FBQUEsZUFGSixDQURGO0FBQUEsYUFGSixDQUR1QixDQXRCaEI7O0FBQUE7QUFzQkhFLFlBQUFBLFVBdEJHO0FBQUEsNkNBbUNGUixPQUFPLENBQUNDLEdBQVIsQ0FDTE8sVUFBVSxDQUNQTixHQURILENBRUk7QUFBQSxrQkFDRUksU0FERixTQUNFQSxTQURGO0FBQUEsa0JBRUVELFFBRkYsU0FFRUEsUUFGRjtBQUFBLHFCQUd1QkksY0FDcEJDLElBRG9CLENBQ2Y7QUFBRUMsZ0JBQUFBLEdBQUcsRUFBRUw7QUFBUCxlQURlLEVBRXBCQyxJQUZvQixDQUduQjtBQUFBO0FBQUE7QUFBQSxvQkFDRUssU0FERixVQUNFQSxTQURGO0FBQUEsb0JBRW1CQyxJQUZuQixVQUVFQyxlQUZGOztBQUFBLHVCQUdnQjtBQUNkckIsa0JBQUFBLE9BQU8sRUFBRVksUUFESztBQUVkVSxrQkFBQUEsRUFBRSxFQUFFVCxTQUZVO0FBR2RNLGtCQUFBQSxTQUFTLEVBQVRBLFNBSGM7QUFJZFQsa0JBQUFBLGdCQUFnQixFQUFFUixRQUpKO0FBS2RrQixrQkFBQUEsSUFBSSxFQUFKQTtBQUxjLGlCQUhoQjtBQUFBLGVBSG1CLENBSHZCO0FBQUEsYUFGSixDQURLLENBbkNFOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBwcm9jZXNzIH0gZnJvbSAnLi4vcmVwbydcbmltcG9ydCByZWdpc3RyeUNvbnRyYWN0IGZyb20gJy4uL3V0aWwvcmVnaXN0cnktY29udHJhY3QnXG5pbXBvcnQgaW5zdGFuY2VTdGF0ZSBmcm9tICcuLi9wcm9jZXNzLWNvbnRyYWN0L2luc3RhbmNlLXN0YXRlJ1xuaW1wb3J0IGRlYnVnIGZyb20gJ2RlYnVnJ1xuaW1wb3J0IGhleFRvSWQgZnJvbSAnLi4vdXRpbC9oZXgtdG8taWQnXG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jICh7XG4gIHdlYjMsXG4gIHJlZ2lzdHJ5OiBhZGRyZXNzLFxufSk6IFByb21pc2U8YW55W10+ID0+IHtcbiAgY29uc3QgY29udHJhY3QgPSBhd2FpdCByZWdpc3RyeUNvbnRyYWN0KHtcbiAgICBhZGRyZXNzLFxuICAgIHdlYjMsXG4gIH0pXG4gIGlmIChjb250cmFjdCkge1xuICAgIGNvbnN0IGluc3RhbmNlcyA9IGF3YWl0IGNvbnRyYWN0Lm1ldGhvZHMuYWxsSW5zdGFuY2VzLmNhbGwoKVxuICAgIGlmIChpbnN0YW5jZXMpIHtcbiAgICAgIGRlYnVnKCdjYXRlcnBpbGxhcnFsOnByb2Nlc3NlcycpKHsgaW5zdGFuY2VzIH0pXG4gICAgICBjb25zdCBpbnN0YW5jZVN0YXRlcyA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICBpbnN0YW5jZXNcbiAgICAgICAgICAubWFwKFxuICAgICAgICAgICAgYWRkcmVzcyA9PiBpbnN0YW5jZVN0YXRlKHtcbiAgICAgICAgICAgICAgd2ViMyxcbiAgICAgICAgICAgICAgcmVnaXN0cnlDb250cmFjdDogY29udHJhY3QsXG4gICAgICAgICAgICB9KShhZGRyZXNzKVxuICAgICAgICAgIClcbiAgICAgIClcbiAgICAgIGRlYnVnKCdjYXRlcnBpbGxhcnFsOnByb2Nlc3NlcycpKHsgaW5zdGFuY2VTdGF0ZXMgfSlcbiAgICAgIGNvbnN0IGJ1bmRsZUZvcnMgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgaW5zdGFuY2VzXG4gICAgICAgICAgLm1hcChcbiAgICAgICAgICAgIChpbnN0YW5jZSk6IFByb21pc2U8b2JqZWN0PiA9PlxuICAgICAgICAgICAgICBjb250cmFjdC5tZXRob2RzLmJ1bmRsZUZvcihpbnN0YW5jZSkuY2FsbCgpXG4gICAgICAgICAgICAgICAgLnRoZW4oXG4gICAgICAgICAgICAgICAgICAoYnVuZGxlRm9yKTogb2JqZWN0ID0+ICh7XG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlLFxuICAgICAgICAgICAgICAgICAgICBidW5kbGVGb3I6IGhleFRvSWQod2ViMykoYnVuZGxlRm9yKSxcbiAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgKVxuICAgICAgKVxuICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFxuICAgICAgICBidW5kbGVGb3JzXG4gICAgICAgICAgLm1hcChcbiAgICAgICAgICAgICh7XG4gICAgICAgICAgICAgIGJ1bmRsZUZvcixcbiAgICAgICAgICAgICAgaW5zdGFuY2UsXG4gICAgICAgICAgICB9KTogUHJvbWlzZTxvYmplY3Q+ID0+IHByb2Nlc3NcbiAgICAgICAgICAgICAgLmZpbmQoeyBfaWQ6IGJ1bmRsZUZvcn0pXG4gICAgICAgICAgICAgIC50aGVuKFxuICAgICAgICAgICAgICAgIChbe1xuICAgICAgICAgICAgICAgICAgYnBtbk1vZGVsLFxuICAgICAgICAgICAgICAgICAgcm9vdFByb2Nlc3NOYW1lOiBuYW1lLFxuICAgICAgICAgICAgICAgIH1dKTogb2JqZWN0ID0+ICh7XG4gICAgICAgICAgICAgICAgICBhZGRyZXNzOiBpbnN0YW5jZSxcbiAgICAgICAgICAgICAgICAgIGlkOiBidW5kbGVGb3IsXG4gICAgICAgICAgICAgICAgICBicG1uTW9kZWwsXG4gICAgICAgICAgICAgICAgICByZWdpc3RyeUNvbnRyYWN0OiBjb250cmFjdCxcbiAgICAgICAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgIClcbiAgICB9XG4gIH1cbn1cbiJdfQ==