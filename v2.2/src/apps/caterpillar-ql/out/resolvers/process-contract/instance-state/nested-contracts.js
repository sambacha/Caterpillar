"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _repo = require("../../repo");

var _hexToId = _interopRequireDefault(require("../../util/hex-to-id"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var nestedContracts = function nestedContracts(_ref) {
  var web3 = _ref.web3,
      registryContract = _ref.registryContract;
  return (
    /*#__PURE__*/
    function () {
      var _ref2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(contractAddress) {
        var bundleId, _ref3, _ref4, _ref4$, abi, indexToElement, worklistAbi, contractInstance, worklistAddress, worklistInstance, startedActivities, startedInstances, instanceStates;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return registryContract.methods.bundleFor(contractAddress).call().then((0, _hexToId["default"])(web3));

              case 2:
                bundleId = _context.sent;
                _context.next = 5;
                return _repo.process.find({
                  _id: bundleId
                });

              case 5:
                _ref3 = _context.sent;
                _ref4 = _slicedToArray(_ref3, 1);
                _ref4$ = _ref4[0];
                abi = _ref4$.abi;
                indexToElement = _ref4$.indexToElement;
                worklistAbi = _ref4$.worklistAbi;
                contractInstance = new web3.eth.Contract(JSON.parse(abi), contractAddress);
                contractInstance.transactionConfirmationBlocks = 1;
                _context.next = 15;
                return contractInstance.methods.getWorklistAddress.call();

              case 15:
                worklistAddress = _context.sent;
                worklistInstance = worklistAddress.toString() !== '0x0000000000000000000000000000000000000000' && new web3.eth.Contract(JSON.parse(worklistAbi), worklistAddress);

                if (worklistInstance) {
                  worklistInstance.transactionConfirmationBlocks = 1;
                }

                _context.t0 = web3.utils;
                _context.next = 21;
                return contractInstance.methods.startedActivities.call();

              case 21:
                _context.t1 = _context.sent;
                startedActivities = _context.t0.toBN.call(_context.t0, _context.t1).toString(2).split('').reverse();
                _context.next = 25;
                return Promise.all(startedActivities.map(function (activityState, index) {
                  return activityState === '1' && indexToElement[index].type;
                }).map(function (type, index) {
                  if (type !== 'Separate-Instance') {
                    return Promise.resolve([]);
                  }

                  return contractInstance.methods.startedInstanceIndexFor(index).call().then(function (x) {
                    return web3.utils.toBN(x).toString(2).split('').reverse();
                  }).then(function (startedInstances) {
                    return contractInstance.methods.allInstanceAddresses.call().then(function (allInstances) {
                      return startedInstances.map(function (startedInstance, index) {
                        return startedInstance === '1' && allInstances[index];
                      }).filter(function (instance) {
                        return instance;
                      });
                    });
                  });
                }));

              case 25:
                startedInstances = _context.sent;
                _context.next = 28;
                return Promise.all(startedInstances.reduce(function (acc, instances) {
                  return [].concat(_toConsumableArray(acc), _toConsumableArray(instances));
                }, []).map(function (state) {
                  return nestedContracts({
                    web3: web3,
                    registryContract: registryContract
                  })(state);
                }));

              case 28:
                instanceStates = _context.sent;
                return _context.abrupt("return", instanceStates.reduce(function (acc, instances) {
                  return [].concat(_toConsumableArray(acc), _toConsumableArray(instances));
                }, [{
                  bundleId: bundleId,
                  contractAddress: contractAddress,
                  abi: abi,
                  indexToElement: indexToElement,
                  worklistAbi: worklistAbi,
                  worklistAddress: worklistAddress,
                  worklistInstance: worklistInstance,
                  startedActivities: startedActivities,
                  startedInstances: startedInstances
                }]));

              case 30:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }()
  );
};

var _default = nestedContracts;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvcHJvY2Vzcy1jb250cmFjdC9pbnN0YW5jZS1zdGF0ZS9uZXN0ZWQtY29udHJhY3RzLnRzIl0sIm5hbWVzIjpbIm5lc3RlZENvbnRyYWN0cyIsIndlYjMiLCJyZWdpc3RyeUNvbnRyYWN0IiwiY29udHJhY3RBZGRyZXNzIiwibWV0aG9kcyIsImJ1bmRsZUZvciIsImNhbGwiLCJ0aGVuIiwiYnVuZGxlSWQiLCJwcm9jZXNzIiwiZmluZCIsIl9pZCIsImFiaSIsImluZGV4VG9FbGVtZW50Iiwid29ya2xpc3RBYmkiLCJjb250cmFjdEluc3RhbmNlIiwiZXRoIiwiQ29udHJhY3QiLCJKU09OIiwicGFyc2UiLCJ0cmFuc2FjdGlvbkNvbmZpcm1hdGlvbkJsb2NrcyIsImdldFdvcmtsaXN0QWRkcmVzcyIsIndvcmtsaXN0QWRkcmVzcyIsIndvcmtsaXN0SW5zdGFuY2UiLCJ0b1N0cmluZyIsInV0aWxzIiwic3RhcnRlZEFjdGl2aXRpZXMiLCJ0b0JOIiwic3BsaXQiLCJyZXZlcnNlIiwiUHJvbWlzZSIsImFsbCIsIm1hcCIsImFjdGl2aXR5U3RhdGUiLCJpbmRleCIsInR5cGUiLCJyZXNvbHZlIiwic3RhcnRlZEluc3RhbmNlSW5kZXhGb3IiLCJ4Iiwic3RhcnRlZEluc3RhbmNlcyIsImFsbEluc3RhbmNlQWRkcmVzc2VzIiwiYWxsSW5zdGFuY2VzIiwic3RhcnRlZEluc3RhbmNlIiwiZmlsdGVyIiwiaW5zdGFuY2UiLCJyZWR1Y2UiLCJhY2MiLCJpbnN0YW5jZXMiLCJzdGF0ZSIsImluc3RhbmNlU3RhdGVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUdBLElBQU1BLGVBQWUsR0FBRyxTQUFsQkEsZUFBa0I7QUFBQSxNQUN0QkMsSUFEc0IsUUFDdEJBLElBRHNCO0FBQUEsTUFHdEJDLGdCQUhzQixRQUd0QkEsZ0JBSHNCO0FBQUE7QUFBQTtBQUFBO0FBQUE7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QUFBQSxnQkFBZ0IsRUFBaEJBO0FBVEQsaUJBQUQsQ0FORyxDQTFFTzs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxPQUpROztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxDQUF4Qjs7ZUFtR2V2QyxlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcHJvY2VzcyB9IGZyb20gJy4uLy4uL3JlcG8nXG5pbXBvcnQgaGV4VG9JZCBmcm9tICcuLi8uLi91dGlsL2hleC10by1pZCdcblxuXG5jb25zdCBuZXN0ZWRDb250cmFjdHMgPSAoe1xuICB3ZWIzLFxuICAvLyBicG1Nb2RlbCxcbiAgcmVnaXN0cnlDb250cmFjdCxcbn0pOiBGdW5jdGlvbiA9PiBhc3luYyAoXG4gIGNvbnRyYWN0QWRkcmVzcyxcbik6IFByb21pc2U8YW55W10+ID0+IHtcbiAgY29uc3QgYnVuZGxlSWQgPSBhd2FpdCByZWdpc3RyeUNvbnRyYWN0Lm1ldGhvZHMuYnVuZGxlRm9yKGNvbnRyYWN0QWRkcmVzcykuY2FsbCgpXG4gICAgLnRoZW4oaGV4VG9JZCh3ZWIzKSlcbiAgICAgIFxuICBjb25zdCBbe1xuICAgIGFiaSxcbiAgICBpbmRleFRvRWxlbWVudCxcbiAgICB3b3JrbGlzdEFiaSxcbiAgfV0gPSBhd2FpdCBwcm9jZXNzXG4gICAgLmZpbmQoeyBfaWQ6IGJ1bmRsZUlkIH0pXG4gIGNvbnN0IGNvbnRyYWN0SW5zdGFuY2UgPSBuZXcgd2ViMy5ldGguQ29udHJhY3QoSlNPTi5wYXJzZShhYmkpLCBjb250cmFjdEFkZHJlc3MpXG4gIGNvbnRyYWN0SW5zdGFuY2UudHJhbnNhY3Rpb25Db25maXJtYXRpb25CbG9ja3MgPSAxO1xuICBjb25zdCB3b3JrbGlzdEFkZHJlc3MgPSBhd2FpdCBjb250cmFjdEluc3RhbmNlLm1ldGhvZHMuZ2V0V29ya2xpc3RBZGRyZXNzLmNhbGwoKVxuICBjb25zdCB3b3JrbGlzdEluc3RhbmNlID0gd29ya2xpc3RBZGRyZXNzLnRvU3RyaW5nKCkgIT09ICcweDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAnICYmXG4gICAgbmV3IHdlYjMuZXRoLkNvbnRyYWN0KEpTT04ucGFyc2Uod29ya2xpc3RBYmkpLCB3b3JrbGlzdEFkZHJlc3MpXG4gIGlmICh3b3JrbGlzdEluc3RhbmNlKSB7XG4gICAgd29ya2xpc3RJbnN0YW5jZS50cmFuc2FjdGlvbkNvbmZpcm1hdGlvbkJsb2NrcyA9IDE7XG4gIH1cbiAgY29uc3Qgc3RhcnRlZEFjdGl2aXRpZXMgPSB3ZWIzLnV0aWxzLnRvQk4oXG4gICAgYXdhaXQgY29udHJhY3RJbnN0YW5jZS5tZXRob2RzLnN0YXJ0ZWRBY3Rpdml0aWVzLmNhbGwoKVxuICApLnRvU3RyaW5nKDIpLnNwbGl0KCcnKS5yZXZlcnNlKClcbiAgY29uc3Qgc3RhcnRlZEluc3RhbmNlcyA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgIHN0YXJ0ZWRBY3Rpdml0aWVzXG4gICAgICAubWFwKFxuICAgICAgICAoYWN0aXZpdHlTdGF0ZSwgaW5kZXgpOiBzdHJpbmcgPT4gYWN0aXZpdHlTdGF0ZSA9PT0gJzEnICYmXG4gICAgICAgICAgaW5kZXhUb0VsZW1lbnRbaW5kZXhdLnR5cGUsXG4gICAgICApXG4gICAgICAubWFwKFxuICAgICAgICAodHlwZSwgaW5kZXgpOiBQcm9taXNlPGFueVtdPiA9PiB7XG4gICAgICAgICAgaWYgKHR5cGUgIT09ICdTZXBhcmF0ZS1JbnN0YW5jZScpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoW10pXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBjb250cmFjdEluc3RhbmNlLm1ldGhvZHMuc3RhcnRlZEluc3RhbmNlSW5kZXhGb3IoaW5kZXgpLmNhbGwoKVxuICAgICAgICAgICAgLnRoZW4oXG4gICAgICAgICAgICAgICh4KTogYW55ID0+XG4gICAgICAgICAgICAgICAgd2ViMy51dGlscy50b0JOKHgpLnRvU3RyaW5nKDIpLnNwbGl0KCcnKS5yZXZlcnNlKCksXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAudGhlbihcbiAgICAgICAgICAgICAgKHN0YXJ0ZWRJbnN0YW5jZXMpOiBzdHJpbmdbXSA9PlxuICAgICAgICAgICAgICAgIGNvbnRyYWN0SW5zdGFuY2UubWV0aG9kcy5hbGxJbnN0YW5jZUFkZHJlc3Nlcy5jYWxsKClcbiAgICAgICAgICAgICAgICAgIC50aGVuKFxuICAgICAgICAgICAgICAgICAgICAoYWxsSW5zdGFuY2VzKTogc3RyaW5nID0+XG4gICAgICAgICAgICAgICAgICAgICAgc3RhcnRlZEluc3RhbmNlc1xuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHN0YXJ0ZWRJbnN0YW5jZSwgaW5kZXgpOiBzdHJpbmcgPT4gc3RhcnRlZEluc3RhbmNlID09PSAnMScgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGxJbnN0YW5jZXNbaW5kZXhdXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAoaW5zdGFuY2UpOiBzdHJpbmcgPT4gaW5zdGFuY2VcbiAgICAgICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgKVxuICApXG4gIGNvbnN0IGluc3RhbmNlU3RhdGVzID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgc3RhcnRlZEluc3RhbmNlc1xuICAgICAgLnJlZHVjZTxzdHJpbmdbXT4oXG4gICAgICAgIChhY2M6IHN0cmluZ1tdLCBpbnN0YW5jZXM6IHN0cmluZ1tdKTogc3RyaW5nW10gPT4gW1xuICAgICAgICAgIC4uLmFjYyxcbiAgICAgICAgICAuLi5pbnN0YW5jZXMsXG4gICAgICAgIF0sXG4gICAgICAgIFtdLFxuICAgICAgKVxuICAgICAgLm1hcChcbiAgICAgICAgKHN0YXRlKTogYW55ID0+IG5lc3RlZENvbnRyYWN0cyh7XG4gICAgICAgICAgd2ViMyxcbiAgICAgICAgICByZWdpc3RyeUNvbnRyYWN0LFxuICAgICAgICB9KShzdGF0ZSlcbiAgICAgIClcbiAgKVxuXG4gIHJldHVybiBpbnN0YW5jZVN0YXRlc1xuICAgIC5yZWR1Y2U8YW55W10+KFxuICAgICAgKGFjYzogYW55W10sIGluc3RhbmNlcyk6IGFueVtdID0+IFtcbiAgICAgICAgLi4uYWNjLFxuICAgICAgICAuLi5pbnN0YW5jZXMsXG4gICAgICBdLFxuICAgICAgW3tcbiAgICAgICAgYnVuZGxlSWQsXG4gICAgICAgIGNvbnRyYWN0QWRkcmVzcyxcbiAgICAgICAgYWJpLFxuICAgICAgICBpbmRleFRvRWxlbWVudCxcbiAgICAgICAgd29ya2xpc3RBYmksXG4gICAgICAgIHdvcmtsaXN0QWRkcmVzcyxcbiAgICAgICAgd29ya2xpc3RJbnN0YW5jZSxcbiAgICAgICAgc3RhcnRlZEFjdGl2aXRpZXMsXG4gICAgICAgIHN0YXJ0ZWRJbnN0YW5jZXMsXG4gICAgICB9XSxcbiAgICApXG4gICAgXG59XG5cbmV4cG9ydCBkZWZhdWx0IG5lc3RlZENvbnRyYWN0c1xuXG4iXX0=