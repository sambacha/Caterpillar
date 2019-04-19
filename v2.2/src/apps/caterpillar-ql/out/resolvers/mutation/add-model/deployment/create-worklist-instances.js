"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _debug2 = _interopRequireDefault(require("debug"));

var _continueWorklistCreation = _interopRequireDefault(require("./continue-worklist-creation"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var debug = (0, _debug2["default"])('caterpillarql:add-model:create-worklist-instances');

var createWorklistInstances = function createWorklistInstances(web3, registryContract, currentIndex, sortedElements, outputContracts, modelInfo) {
  debug('----------------------------------------------------------------------------------------');
  var workListInstanceContract = outputContracts[modelInfo.id]["".concat(sortedElements[currentIndex].nodeName, "_Worklist")];

  if (workListInstanceContract) {
    var worklistContract = new web3.eth.Contract(workListInstanceContract.abi);
    worklistContract.transactionConfirmationBlocks = 1;
    return web3.eth.personal.getAccounts().then(function (accounts) {
      return worklistContract.deploy({
        data: "0x" + workListInstanceContract.evm.bytecode.object
      }).send({
        from: accounts[0],
        gas: 4700000
      }).then(function (contractW) {
        if (contractW.address) {
          return registryContract.methods.registerWorklist(web3.utils.fromAscii(sortedElements[currentIndex].bundleId), contractW.address).send({
            from: accounts[0],
            gas: 4700000
          }).then(function (result1) {
            return (0, _continueWorklistCreation["default"])(web3, registryContract, currentIndex, [].concat(_toConsumableArray(sortedElements.slice(0, currentIndex - 1)), [_objectSpread({}, sortedElements[currentIndex], {
              worklist: contractW.address
            })], _toConsumableArray(sortedElements.slice(currentIndex + 1))), outputContracts, modelInfo, createWorklistInstances);
          });
        }
      });
    });
  } else {
    return (0, _continueWorklistCreation["default"])(web3, registryContract, currentIndex, sortedElements, outputContracts, modelInfo, createWorklistInstances);
  }
};

var _default = createWorklistInstances;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvbXV0YXRpb24vYWRkLW1vZGVsL2RlcGxveW1lbnQvY3JlYXRlLXdvcmtsaXN0LWluc3RhbmNlcy50cyJdLCJuYW1lcyI6WyJkZWJ1ZyIsImNyZWF0ZVdvcmtsaXN0SW5zdGFuY2VzIiwid2ViMyIsInJlZ2lzdHJ5Q29udHJhY3QiLCJjdXJyZW50SW5kZXgiLCJzb3J0ZWRFbGVtZW50cyIsIm91dHB1dENvbnRyYWN0cyIsIm1vZGVsSW5mbyIsIndvcmtMaXN0SW5zdGFuY2VDb250cmFjdCIsImlkIiwibm9kZU5hbWUiLCJ3b3JrbGlzdENvbnRyYWN0IiwiZXRoIiwiQ29udHJhY3QiLCJhYmkiLCJ0cmFuc2FjdGlvbkNvbmZpcm1hdGlvbkJsb2NrcyIsInBlcnNvbmFsIiwiZ2V0QWNjb3VudHMiLCJ0aGVuIiwiYWNjb3VudHMiLCJkZXBsb3kiLCJkYXRhIiwiZXZtIiwiYnl0ZWNvZGUiLCJvYmplY3QiLCJzZW5kIiwiZnJvbSIsImdhcyIsImNvbnRyYWN0VyIsImFkZHJlc3MiLCJtZXRob2RzIiwicmVnaXN0ZXJXb3JrbGlzdCIsInV0aWxzIiwiZnJvbUFzY2lpIiwiYnVuZGxlSWQiLCJyZXN1bHQxIiwic2xpY2UiLCJ3b3JrbGlzdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsS0FBSyxHQUFHLHdCQUFPLG1EQUFQLENBQWQ7O0FBRUEsSUFBTUMsdUJBQXVCLEdBQUcsU0FBMUJBLHVCQUEwQixDQUM5QkMsSUFEOEIsRUFFOUJDLGdCQUY4QixFQUc5QkMsWUFIOEIsRUFJOUJDLGNBSjhCLEVBSzlCQyxlQUw4QixFQU05QkMsU0FOOEIsRUFPM0I7QUFDSFAsRUFBQUEsS0FBSyxDQUFDLDBGQUFELENBQUw7QUFDQSxNQUFNUSx3QkFBd0IsR0FBR0YsZUFBZSxDQUFDQyxTQUFTLENBQUNFLEVBQVgsQ0FBZixXQUFpQ0osY0FBYyxDQUFDRCxZQUFELENBQWQsQ0FBNkJNLFFBQTlELGVBQWpDOztBQUNBLE1BQUlGLHdCQUFKLEVBQThCO0FBQzVCLFFBQU1HLGdCQUFnQixHQUFHLElBQUlULElBQUksQ0FBQ1UsR0FBTCxDQUFTQyxRQUFiLENBQXNCTCx3QkFBd0IsQ0FBQ00sR0FBL0MsQ0FBekI7QUFDQUgsSUFBQUEsZ0JBQWdCLENBQUNJLDZCQUFqQixHQUFpRCxDQUFqRDtBQUNBLFdBQU9iLElBQUksQ0FBQ1UsR0FBTCxDQUFTSSxRQUFULENBQWtCQyxXQUFsQixHQUNKQyxJQURJLENBRUgsVUFBQUMsUUFBUTtBQUFBLGFBQ05SLGdCQUFnQixDQUNiUyxNQURILENBRUk7QUFDRUMsUUFBQUEsSUFBSSxFQUFFLE9BQU9iLHdCQUF3QixDQUFDYyxHQUF6QixDQUE2QkMsUUFBN0IsQ0FBc0NDO0FBRHJELE9BRkosRUFNR0MsSUFOSCxDQU9JO0FBQ0VDLFFBQUFBLElBQUksRUFBRVAsUUFBUSxDQUFDLENBQUQsQ0FEaEI7QUFFRVEsUUFBQUEsR0FBRyxFQUFFO0FBRlAsT0FQSixFQVlHVCxJQVpILENBYUksVUFBQVUsU0FBUyxFQUFJO0FBQ1gsWUFBSUEsU0FBUyxDQUFDQyxPQUFkLEVBQXVCO0FBQ3JCLGlCQUFPMUIsZ0JBQWdCLENBQ3BCMkIsT0FESSxDQUVKQyxnQkFGSSxDQUdIN0IsSUFBSSxDQUFDOEIsS0FBTCxDQUFXQyxTQUFYLENBQXFCNUIsY0FBYyxDQUFDRCxZQUFELENBQWQsQ0FBNkI4QixRQUFsRCxDQUhHLEVBSUhOLFNBQVMsQ0FBQ0MsT0FKUCxFQU1KSixJQU5JLENBT0g7QUFDRUMsWUFBQUEsSUFBSSxFQUFFUCxRQUFRLENBQUMsQ0FBRCxDQURoQjtBQUVFUSxZQUFBQSxHQUFHLEVBQUU7QUFGUCxXQVBHLEVBWUpULElBWkksQ0FhSCxVQUFBaUIsT0FBTztBQUFBLG1CQUNMLDBDQUNFakMsSUFERixFQUVFQyxnQkFGRixFQUdFQyxZQUhGLCtCQUtPQyxjQUFjLENBQUMrQixLQUFmLENBQXFCLENBQXJCLEVBQXdCaEMsWUFBWSxHQUFFLENBQXRDLENBTFAsc0JBT1NDLGNBQWMsQ0FBQ0QsWUFBRCxDQVB2QjtBQVFNaUMsY0FBQUEsUUFBUSxFQUFFVCxTQUFTLENBQUNDO0FBUjFCLG9DQVVPeEIsY0FBYyxDQUFDK0IsS0FBZixDQUFxQmhDLFlBQVksR0FBRyxDQUFwQyxDQVZQLElBWUVFLGVBWkYsRUFhRUMsU0FiRixFQWNFTix1QkFkRixDQURLO0FBQUEsV0FiSixDQUFQO0FBK0JEO0FBQ0YsT0EvQ0wsQ0FETTtBQUFBLEtBRkwsQ0FBUDtBQXFERCxHQXhERCxNQXdETztBQUNMLFdBQU8sMENBQ0xDLElBREssRUFFTEMsZ0JBRkssRUFHTEMsWUFISyxFQUlMQyxjQUpLLEVBS0xDLGVBTEssRUFNTEMsU0FOSyxFQU9MTix1QkFQSyxDQUFQO0FBU0Q7QUFDRixDQTdFRDs7ZUErRWVBLHVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF9kZWJ1ZyBmcm9tICdkZWJ1ZydcblxuaW1wb3J0ICBjb250aW51ZVdvcmtsaXN0Q3JlYXRpb24gZnJvbSAnLi9jb250aW51ZS13b3JrbGlzdC1jcmVhdGlvbidcblxuY29uc3QgZGVidWcgPSBfZGVidWcoJ2NhdGVycGlsbGFycWw6YWRkLW1vZGVsOmNyZWF0ZS13b3JrbGlzdC1pbnN0YW5jZXMnKVxuXG5jb25zdCBjcmVhdGVXb3JrbGlzdEluc3RhbmNlcyA9IChcbiAgd2ViMyxcbiAgcmVnaXN0cnlDb250cmFjdCwgXG4gIGN1cnJlbnRJbmRleCxcbiAgc29ydGVkRWxlbWVudHMsXG4gIG91dHB1dENvbnRyYWN0cyxcbiAgbW9kZWxJbmZvLFxuKSA9PiB7XG4gIGRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcbiAgY29uc3Qgd29ya0xpc3RJbnN0YW5jZUNvbnRyYWN0ID0gb3V0cHV0Q29udHJhY3RzW21vZGVsSW5mby5pZF1bYCR7c29ydGVkRWxlbWVudHNbY3VycmVudEluZGV4XS5ub2RlTmFtZX1fV29ya2xpc3RgXVxuICBpZiAod29ya0xpc3RJbnN0YW5jZUNvbnRyYWN0KSB7XG4gICAgY29uc3Qgd29ya2xpc3RDb250cmFjdCA9IG5ldyB3ZWIzLmV0aC5Db250cmFjdCh3b3JrTGlzdEluc3RhbmNlQ29udHJhY3QuYWJpKVxuICAgIHdvcmtsaXN0Q29udHJhY3QudHJhbnNhY3Rpb25Db25maXJtYXRpb25CbG9ja3MgPSAxXG4gICAgcmV0dXJuIHdlYjMuZXRoLnBlcnNvbmFsLmdldEFjY291bnRzKClcbiAgICAgIC50aGVuKFxuICAgICAgICBhY2NvdW50cyA9PlxuICAgICAgICAgIHdvcmtsaXN0Q29udHJhY3RcbiAgICAgICAgICAgIC5kZXBsb3koXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBkYXRhOiBcIjB4XCIgKyB3b3JrTGlzdEluc3RhbmNlQ29udHJhY3QuZXZtLmJ5dGVjb2RlLm9iamVjdCxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5zZW5kKFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZnJvbTogYWNjb3VudHNbMF0sXG4gICAgICAgICAgICAgICAgZ2FzOiA0NzAwMDAwLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLnRoZW4oXG4gICAgICAgICAgICAgIGNvbnRyYWN0VyA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGNvbnRyYWN0Vy5hZGRyZXNzKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gcmVnaXN0cnlDb250cmFjdFxuICAgICAgICAgICAgICAgICAgICAubWV0aG9kc1xuICAgICAgICAgICAgICAgICAgICAucmVnaXN0ZXJXb3JrbGlzdChcbiAgICAgICAgICAgICAgICAgICAgICB3ZWIzLnV0aWxzLmZyb21Bc2NpaShzb3J0ZWRFbGVtZW50c1tjdXJyZW50SW5kZXhdLmJ1bmRsZUlkKSxcbiAgICAgICAgICAgICAgICAgICAgICBjb250cmFjdFcuYWRkcmVzcyxcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAuc2VuZChcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmcm9tOiBhY2NvdW50c1swXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGdhczogNDcwMDAwMFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oXG4gICAgICAgICAgICAgICAgICAgICAgcmVzdWx0MSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWVXb3JrbGlzdENyZWF0aW9uKFxuICAgICAgICAgICAgICAgICAgICAgICAgICB3ZWIzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICByZWdpc3RyeUNvbnRyYWN0LCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEluZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uc29ydGVkRWxlbWVudHMuc2xpY2UoMCwgY3VycmVudEluZGV4IC0xKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5zb3J0ZWRFbGVtZW50c1tjdXJyZW50SW5kZXhdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd29ya2xpc3Q6IGNvbnRyYWN0Vy5hZGRyZXNzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuLi5zb3J0ZWRFbGVtZW50cy5zbGljZShjdXJyZW50SW5kZXggKyAxKVxuICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXRDb250cmFjdHMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsSW5mbyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlV29ya2xpc3RJbnN0YW5jZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIClcbiAgICAgICAgKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBjb250aW51ZVdvcmtsaXN0Q3JlYXRpb24oXG4gICAgICB3ZWIzLFxuICAgICAgcmVnaXN0cnlDb250cmFjdCwgICAgICAgICAgICAgICBcbiAgICAgIGN1cnJlbnRJbmRleCxcbiAgICAgIHNvcnRlZEVsZW1lbnRzLFxuICAgICAgb3V0cHV0Q29udHJhY3RzLFxuICAgICAgbW9kZWxJbmZvLFxuICAgICAgY3JlYXRlV29ya2xpc3RJbnN0YW5jZXMsXG4gICAgKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlV29ya2xpc3RJbnN0YW5jZXNcbiJdfQ==