"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _debug2 = _interopRequireDefault(require("debug"));

var _StatusError = _interopRequireDefault(require("../Status-Error"));

var _repo = require("../repo");

var _compile = _interopRequireDefault(require("../util/compile"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/* babel-plugin-inline-import '../../abstract/AbstractFactory.sol' */
var abstractFactory = "pragma solidity ^0.5.6;\n\ncontract AbstractFactory {\n    address internal worklist = address(0);\n\n    function setWorklist(address _worklist) public {\n        worklist = _worklist;\n    }\n\n    function newInstance(address parent, address globalFactory) public returns(address);\n    function startInstanceExecution(address processAddress) public;\n}\n";

/* babel-plugin-inline-import '../../abstract/ProcessRegistry.sol' */
var processRegistry = "pragma solidity ^0.5.6;\n\ncontract IFunct {\n    // WorkList functions\n    function updateRuntimeRegistry(address _runtimeRegistry) public;\n    // Factory Functions\n    function setWorklist(address _worklist) public;\n    function startInstanceExecution(address processAddress) public;\n    function newInstance(address parent, address globalFactory) public returns(address);\n    function findParent() public view returns(address);\n}\n\ncontract ProcessRegistry {\n\n    mapping (bytes32 => mapping (uint => bytes32)) private parent2ChildrenBundleId;\n    mapping (bytes32 => address) private factories;\n    mapping (bytes32 => bytes32) private policy;\n    mapping (bytes32 => bytes32) private taskRole;\n\n    mapping (address => bytes32) private instance2Bundle;\n    mapping (address => address) private instance2PolicyOp;\n    address[] private instances;\n\n    mapping (address => bytes32) private worklist2Bundle;\n\n    event NewInstanceCreatedFor(address parent, address processAddress);\n\n    function registerFactory(bytes32 bundleId, address factory) external {\n        factories[bundleId] = factory;\n    }\n\n    function registerWorklist(bytes32 bundleId, address worklist) external {\n        address factory = factories[bundleId];\n        require(factory != address(0));\n        worklist2Bundle[worklist] = bundleId;\n        IFunct(factory).setWorklist(worklist);\n        IFunct(worklist).updateRuntimeRegistry(address(this));\n    }\n\n    function findRuntimePolicy(address pCase) public view returns(address) {\n        return instance2PolicyOp[pCase];\n    }\n\n    function relateProcessToPolicy(bytes32 bundleId, bytes32 _policy, bytes32 _taskRole) external {\n        taskRole[bundleId] = _taskRole;\n        policy[bundleId] = _policy;\n    }\n\n\n    function addChildBundleId(bytes32 parentBundleId, bytes32 processBundleId, uint nodeIndex) external {\n        parent2ChildrenBundleId[parentBundleId][nodeIndex] = processBundleId;\n    }\n\n    function newInstanceFor(uint nodeIndex, address parent) public returns(address) {\n        return newBundleInstanceFor(parent2ChildrenBundleId[instance2Bundle[parent]][nodeIndex], parent, instance2PolicyOp[parent]);\n    }\n\n    function newBundleInstanceFor(bytes32 bundleId, address parent, address policyOpAddr) public returns(address) {\n        address factory = factories[bundleId];\n        require(factory != address(0));\n        address processAddress = IFunct(factory).newInstance(parent, address(this));\n        instance2Bundle[processAddress] = bundleId;\n        instance2PolicyOp[processAddress] = policyOpAddr;\n        instances.push(processAddress);\n        IFunct(factory).startInstanceExecution(processAddress);\n        emit NewInstanceCreatedFor(parent, processAddress);\n        return processAddress;\n    }\n\n    function allInstances() external view returns(address[] memory) {\n        return instances;\n    }\n    \n    function bindingPolicyFor(address procInstance) external view returns(bytes32) {\n        bytes32 pId = instance2Bundle[procInstance];\n        address pAddr = procInstance;\n        while(policy[pId].length != 0) {\n            pAddr = IFunct(pAddr).findParent();\n            if(pAddr == address(0))\n                break;\n            pId = instance2Bundle[pAddr];\n        }\n        return policy[pId];\n    }\n\n    function taskRoleMapFor(address procInstance) external view returns(bytes32) {\n        bytes32 pId = instance2Bundle[procInstance];\n        address pAddr = procInstance;\n        while(taskRole[pId].length != 0) {\n            pAddr = IFunct(pAddr).findParent();\n            if(pAddr == address(0))\n                break;\n            pId = instance2Bundle[pAddr];\n        }\n        return taskRole[pId];\n    }\n\n    function bindingPolicyFromId(bytes32 procId) external view returns(bytes32) {\n        return policy[procId];\n    }\n\n    function taskRoleMapFromId(bytes32 procId) external view returns(bytes32) {\n        return taskRole[procId];\n    }\n\n    function bundleFor(address processInstance) external view returns(bytes32) {\n        return instance2Bundle[processInstance];\n    }\n\n    function childrenFor(bytes32 parent, uint nodeInd) external view returns(bytes32) {\n        return parent2ChildrenBundleId[parent][nodeInd];\n    }\n\n    function worklistBundleFor(address worklist) external view returns(bytes32) {\n        return worklist2Bundle[worklist];\n    }\n}";
var debug = (0, _debug2["default"])('caterpillarql:add-registry');
var executionAccount = 0;

var _default =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(_ref) {
    var web3, output, procContract, gasUsed, accounts, contract;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            web3 = _ref.web3;
            debug('DEPLOYING PROCESS RUNTIME REGISTRY ...');
            _context.prev = 2;
            output = (0, _compile["default"])({
              AbstractFactory: {
                content: abstractFactory
              },
              ProcessRegistry: {
                content: processRegistry
              }
            });

            if (!(Object.keys(output.contracts).length === 0)) {
              _context.next = 10;
              break;
            }

            debug('COMPILATION ERROR IN SMART CONTRACTS');
            debug(output.errors);
            debug('----------------------------------------------------------------------------------------------');
            throw new _StatusError["default"]('COMPILATION ERROR IN RUNTIME REGISTRY SMART CONTRACTS', 400);

          case 10:
            debug('PROCESS RUNTIME REGISTRY COMPILED SUCCESSFULLY');
            debug('CREATING RUNTIME REGISTRY INSTANCE ... ');
            procContract = new web3.eth.Contract(output.contracts.ProcessRegistry.ProcessRegistry["interface"]); // how many blocks we wait for before result

            procContract.transactionConfirmationBlocks = 1;
            debug(output.contracts.ProcessRegistry.ProcessRegistry);
            _context.next = 17;
            return web3.eth.personal.getAccounts();

          case 17:
            accounts = _context.sent;
            _context.next = 20;
            return procContract.deploy({
              data: "0x" + output.contracts.ProcessRegistry.ProcessRegistry.evm.bytecode.object
            }).send({
              from: accounts[executionAccount],
              gas: 4700000
            } // (error, txHash) => console.log('s func', error, txHash),
            ).on('receipt', function (_ref3) {
              var g = _ref3.gasUsed;
              gasUsed = g;
            });

          case 20:
            contract = _context.sent;
            return _context.abrupt("return", _repo.registry.create({
              address: contract.address,
              solidityCode: processRegistry,
              gasUsed: gasUsed,
              abi: JSON.stringify(output.contracts.ProcessRegistry.ProcessRegistry.abi),
              bytecode: output.contracts.ProcessRegistry.ProcessRegistry.evm.bytecode.object
            }));

          case 24:
            _context.prev = 24;
            _context.t0 = _context["catch"](2);
            debug("Error: ", _context.t0);
            debug('----------------------------------------------------------------------------------------------');
            throw new _StatusError["default"](_context.t0.message, 400);

          case 29:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 24]]);
  }));

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvbXV0YXRpb24vYWRkLXJlZ2lzdHJ5LnRzIl0sIm5hbWVzIjpbImRlYnVnIiwiZXhlY3V0aW9uQWNjb3VudCIsIndlYjMiLCJvdXRwdXQiLCJBYnN0cmFjdEZhY3RvcnkiLCJjb250ZW50IiwiYWJzdHJhY3RGYWN0b3J5IiwiUHJvY2Vzc1JlZ2lzdHJ5IiwicHJvY2Vzc1JlZ2lzdHJ5IiwiT2JqZWN0Iiwia2V5cyIsImNvbnRyYWN0cyIsImxlbmd0aCIsImVycm9ycyIsIlN0YXR1c0Vycm9yIiwicHJvY0NvbnRyYWN0IiwiZXRoIiwiQ29udHJhY3QiLCJ0cmFuc2FjdGlvbkNvbmZpcm1hdGlvbkJsb2NrcyIsInBlcnNvbmFsIiwiZ2V0QWNjb3VudHMiLCJhY2NvdW50cyIsImRlcGxveSIsImRhdGEiLCJldm0iLCJieXRlY29kZSIsIm9iamVjdCIsInNlbmQiLCJmcm9tIiwiZ2FzIiwib24iLCJnIiwiZ2FzVXNlZCIsImNvbnRyYWN0IiwicmVnaXN0cnkiLCJjcmVhdGUiLCJhZGRyZXNzIiwic29saWRpdHlDb2RlIiwiYWJpIiwiSlNPTiIsInN0cmluZ2lmeSIsIm1lc3NhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7QUFFQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7OztBQUtBLElBQU1BLEtBQUssR0FBRyx3QkFBTyw0QkFBUCxDQUFkO0FBQ0EsSUFBTUMsZ0JBQWdCLEdBQUcsQ0FBekI7Ozs7Ozs7MEJBRWU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ2JDLFlBQUFBLElBRGEsUUFDYkEsSUFEYTtBQUdiRixZQUFBQSxLQUFLLENBQUMsd0NBQUQsQ0FBTDtBQUhhO0FBS0xHLFlBQUFBLE1BTEssR0FLSSx5QkFBUTtBQUNyQkMsY0FBQUEsZUFBZSxFQUFFO0FBQ2ZDLGdCQUFBQSxPQUFPLEVBQUVDO0FBRE0sZUFESTtBQUlyQkMsY0FBQUEsZUFBZSxFQUFFO0FBQ2ZGLGdCQUFBQSxPQUFPLEVBQUVHO0FBRE07QUFKSSxhQUFSLENBTEo7O0FBQUEsa0JBY1BDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZUCxNQUFNLENBQUNRLFNBQW5CLEVBQThCQyxNQUE5QixLQUF5QyxDQWRsQztBQUFBO0FBQUE7QUFBQTs7QUFlVFosWUFBQUEsS0FBSyxDQUFDLHNDQUFELENBQUw7QUFDQUEsWUFBQUEsS0FBSyxDQUFDRyxNQUFNLENBQUNVLE1BQVIsQ0FBTDtBQUNBYixZQUFBQSxLQUFLLENBQUMsZ0dBQUQsQ0FBTDtBQWpCUyxrQkFrQkgsSUFBSWMsdUJBQUosQ0FBZ0IsdURBQWhCLEVBQXlFLEdBQXpFLENBbEJHOztBQUFBO0FBc0JYZCxZQUFBQSxLQUFLLENBQUMsZ0RBQUQsQ0FBTDtBQUNBQSxZQUFBQSxLQUFLLENBQUMseUNBQUQsQ0FBTDtBQUNNZSxZQUFBQSxZQXhCSyxHQXdCVSxJQUFJYixJQUFJLENBQUNjLEdBQUwsQ0FBU0MsUUFBYixDQUFzQmQsTUFBTSxDQUFDUSxTQUFQLENBQWlCSixlQUFqQixDQUFpQ0EsZUFBakMsYUFBdEIsQ0F4QlYsRUF5Qlg7O0FBQ0FRLFlBQUFBLFlBQVksQ0FBQ0csNkJBQWIsR0FBNkMsQ0FBN0M7QUFFQWxCLFlBQUFBLEtBQUssQ0FBQ0csTUFBTSxDQUFDUSxTQUFQLENBQWlCSixlQUFqQixDQUFpQ0EsZUFBbEMsQ0FBTDtBQTVCVztBQUFBLG1CQTZCWUwsSUFBSSxDQUFDYyxHQUFMLENBQVNHLFFBQVQsQ0FBa0JDLFdBQWxCLEVBN0JaOztBQUFBO0FBNkJMQyxZQUFBQSxRQTdCSztBQUFBO0FBQUEsbUJBOEJZTixZQUFZLENBQ2hDTyxNQURvQixDQUNiO0FBQ05DLGNBQUFBLElBQUksRUFBRSxPQUFPcEIsTUFBTSxDQUFDUSxTQUFQLENBQWlCSixlQUFqQixDQUFpQ0EsZUFBakMsQ0FBaURpQixHQUFqRCxDQUFxREMsUUFBckQsQ0FBOERDO0FBRHJFLGFBRGEsRUFJcEJDLElBSm9CLENBS25CO0FBQ0VDLGNBQUFBLElBQUksRUFBRVAsUUFBUSxDQUFDcEIsZ0JBQUQsQ0FEaEI7QUFFRTRCLGNBQUFBLEdBQUcsRUFBRTtBQUZQLGFBTG1CLENBU25CO0FBVG1CLGNBV3BCQyxFQVhvQixDQVluQixTQVptQixFQWFuQixpQkFFVztBQUFBLGtCQURFQyxDQUNGLFNBRFBDLE9BQ087QUFDVEEsY0FBQUEsT0FBTyxHQUFHRCxDQUFWO0FBQ0QsYUFqQmtCLENBOUJaOztBQUFBO0FBOEJMRSxZQUFBQSxRQTlCSztBQUFBLDZDQWlESkMsZUFBU0MsTUFBVCxDQUNMO0FBQ0VDLGNBQUFBLE9BQU8sRUFBRUgsUUFBUSxDQUFDRyxPQURwQjtBQUVFQyxjQUFBQSxZQUFZLEVBQUU3QixlQUZoQjtBQUdFd0IsY0FBQUEsT0FBTyxFQUFQQSxPQUhGO0FBSUVNLGNBQUFBLEdBQUcsRUFBRUMsSUFBSSxDQUFDQyxTQUFMLENBQWVyQyxNQUFNLENBQUNRLFNBQVAsQ0FBaUJKLGVBQWpCLENBQWlDQSxlQUFqQyxDQUFpRCtCLEdBQWhFLENBSlA7QUFLRWIsY0FBQUEsUUFBUSxFQUFFdEIsTUFBTSxDQUFDUSxTQUFQLENBQWlCSixlQUFqQixDQUFpQ0EsZUFBakMsQ0FBaURpQixHQUFqRCxDQUFxREMsUUFBckQsQ0FBOERDO0FBTDFFLGFBREssQ0FqREk7O0FBQUE7QUFBQTtBQUFBO0FBMkRYMUIsWUFBQUEsS0FBSyxDQUFDLFNBQUQsY0FBTDtBQUNBQSxZQUFBQSxLQUFLLENBQUMsZ0dBQUQsQ0FBTDtBQTVEVyxrQkE2REwsSUFBSWMsdUJBQUosQ0FBZ0IsWUFBRTJCLE9BQWxCLEVBQTJCLEdBQTNCLENBN0RLOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZnMgZnJvbSAnZnMnXG5pbXBvcnQgc29sYyBmcm9tICdzb2xjJ1xuaW1wb3J0IF9kZWJ1ZyBmcm9tICdkZWJ1ZydcblxuaW1wb3J0IFN0YXR1c0Vycm9yIGZyb20gJy4uL1N0YXR1cy1FcnJvcidcbmltcG9ydCB7IHJlZ2lzdHJ5IH0gZnJvbSAnLi4vcmVwbydcbmltcG9ydCBjb21waWxlIGZyb20gJy4uL3V0aWwvY29tcGlsZSdcblxuaW1wb3J0IGFic3RyYWN0RmFjdG9yeSBmcm9tICcuLi8uLi9hYnN0cmFjdC9BYnN0cmFjdEZhY3Rvcnkuc29sJ1xuaW1wb3J0IHByb2Nlc3NSZWdpc3RyeSBmcm9tICcuLi8uLi9hYnN0cmFjdC9Qcm9jZXNzUmVnaXN0cnkuc29sJyBcblxuY29uc3QgZGVidWcgPSBfZGVidWcoJ2NhdGVycGlsbGFycWw6YWRkLXJlZ2lzdHJ5JylcbmNvbnN0IGV4ZWN1dGlvbkFjY291bnQgPSAwXG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jICh7XG4gIHdlYjMsXG59KTogUHJvbWlzZTxvYmplY3Q+ID0+IHtcbiAgZGVidWcoJ0RFUExPWUlORyBQUk9DRVNTIFJVTlRJTUUgUkVHSVNUUlkgLi4uJyk7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3V0cHV0ID0gY29tcGlsZSh7XG4gICAgICBBYnN0cmFjdEZhY3Rvcnk6IHtcbiAgICAgICAgY29udGVudDogYWJzdHJhY3RGYWN0b3J5LFxuICAgICAgfSxcbiAgICAgIFByb2Nlc3NSZWdpc3RyeToge1xuICAgICAgICBjb250ZW50OiBwcm9jZXNzUmVnaXN0cnksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgaWYgKE9iamVjdC5rZXlzKG91dHB1dC5jb250cmFjdHMpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgZGVidWcoJ0NPTVBJTEFUSU9OIEVSUk9SIElOIFNNQVJUIENPTlRSQUNUUycpO1xuICAgICAgZGVidWcob3V0cHV0LmVycm9ycyk7XG4gICAgICBkZWJ1ZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xuICAgICAgdGhyb3cgbmV3IFN0YXR1c0Vycm9yKCdDT01QSUxBVElPTiBFUlJPUiBJTiBSVU5USU1FIFJFR0lTVFJZIFNNQVJUIENPTlRSQUNUUycsIDQwMClcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBkZWJ1ZygnUFJPQ0VTUyBSVU5USU1FIFJFR0lTVFJZIENPTVBJTEVEIFNVQ0NFU1NGVUxMWScpO1xuICAgIGRlYnVnKCdDUkVBVElORyBSVU5USU1FIFJFR0lTVFJZIElOU1RBTkNFIC4uLiAnKTtcbiAgICBjb25zdCBwcm9jQ29udHJhY3QgPSBuZXcgd2ViMy5ldGguQ29udHJhY3Qob3V0cHV0LmNvbnRyYWN0cy5Qcm9jZXNzUmVnaXN0cnkuUHJvY2Vzc1JlZ2lzdHJ5LmludGVyZmFjZSlcbiAgICAvLyBob3cgbWFueSBibG9ja3Mgd2Ugd2FpdCBmb3IgYmVmb3JlIHJlc3VsdFxuICAgIHByb2NDb250cmFjdC50cmFuc2FjdGlvbkNvbmZpcm1hdGlvbkJsb2NrcyA9IDE7XG4gICAgbGV0IGdhc1VzZWRcbiAgICBkZWJ1ZyhvdXRwdXQuY29udHJhY3RzLlByb2Nlc3NSZWdpc3RyeS5Qcm9jZXNzUmVnaXN0cnkpXG4gICAgY29uc3QgYWNjb3VudHMgPSBhd2FpdCB3ZWIzLmV0aC5wZXJzb25hbC5nZXRBY2NvdW50cygpXG4gICAgY29uc3QgY29udHJhY3QgPSBhd2FpdCBwcm9jQ29udHJhY3RcbiAgICAgIC5kZXBsb3koe1xuICAgICAgICBkYXRhOiBcIjB4XCIgKyBvdXRwdXQuY29udHJhY3RzLlByb2Nlc3NSZWdpc3RyeS5Qcm9jZXNzUmVnaXN0cnkuZXZtLmJ5dGVjb2RlLm9iamVjdCxcbiAgICAgIH0pXG4gICAgICAuc2VuZChcbiAgICAgICAge1xuICAgICAgICAgIGZyb206IGFjY291bnRzW2V4ZWN1dGlvbkFjY291bnRdLFxuICAgICAgICAgIGdhczogNDcwMDAwMCxcbiAgICAgICAgfSxcbiAgICAgICAgLy8gKGVycm9yLCB0eEhhc2gpID0+IGNvbnNvbGUubG9nKCdzIGZ1bmMnLCBlcnJvciwgdHhIYXNoKSxcbiAgICAgIClcbiAgICAgIC5vbihcbiAgICAgICAgJ3JlY2VpcHQnLFxuICAgICAgICAoXG4gICAgICAgICAgeyBnYXNVc2VkOiBnIH06IGFueSxcbiAgICAgICAgKTogdm9pZCA9PiB7XG4gICAgICAgICAgZ2FzVXNlZCA9IGdcbiAgICAgICAgfSxcbiAgICAgIClcbiAgICByZXR1cm4gcmVnaXN0cnkuY3JlYXRlKFxuICAgICAge1xuICAgICAgICBhZGRyZXNzOiBjb250cmFjdC5hZGRyZXNzLFxuICAgICAgICBzb2xpZGl0eUNvZGU6IHByb2Nlc3NSZWdpc3RyeSxcbiAgICAgICAgZ2FzVXNlZCxcbiAgICAgICAgYWJpOiBKU09OLnN0cmluZ2lmeShvdXRwdXQuY29udHJhY3RzLlByb2Nlc3NSZWdpc3RyeS5Qcm9jZXNzUmVnaXN0cnkuYWJpKSxcbiAgICAgICAgYnl0ZWNvZGU6IG91dHB1dC5jb250cmFjdHMuUHJvY2Vzc1JlZ2lzdHJ5LlByb2Nlc3NSZWdpc3RyeS5ldm0uYnl0ZWNvZGUub2JqZWN0LFxuICAgICAgfVxuICAgIClcbiAgfSBjYXRjaCAoZSkge1xuICAgIGRlYnVnKFwiRXJyb3I6IFwiLCBlKTtcbiAgICBkZWJ1ZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xuICAgIHRocm93IG5ldyBTdGF0dXNFcnJvcihlLm1lc3NhZ2UsIDQwMClcbiAgfVxufSJdfQ==