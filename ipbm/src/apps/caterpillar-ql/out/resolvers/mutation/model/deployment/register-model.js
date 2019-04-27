"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _debug2 = _interopRequireDefault(require("debug"));

var _registerModels = _interopRequireDefault(require("./register-models"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Step 1. Model Registration: Collects the compilation artifacts of the produced models, 
//         and saves all these metadata as an entry in the Process Repository.
const debug = (0, _debug2.default)('caterpillarql:model:register-model');

var _default = (web3, registryContract, modelInfo, contracts) => {
  // Sorting elements such that children are created first
  let queue = [{
    nodeId: modelInfo.id,
    nodeName: modelInfo.name,
    bundleId: '',
    nodeIndex: 0,
    bundleParent: '',
    factoryContract: ''
  }];

  for (let i = 0; i < queue.length; i++) {
    if (modelInfo.controlFlowInfoMap.has(queue[i].nodeId)) {
      let cfInfo = modelInfo.controlFlowInfoMap.get(queue[i].nodeId);
      let candidates = [cfInfo.multiinstanceActivities, cfInfo.nonInterruptingEvents, cfInfo.callActivities];
      candidates.forEach(children => {
        if (children) {
          children.forEach((value, key) => {
            queue.push({
              nodeId: key,
              nodeName: value,
              bundleId: '',
              nodeIndex: 0,
              bundleParent: '',
              factoryContract: ''
            });
          });
        }
      });
    }
  }

  queue.reverse();
  let nodeIndexes = new Map();

  for (let i = 0; i < queue.length; i++) nodeIndexes.set(queue[i].nodeId, i);

  debug('....................................................................');
  debug('UPDATING COMPILATION ARTIFACTS IN REPOSITORY ...');
  return (0, _registerModels.default)(web3, registryContract, 0, queue, nodeIndexes, modelInfo, contracts);
};

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvbXV0YXRpb24vbW9kZWwvZGVwbG95bWVudC9yZWdpc3Rlci1tb2RlbC50cyJdLCJuYW1lcyI6WyJkZWJ1ZyIsIndlYjMiLCJyZWdpc3RyeUNvbnRyYWN0IiwibW9kZWxJbmZvIiwiY29udHJhY3RzIiwicXVldWUiLCJub2RlSWQiLCJpZCIsIm5vZGVOYW1lIiwibmFtZSIsImJ1bmRsZUlkIiwibm9kZUluZGV4IiwiYnVuZGxlUGFyZW50IiwiZmFjdG9yeUNvbnRyYWN0IiwiaSIsImxlbmd0aCIsImNvbnRyb2xGbG93SW5mb01hcCIsImhhcyIsImNmSW5mbyIsImdldCIsImNhbmRpZGF0ZXMiLCJtdWx0aWluc3RhbmNlQWN0aXZpdGllcyIsIm5vbkludGVycnVwdGluZ0V2ZW50cyIsImNhbGxBY3Rpdml0aWVzIiwiZm9yRWFjaCIsImNoaWxkcmVuIiwidmFsdWUiLCJrZXkiLCJwdXNoIiwicmV2ZXJzZSIsIm5vZGVJbmRleGVzIiwiTWFwIiwic2V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBRUE7Ozs7QUFDQTtBQUNBO0FBRUEsTUFBTUEsS0FBSyxHQUFHLHFCQUFPLG9DQUFQLENBQWQ7O2VBRWUsQ0FDYkMsSUFEYSxFQUViQyxnQkFGYSxFQUdiQyxTQUhhLEVBSWJDLFNBSmEsS0FLVjtBQUNIO0FBQ0EsTUFBSUMsS0FBSyxHQUFHLENBQ1Y7QUFDRUMsSUFBQUEsTUFBTSxFQUFFSCxTQUFTLENBQUNJLEVBRHBCO0FBRUVDLElBQUFBLFFBQVEsRUFBRUwsU0FBUyxDQUFDTSxJQUZ0QjtBQUdFQyxJQUFBQSxRQUFRLEVBQUUsRUFIWjtBQUlFQyxJQUFBQSxTQUFTLEVBQUUsQ0FKYjtBQUtFQyxJQUFBQSxZQUFZLEVBQUUsRUFMaEI7QUFNRUMsSUFBQUEsZUFBZSxFQUFFO0FBTm5CLEdBRFUsQ0FBWjs7QUFVQSxPQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdULEtBQUssQ0FBQ1UsTUFBMUIsRUFBa0NELENBQUMsRUFBbkMsRUFBdUM7QUFDckMsUUFBSVgsU0FBUyxDQUFDYSxrQkFBVixDQUE2QkMsR0FBN0IsQ0FBaUNaLEtBQUssQ0FBQ1MsQ0FBRCxDQUFMLENBQVNSLE1BQTFDLENBQUosRUFBdUQ7QUFDckQsVUFBSVksTUFBTSxHQUFHZixTQUFTLENBQUNhLGtCQUFWLENBQTZCRyxHQUE3QixDQUFpQ2QsS0FBSyxDQUFDUyxDQUFELENBQUwsQ0FBU1IsTUFBMUMsQ0FBYjtBQUNBLFVBQUljLFVBQVUsR0FBRyxDQUFDRixNQUFNLENBQUNHLHVCQUFSLEVBQWlDSCxNQUFNLENBQUNJLHFCQUF4QyxFQUErREosTUFBTSxDQUFDSyxjQUF0RSxDQUFqQjtBQUNBSCxNQUFBQSxVQUFVLENBQUNJLE9BQVgsQ0FBbUJDLFFBQVEsSUFBSTtBQUM3QixZQUFJQSxRQUFKLEVBQWM7QUFDWkEsVUFBQUEsUUFBUSxDQUFDRCxPQUFULENBQWlCLENBQUNFLEtBQUQsRUFBUUMsR0FBUixLQUFnQjtBQUMvQnRCLFlBQUFBLEtBQUssQ0FBQ3VCLElBQU4sQ0FBVztBQUFFdEIsY0FBQUEsTUFBTSxFQUFFcUIsR0FBVjtBQUFlbkIsY0FBQUEsUUFBUSxFQUFFa0IsS0FBekI7QUFBZ0NoQixjQUFBQSxRQUFRLEVBQUUsRUFBMUM7QUFBOENDLGNBQUFBLFNBQVMsRUFBRSxDQUF6RDtBQUE0REMsY0FBQUEsWUFBWSxFQUFFLEVBQTFFO0FBQThFQyxjQUFBQSxlQUFlLEVBQUU7QUFBL0YsYUFBWDtBQUNELFdBRkQ7QUFHRDtBQUNGLE9BTkQ7QUFPRDtBQUNGOztBQUNEUixFQUFBQSxLQUFLLENBQUN3QixPQUFOO0FBQ0EsTUFBSUMsV0FBVyxHQUFHLElBQUlDLEdBQUosRUFBbEI7O0FBQ0EsT0FBSyxJQUFJakIsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR1QsS0FBSyxDQUFDVSxNQUExQixFQUFrQ0QsQ0FBQyxFQUFuQyxFQUNFZ0IsV0FBVyxDQUFDRSxHQUFaLENBQWdCM0IsS0FBSyxDQUFDUyxDQUFELENBQUwsQ0FBU1IsTUFBekIsRUFBaUNRLENBQWpDOztBQUNGZCxFQUFBQSxLQUFLLENBQUMsc0VBQUQsQ0FBTDtBQUNBQSxFQUFBQSxLQUFLLENBQUMsa0RBQUQsQ0FBTDtBQUNBLFNBQU8sNkJBQ0xDLElBREssRUFFTEMsZ0JBRkssRUFHTCxDQUhLLEVBSUxHLEtBSkssRUFLTHlCLFdBTEssRUFNTDNCLFNBTkssRUFPTEMsU0FQSyxDQUFQO0FBU0QsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfZGVidWcgZnJvbSAnZGVidWcnXG5cbmltcG9ydCByZWdpc3Rlck1vZGVscyBmcm9tICcuL3JlZ2lzdGVyLW1vZGVscydcbi8vIFN0ZXAgMS4gTW9kZWwgUmVnaXN0cmF0aW9uOiBDb2xsZWN0cyB0aGUgY29tcGlsYXRpb24gYXJ0aWZhY3RzIG9mIHRoZSBwcm9kdWNlZCBtb2RlbHMsIFxuLy8gICAgICAgICBhbmQgc2F2ZXMgYWxsIHRoZXNlIG1ldGFkYXRhIGFzIGFuIGVudHJ5IGluIHRoZSBQcm9jZXNzIFJlcG9zaXRvcnkuXG5cbmNvbnN0IGRlYnVnID0gX2RlYnVnKCdjYXRlcnBpbGxhcnFsOm1vZGVsOnJlZ2lzdGVyLW1vZGVsJylcblxuZXhwb3J0IGRlZmF1bHQgKFxuICB3ZWIzLFxuICByZWdpc3RyeUNvbnRyYWN0LFxuICBtb2RlbEluZm8sXG4gIGNvbnRyYWN0cyxcbikgPT4ge1xuICAvLyBTb3J0aW5nIGVsZW1lbnRzIHN1Y2ggdGhhdCBjaGlsZHJlbiBhcmUgY3JlYXRlZCBmaXJzdFxuICBsZXQgcXVldWUgPSBbXG4gICAge1xuICAgICAgbm9kZUlkOiBtb2RlbEluZm8uaWQsXG4gICAgICBub2RlTmFtZTogbW9kZWxJbmZvLm5hbWUsXG4gICAgICBidW5kbGVJZDogJycsXG4gICAgICBub2RlSW5kZXg6IDAsXG4gICAgICBidW5kbGVQYXJlbnQ6ICcnLFxuICAgICAgZmFjdG9yeUNvbnRyYWN0OiAnJyxcbiAgICB9XG4gIF1cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBxdWV1ZS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChtb2RlbEluZm8uY29udHJvbEZsb3dJbmZvTWFwLmhhcyhxdWV1ZVtpXS5ub2RlSWQpKSB7XG4gICAgICBsZXQgY2ZJbmZvID0gbW9kZWxJbmZvLmNvbnRyb2xGbG93SW5mb01hcC5nZXQocXVldWVbaV0ubm9kZUlkKTtcbiAgICAgIGxldCBjYW5kaWRhdGVzID0gW2NmSW5mby5tdWx0aWluc3RhbmNlQWN0aXZpdGllcywgY2ZJbmZvLm5vbkludGVycnVwdGluZ0V2ZW50cywgY2ZJbmZvLmNhbGxBY3Rpdml0aWVzXTtcbiAgICAgIGNhbmRpZGF0ZXMuZm9yRWFjaChjaGlsZHJlbiA9PiB7XG4gICAgICAgIGlmIChjaGlsZHJlbikge1xuICAgICAgICAgIGNoaWxkcmVuLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgICAgIHF1ZXVlLnB1c2goeyBub2RlSWQ6IGtleSwgbm9kZU5hbWU6IHZhbHVlLCBidW5kbGVJZDogJycsIG5vZGVJbmRleDogMCwgYnVuZGxlUGFyZW50OiAnJywgZmFjdG9yeUNvbnRyYWN0OiAnJyB9KTtcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuICBxdWV1ZS5yZXZlcnNlKCk7XG4gIGxldCBub2RlSW5kZXhlcyA9IG5ldyBNYXAoKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBxdWV1ZS5sZW5ndGg7IGkrKylcbiAgICBub2RlSW5kZXhlcy5zZXQocXVldWVbaV0ubm9kZUlkLCBpKVxuICBkZWJ1ZygnLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4nKTtcbiAgZGVidWcoJ1VQREFUSU5HIENPTVBJTEFUSU9OIEFSVElGQUNUUyBJTiBSRVBPU0lUT1JZIC4uLicpO1xuICByZXR1cm4gcmVnaXN0ZXJNb2RlbHMoXG4gICAgd2ViMyxcbiAgICByZWdpc3RyeUNvbnRyYWN0LFxuICAgIDAsXG4gICAgcXVldWUsXG4gICAgbm9kZUluZGV4ZXMsXG4gICAgbW9kZWxJbmZvLFxuICAgIGNvbnRyYWN0cyxcbiAgKVxufVxuIl19