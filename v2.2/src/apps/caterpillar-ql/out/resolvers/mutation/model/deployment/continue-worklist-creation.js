"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _debug2 = _interopRequireDefault(require("debug"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = (0, _debug2.default)('caterpillarql:model:continue-worklist-creation');

const continueWorklistCreation = (web3, registryContract, currentIndex, sortedElements, outputContracts, modelInfo, createWorklistInstances) => {
  if (currentIndex + 1 < sortedElements.length) {
    return createWorklistInstances(web3, registryContract, currentIndex + 1, sortedElements, outputContracts, modelInfo);
  } else {
    let bundleId = '';

    for (let i = 0; i < sortedElements.length; i++) {
      if (sortedElements[i].nodeName === modelInfo.name) {
        bundleId = sortedElements[i].bundleId;
        break;
      }
    }

    debug('----------------------------------------------------------------------------------------------');
    return {
      id: bundleId,
      name: modelInfo.name,
      bpmn: modelInfo.bpmn,
      solidity: modelInfo.solidity
    };
  }
};

var _default = continueWorklistCreation;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvbXV0YXRpb24vbW9kZWwvZGVwbG95bWVudC9jb250aW51ZS13b3JrbGlzdC1jcmVhdGlvbi50cyJdLCJuYW1lcyI6WyJkZWJ1ZyIsImNvbnRpbnVlV29ya2xpc3RDcmVhdGlvbiIsIndlYjMiLCJyZWdpc3RyeUNvbnRyYWN0IiwiY3VycmVudEluZGV4Iiwic29ydGVkRWxlbWVudHMiLCJvdXRwdXRDb250cmFjdHMiLCJtb2RlbEluZm8iLCJjcmVhdGVXb3JrbGlzdEluc3RhbmNlcyIsImxlbmd0aCIsImJ1bmRsZUlkIiwiaSIsIm5vZGVOYW1lIiwibmFtZSIsImlkIiwiYnBtbiIsInNvbGlkaXR5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7QUFFQSxNQUFNQSxLQUFLLEdBQUcscUJBQU8sZ0RBQVAsQ0FBZDs7QUFFQSxNQUFNQyx3QkFBd0IsR0FBRyxDQUMvQkMsSUFEK0IsRUFFL0JDLGdCQUYrQixFQUcvQkMsWUFIK0IsRUFJL0JDLGNBSitCLEVBSy9CQyxlQUwrQixFQU0vQkMsU0FOK0IsRUFPL0JDLHVCQVArQixLQVE1QjtBQUNILE1BQUlKLFlBQVksR0FBRyxDQUFmLEdBQW1CQyxjQUFjLENBQUNJLE1BQXRDLEVBQThDO0FBQzVDLFdBQU9ELHVCQUF1QixDQUM1Qk4sSUFENEIsRUFFNUJDLGdCQUY0QixFQUc1QkMsWUFBWSxHQUFHLENBSGEsRUFJNUJDLGNBSjRCLEVBSzVCQyxlQUw0QixFQU01QkMsU0FONEIsQ0FBOUI7QUFRRCxHQVRELE1BU087QUFDTCxRQUFJRyxRQUFRLEdBQUcsRUFBZjs7QUFDQSxTQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdOLGNBQWMsQ0FBQ0ksTUFBbkMsRUFBMkNFLENBQUMsRUFBNUMsRUFBZ0Q7QUFDOUMsVUFBSU4sY0FBYyxDQUFDTSxDQUFELENBQWQsQ0FBa0JDLFFBQWxCLEtBQStCTCxTQUFTLENBQUNNLElBQTdDLEVBQW1EO0FBQ2pESCxRQUFBQSxRQUFRLEdBQUdMLGNBQWMsQ0FBQ00sQ0FBRCxDQUFkLENBQWtCRCxRQUE3QjtBQUNBO0FBQ0Q7QUFDRjs7QUFDRFYsSUFBQUEsS0FBSyxDQUFDLGdHQUFELENBQUw7QUFDQSxXQUFPO0FBQ0xjLE1BQUFBLEVBQUUsRUFBRUosUUFEQztBQUVMRyxNQUFBQSxJQUFJLEVBQUVOLFNBQVMsQ0FBQ00sSUFGWDtBQUdMRSxNQUFBQSxJQUFJLEVBQUVSLFNBQVMsQ0FBQ1EsSUFIWDtBQUlMQyxNQUFBQSxRQUFRLEVBQUVULFNBQVMsQ0FBQ1M7QUFKZixLQUFQO0FBTUQ7QUFDRixDQWxDRDs7ZUFvQ2VmLHdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF9kZWJ1ZyBmcm9tICdkZWJ1ZydcblxuY29uc3QgZGVidWcgPSBfZGVidWcoJ2NhdGVycGlsbGFycWw6bW9kZWw6Y29udGludWUtd29ya2xpc3QtY3JlYXRpb24nKVxuXG5jb25zdCBjb250aW51ZVdvcmtsaXN0Q3JlYXRpb24gPSAoXG4gIHdlYjMsXG4gIHJlZ2lzdHJ5Q29udHJhY3QsXG4gIGN1cnJlbnRJbmRleCxcbiAgc29ydGVkRWxlbWVudHMsXG4gIG91dHB1dENvbnRyYWN0cyxcbiAgbW9kZWxJbmZvLFxuICBjcmVhdGVXb3JrbGlzdEluc3RhbmNlcyxcbikgPT4ge1xuICBpZiAoY3VycmVudEluZGV4ICsgMSA8IHNvcnRlZEVsZW1lbnRzLmxlbmd0aCkge1xuICAgIHJldHVybiBjcmVhdGVXb3JrbGlzdEluc3RhbmNlcyhcbiAgICAgIHdlYjMsXG4gICAgICByZWdpc3RyeUNvbnRyYWN0LFxuICAgICAgY3VycmVudEluZGV4ICsgMSxcbiAgICAgIHNvcnRlZEVsZW1lbnRzLFxuICAgICAgb3V0cHV0Q29udHJhY3RzLFxuICAgICAgbW9kZWxJbmZvLFxuICAgICAgKTtcbiAgfSBlbHNlIHtcbiAgICBsZXQgYnVuZGxlSWQgPSAnJztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNvcnRlZEVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoc29ydGVkRWxlbWVudHNbaV0ubm9kZU5hbWUgPT09IG1vZGVsSW5mby5uYW1lKSB7XG4gICAgICAgIGJ1bmRsZUlkID0gc29ydGVkRWxlbWVudHNbaV0uYnVuZGxlSWQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBkZWJ1ZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xuICAgIHJldHVybiB7XG4gICAgICBpZDogYnVuZGxlSWQsXG4gICAgICBuYW1lOiBtb2RlbEluZm8ubmFtZSxcbiAgICAgIGJwbW46IG1vZGVsSW5mby5icG1uLFxuICAgICAgc29saWRpdHk6IG1vZGVsSW5mby5zb2xpZGl0eVxuICAgIH07XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbnRpbnVlV29ya2xpc3RDcmVhdGlvblxuIl19