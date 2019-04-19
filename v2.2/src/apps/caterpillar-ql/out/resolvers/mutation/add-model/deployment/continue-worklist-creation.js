"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _debug2 = _interopRequireDefault(require("debug"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var debug = (0, _debug2["default"])('caterpillarql:add-model:continue-worklist-creation');

var continueWorklistCreation = function continueWorklistCreation(web3, registryContract, currentIndex, sortedElements, outputContracts, modelInfo, createWorklistInstances) {
  if (currentIndex + 1 < sortedElements.length) {
    return createWorklistInstances(web3, registryContract, currentIndex + 1, sortedElements, outputContracts, modelInfo);
  } else {
    var bundleId = '';

    for (var i = 0; i < sortedElements.length; i++) {
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
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvbXV0YXRpb24vYWRkLW1vZGVsL2RlcGxveW1lbnQvY29udGludWUtd29ya2xpc3QtY3JlYXRpb24udHMiXSwibmFtZXMiOlsiZGVidWciLCJjb250aW51ZVdvcmtsaXN0Q3JlYXRpb24iLCJ3ZWIzIiwicmVnaXN0cnlDb250cmFjdCIsImN1cnJlbnRJbmRleCIsInNvcnRlZEVsZW1lbnRzIiwib3V0cHV0Q29udHJhY3RzIiwibW9kZWxJbmZvIiwiY3JlYXRlV29ya2xpc3RJbnN0YW5jZXMiLCJsZW5ndGgiLCJidW5kbGVJZCIsImkiLCJub2RlTmFtZSIsIm5hbWUiLCJpZCIsImJwbW4iLCJzb2xpZGl0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7O0FBRUEsSUFBTUEsS0FBSyxHQUFHLHdCQUFPLG9EQUFQLENBQWQ7O0FBRUEsSUFBTUMsd0JBQXdCLEdBQUcsU0FBM0JBLHdCQUEyQixDQUMvQkMsSUFEK0IsRUFFL0JDLGdCQUYrQixFQUcvQkMsWUFIK0IsRUFJL0JDLGNBSitCLEVBSy9CQyxlQUwrQixFQU0vQkMsU0FOK0IsRUFPL0JDLHVCQVArQixFQVE1QjtBQUNILE1BQUlKLFlBQVksR0FBRyxDQUFmLEdBQW1CQyxjQUFjLENBQUNJLE1BQXRDLEVBQThDO0FBQzVDLFdBQU9ELHVCQUF1QixDQUM1Qk4sSUFENEIsRUFFNUJDLGdCQUY0QixFQUc1QkMsWUFBWSxHQUFHLENBSGEsRUFJNUJDLGNBSjRCLEVBSzVCQyxlQUw0QixFQU01QkMsU0FONEIsQ0FBOUI7QUFRRCxHQVRELE1BU087QUFDTCxRQUFJRyxRQUFRLEdBQUcsRUFBZjs7QUFDQSxTQUFLLElBQUlDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdOLGNBQWMsQ0FBQ0ksTUFBbkMsRUFBMkNFLENBQUMsRUFBNUMsRUFBZ0Q7QUFDOUMsVUFBSU4sY0FBYyxDQUFDTSxDQUFELENBQWQsQ0FBa0JDLFFBQWxCLEtBQStCTCxTQUFTLENBQUNNLElBQTdDLEVBQW1EO0FBQ2pESCxRQUFBQSxRQUFRLEdBQUdMLGNBQWMsQ0FBQ00sQ0FBRCxDQUFkLENBQWtCRCxRQUE3QjtBQUNBO0FBQ0Q7QUFDRjs7QUFDRFYsSUFBQUEsS0FBSyxDQUFDLGdHQUFELENBQUw7QUFDQSxXQUFPO0FBQ0xjLE1BQUFBLEVBQUUsRUFBRUosUUFEQztBQUVMRyxNQUFBQSxJQUFJLEVBQUVOLFNBQVMsQ0FBQ00sSUFGWDtBQUdMRSxNQUFBQSxJQUFJLEVBQUVSLFNBQVMsQ0FBQ1EsSUFIWDtBQUlMQyxNQUFBQSxRQUFRLEVBQUVULFNBQVMsQ0FBQ1M7QUFKZixLQUFQO0FBTUQ7QUFDRixDQWxDRDs7ZUFvQ2VmLHdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF9kZWJ1ZyBmcm9tICdkZWJ1ZydcblxuY29uc3QgZGVidWcgPSBfZGVidWcoJ2NhdGVycGlsbGFycWw6YWRkLW1vZGVsOmNvbnRpbnVlLXdvcmtsaXN0LWNyZWF0aW9uJylcblxuY29uc3QgY29udGludWVXb3JrbGlzdENyZWF0aW9uID0gKFxuICB3ZWIzLFxuICByZWdpc3RyeUNvbnRyYWN0LFxuICBjdXJyZW50SW5kZXgsXG4gIHNvcnRlZEVsZW1lbnRzLFxuICBvdXRwdXRDb250cmFjdHMsXG4gIG1vZGVsSW5mbyxcbiAgY3JlYXRlV29ya2xpc3RJbnN0YW5jZXMsXG4pID0+IHtcbiAgaWYgKGN1cnJlbnRJbmRleCArIDEgPCBzb3J0ZWRFbGVtZW50cy5sZW5ndGgpIHtcbiAgICByZXR1cm4gY3JlYXRlV29ya2xpc3RJbnN0YW5jZXMoXG4gICAgICB3ZWIzLFxuICAgICAgcmVnaXN0cnlDb250cmFjdCxcbiAgICAgIGN1cnJlbnRJbmRleCArIDEsXG4gICAgICBzb3J0ZWRFbGVtZW50cyxcbiAgICAgIG91dHB1dENvbnRyYWN0cyxcbiAgICAgIG1vZGVsSW5mbyxcbiAgICAgICk7XG4gIH0gZWxzZSB7XG4gICAgbGV0IGJ1bmRsZUlkID0gJyc7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzb3J0ZWRFbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHNvcnRlZEVsZW1lbnRzW2ldLm5vZGVOYW1lID09PSBtb2RlbEluZm8ubmFtZSkge1xuICAgICAgICBidW5kbGVJZCA9IHNvcnRlZEVsZW1lbnRzW2ldLmJ1bmRsZUlkO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgZGVidWcoJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6IGJ1bmRsZUlkLFxuICAgICAgbmFtZTogbW9kZWxJbmZvLm5hbWUsXG4gICAgICBicG1uOiBtb2RlbEluZm8uYnBtbixcbiAgICAgIHNvbGlkaXR5OiBtb2RlbEluZm8uc29saWRpdHlcbiAgICB9O1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb250aW51ZVdvcmtsaXN0Q3JlYXRpb25cbiJdfQ==