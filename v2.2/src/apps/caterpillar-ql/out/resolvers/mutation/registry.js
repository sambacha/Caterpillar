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

/* babel-plugin-inline-import '../../abstract/AbstractFactory.sol' */
const abstractFactory = "pragma solidity ^0.5.6;\n\ncontract AbstractFactory {\n    address internal worklist = address(0);\n\n    function setWorklist(address _worklist) public {\n        worklist = _worklist;\n    }\n\n    function newInstance(address parent, address globalFactory) public returns(address);\n    function startInstanceExecution(address processAddress) public;\n}\n";

/* babel-plugin-inline-import '../../abstract/ProcessRegistry.sol' */
const processRegistry = "pragma solidity ^0.5.6;\n\ncontract IFunct {\n    // WorkList functions\n    function updateRuntimeRegistry(address _runtimeRegistry) public;\n    // Factory Functions\n    function setWorklist(address _worklist) public;\n    function startInstanceExecution(address processAddress) public;\n    function newInstance(address parent, address globalFactory) public returns(address);\n    function findParent() public view returns(address);\n}\n\ncontract ProcessRegistry {\n\n    mapping (bytes32 => mapping (uint => bytes32)) private parent2ChildrenBundleId;\n    mapping (bytes32 => address) private factories;\n    mapping (bytes32 => bytes32) private policy;\n    mapping (bytes32 => bytes32) private taskRole;\n\n    mapping (address => bytes32) private instance2Bundle;\n    mapping (address => address) private instance2PolicyOp;\n    address[] private instances;\n\n    mapping (address => bytes32) private worklist2Bundle;\n\n    event NewInstanceCreatedFor(address parent, address processAddress);\n\n    function registerFactory(bytes32 bundleId, address factory) external {\n        factories[bundleId] = factory;\n    }\n\n    function registerWorklist(bytes32 bundleId, address worklist) external {\n        address factory = factories[bundleId];\n        require(factory != address(0));\n        worklist2Bundle[worklist] = bundleId;\n        IFunct(factory).setWorklist(worklist);\n        IFunct(worklist).updateRuntimeRegistry(address(this));\n    }\n\n    function findRuntimePolicy(address pCase) public view returns(address) {\n        return instance2PolicyOp[pCase];\n    }\n\n    function relateProcessToPolicy(bytes32 bundleId, bytes32 _policy, bytes32 _taskRole) external {\n        taskRole[bundleId] = _taskRole;\n        policy[bundleId] = _policy;\n    }\n\n\n    function addChildBundleId(bytes32 parentBundleId, bytes32 processBundleId, uint nodeIndex) external {\n        parent2ChildrenBundleId[parentBundleId][nodeIndex] = processBundleId;\n    }\n\n    function newInstanceFor(uint nodeIndex, address parent) public returns(address) {\n        return newBundleInstanceFor(parent2ChildrenBundleId[instance2Bundle[parent]][nodeIndex], parent, instance2PolicyOp[parent]);\n    }\n\n    function newBundleInstanceFor(bytes32 bundleId, address parent, address policyOpAddr) public returns(address) {\n        address factory = factories[bundleId];\n        require(factory != address(0));\n        address processAddress = IFunct(factory).newInstance(parent, address(this));\n        instance2Bundle[processAddress] = bundleId;\n        instance2PolicyOp[processAddress] = policyOpAddr;\n        instances.push(processAddress);\n        IFunct(factory).startInstanceExecution(processAddress);\n        emit NewInstanceCreatedFor(parent, processAddress);\n        return processAddress;\n    }\n\n    function allInstances() external view returns(address[] memory) {\n        return instances;\n    }\n    \n    function bindingPolicyFor(address procInstance) external view returns(bytes32) {\n        bytes32 pId = instance2Bundle[procInstance];\n        address pAddr = procInstance;\n        while(policy[pId].length != 0) {\n            pAddr = IFunct(pAddr).findParent();\n            if(pAddr == address(0))\n                break;\n            pId = instance2Bundle[pAddr];\n        }\n        return policy[pId];\n    }\n\n    function taskRoleMapFor(address procInstance) external view returns(bytes32) {\n        bytes32 pId = instance2Bundle[procInstance];\n        address pAddr = procInstance;\n        while(taskRole[pId].length != 0) {\n            pAddr = IFunct(pAddr).findParent();\n            if(pAddr == address(0))\n                break;\n            pId = instance2Bundle[pAddr];\n        }\n        return taskRole[pId];\n    }\n\n    function bindingPolicyFromId(bytes32 procId) external view returns(bytes32) {\n        return policy[procId];\n    }\n\n    function taskRoleMapFromId(bytes32 procId) external view returns(bytes32) {\n        return taskRole[procId];\n    }\n\n    function bundleFor(address processInstance) external view returns(bytes32) {\n        return instance2Bundle[processInstance];\n    }\n\n    function childrenFor(bytes32 parent, uint nodeInd) external view returns(bytes32) {\n        return parent2ChildrenBundleId[parent][nodeInd];\n    }\n\n    function worklistBundleFor(address worklist) external view returns(bytes32) {\n        return worklist2Bundle[worklist];\n    }\n}";
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
    const procContract = new web3.eth.Contract(output.contracts.ProcessRegistry.ProcessRegistry.interface); // how many blocks we wait for before result

    procContract.transactionConfirmationBlocks = 1;
    let gasUsed;
    debug(output.contracts.ProcessRegistry.ProcessRegistry);
    const accounts = await web3.eth.personal.getAccounts();
    const contract = await procContract.deploy({
      data: "0x" + output.contracts.ProcessRegistry.ProcessRegistry.evm.bytecode.object
    }).send({
      from: accounts[executionAccount],
      gas: 4700000
    } // (error, txHash) => console.log('s func', error, txHash),
    ).on('receipt', ({
      gasUsed: g
    }) => {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvbXV0YXRpb24vcmVnaXN0cnkudHMiXSwibmFtZXMiOlsiZGVidWciLCJleGVjdXRpb25BY2NvdW50Iiwid2ViMyIsIm91dHB1dCIsIkFic3RyYWN0RmFjdG9yeSIsImNvbnRlbnQiLCJhYnN0cmFjdEZhY3RvcnkiLCJQcm9jZXNzUmVnaXN0cnkiLCJwcm9jZXNzUmVnaXN0cnkiLCJPYmplY3QiLCJrZXlzIiwiY29udHJhY3RzIiwibGVuZ3RoIiwiZXJyb3JzIiwiU3RhdHVzRXJyb3IiLCJwcm9jQ29udHJhY3QiLCJldGgiLCJDb250cmFjdCIsImludGVyZmFjZSIsInRyYW5zYWN0aW9uQ29uZmlybWF0aW9uQmxvY2tzIiwiZ2FzVXNlZCIsImFjY291bnRzIiwicGVyc29uYWwiLCJnZXRBY2NvdW50cyIsImNvbnRyYWN0IiwiZGVwbG95IiwiZGF0YSIsImV2bSIsImJ5dGVjb2RlIiwib2JqZWN0Iiwic2VuZCIsImZyb20iLCJnYXMiLCJvbiIsImciLCJyZWdpc3RyeSIsImNyZWF0ZSIsImFkZHJlc3MiLCJzb2xpZGl0eUNvZGUiLCJhYmkiLCJKU09OIiwic3RyaW5naWZ5IiwiZSIsIm1lc3NhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFFQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7O0FBS0EsTUFBTUEsS0FBSyxHQUFHLHFCQUFPLHdCQUFQLENBQWQ7QUFDQSxNQUFNQyxnQkFBZ0IsR0FBRyxDQUF6Qjs7ZUFFZSxPQUFPO0FBQ3BCQyxFQUFBQTtBQURvQixDQUFQLEtBRVE7QUFDckJGLEVBQUFBLEtBQUssQ0FBQyx3Q0FBRCxDQUFMOztBQUNBLE1BQUk7QUFDRixVQUFNRyxNQUFNLEdBQUcsc0JBQVE7QUFDckJDLE1BQUFBLGVBQWUsRUFBRTtBQUNmQyxRQUFBQSxPQUFPLEVBQUVDO0FBRE0sT0FESTtBQUlyQkMsTUFBQUEsZUFBZSxFQUFFO0FBQ2ZGLFFBQUFBLE9BQU8sRUFBRUc7QUFETTtBQUpJLEtBQVIsQ0FBZjs7QUFTQSxRQUFJQyxNQUFNLENBQUNDLElBQVAsQ0FBWVAsTUFBTSxDQUFDUSxTQUFuQixFQUE4QkMsTUFBOUIsS0FBeUMsQ0FBN0MsRUFBZ0Q7QUFDOUNaLE1BQUFBLEtBQUssQ0FBQyxzQ0FBRCxDQUFMO0FBQ0FBLE1BQUFBLEtBQUssQ0FBQ0csTUFBTSxDQUFDVSxNQUFSLENBQUw7QUFDQWIsTUFBQUEsS0FBSyxDQUFDLGdHQUFELENBQUw7QUFDQSxZQUFNLElBQUljLG9CQUFKLENBQWdCLHVEQUFoQixFQUF5RSxHQUF6RSxDQUFOO0FBQ0E7QUFDRDs7QUFFRGQsSUFBQUEsS0FBSyxDQUFDLGdEQUFELENBQUw7QUFDQUEsSUFBQUEsS0FBSyxDQUFDLHlDQUFELENBQUw7QUFDQSxVQUFNZSxZQUFZLEdBQUcsSUFBSWIsSUFBSSxDQUFDYyxHQUFMLENBQVNDLFFBQWIsQ0FBc0JkLE1BQU0sQ0FBQ1EsU0FBUCxDQUFpQkosZUFBakIsQ0FBaUNBLGVBQWpDLENBQWlEVyxTQUF2RSxDQUFyQixDQXBCRSxDQXFCRjs7QUFDQUgsSUFBQUEsWUFBWSxDQUFDSSw2QkFBYixHQUE2QyxDQUE3QztBQUNBLFFBQUlDLE9BQUo7QUFDQXBCLElBQUFBLEtBQUssQ0FBQ0csTUFBTSxDQUFDUSxTQUFQLENBQWlCSixlQUFqQixDQUFpQ0EsZUFBbEMsQ0FBTDtBQUNBLFVBQU1jLFFBQVEsR0FBRyxNQUFNbkIsSUFBSSxDQUFDYyxHQUFMLENBQVNNLFFBQVQsQ0FBa0JDLFdBQWxCLEVBQXZCO0FBQ0EsVUFBTUMsUUFBUSxHQUFHLE1BQU1ULFlBQVksQ0FDaENVLE1BRG9CLENBQ2I7QUFDTkMsTUFBQUEsSUFBSSxFQUFFLE9BQU92QixNQUFNLENBQUNRLFNBQVAsQ0FBaUJKLGVBQWpCLENBQWlDQSxlQUFqQyxDQUFpRG9CLEdBQWpELENBQXFEQyxRQUFyRCxDQUE4REM7QUFEckUsS0FEYSxFQUlwQkMsSUFKb0IsQ0FLbkI7QUFDRUMsTUFBQUEsSUFBSSxFQUFFVixRQUFRLENBQUNwQixnQkFBRCxDQURoQjtBQUVFK0IsTUFBQUEsR0FBRyxFQUFFO0FBRlAsS0FMbUIsQ0FTbkI7QUFUbUIsTUFXcEJDLEVBWG9CLENBWW5CLFNBWm1CLEVBYW5CLENBQ0U7QUFBRWIsTUFBQUEsT0FBTyxFQUFFYztBQUFYLEtBREYsS0FFVztBQUNUZCxNQUFBQSxPQUFPLEdBQUdjLENBQVY7QUFDRCxLQWpCa0IsQ0FBdkI7QUFtQkEsV0FBT0MsZUFBU0MsTUFBVCxDQUNMO0FBQ0VDLE1BQUFBLE9BQU8sRUFBRWIsUUFBUSxDQUFDYSxPQURwQjtBQUVFQyxNQUFBQSxZQUFZLEVBQUU5QixlQUZoQjtBQUdFWSxNQUFBQSxPQUhGO0FBSUVtQixNQUFBQSxHQUFHLEVBQUVDLElBQUksQ0FBQ0MsU0FBTCxDQUFldEMsTUFBTSxDQUFDUSxTQUFQLENBQWlCSixlQUFqQixDQUFpQ0EsZUFBakMsQ0FBaURnQyxHQUFoRSxDQUpQO0FBS0VYLE1BQUFBLFFBQVEsRUFBRXpCLE1BQU0sQ0FBQ1EsU0FBUCxDQUFpQkosZUFBakIsQ0FBaUNBLGVBQWpDLENBQWlEb0IsR0FBakQsQ0FBcURDLFFBQXJELENBQThEQztBQUwxRSxLQURLLENBQVA7QUFTRCxHQXRERCxDQXNERSxPQUFPYSxDQUFQLEVBQVU7QUFDVjFDLElBQUFBLEtBQUssQ0FBQyxTQUFELEVBQVkwQyxDQUFaLENBQUw7QUFDQTFDLElBQUFBLEtBQUssQ0FBQyxnR0FBRCxDQUFMO0FBQ0EsVUFBTSxJQUFJYyxvQkFBSixDQUFnQjRCLENBQUMsQ0FBQ0MsT0FBbEIsRUFBMkIsR0FBM0IsQ0FBTjtBQUNEO0FBQ0YsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfZGVidWcgZnJvbSAnZGVidWcnXG5cbmltcG9ydCBTdGF0dXNFcnJvciBmcm9tICcuLi9TdGF0dXMtRXJyb3InXG5pbXBvcnQgeyByZWdpc3RyeSB9IGZyb20gJy4uL3JlcG8nXG5pbXBvcnQgY29tcGlsZSBmcm9tICcuLi91dGlsL2NvbXBpbGUnXG5cbmltcG9ydCBhYnN0cmFjdEZhY3RvcnkgZnJvbSAnLi4vLi4vYWJzdHJhY3QvQWJzdHJhY3RGYWN0b3J5LnNvbCdcbmltcG9ydCBwcm9jZXNzUmVnaXN0cnkgZnJvbSAnLi4vLi4vYWJzdHJhY3QvUHJvY2Vzc1JlZ2lzdHJ5LnNvbCcgXG5cbmNvbnN0IGRlYnVnID0gX2RlYnVnKCdjYXRlcnBpbGxhcnFsOnJlZ2lzdHJ5JylcbmNvbnN0IGV4ZWN1dGlvbkFjY291bnQgPSAwXG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jICh7XG4gIHdlYjMsXG59KTogUHJvbWlzZTxvYmplY3Q+ID0+IHtcbiAgZGVidWcoJ0RFUExPWUlORyBQUk9DRVNTIFJVTlRJTUUgUkVHSVNUUlkgLi4uJyk7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3V0cHV0ID0gY29tcGlsZSh7XG4gICAgICBBYnN0cmFjdEZhY3Rvcnk6IHtcbiAgICAgICAgY29udGVudDogYWJzdHJhY3RGYWN0b3J5LFxuICAgICAgfSxcbiAgICAgIFByb2Nlc3NSZWdpc3RyeToge1xuICAgICAgICBjb250ZW50OiBwcm9jZXNzUmVnaXN0cnksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgaWYgKE9iamVjdC5rZXlzKG91dHB1dC5jb250cmFjdHMpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgZGVidWcoJ0NPTVBJTEFUSU9OIEVSUk9SIElOIFNNQVJUIENPTlRSQUNUUycpO1xuICAgICAgZGVidWcob3V0cHV0LmVycm9ycyk7XG4gICAgICBkZWJ1ZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xuICAgICAgdGhyb3cgbmV3IFN0YXR1c0Vycm9yKCdDT01QSUxBVElPTiBFUlJPUiBJTiBSVU5USU1FIFJFR0lTVFJZIFNNQVJUIENPTlRSQUNUUycsIDQwMClcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBkZWJ1ZygnUFJPQ0VTUyBSVU5USU1FIFJFR0lTVFJZIENPTVBJTEVEIFNVQ0NFU1NGVUxMWScpO1xuICAgIGRlYnVnKCdDUkVBVElORyBSVU5USU1FIFJFR0lTVFJZIElOU1RBTkNFIC4uLiAnKTtcbiAgICBjb25zdCBwcm9jQ29udHJhY3QgPSBuZXcgd2ViMy5ldGguQ29udHJhY3Qob3V0cHV0LmNvbnRyYWN0cy5Qcm9jZXNzUmVnaXN0cnkuUHJvY2Vzc1JlZ2lzdHJ5LmludGVyZmFjZSlcbiAgICAvLyBob3cgbWFueSBibG9ja3Mgd2Ugd2FpdCBmb3IgYmVmb3JlIHJlc3VsdFxuICAgIHByb2NDb250cmFjdC50cmFuc2FjdGlvbkNvbmZpcm1hdGlvbkJsb2NrcyA9IDE7XG4gICAgbGV0IGdhc1VzZWRcbiAgICBkZWJ1ZyhvdXRwdXQuY29udHJhY3RzLlByb2Nlc3NSZWdpc3RyeS5Qcm9jZXNzUmVnaXN0cnkpXG4gICAgY29uc3QgYWNjb3VudHMgPSBhd2FpdCB3ZWIzLmV0aC5wZXJzb25hbC5nZXRBY2NvdW50cygpXG4gICAgY29uc3QgY29udHJhY3QgPSBhd2FpdCBwcm9jQ29udHJhY3RcbiAgICAgIC5kZXBsb3koe1xuICAgICAgICBkYXRhOiBcIjB4XCIgKyBvdXRwdXQuY29udHJhY3RzLlByb2Nlc3NSZWdpc3RyeS5Qcm9jZXNzUmVnaXN0cnkuZXZtLmJ5dGVjb2RlLm9iamVjdCxcbiAgICAgIH0pXG4gICAgICAuc2VuZChcbiAgICAgICAge1xuICAgICAgICAgIGZyb206IGFjY291bnRzW2V4ZWN1dGlvbkFjY291bnRdLFxuICAgICAgICAgIGdhczogNDcwMDAwMCxcbiAgICAgICAgfSxcbiAgICAgICAgLy8gKGVycm9yLCB0eEhhc2gpID0+IGNvbnNvbGUubG9nKCdzIGZ1bmMnLCBlcnJvciwgdHhIYXNoKSxcbiAgICAgIClcbiAgICAgIC5vbihcbiAgICAgICAgJ3JlY2VpcHQnLFxuICAgICAgICAoXG4gICAgICAgICAgeyBnYXNVc2VkOiBnIH06IGFueSxcbiAgICAgICAgKTogdm9pZCA9PiB7XG4gICAgICAgICAgZ2FzVXNlZCA9IGdcbiAgICAgICAgfSxcbiAgICAgIClcbiAgICByZXR1cm4gcmVnaXN0cnkuY3JlYXRlKFxuICAgICAge1xuICAgICAgICBhZGRyZXNzOiBjb250cmFjdC5hZGRyZXNzLFxuICAgICAgICBzb2xpZGl0eUNvZGU6IHByb2Nlc3NSZWdpc3RyeSxcbiAgICAgICAgZ2FzVXNlZCxcbiAgICAgICAgYWJpOiBKU09OLnN0cmluZ2lmeShvdXRwdXQuY29udHJhY3RzLlByb2Nlc3NSZWdpc3RyeS5Qcm9jZXNzUmVnaXN0cnkuYWJpKSxcbiAgICAgICAgYnl0ZWNvZGU6IG91dHB1dC5jb250cmFjdHMuUHJvY2Vzc1JlZ2lzdHJ5LlByb2Nlc3NSZWdpc3RyeS5ldm0uYnl0ZWNvZGUub2JqZWN0LFxuICAgICAgfVxuICAgIClcbiAgfSBjYXRjaCAoZSkge1xuICAgIGRlYnVnKFwiRXJyb3I6IFwiLCBlKTtcbiAgICBkZWJ1ZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xuICAgIHRocm93IG5ldyBTdGF0dXNFcnJvcihlLm1lc3NhZ2UsIDQwMClcbiAgfVxufSJdfQ==