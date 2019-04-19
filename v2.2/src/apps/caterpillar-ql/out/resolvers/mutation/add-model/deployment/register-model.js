"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _debug2 = _interopRequireDefault(require("debug"));

var _registerModels = _interopRequireDefault(require("./register-models"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Step 1. Model Registration: Collects the compilation artifacts of the produced models, 
//         and saves all these metadata as an entry in the Process Repository.
var debug = (0, _debug2["default"])('caterpillarql:add-model:register-model');

var _default = function _default(web3, registryContract, modelInfo, contracts) {
  // Sorting elements such that children are created first
  var queue = [{
    nodeId: modelInfo.id,
    nodeName: modelInfo.name,
    bundleId: '',
    nodeIndex: 0,
    bundleParent: '',
    factoryContract: ''
  }];

  for (var i = 0; i < queue.length; i++) {
    if (modelInfo.controlFlowInfoMap.has(queue[i].nodeId)) {
      var cfInfo = modelInfo.controlFlowInfoMap.get(queue[i].nodeId);
      var candidates = [cfInfo.multiinstanceActivities, cfInfo.nonInterruptingEvents, cfInfo.callActivities];
      candidates.forEach(function (children) {
        if (children) {
          children.forEach(function (value, key) {
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
  var nodeIndexes = new Map();

  for (var _i = 0; _i < queue.length; _i++) {
    nodeIndexes.set(queue[_i].nodeId, _i);
  }

  debug('....................................................................');
  debug('UPDATING COMPILATION ARTIFACTS IN REPOSITORY ...');
  return (0, _registerModels["default"])(web3, registryContract, 0, queue, nodeIndexes, modelInfo, contracts);
};

exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvbXV0YXRpb24vYWRkLW1vZGVsL2RlcGxveW1lbnQvcmVnaXN0ZXItbW9kZWwudHMiXSwibmFtZXMiOlsiZGVidWciLCJ3ZWIzIiwicmVnaXN0cnlDb250cmFjdCIsIm1vZGVsSW5mbyIsImNvbnRyYWN0cyIsInF1ZXVlIiwibm9kZUlkIiwiaWQiLCJub2RlTmFtZSIsIm5hbWUiLCJidW5kbGVJZCIsIm5vZGVJbmRleCIsImJ1bmRsZVBhcmVudCIsImZhY3RvcnlDb250cmFjdCIsImkiLCJsZW5ndGgiLCJjb250cm9sRmxvd0luZm9NYXAiLCJoYXMiLCJjZkluZm8iLCJnZXQiLCJjYW5kaWRhdGVzIiwibXVsdGlpbnN0YW5jZUFjdGl2aXRpZXMiLCJub25JbnRlcnJ1cHRpbmdFdmVudHMiLCJjYWxsQWN0aXZpdGllcyIsImZvckVhY2giLCJjaGlsZHJlbiIsInZhbHVlIiwia2V5IiwicHVzaCIsInJldmVyc2UiLCJub2RlSW5kZXhlcyIsIk1hcCIsInNldCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUVBOzs7O0FBQ0E7QUFDQTtBQUVBLElBQU1BLEtBQUssR0FBRyx3QkFBTyx3Q0FBUCxDQUFkOztlQUVlLGtCQUNiQyxJQURhLEVBRWJDLGdCQUZhLEVBR2JDLFNBSGEsRUFJYkMsU0FKYSxFQUtWO0FBQ0g7QUFDQSxNQUFJQyxLQUFLLEdBQUcsQ0FDVjtBQUNFQyxJQUFBQSxNQUFNLEVBQUVILFNBQVMsQ0FBQ0ksRUFEcEI7QUFFRUMsSUFBQUEsUUFBUSxFQUFFTCxTQUFTLENBQUNNLElBRnRCO0FBR0VDLElBQUFBLFFBQVEsRUFBRSxFQUhaO0FBSUVDLElBQUFBLFNBQVMsRUFBRSxDQUpiO0FBS0VDLElBQUFBLFlBQVksRUFBRSxFQUxoQjtBQU1FQyxJQUFBQSxlQUFlLEVBQUU7QUFObkIsR0FEVSxDQUFaOztBQVVBLE9BQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR1QsS0FBSyxDQUFDVSxNQUExQixFQUFrQ0QsQ0FBQyxFQUFuQyxFQUF1QztBQUNyQyxRQUFJWCxTQUFTLENBQUNhLGtCQUFWLENBQTZCQyxHQUE3QixDQUFpQ1osS0FBSyxDQUFDUyxDQUFELENBQUwsQ0FBU1IsTUFBMUMsQ0FBSixFQUF1RDtBQUNyRCxVQUFJWSxNQUFNLEdBQUdmLFNBQVMsQ0FBQ2Esa0JBQVYsQ0FBNkJHLEdBQTdCLENBQWlDZCxLQUFLLENBQUNTLENBQUQsQ0FBTCxDQUFTUixNQUExQyxDQUFiO0FBQ0EsVUFBSWMsVUFBVSxHQUFHLENBQUNGLE1BQU0sQ0FBQ0csdUJBQVIsRUFBaUNILE1BQU0sQ0FBQ0kscUJBQXhDLEVBQStESixNQUFNLENBQUNLLGNBQXRFLENBQWpCO0FBQ0FILE1BQUFBLFVBQVUsQ0FBQ0ksT0FBWCxDQUFtQixVQUFBQyxRQUFRLEVBQUk7QUFDN0IsWUFBSUEsUUFBSixFQUFjO0FBQ1pBLFVBQUFBLFFBQVEsQ0FBQ0QsT0FBVCxDQUFpQixVQUFDRSxLQUFELEVBQVFDLEdBQVIsRUFBZ0I7QUFDL0J0QixZQUFBQSxLQUFLLENBQUN1QixJQUFOLENBQVc7QUFBRXRCLGNBQUFBLE1BQU0sRUFBRXFCLEdBQVY7QUFBZW5CLGNBQUFBLFFBQVEsRUFBRWtCLEtBQXpCO0FBQWdDaEIsY0FBQUEsUUFBUSxFQUFFLEVBQTFDO0FBQThDQyxjQUFBQSxTQUFTLEVBQUUsQ0FBekQ7QUFBNERDLGNBQUFBLFlBQVksRUFBRSxFQUExRTtBQUE4RUMsY0FBQUEsZUFBZSxFQUFFO0FBQS9GLGFBQVg7QUFDRCxXQUZEO0FBR0Q7QUFDRixPQU5EO0FBT0Q7QUFDRjs7QUFDRFIsRUFBQUEsS0FBSyxDQUFDd0IsT0FBTjtBQUNBLE1BQUlDLFdBQVcsR0FBRyxJQUFJQyxHQUFKLEVBQWxCOztBQUNBLE9BQUssSUFBSWpCLEVBQUMsR0FBRyxDQUFiLEVBQWdCQSxFQUFDLEdBQUdULEtBQUssQ0FBQ1UsTUFBMUIsRUFBa0NELEVBQUMsRUFBbkM7QUFDRWdCLElBQUFBLFdBQVcsQ0FBQ0UsR0FBWixDQUFnQjNCLEtBQUssQ0FBQ1MsRUFBRCxDQUFMLENBQVNSLE1BQXpCLEVBQWlDUSxFQUFqQztBQURGOztBQUVBZCxFQUFBQSxLQUFLLENBQUMsc0VBQUQsQ0FBTDtBQUNBQSxFQUFBQSxLQUFLLENBQUMsa0RBQUQsQ0FBTDtBQUNBLFNBQU8sZ0NBQ0xDLElBREssRUFFTEMsZ0JBRkssRUFHTCxDQUhLLEVBSUxHLEtBSkssRUFLTHlCLFdBTEssRUFNTDNCLFNBTkssRUFPTEMsU0FQSyxDQUFQO0FBU0QsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfZGVidWcgZnJvbSAnZGVidWcnXG5cbmltcG9ydCByZWdpc3Rlck1vZGVscyBmcm9tICcuL3JlZ2lzdGVyLW1vZGVscydcbi8vIFN0ZXAgMS4gTW9kZWwgUmVnaXN0cmF0aW9uOiBDb2xsZWN0cyB0aGUgY29tcGlsYXRpb24gYXJ0aWZhY3RzIG9mIHRoZSBwcm9kdWNlZCBtb2RlbHMsIFxuLy8gICAgICAgICBhbmQgc2F2ZXMgYWxsIHRoZXNlIG1ldGFkYXRhIGFzIGFuIGVudHJ5IGluIHRoZSBQcm9jZXNzIFJlcG9zaXRvcnkuXG5cbmNvbnN0IGRlYnVnID0gX2RlYnVnKCdjYXRlcnBpbGxhcnFsOmFkZC1tb2RlbDpyZWdpc3Rlci1tb2RlbCcpXG5cbmV4cG9ydCBkZWZhdWx0IChcbiAgd2ViMyxcbiAgcmVnaXN0cnlDb250cmFjdCxcbiAgbW9kZWxJbmZvLFxuICBjb250cmFjdHMsXG4pID0+IHtcbiAgLy8gU29ydGluZyBlbGVtZW50cyBzdWNoIHRoYXQgY2hpbGRyZW4gYXJlIGNyZWF0ZWQgZmlyc3RcbiAgbGV0IHF1ZXVlID0gW1xuICAgIHtcbiAgICAgIG5vZGVJZDogbW9kZWxJbmZvLmlkLFxuICAgICAgbm9kZU5hbWU6IG1vZGVsSW5mby5uYW1lLFxuICAgICAgYnVuZGxlSWQ6ICcnLFxuICAgICAgbm9kZUluZGV4OiAwLFxuICAgICAgYnVuZGxlUGFyZW50OiAnJyxcbiAgICAgIGZhY3RvcnlDb250cmFjdDogJycsXG4gICAgfVxuICBdXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcXVldWUubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAobW9kZWxJbmZvLmNvbnRyb2xGbG93SW5mb01hcC5oYXMocXVldWVbaV0ubm9kZUlkKSkge1xuICAgICAgbGV0IGNmSW5mbyA9IG1vZGVsSW5mby5jb250cm9sRmxvd0luZm9NYXAuZ2V0KHF1ZXVlW2ldLm5vZGVJZCk7XG4gICAgICBsZXQgY2FuZGlkYXRlcyA9IFtjZkluZm8ubXVsdGlpbnN0YW5jZUFjdGl2aXRpZXMsIGNmSW5mby5ub25JbnRlcnJ1cHRpbmdFdmVudHMsIGNmSW5mby5jYWxsQWN0aXZpdGllc107XG4gICAgICBjYW5kaWRhdGVzLmZvckVhY2goY2hpbGRyZW4gPT4ge1xuICAgICAgICBpZiAoY2hpbGRyZW4pIHtcbiAgICAgICAgICBjaGlsZHJlbi5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgICAgICBxdWV1ZS5wdXNoKHsgbm9kZUlkOiBrZXksIG5vZGVOYW1lOiB2YWx1ZSwgYnVuZGxlSWQ6ICcnLCBub2RlSW5kZXg6IDAsIGJ1bmRsZVBhcmVudDogJycsIGZhY3RvcnlDb250cmFjdDogJycgfSk7XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cbiAgcXVldWUucmV2ZXJzZSgpO1xuICBsZXQgbm9kZUluZGV4ZXMgPSBuZXcgTWFwKCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcXVldWUubGVuZ3RoOyBpKyspXG4gICAgbm9kZUluZGV4ZXMuc2V0KHF1ZXVlW2ldLm5vZGVJZCwgaSlcbiAgZGVidWcoJy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uJyk7XG4gIGRlYnVnKCdVUERBVElORyBDT01QSUxBVElPTiBBUlRJRkFDVFMgSU4gUkVQT1NJVE9SWSAuLi4nKTtcbiAgcmV0dXJuIHJlZ2lzdGVyTW9kZWxzKFxuICAgIHdlYjMsXG4gICAgcmVnaXN0cnlDb250cmFjdCxcbiAgICAwLFxuICAgIHF1ZXVlLFxuICAgIG5vZGVJbmRleGVzLFxuICAgIG1vZGVsSW5mbyxcbiAgICBjb250cmFjdHMsXG4gIClcbn1cbiJdfQ==