"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _debug2 = _interopRequireDefault(require("debug"));

var _registryContract = _interopRequireDefault(require("../../util/registry-contract"));

var _parseModel = _interopRequireDefault(require("./parse-model"));

var _sources = _interopRequireDefault(require("./sources"));

var _compile = _interopRequireDefault(require("../../util/compile"));

var _registerModel = _interopRequireDefault(require("./deployment/register-model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const debug = (0, _debug2.default)('caterpillarql:model');

var _default = async ({
  bpmn,
  registry,
  web3
}) => {
  const contract = await (0, _registryContract.default)({
    address: registry,
    web3
  }); // nasty!!!

  const model = {
    bpmn
  };
  await (0, _parseModel.default)(model);
  const output = (0, _compile.default)(_objectSpread({}, _sources.default, {
    [model.id]: {
      content: model.solidity
    }
  }));

  if (!output.contracts || Object.keys(output.contracts).length === 0) {
    debug('COMPILATION ERROR IN SMART CONTRACTS');
    debug(output.errors);
    throw new Error('COMPILATION ERROR IN SMART CONTRACTS');
  } // this does nothing

  /*Object.keys(output.contracts).forEach(key => {
    let bytecode = '0x' + output.contracts[key].bytecode;
    var gasEstimate = web3.eth.estimateGas({data: bytecode});
    // console.log(".............................................");
    // console.log("Contract Name: " + key.split(':')[1]);
    // console.log("Gas Estimation: " + gasEstimate);
  });*/


  return (0, _registerModel.default)(web3, contract, model, output.contracts);
};

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvbXV0YXRpb24vbW9kZWwvaW5kZXgudHMiXSwibmFtZXMiOlsiZGVidWciLCJicG1uIiwicmVnaXN0cnkiLCJ3ZWIzIiwiY29udHJhY3QiLCJhZGRyZXNzIiwibW9kZWwiLCJvdXRwdXQiLCJzb3VyY2VzIiwiaWQiLCJjb250ZW50Iiwic29saWRpdHkiLCJjb250cmFjdHMiLCJPYmplY3QiLCJrZXlzIiwibGVuZ3RoIiwiZXJyb3JzIiwiRXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7QUFFQSxNQUFNQSxLQUFLLEdBQUcscUJBQU8scUJBQVAsQ0FBZDs7ZUFFZSxPQUFPO0FBQ3BCQyxFQUFBQSxJQURvQjtBQUVwQkMsRUFBQUEsUUFGb0I7QUFHcEJDLEVBQUFBO0FBSG9CLENBQVAsS0FJUTtBQUNyQixRQUFNQyxRQUFRLEdBQUcsTUFBTSwrQkFBaUI7QUFDdENDLElBQUFBLE9BQU8sRUFBRUgsUUFENkI7QUFFdENDLElBQUFBO0FBRnNDLEdBQWpCLENBQXZCLENBRHFCLENBTXJCOztBQUNBLFFBQU1HLEtBQUssR0FBRztBQUNaTCxJQUFBQTtBQURZLEdBQWQ7QUFHQSxRQUFNLHlCQUFXSyxLQUFYLENBQU47QUFDQSxRQUFNQyxNQUFNLEdBQUcsd0NBQ1ZDLGdCQURVO0FBRWIsS0FBQ0YsS0FBSyxDQUFDRyxFQUFQLEdBQVk7QUFDVkMsTUFBQUEsT0FBTyxFQUFFSixLQUFLLENBQUNLO0FBREw7QUFGQyxLQUFmOztBQU1BLE1BQUksQ0FBQ0osTUFBTSxDQUFDSyxTQUFSLElBQXFCQyxNQUFNLENBQUNDLElBQVAsQ0FBWVAsTUFBTSxDQUFDSyxTQUFuQixFQUE4QkcsTUFBOUIsS0FBeUMsQ0FBbEUsRUFBcUU7QUFDbkVmLElBQUFBLEtBQUssQ0FBQyxzQ0FBRCxDQUFMO0FBQ0FBLElBQUFBLEtBQUssQ0FBQ08sTUFBTSxDQUFDUyxNQUFSLENBQUw7QUFDQSxVQUFNLElBQUlDLEtBQUosQ0FBVSxzQ0FBVixDQUFOO0FBQ0QsR0FyQm9CLENBc0JyQjs7QUFDQTs7Ozs7Ozs7O0FBT0EsU0FBTyw0QkFDTGQsSUFESyxFQUVMQyxRQUZLLEVBR0xFLEtBSEssRUFJTEMsTUFBTSxDQUFDSyxTQUpGLENBQVA7QUFNRCxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF9kZWJ1ZyBmcm9tICdkZWJ1ZydcblxuaW1wb3J0IHJlZ2lzdHJ5Q29udHJhY3QgZnJvbSAnLi4vLi4vdXRpbC9yZWdpc3RyeS1jb250cmFjdCdcbmltcG9ydCBwYXJzZU1vZGVsIGZyb20gJy4vcGFyc2UtbW9kZWwnXG5pbXBvcnQgc291cmNlcyBmcm9tICcuL3NvdXJjZXMnXG5pbXBvcnQgY29tcGlsZSBmcm9tICcuLi8uLi91dGlsL2NvbXBpbGUnXG5pbXBvcnQgcmVnaXN0ZXJNb2RlbCBmcm9tICcuL2RlcGxveW1lbnQvcmVnaXN0ZXItbW9kZWwnXG5cbmNvbnN0IGRlYnVnID0gX2RlYnVnKCdjYXRlcnBpbGxhcnFsOm1vZGVsJylcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgKHtcbiAgYnBtbixcbiAgcmVnaXN0cnksXG4gIHdlYjMsXG59KTogUHJvbWlzZTxvYmplY3Q+ID0+IHtcbiAgY29uc3QgY29udHJhY3QgPSBhd2FpdCByZWdpc3RyeUNvbnRyYWN0KHtcbiAgICBhZGRyZXNzOiByZWdpc3RyeSxcbiAgICB3ZWIzLFxuICB9KVxuXG4gIC8vIG5hc3R5ISEhXG4gIGNvbnN0IG1vZGVsID0ge1xuICAgIGJwbW4sXG4gIH1cbiAgYXdhaXQgcGFyc2VNb2RlbChtb2RlbClcbiAgY29uc3Qgb3V0cHV0ID0gY29tcGlsZSh7XG4gICAgLi4uc291cmNlcyxcbiAgICBbbW9kZWwuaWRdOiB7XG4gICAgICBjb250ZW50OiBtb2RlbC5zb2xpZGl0eSxcbiAgICB9XG4gIH0pXG4gIGlmICghb3V0cHV0LmNvbnRyYWN0cyB8fCBPYmplY3Qua2V5cyhvdXRwdXQuY29udHJhY3RzKS5sZW5ndGggPT09IDApIHtcbiAgICBkZWJ1ZygnQ09NUElMQVRJT04gRVJST1IgSU4gU01BUlQgQ09OVFJBQ1RTJyk7XG4gICAgZGVidWcob3V0cHV0LmVycm9ycyk7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDT01QSUxBVElPTiBFUlJPUiBJTiBTTUFSVCBDT05UUkFDVFMnKVxuICB9XG4gIC8vIHRoaXMgZG9lcyBub3RoaW5nXG4gIC8qT2JqZWN0LmtleXMob3V0cHV0LmNvbnRyYWN0cykuZm9yRWFjaChrZXkgPT4ge1xuICAgIGxldCBieXRlY29kZSA9ICcweCcgKyBvdXRwdXQuY29udHJhY3RzW2tleV0uYnl0ZWNvZGU7XG4gICAgdmFyIGdhc0VzdGltYXRlID0gd2ViMy5ldGguZXN0aW1hdGVHYXMoe2RhdGE6IGJ5dGVjb2RlfSk7XG4gICAgLy8gY29uc29sZS5sb2coXCIuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cIik7XG4gICAgLy8gY29uc29sZS5sb2coXCJDb250cmFjdCBOYW1lOiBcIiArIGtleS5zcGxpdCgnOicpWzFdKTtcbiAgICAvLyBjb25zb2xlLmxvZyhcIkdhcyBFc3RpbWF0aW9uOiBcIiArIGdhc0VzdGltYXRlKTtcbiAgfSk7Ki9cbiAgcmV0dXJuIHJlZ2lzdGVyTW9kZWwoXG4gICAgd2ViMyxcbiAgICBjb250cmFjdCxcbiAgICBtb2RlbCxcbiAgICBvdXRwdXQuY29udHJhY3RzLFxuICApO1xufSJdfQ==