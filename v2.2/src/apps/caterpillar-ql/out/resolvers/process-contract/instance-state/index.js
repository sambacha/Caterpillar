"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _nestedContracts = _interopRequireDefault(require("./nested-contracts"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var findParameters = function findParameters(contractAbi, functionName) {
  var jsonAbi = JSON.parse(contractAbi);
  var candidates = [];
  jsonAbi.forEach(function (element) {
    if (element.name === functionName) {
      candidates = element.inputs;
    }
  });
  var res = [];
  candidates.forEach(function (element) {
    if (element.name && element.name !== 'workitemId') res.push(element);
  });
  return res;
};

var _default = function _default(_ref) {
  var web3 = _ref.web3,
      bpmnModel = _ref.bpmnModel,
      registryContract = _ref.registryContract;
  return (
    /*#__PURE__*/
    function () {
      var _ref2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(contractAddress) {
        var nestedContracts, x, workItems;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return (0, _nestedContracts["default"])({
                  web3: web3,
                  registryContract: registryContract
                })(contractAddress);

              case 2:
                nestedContracts = _context4.sent;
                _context4.next = 5;
                return Promise.all(nestedContracts.map(
                /*#__PURE__*/
                function () {
                  var _ref4 = _asyncToGenerator(
                  /*#__PURE__*/
                  regeneratorRuntime.mark(function _callee3(_ref3) {
                    var bundleId, contractAddress, abi, indexToElement, worklistAbi, worklistAddress, worklistInstance, startedActivities, startedInstances;
                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            bundleId = _ref3.bundleId, contractAddress = _ref3.contractAddress, abi = _ref3.abi, indexToElement = _ref3.indexToElement, worklistAbi = _ref3.worklistAbi, worklistAddress = _ref3.worklistAddress, worklistInstance = _ref3.worklistInstance, startedActivities = _ref3.startedActivities, startedInstances = _ref3.startedInstances;
                            return _context3.abrupt("return", Promise.all(startedActivities.map(
                            /*#__PURE__*/
                            function () {
                              var _ref5 = _asyncToGenerator(
                              /*#__PURE__*/
                              regeneratorRuntime.mark(function _callee2(startedActivity, index) {
                                var reqInd, ret;
                                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                  while (1) {
                                    switch (_context2.prev = _context2.next) {
                                      case 0:
                                        if (!(startedActivity === '1' && indexToElement[index].type === 'Workitem')) {
                                          _context2.next = 8;
                                          break;
                                        }

                                        _context2.next = 3;
                                        return worklistInstance.methods.workItemsFor(index, contractAddress).call().then(function (x) {
                                          return web3.utils.toBN(x).toString(2).split('').reverse();
                                        });

                                      case 3:
                                        reqInd = _context2.sent;
                                        _context2.next = 6;
                                        return Promise.all(reqInd.map(
                                        /*#__PURE__*/
                                        function () {
                                          var _ref6 = _asyncToGenerator(
                                          /*#__PURE__*/
                                          regeneratorRuntime.mark(function _callee(req, i) {
                                            return regeneratorRuntime.wrap(function _callee$(_context) {
                                              while (1) {
                                                switch (_context.prev = _context.next) {
                                                  case 0:
                                                    if (!(req === '1')) {
                                                      _context.next = 12;
                                                      break;
                                                    }

                                                    _context.t0 = bundleId;
                                                    _context.t1 = indexToElement[index].id;
                                                    _context.t2 = indexToElement[index].name;
                                                    _context.t3 = ["/workitems/".concat(worklistAddress, "/").concat(i)];
                                                    _context.t4 = findParameters(worklistAbi, indexToElement[index].name);
                                                    _context.next = 8;
                                                    return worklistInstance.methods.processInstanceFor(i).call();

                                                  case 8:
                                                    _context.t5 = _context.sent;
                                                    _context.t6 = [_context.t5];
                                                    _context.t7 = contractAddress;
                                                    return _context.abrupt("return", {
                                                      bundleId: _context.t0,
                                                      elementId: _context.t1,
                                                      elementName: _context.t2,
                                                      hrefs: _context.t3,
                                                      input: _context.t4,
                                                      pcases: _context.t6,
                                                      processAddress: _context.t7
                                                    });

                                                  case 12:
                                                  case "end":
                                                    return _context.stop();
                                                }
                                              }
                                            }, _callee);
                                          }));

                                          return function (_x5, _x6) {
                                            return _ref6.apply(this, arguments);
                                          };
                                        }()));

                                      case 6:
                                        ret = _context2.sent;
                                        return _context2.abrupt("return", ret);

                                      case 8:
                                      case "end":
                                        return _context2.stop();
                                    }
                                  }
                                }, _callee2);
                              }));

                              return function (_x3, _x4) {
                                return _ref5.apply(this, arguments);
                              };
                            }())));

                          case 2:
                          case "end":
                            return _context3.stop();
                        }
                      }
                    }, _callee3);
                  }));

                  return function (_x2) {
                    return _ref4.apply(this, arguments);
                  };
                }()));

              case 5:
                x = _context4.sent;
                workItems = x.reduce(function (acc, items) {
                  return [].concat(_toConsumableArray(acc), _toConsumableArray(items || []));
                }, []).reduce(function (acc, items) {
                  return [].concat(_toConsumableArray(acc), _toConsumableArray(items || []));
                }, []).filter(function (x) {
                  return x;
                }).map(function (item, index) {
                  return _objectSpread({}, item, {
                    index: index
                  });
                }).reduce(function (acc, item) {
                  var exists = acc.find(function (_ref7) {
                    var elementId = _ref7.elementId,
                        bundleId = _ref7.bundleId;
                    return elementId === item.elementId && bundleId === item.bundleId;
                  });

                  if (exists) {
                    return [].concat(_toConsumableArray(acc.filter(function (a) {
                      return a !== exists;
                    })), [_objectSpread({}, exists, {
                      hrefs: [].concat(_toConsumableArray(exists.hrefs), _toConsumableArray(item.hrefs)),
                      pcases: [].concat(_toConsumableArray(exists.pcases), _toConsumableArray(item.pcases))
                    })]);
                  }

                  return [].concat(_toConsumableArray(acc), [item]);
                }, []).sort(function (_ref8) {
                  var index = _ref8.index;
                  return index;
                });
                return _context4.abrupt("return", {
                  bpmn: bpmnModel,
                  workItems: workItems
                });

              case 8:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }()
  );
};

exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvcHJvY2Vzcy1jb250cmFjdC9pbnN0YW5jZS1zdGF0ZS9pbmRleC50cyJdLCJuYW1lcyI6WyJmaW5kUGFyYW1ldGVycyIsImNvbnRyYWN0QWJpIiwiZnVuY3Rpb25OYW1lIiwianNvbkFiaSIsIkpTT04iLCJwYXJzZSIsImNhbmRpZGF0ZXMiLCJmb3JFYWNoIiwiZWxlbWVudCIsIm5hbWUiLCJpbnB1dHMiLCJyZXMiLCJwdXNoIiwid2ViMyIsImJwbW5Nb2RlbCIsInJlZ2lzdHJ5Q29udHJhY3QiLCJjb250cmFjdEFkZHJlc3MiLCJuZXN0ZWRDb250cmFjdHMiLCJQcm9taXNlIiwiYWxsIiwibWFwIiwiYnVuZGxlSWQiLCJhYmkiLCJpbmRleFRvRWxlbWVudCIsIndvcmtsaXN0QWJpIiwid29ya2xpc3RBZGRyZXNzIiwid29ya2xpc3RJbnN0YW5jZSIsInN0YXJ0ZWRBY3Rpdml0aWVzIiwic3RhcnRlZEluc3RhbmNlcyIsInN0YXJ0ZWRBY3Rpdml0eSIsImluZGV4IiwidHlwZSIsIm1ldGhvZHMiLCJ3b3JrSXRlbXNGb3IiLCJjYWxsIiwidGhlbiIsIngiLCJ1dGlscyIsInRvQk4iLCJ0b1N0cmluZyIsInNwbGl0IiwicmV2ZXJzZSIsInJlcUluZCIsInJlcSIsImkiLCJpZCIsInByb2Nlc3NJbnN0YW5jZUZvciIsImVsZW1lbnRJZCIsImVsZW1lbnROYW1lIiwiaHJlZnMiLCJpbnB1dCIsInBjYXNlcyIsInByb2Nlc3NBZGRyZXNzIiwicmV0Iiwid29ya0l0ZW1zIiwicmVkdWNlIiwiYWNjIiwiaXRlbXMiLCJmaWx0ZXIiLCJpdGVtIiwiZXhpc3RzIiwiZmluZCIsImEiLCJzb3J0IiwiYnBtbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUdBLElBQU1BLGNBQWMsR0FBRyxTQUFqQkEsY0FBaUIsQ0FBQ0MsV0FBRCxFQUFjQyxZQUFkLEVBQStCO0FBQ3BELE1BQUlDLE9B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RUFBRWxELFNBQVI7QUFBbUJ3QyxrQkFBQUEsU0FBUyxFQUFUQTtBQUFuQixpQkFySE87O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsT0FKRDs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBnZXROZXN0ZWRDb250cmFjdHMgZnJvbSAnLi9uZXN0ZWQtY29udHJhY3RzJ1xuXG5cbmNvbnN0IGZpbmRQYXJhbWV0ZXJzID0gKGNvbnRyYWN0QWJpLCBmdW5jdGlvbk5hbWUpID0+IHtcbiAgbGV0IGpzb25BYmkgPSBKU09OLnBhcnNlKGNvbnRyYWN0QWJpKTtcbiAgbGV0IGNhbmRpZGF0ZXMgPSBbXTtcbiAganNvbkFiaS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgaWYgKGVsZW1lbnQubmFtZSA9PT0gZnVuY3Rpb25OYW1lKSB7XG4gICAgICAgICAgY2FuZGlkYXRlcyA9IGVsZW1lbnQuaW5wdXRzO1xuICAgICAgfVxuICB9KTtcbiAgbGV0IHJlcyA9IFtdO1xuICBjYW5kaWRhdGVzLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICBpZiAoZWxlbWVudC5uYW1lICYmIGVsZW1lbnQubmFtZSAhPT0gJ3dvcmtpdGVtSWQnKVxuICAgICAgICAgIHJlcy5wdXNoKGVsZW1lbnQpO1xuICB9KTtcbiAgcmV0dXJuIHJlcztcbn07XG5cblxuZXhwb3J0IGRlZmF1bHQgKHtcbiAgd2ViMyxcbiAgYnBtbk1vZGVsLFxuICByZWdpc3RyeUNvbnRyYWN0LFxufSk6IEZ1bmN0aW9uID0+IGFzeW5jIChcbiAgY29udHJhY3RBZGRyZXNzLFxuKTogUHJvbWlzZTxhbnk+ID0+IHtcbiAgY29uc3QgbmVzdGVkQ29udHJhY3RzID0gYXdhaXQgZ2V0TmVzdGVkQ29udHJhY3RzKHtcbiAgICB3ZWIzLFxuICAgIHJlZ2lzdHJ5Q29udHJhY3QsICBcbiAgfSkoY29udHJhY3RBZGRyZXNzKVxuXG4gIGNvbnN0IHggPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICBuZXN0ZWRDb250cmFjdHNcbiAgICAgIC5tYXAoXG4gICAgICAgIGFzeW5jICh7XG4gICAgICAgICAgYnVuZGxlSWQsXG4gICAgICAgICAgY29udHJhY3RBZGRyZXNzLFxuICAgICAgICAgIGFiaSxcbiAgICAgICAgICBpbmRleFRvRWxlbWVudCxcbiAgICAgICAgICB3b3JrbGlzdEFiaSxcbiAgICAgICAgICB3b3JrbGlzdEFkZHJlc3MsXG4gICAgICAgICAgd29ya2xpc3RJbnN0YW5jZSxcbiAgICAgICAgICBzdGFydGVkQWN0aXZpdGllcyxcbiAgICAgICAgICBzdGFydGVkSW5zdGFuY2VzLFxuICAgICAgICB9KTogUHJvbWlzZTxhbnk+ID0+IFByb21pc2UuYWxsKFxuICAgICAgICAgIHN0YXJ0ZWRBY3Rpdml0aWVzXG4gICAgICAgICAgICAubWFwKFxuICAgICAgICAgICAgICBhc3luYyAoXG4gICAgICAgICAgICAgICAgc3RhcnRlZEFjdGl2aXR5LFxuICAgICAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgICApOiBQcm9taXNlPGFueT4gPT4ge1xuICAgICAgICAgICAgICAgIGlmIChzdGFydGVkQWN0aXZpdHkgPT09ICcxJyAmJiBpbmRleFRvRWxlbWVudFtpbmRleF0udHlwZSA9PT0gJ1dvcmtpdGVtJykge1xuICAgICAgICAgICAgICAgICAgY29uc3QgcmVxSW5kID0gYXdhaXQgd29ya2xpc3RJbnN0YW5jZS5tZXRob2RzLndvcmtJdGVtc0ZvcihpbmRleCwgY29udHJhY3RBZGRyZXNzKS5jYWxsKClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oXG4gICAgICAgICAgICAgICAgICAgICAgKHgpOiBhbnkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHdlYjMudXRpbHMudG9CTih4KS50b1N0cmluZygyKS5zcGxpdCgnJykucmV2ZXJzZSgpLFxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgIGNvbnN0IHJldCA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgICAgICAgICAgICByZXFJbmRcbiAgICAgICAgICAgICAgICAgICAgICAubWFwKFxuICAgICAgICAgICAgICAgICAgICAgICAgYXN5bmMgKHJlcSwgaSk6IFByb21pc2U8YW55PiA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXEgPT09ICcxJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidW5kbGVJZDogYnVuZGxlSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50SWQ6IGluZGV4VG9FbGVtZW50W2luZGV4XS5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnROYW1lOiBpbmRleFRvRWxlbWVudFtpbmRleF0ubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhyZWZzOiBbYC93b3JraXRlbXMvJHt3b3JrbGlzdEFkZHJlc3N9LyR7aX1gXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0OiBmaW5kUGFyYW1ldGVycyh3b3JrbGlzdEFiaSwgaW5kZXhUb0VsZW1lbnRbaW5kZXhdLm5hbWUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGNhc2VzOiBbIGF3YWl0IHdvcmtsaXN0SW5zdGFuY2UubWV0aG9kcy5wcm9jZXNzSW5zdGFuY2VGb3IoaSkuY2FsbCgpXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2Nlc3NBZGRyZXNzOiBjb250cmFjdEFkZHJlc3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKVxuICAgICAgICApLFxuICAgICAgKVxuICApXG4gIGNvbnN0IHdvcmtJdGVtcyA9IHhcbiAgICAucmVkdWNlKFxuICAgICAgKGFjYywgaXRlbXMpID0+IFtcbiAgICAgICAgLi4uYWNjLFxuICAgICAgICAuLi5pdGVtcyB8fCBbXSxcbiAgICAgIF0sXG4gICAgICBbXSxcbiAgICApXG4gICAgLnJlZHVjZShcbiAgICAgIChhY2MsIGl0ZW1zKSA9PiBbXG4gICAgICAgIC4uLmFjYyxcbiAgICAgICAgLi4uaXRlbXMgfHwgW10sXG4gICAgICBdLFxuICAgICAgW10sXG4gICAgKVxuICAgIC5maWx0ZXIoeCA9PiB4KVxuICAgIC5tYXAoXG4gICAgICAoaXRlbSwgaW5kZXgpID0+ICh7XG4gICAgICAgIC4uLml0ZW0sXG4gICAgICAgIGluZGV4LFxuICAgICAgfSlcbiAgICApXG4gICAgLnJlZHVjZShcbiAgICAgIChhY2MsIGl0ZW0pID0+IHtcbiAgICAgICAgY29uc3QgZXhpc3RzID0gYWNjLmZpbmQoXG4gICAgICAgICAgKHsgZWxlbWVudElkLCBidW5kbGVJZCB9KSA9PlxuICAgICAgICAgICAgZWxlbWVudElkID09PSBpdGVtLmVsZW1lbnRJZCAmJlxuICAgICAgICAgICAgICBidW5kbGVJZCA9PT0gaXRlbS5idW5kbGVJZCxcbiAgICAgICAgKVxuICAgICAgICBpZiAoZXhpc3RzKSB7XG4gICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIC4uLmFjYy5maWx0ZXIoYSA9PiBhICE9PSBleGlzdHMpLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAuLi5leGlzdHMsXG4gICAgICAgICAgICAgIGhyZWZzOltcbiAgICAgICAgICAgICAgICAuLi5leGlzdHMuaHJlZnMsXG4gICAgICAgICAgICAgICAgLi4uaXRlbS5ocmVmcyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgcGNhc2VzOiBbXG4gICAgICAgICAgICAgICAgLi4uZXhpc3RzLnBjYXNlcyxcbiAgICAgICAgICAgICAgICAuLi5pdGVtLnBjYXNlcyxcbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgIC4uLmFjYyxcbiAgICAgICAgICBpdGVtLFxuICAgICAgICBdICBcbiAgICAgICAgXG4gICAgICB9LFxuICAgICAgW10sXG4gICAgKVxuICAgIC5zb3J0KFxuICAgICAgKHsgaW5kZXggfSkgPT4gaW5kZXgsXG4gICAgKVxuICByZXR1cm4geyBicG1uOiBicG1uTW9kZWwsIHdvcmtJdGVtcyB9XG59XG4iXX0=