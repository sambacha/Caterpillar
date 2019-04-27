"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _debug2 = _interopRequireDefault(require("debug"));

var _StatusError = _interopRequireDefault(require("../Status-Error"));

var _repo = require("../repo");

var _compile = _interopRequireDefault(require("../util/compile"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/* babel-plugin-inline-import '../../abstract/AbstractFactory.sol' */
const abstractFactory = "pragma solidity ^0.5.0;\n\ncontract AbstractFactory {\n    address internal worklist = address(0);\n\n    function setWorklist(address _worklist) public {\n        worklist = _worklist;\n    }\n\n    function newInstance(address parent, address globalFactory) public returns(address);\n    function startInstanceExecution(address processAddress) public;\n}\n";

/* babel-plugin-inline-import '../../abstract/ProcessRegistry.sol' */
const processRegistry = "pragma solidity ^0.5.0;\n\ncontract IFunct {\n    // worklist functions\n    function updateRuntimeRegistry(address _runtimeRegistry) public;\n    // Factory Functions\n    function setWorklist(address _worklist) public;\n    function startInstanceExecution(address processAddress) public;\n    function newInstance(address parent, address globalFactory) public returns(address);\n    function findParent() public view returns(address);\n}\n\ncontract ProcessRegistry {\n\n    mapping (bytes32 => mapping (uint => bytes32)) private parent2ChildrenBundleId;\n    mapping (bytes32 => address) private factories;\n    mapping (bytes32 => bytes32) private policy;\n    mapping (bytes32 => bytes32) private taskRole;\n\n    mapping (address => bytes32) private instance2Bundle;\n    mapping (address => address) private instance2PolicyOp;\n    address[] private instances;\n\n    mapping (address => bytes32) private worklist2Bundle;\n\n    event NewInstanceCreatedFor(address parent, address processAddress);\n\n    function registerFactory(bytes32 bundleId, address factory) external {\n        factories[bundleId] = factory;\n    }\n\n    function registerWorklist(bytes32 bundleId, address worklist) external {\n        address factory = factories[bundleId];\n        require(factory != address(0));\n        worklist2Bundle[worklist] = bundleId;\n        IFunct(factory).setWorklist(worklist);\n        IFunct(worklist).updateRuntimeRegistry(address(this));\n    }\n\n    function findRuntimePolicy(address pCase) public view returns(address) {\n        return instance2PolicyOp[pCase];\n    }\n\n    function relateProcessToPolicy(bytes32 bundleId, bytes32 _policy, bytes32 _taskRole) external {\n        taskRole[bundleId] = _taskRole;\n        policy[bundleId] = _policy;\n    }\n\n\n    function addChildBundleId(bytes32 parentBundleId, bytes32 processBundleId, uint nodeIndex) external {\n        parent2ChildrenBundleId[parentBundleId][nodeIndex] = processBundleId;\n    }\n\n    function newInstanceFor(uint nodeIndex, address parent) public returns(address) {\n        return newBundleInstanceFor(parent2ChildrenBundleId[instance2Bundle[parent]][nodeIndex], parent, instance2PolicyOp[parent]);\n    }\n\n    function newBundleInstanceFor(bytes32 bundleId, address parent, address policyOpAddr) public returns(address) {\n        address factory = factories[bundleId];\n        require(factory != address(0));\n        address processAddress = IFunct(factory).newInstance(parent, address(this));\n        instance2Bundle[processAddress] = bundleId;\n        instance2PolicyOp[processAddress] = policyOpAddr;\n        instances.push(processAddress);\n        IFunct(factory).startInstanceExecution(processAddress);\n        emit NewInstanceCreatedFor(parent, processAddress);\n        return processAddress;\n    }\n\n    function allInstances() external view returns(address[] memory) {\n        return instances;\n    }\n    \n    function bindingPolicyFor(address procInstance) external view returns(bytes32) {\n        bytes32 pId = instance2Bundle[procInstance];\n        address pAddr = procInstance;\n        while(policy[pId].length != 0) {\n            pAddr = IFunct(pAddr).findParent();\n            if(pAddr == address(0))\n                break;\n            pId = instance2Bundle[pAddr];\n        }\n        return policy[pId];\n    }\n\n    function taskRoleMapFor(address procInstance) external view returns(bytes32) {\n        bytes32 pId = instance2Bundle[procInstance];\n        address pAddr = procInstance;\n        while(taskRole[pId].length != 0) {\n            pAddr = IFunct(pAddr).findParent();\n            if(pAddr == address(0))\n                break;\n            pId = instance2Bundle[pAddr];\n        }\n        return taskRole[pId];\n    }\n\n    function bindingPolicyFromId(bytes32 procId) external view returns(bytes32) {\n        return policy[procId];\n    }\n\n    function taskRoleMapFromId(bytes32 procId) external view returns(bytes32) {\n        return taskRole[procId];\n    }\n\n    function bundleFor(address processInstance) external view returns(bytes32) {\n        return instance2Bundle[processInstance];\n    }\n\n    function childrenFor(bytes32 parent, uint nodeInd) external view returns(bytes32) {\n        return parent2ChildrenBundleId[parent][nodeInd];\n    }\n\n    function worklistBundleFor(address worklist) external view returns(bytes32) {\n        return worklist2Bundle[worklist];\n    }\n}";
const debug = (0, _debug2.default)('caterpillarql:registry');
const executionAccount = 0;

var _default = async ({
  web3
}) => {
  debug('DEPLOYING PROCESS RUNTIME REGISTRY ...');

  try {
    const output = (0, _compile.default)({
      AbstractFactory: {
        content: abstractFactory
      },
      ProcessRegistry: {
        content: processRegistry
      }
    });

    if (Object.keys(output.contracts).length === 0) {
      debug('COMPILATION ERROR IN SMART CONTRACTS');
      debug(output.errors);
      debug('----------------------------------------------------------------------------------------------');
      throw new _StatusError.default('COMPILATION ERROR IN RUNTIME REGISTRY SMART CONTRACTS', 400);
      return;
    }

    debug('PROCESS RUNTIME REGISTRY COMPILED SUCCESSFULLY');
    debug('CREATING RUNTIME REGISTRY INSTANCE ... ');
    const procContract = new web3.eth.Contract(output.contracts.ProcessRegistry.ProcessRegistry.interface);
    /*
    procContract
      .getPastEvents(
        'allEvents',
        {
          fromBlock: 'latest',
        },
        e => console.log('past event', e),
      )*/
    // how many blocks we wait for before result

    procContract.transactionConfirmationBlocks = 1;
    let gasUsed, createdBlockNumber;
    const accounts = await web3.eth.personal.getAccounts();
    const contract = await procContract.deploy({
      data: "0x" + output.contracts.ProcessRegistry.ProcessRegistry.evm.bytecode.object
    }).send({
      from: accounts[executionAccount],
      gas: 4700000
    } // (error, txHash) => console.log('s func', error, txHash),
    ).on('receipt', (_ref) => {
      let {
        gasUsed: g,
        blockNumber
      } = _ref,
          rest = _objectWithoutProperties(_ref, ["gasUsed", "blockNumber"]);

      debug({
        rest
      });
      createdBlockNumber = blockNumber;
      gasUsed = g;
    });
    return _repo.registry.create({
      address: contract.address,
      solidityCode: processRegistry,
      gasUsed,
      abi: JSON.stringify(output.contracts.ProcessRegistry.ProcessRegistry.abi),
      bytecode: output.contracts.ProcessRegistry.ProcessRegistry.evm.bytecode.object
    });
  } catch (e) {
    debug("Error: ", e);
    debug('----------------------------------------------------------------------------------------------');
    throw new _StatusError.default(e.message, 400);
  }
};

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvbXV0YXRpb24vcmVnaXN0cnkudHMiXSwibmFtZXMiOlsiZGVidWciLCJleGVjdXRpb25BY2NvdW50Iiwid2ViMyIsIm91dHB1dCIsIkFic3RyYWN0RmFjdG9yeSIsImNvbnRlbnQiLCJhYnN0cmFjdEZhY3RvcnkiLCJQcm9jZXNzUmVnaXN0cnkiLCJwcm9jZXNzUmVnaXN0cnkiLCJPYmplY3QiLCJrZXlzIiwiY29udHJhY3RzIiwibGVuZ3RoIiwiZXJyb3JzIiwiU3RhdHVzRXJyb3IiLCJwcm9jQ29udHJhY3QiLCJldGgiLCJDb250cmFjdCIsImludGVyZmFjZSIsInRyYW5zYWN0aW9uQ29uZmlybWF0aW9uQmxvY2tzIiwiZ2FzVXNlZCIsImNyZWF0ZWRCbG9ja051bWJlciIsImFjY291bnRzIiwicGVyc29uYWwiLCJnZXRBY2NvdW50cyIsImNvbnRyYWN0IiwiZGVwbG95IiwiZGF0YSIsImV2bSIsImJ5dGVjb2RlIiwib2JqZWN0Iiwic2VuZCIsImZyb20iLCJnYXMiLCJvbiIsImciLCJibG9ja051bWJlciIsInJlc3QiLCJyZWdpc3RyeSIsImNyZWF0ZSIsImFkZHJlc3MiLCJzb2xpZGl0eUNvZGUiLCJhYmkiLCJKU09OIiwic3RyaW5naWZ5IiwiZSIsIm1lc3NhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFFQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7OztBQUtBLE1BQU1BLEtBQUssR0FBRyxxQkFBTyx3QkFBUCxDQUFkO0FBQ0EsTUFBTUMsZ0JBQWdCLEdBQUcsQ0FBekI7O2VBRWUsT0FBTztBQUNwQkMsRUFBQUE7QUFEb0IsQ0FBUCxLQUVRO0FBQ3JCRixFQUFBQSxLQUFLLENBQUMsd0NBQUQsQ0FBTDs7QUFDQSxNQUFJO0FBQ0YsVUFBTUcsTUFBTSxHQUFHLHNCQUFRO0FBQ3JCQyxNQUFBQSxlQUFlLEVBQUU7QUFDZkMsUUFBQUEsT0FBTyxFQUFFQztBQURNLE9BREk7QUFJckJDLE1BQUFBLGVBQWUsRUFBRTtBQUNmRixRQUFBQSxPQUFPLEVBQUVHO0FBRE07QUFKSSxLQUFSLENBQWY7O0FBU0EsUUFBSUMsTUFBTSxDQUFDQyxJQUFQLENBQVlQLE1BQU0sQ0FBQ1EsU0FBbkIsRUFBOEJDLE1BQTlCLEtBQXlDLENBQTdDLEVBQWdEO0FBQzlDWixNQUFBQSxLQUFLLENBQUMsc0NBQUQsQ0FBTDtBQUNBQSxNQUFBQSxLQUFLLENBQUNHLE1BQU0sQ0FBQ1UsTUFBUixDQUFMO0FBQ0FiLE1BQUFBLEtBQUssQ0FBQyxnR0FBRCxDQUFMO0FBQ0EsWUFBTSxJQUFJYyxvQkFBSixDQUFnQix1REFBaEIsRUFBeUUsR0FBekUsQ0FBTjtBQUNBO0FBQ0Q7O0FBRURkLElBQUFBLEtBQUssQ0FBQyxnREFBRCxDQUFMO0FBQ0FBLElBQUFBLEtBQUssQ0FBQyx5Q0FBRCxDQUFMO0FBQ0EsVUFBTWUsWUFBWSxHQUFHLElBQUliLElBQUksQ0FBQ2MsR0FBTCxDQUFTQyxRQUFiLENBQXNCZCxNQUFNLENBQUNRLFNBQVAsQ0FBaUJKLGVBQWpCLENBQWlDQSxlQUFqQyxDQUFpRFcsU0FBdkUsQ0FBckI7QUFDQTs7Ozs7Ozs7O0FBU0E7O0FBQ0FILElBQUFBLFlBQVksQ0FBQ0ksNkJBQWIsR0FBNkMsQ0FBN0M7QUFDQSxRQUFJQyxPQUFKLEVBQWFDLGtCQUFiO0FBQ0EsVUFBTUMsUUFBUSxHQUFHLE1BQU1wQixJQUFJLENBQUNjLEdBQUwsQ0FBU08sUUFBVCxDQUFrQkMsV0FBbEIsRUFBdkI7QUFDQSxVQUFNQyxRQUFRLEdBQUcsTUFBTVYsWUFBWSxDQUNoQ1csTUFEb0IsQ0FDYjtBQUNOQyxNQUFBQSxJQUFJLEVBQUUsT0FBT3hCLE1BQU0sQ0FBQ1EsU0FBUCxDQUFpQkosZUFBakIsQ0FBaUNBLGVBQWpDLENBQWlEcUIsR0FBakQsQ0FBcURDLFFBQXJELENBQThEQztBQURyRSxLQURhLEVBSXBCQyxJQUpvQixDQUtuQjtBQUNFQyxNQUFBQSxJQUFJLEVBQUVWLFFBQVEsQ0FBQ3JCLGdCQUFELENBRGhCO0FBRUVnQyxNQUFBQSxHQUFHLEVBQUU7QUFGUCxLQUxtQixDQVNuQjtBQVRtQixNQVdwQkMsRUFYb0IsQ0FZbkIsU0FabUIsRUFhbkIsVUFFVztBQUFBLFVBRFQ7QUFBRWQsUUFBQUEsT0FBTyxFQUFFZSxDQUFYO0FBQWNDLFFBQUFBO0FBQWQsT0FDUztBQUFBLFVBRHFCQyxJQUNyQjs7QUFDVHJDLE1BQUFBLEtBQUssQ0FBQztBQUFFcUMsUUFBQUE7QUFBRixPQUFELENBQUw7QUFDQWhCLE1BQUFBLGtCQUFrQixHQUFHZSxXQUFyQjtBQUNBaEIsTUFBQUEsT0FBTyxHQUFHZSxDQUFWO0FBQ0QsS0FuQmtCLENBQXZCO0FBc0JBLFdBQU9HLGVBQVNDLE1BQVQsQ0FDTDtBQUNFQyxNQUFBQSxPQUFPLEVBQUVmLFFBQVEsQ0FBQ2UsT0FEcEI7QUFFRUMsTUFBQUEsWUFBWSxFQUFFakMsZUFGaEI7QUFHRVksTUFBQUEsT0FIRjtBQUlFc0IsTUFBQUEsR0FBRyxFQUFFQyxJQUFJLENBQUNDLFNBQUwsQ0FBZXpDLE1BQU0sQ0FBQ1EsU0FBUCxDQUFpQkosZUFBakIsQ0FBaUNBLGVBQWpDLENBQWlEbUMsR0FBaEUsQ0FKUDtBQUtFYixNQUFBQSxRQUFRLEVBQUUxQixNQUFNLENBQUNRLFNBQVAsQ0FBaUJKLGVBQWpCLENBQWlDQSxlQUFqQyxDQUFpRHFCLEdBQWpELENBQXFEQyxRQUFyRCxDQUE4REM7QUFMMUUsS0FESyxDQUFQO0FBU0QsR0FqRUQsQ0FpRUUsT0FBT2UsQ0FBUCxFQUFVO0FBQ1Y3QyxJQUFBQSxLQUFLLENBQUMsU0FBRCxFQUFZNkMsQ0FBWixDQUFMO0FBQ0E3QyxJQUFBQSxLQUFLLENBQUMsZ0dBQUQsQ0FBTDtBQUNBLFVBQU0sSUFBSWMsb0JBQUosQ0FBZ0IrQixDQUFDLENBQUNDLE9BQWxCLEVBQTJCLEdBQTNCLENBQU47QUFDRDtBQUNGLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgX2RlYnVnIGZyb20gJ2RlYnVnJ1xuXG5pbXBvcnQgU3RhdHVzRXJyb3IgZnJvbSAnLi4vU3RhdHVzLUVycm9yJ1xuaW1wb3J0IHsgcmVnaXN0cnkgfSBmcm9tICcuLi9yZXBvJ1xuaW1wb3J0IGNvbXBpbGUgZnJvbSAnLi4vdXRpbC9jb21waWxlJ1xuXG5pbXBvcnQgYWJzdHJhY3RGYWN0b3J5IGZyb20gJy4uLy4uL2Fic3RyYWN0L0Fic3RyYWN0RmFjdG9yeS5zb2wnXG5pbXBvcnQgcHJvY2Vzc1JlZ2lzdHJ5IGZyb20gJy4uLy4uL2Fic3RyYWN0L1Byb2Nlc3NSZWdpc3RyeS5zb2wnIFxuXG5jb25zdCBkZWJ1ZyA9IF9kZWJ1ZygnY2F0ZXJwaWxsYXJxbDpyZWdpc3RyeScpXG5jb25zdCBleGVjdXRpb25BY2NvdW50ID0gMFxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyAoe1xuICB3ZWIzLFxufSk6IFByb21pc2U8b2JqZWN0PiA9PiB7XG4gIGRlYnVnKCdERVBMT1lJTkcgUFJPQ0VTUyBSVU5USU1FIFJFR0lTVFJZIC4uLicpO1xuICB0cnkge1xuICAgIGNvbnN0IG91dHB1dCA9IGNvbXBpbGUoe1xuICAgICAgQWJzdHJhY3RGYWN0b3J5OiB7XG4gICAgICAgIGNvbnRlbnQ6IGFic3RyYWN0RmFjdG9yeSxcbiAgICAgIH0sXG4gICAgICBQcm9jZXNzUmVnaXN0cnk6IHtcbiAgICAgICAgY29udGVudDogcHJvY2Vzc1JlZ2lzdHJ5LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGlmIChPYmplY3Qua2V5cyhvdXRwdXQuY29udHJhY3RzKS5sZW5ndGggPT09IDApIHtcbiAgICAgIGRlYnVnKCdDT01QSUxBVElPTiBFUlJPUiBJTiBTTUFSVCBDT05UUkFDVFMnKTtcbiAgICAgIGRlYnVnKG91dHB1dC5lcnJvcnMpO1xuICAgICAgZGVidWcoJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcbiAgICAgIHRocm93IG5ldyBTdGF0dXNFcnJvcignQ09NUElMQVRJT04gRVJST1IgSU4gUlVOVElNRSBSRUdJU1RSWSBTTUFSVCBDT05UUkFDVFMnLCA0MDApXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZGVidWcoJ1BST0NFU1MgUlVOVElNRSBSRUdJU1RSWSBDT01QSUxFRCBTVUNDRVNTRlVMTFknKTtcbiAgICBkZWJ1ZygnQ1JFQVRJTkcgUlVOVElNRSBSRUdJU1RSWSBJTlNUQU5DRSAuLi4gJyk7XG4gICAgY29uc3QgcHJvY0NvbnRyYWN0ID0gbmV3IHdlYjMuZXRoLkNvbnRyYWN0KG91dHB1dC5jb250cmFjdHMuUHJvY2Vzc1JlZ2lzdHJ5LlByb2Nlc3NSZWdpc3RyeS5pbnRlcmZhY2UpXG4gICAgLypcbiAgICBwcm9jQ29udHJhY3RcbiAgICAgIC5nZXRQYXN0RXZlbnRzKFxuICAgICAgICAnYWxsRXZlbnRzJyxcbiAgICAgICAge1xuICAgICAgICAgIGZyb21CbG9jazogJ2xhdGVzdCcsXG4gICAgICAgIH0sXG4gICAgICAgIGUgPT4gY29uc29sZS5sb2coJ3Bhc3QgZXZlbnQnLCBlKSxcbiAgICAgICkqL1xuICAgIC8vIGhvdyBtYW55IGJsb2NrcyB3ZSB3YWl0IGZvciBiZWZvcmUgcmVzdWx0XG4gICAgcHJvY0NvbnRyYWN0LnRyYW5zYWN0aW9uQ29uZmlybWF0aW9uQmxvY2tzID0gMTtcbiAgICBsZXQgZ2FzVXNlZCwgY3JlYXRlZEJsb2NrTnVtYmVyXG4gICAgY29uc3QgYWNjb3VudHMgPSBhd2FpdCB3ZWIzLmV0aC5wZXJzb25hbC5nZXRBY2NvdW50cygpXG4gICAgY29uc3QgY29udHJhY3QgPSBhd2FpdCBwcm9jQ29udHJhY3RcbiAgICAgIC5kZXBsb3koe1xuICAgICAgICBkYXRhOiBcIjB4XCIgKyBvdXRwdXQuY29udHJhY3RzLlByb2Nlc3NSZWdpc3RyeS5Qcm9jZXNzUmVnaXN0cnkuZXZtLmJ5dGVjb2RlLm9iamVjdCxcbiAgICAgIH0pXG4gICAgICAuc2VuZChcbiAgICAgICAge1xuICAgICAgICAgIGZyb206IGFjY291bnRzW2V4ZWN1dGlvbkFjY291bnRdLFxuICAgICAgICAgIGdhczogNDcwMDAwMCxcbiAgICAgICAgfSxcbiAgICAgICAgLy8gKGVycm9yLCB0eEhhc2gpID0+IGNvbnNvbGUubG9nKCdzIGZ1bmMnLCBlcnJvciwgdHhIYXNoKSxcbiAgICAgIClcbiAgICAgIC5vbihcbiAgICAgICAgJ3JlY2VpcHQnLFxuICAgICAgICAoXG4gICAgICAgICAgeyBnYXNVc2VkOiBnLCBibG9ja051bWJlciwgLi4ucmVzdCB9OiBhbnksXG4gICAgICAgICk6IHZvaWQgPT4ge1xuICAgICAgICAgIGRlYnVnKHsgcmVzdCB9KVxuICAgICAgICAgIGNyZWF0ZWRCbG9ja051bWJlciA9IGJsb2NrTnVtYmVyXG4gICAgICAgICAgZ2FzVXNlZCA9IGdcbiAgICAgICAgfSxcbiAgICAgIClcbiAgICAgIFxuICAgIHJldHVybiByZWdpc3RyeS5jcmVhdGUoXG4gICAgICB7XG4gICAgICAgIGFkZHJlc3M6IGNvbnRyYWN0LmFkZHJlc3MsXG4gICAgICAgIHNvbGlkaXR5Q29kZTogcHJvY2Vzc1JlZ2lzdHJ5LFxuICAgICAgICBnYXNVc2VkLFxuICAgICAgICBhYmk6IEpTT04uc3RyaW5naWZ5KG91dHB1dC5jb250cmFjdHMuUHJvY2Vzc1JlZ2lzdHJ5LlByb2Nlc3NSZWdpc3RyeS5hYmkpLFxuICAgICAgICBieXRlY29kZTogb3V0cHV0LmNvbnRyYWN0cy5Qcm9jZXNzUmVnaXN0cnkuUHJvY2Vzc1JlZ2lzdHJ5LmV2bS5ieXRlY29kZS5vYmplY3QsXG4gICAgICB9XG4gICAgKVxuICB9IGNhdGNoIChlKSB7XG4gICAgZGVidWcoXCJFcnJvcjogXCIsIGUpO1xuICAgIGRlYnVnKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XG4gICAgdGhyb3cgbmV3IFN0YXR1c0Vycm9yKGUubWVzc2FnZSwgNDAwKVxuICB9XG59Il19