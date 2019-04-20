"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _repo = require("../repo");

var _registryContract = _interopRequireDefault(require("../util/registry-contract"));

var _instanceState = _interopRequireDefault(require("../process-contract/instance-state"));

var _debug = _interopRequireDefault(require("debug"));

var _hexToId = _interopRequireDefault(require("../util/hex-to-id"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = async ({
  web3,
  registry: address
}) => {
  const contract = await (0, _registryContract.default)({
    address,
    web3
  });

  if (contract) {
    const instances = await contract.methods.allInstances.call();

    if (instances) {
      (0, _debug.default)('caterpillarql:processes')({
        instances
      });
      const instanceStates = await Promise.all(instances.map(address => (0, _instanceState.default)({
        web3,
        registryContract: contract
      })(address)));
      (0, _debug.default)('caterpillarql:processes')({
        instanceStates
      });
      const bundleFors = await Promise.all(instances.map(instance => contract.methods.bundleFor(instance).call().then(bundleFor => ({
        instance,
        bundleFor: (0, _hexToId.default)(web3)(bundleFor)
      }))));
      return Promise.all(bundleFors.map(({
        bundleFor,
        instance
      }) => _repo.process.find({
        _id: bundleFor
      }).then(([{
        bpmnModel,
        rootProcessName: name
      }]) => ({
        address: instance,
        id: bundleFor,
        bpmnModel,
        registryContract: contract,
        name
      }))));
    }
  }
};

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvcmVnaXN0cnkvcHJvY2Vzc2VzLnRzIl0sIm5hbWVzIjpbIndlYjMiLCJyZWdpc3RyeSIsImFkZHJlc3MiLCJjb250cmFjdCIsImluc3RhbmNlcyIsIm1ldGhvZHMiLCJhbGxJbnN0YW5jZXMiLCJjYWxsIiwiaW5zdGFuY2VTdGF0ZXMiLCJQcm9taXNlIiwiYWxsIiwibWFwIiwicmVnaXN0cnlDb250cmFjdCIsImJ1bmRsZUZvcnMiLCJpbnN0YW5jZSIsImJ1bmRsZUZvciIsInRoZW4iLCJwcm9jZXNzIiwiZmluZCIsIl9pZCIsImJwbW5Nb2RlbCIsInJvb3RQcm9jZXNzTmFtZSIsIm5hbWUiLCJpZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7O2VBRWUsT0FBTztBQUNwQkEsRUFBQUEsSUFEb0I7QUFFcEJDLEVBQUFBLFFBQVEsRUFBRUM7QUFGVSxDQUFQLEtBR087QUFDcEIsUUFBTUMsUUFBUSxHQUFHLE1BQU0sK0JBQWlCO0FBQ3RDRCxJQUFBQSxPQURzQztBQUV0Q0YsSUFBQUE7QUFGc0MsR0FBakIsQ0FBdkI7O0FBSUEsTUFBSUcsUUFBSixFQUFjO0FBQ1osVUFBTUMsU0FBUyxHQUFHLE1BQU1ELFFBQVEsQ0FBQ0UsT0FBVCxDQUFpQkMsWUFBakIsQ0FBOEJDLElBQTlCLEVBQXhCOztBQUNBLFFBQUlILFNBQUosRUFBZTtBQUNiLDBCQUFNLHlCQUFOLEVBQWlDO0FBQUVBLFFBQUFBO0FBQUYsT0FBakM7QUFDQSxZQUFNSSxjQUFjLEdBQUcsTUFBTUMsT0FBTyxDQUFDQyxHQUFSLENBQzNCTixTQUFTLENBQ05PLEdBREgsQ0FFSVQsT0FBTyxJQUFJLDRCQUFjO0FBQ3ZCRixRQUFBQSxJQUR1QjtBQUV2QlksUUFBQUEsZ0JBQWdCLEVBQUVUO0FBRkssT0FBZCxFQUdSRCxPQUhRLENBRmYsQ0FEMkIsQ0FBN0I7QUFTQSwwQkFBTSx5QkFBTixFQUFpQztBQUFFTSxRQUFBQTtBQUFGLE9BQWpDO0FBQ0EsWUFBTUssVUFBVSxHQUFHLE1BQU1KLE9BQU8sQ0FBQ0MsR0FBUixDQUN2Qk4sU0FBUyxDQUNOTyxHQURILENBRUtHLFFBQUQsSUFDRVgsUUFBUSxDQUFDRSxPQUFULENBQWlCVSxTQUFqQixDQUEyQkQsUUFBM0IsRUFBcUNQLElBQXJDLEdBQ0dTLElBREgsQ0FFS0QsU0FBRCxLQUF3QjtBQUN0QkQsUUFBQUEsUUFEc0I7QUFFdEJDLFFBQUFBLFNBQVMsRUFBRSxzQkFBUWYsSUFBUixFQUFjZSxTQUFkO0FBRlcsT0FBeEIsQ0FGSixDQUhOLENBRHVCLENBQXpCO0FBYUEsYUFBT04sT0FBTyxDQUFDQyxHQUFSLENBQ0xHLFVBQVUsQ0FDUEYsR0FESCxDQUVJLENBQUM7QUFDQ0ksUUFBQUEsU0FERDtBQUVDRCxRQUFBQTtBQUZELE9BQUQsS0FHdUJHLGNBQ3BCQyxJQURvQixDQUNmO0FBQUVDLFFBQUFBLEdBQUcsRUFBRUo7QUFBUCxPQURlLEVBRXBCQyxJQUZvQixDQUduQixDQUFDLENBQUM7QUFDQUksUUFBQUEsU0FEQTtBQUVBQyxRQUFBQSxlQUFlLEVBQUVDO0FBRmpCLE9BQUQsQ0FBRCxNQUdnQjtBQUNkcEIsUUFBQUEsT0FBTyxFQUFFWSxRQURLO0FBRWRTLFFBQUFBLEVBQUUsRUFBRVIsU0FGVTtBQUdkSyxRQUFBQSxTQUhjO0FBSWRSLFFBQUFBLGdCQUFnQixFQUFFVCxRQUpKO0FBS2RtQixRQUFBQTtBQUxjLE9BSGhCLENBSG1CLENBTDNCLENBREssQ0FBUDtBQXNCRDtBQUNGO0FBQ0YsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHByb2Nlc3MgfSBmcm9tICcuLi9yZXBvJ1xuaW1wb3J0IHJlZ2lzdHJ5Q29udHJhY3QgZnJvbSAnLi4vdXRpbC9yZWdpc3RyeS1jb250cmFjdCdcbmltcG9ydCBpbnN0YW5jZVN0YXRlIGZyb20gJy4uL3Byb2Nlc3MtY29udHJhY3QvaW5zdGFuY2Utc3RhdGUnXG5pbXBvcnQgZGVidWcgZnJvbSAnZGVidWcnXG5pbXBvcnQgaGV4VG9JZCBmcm9tICcuLi91dGlsL2hleC10by1pZCdcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgKHtcbiAgd2ViMyxcbiAgcmVnaXN0cnk6IGFkZHJlc3MsXG59KTogUHJvbWlzZTxhbnlbXT4gPT4ge1xuICBjb25zdCBjb250cmFjdCA9IGF3YWl0IHJlZ2lzdHJ5Q29udHJhY3Qoe1xuICAgIGFkZHJlc3MsXG4gICAgd2ViMyxcbiAgfSlcbiAgaWYgKGNvbnRyYWN0KSB7XG4gICAgY29uc3QgaW5zdGFuY2VzID0gYXdhaXQgY29udHJhY3QubWV0aG9kcy5hbGxJbnN0YW5jZXMuY2FsbCgpXG4gICAgaWYgKGluc3RhbmNlcykge1xuICAgICAgZGVidWcoJ2NhdGVycGlsbGFycWw6cHJvY2Vzc2VzJykoeyBpbnN0YW5jZXMgfSlcbiAgICAgIGNvbnN0IGluc3RhbmNlU3RhdGVzID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICAgIGluc3RhbmNlc1xuICAgICAgICAgIC5tYXAoXG4gICAgICAgICAgICBhZGRyZXNzID0+IGluc3RhbmNlU3RhdGUoe1xuICAgICAgICAgICAgICB3ZWIzLFxuICAgICAgICAgICAgICByZWdpc3RyeUNvbnRyYWN0OiBjb250cmFjdCxcbiAgICAgICAgICAgIH0pKGFkZHJlc3MpXG4gICAgICAgICAgKVxuICAgICAgKVxuICAgICAgZGVidWcoJ2NhdGVycGlsbGFycWw6cHJvY2Vzc2VzJykoeyBpbnN0YW5jZVN0YXRlcyB9KVxuICAgICAgY29uc3QgYnVuZGxlRm9ycyA9IGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICBpbnN0YW5jZXNcbiAgICAgICAgICAubWFwKFxuICAgICAgICAgICAgKGluc3RhbmNlKTogUHJvbWlzZTxvYmplY3Q+ID0+XG4gICAgICAgICAgICAgIGNvbnRyYWN0Lm1ldGhvZHMuYnVuZGxlRm9yKGluc3RhbmNlKS5jYWxsKClcbiAgICAgICAgICAgICAgICAudGhlbihcbiAgICAgICAgICAgICAgICAgIChidW5kbGVGb3IpOiBvYmplY3QgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2UsXG4gICAgICAgICAgICAgICAgICAgIGJ1bmRsZUZvcjogaGV4VG9JZCh3ZWIzKShidW5kbGVGb3IpLFxuICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICApXG4gICAgICApXG4gICAgICByZXR1cm4gUHJvbWlzZS5hbGwoXG4gICAgICAgIGJ1bmRsZUZvcnNcbiAgICAgICAgICAubWFwKFxuICAgICAgICAgICAgKHtcbiAgICAgICAgICAgICAgYnVuZGxlRm9yLFxuICAgICAgICAgICAgICBpbnN0YW5jZSxcbiAgICAgICAgICAgIH0pOiBQcm9taXNlPG9iamVjdD4gPT4gcHJvY2Vzc1xuICAgICAgICAgICAgICAuZmluZCh7IF9pZDogYnVuZGxlRm9yfSlcbiAgICAgICAgICAgICAgLnRoZW4oXG4gICAgICAgICAgICAgICAgKFt7XG4gICAgICAgICAgICAgICAgICBicG1uTW9kZWwsXG4gICAgICAgICAgICAgICAgICByb290UHJvY2Vzc05hbWU6IG5hbWUsXG4gICAgICAgICAgICAgICAgfV0pOiBvYmplY3QgPT4gKHtcbiAgICAgICAgICAgICAgICAgIGFkZHJlc3M6IGluc3RhbmNlLFxuICAgICAgICAgICAgICAgICAgaWQ6IGJ1bmRsZUZvcixcbiAgICAgICAgICAgICAgICAgIGJwbW5Nb2RlbCxcbiAgICAgICAgICAgICAgICAgIHJlZ2lzdHJ5Q29udHJhY3Q6IGNvbnRyYWN0LFxuICAgICAgICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICApXG4gICAgICAgICAgKVxuICAgICAgKVxuICAgIH1cbiAgfVxufVxuIl19