"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const generate = ({
  procId,
  separateInstances,
  workItems
}) => {
  const maxTaskIndex = Math.max(...workItems.map(({
    taskIndex
  }) => taskIndex));
  return _objectSpread({
    [procId]: [...Array(maxTaskIndex + 1)].fill('.').map((_, index) => {
      const workItem = workItems.find(({
        taskIndex
      }) => taskIndex === index);
      return workItem && workItem.roleIndex ? workItem.roleIndex : 0;
    })
  }, separateInstances.map(generate).reduce((acc, val) => _objectSpread({}, acc, val), {}));
};

var _default = generate;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvbXV0YXRpb24vcm9sZS10YXNrL2RlcGxveW1lbnQvZHluYW1pYy1iaW5kaW5nL3ZhbGlkYXRpb25fY29kZV9nZW4vZ2VuZXJhdGUtcm9sZS10YXNrLWluZGV4ZXMudHMiXSwibmFtZXMiOlsiZ2VuZXJhdGUiLCJwcm9jSWQiLCJzZXBhcmF0ZUluc3RhbmNlcyIsIndvcmtJdGVtcyIsIm1heFRhc2tJbmRleCIsIk1hdGgiLCJtYXgiLCJtYXAiLCJ0YXNrSW5kZXgiLCJBcnJheSIsImZpbGwiLCJfIiwiaW5kZXgiLCJ3b3JrSXRlbSIsImZpbmQiLCJyb2xlSW5kZXgiLCJyZWR1Y2UiLCJhY2MiLCJ2YWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsTUFBTUEsUUFBUSxHQUFHLENBQUM7QUFDaEJDLEVBQUFBLE1BRGdCO0FBRWhCQyxFQUFBQSxpQkFGZ0I7QUFHaEJDLEVBQUFBO0FBSGdCLENBQUQsS0FJWDtBQUNKLFFBQU1DLFlBQVksR0FBR0MsSUFBSSxDQUFDQyxHQUFMLENBQVMsR0FBR0gsU0FBUyxDQUFDSSxHQUFWLENBQWMsQ0FBQztBQUFFQyxJQUFBQTtBQUFGLEdBQUQsS0FBbUJBLFNBQWpDLENBQVosQ0FBckI7QUFDQTtBQUNFLEtBQUNQLE1BQUQsR0FBVSxDQUFDLEdBQUdRLEtBQUssQ0FBQ0wsWUFBWSxHQUFHLENBQWhCLENBQVQsRUFBNkJNLElBQTdCLENBQWtDLEdBQWxDLEVBQ1BILEdBRE8sQ0FFTixDQUFDSSxDQUFELEVBQUlDLEtBQUosS0FBYztBQUNaLFlBQU1DLFFBQVEsR0FBR1YsU0FBUyxDQUFDVyxJQUFWLENBQWUsQ0FBQztBQUFFTixRQUFBQTtBQUFGLE9BQUQsS0FBa0JBLFNBQVMsS0FBS0ksS0FBL0MsQ0FBakI7QUFDQSxhQUFPQyxRQUFRLElBQUlBLFFBQVEsQ0FBQ0UsU0FBckIsR0FBaUNGLFFBQVEsQ0FBQ0UsU0FBMUMsR0FBc0QsQ0FBN0Q7QUFDRCxLQUxLO0FBRFosS0FRS2IsaUJBQWlCLENBQ2ZLLEdBREYsQ0FDTVAsUUFETixFQUVFZ0IsTUFGRixDQUdHLENBQUNDLEdBQUQsRUFBTUMsR0FBTix1QkFDS0QsR0FETCxFQUVLQyxHQUZMLENBSEgsRUFPRyxFQVBILENBUkw7QUFrQkQsQ0F4QkQ7O2VBeUJlbEIsUSIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGdlbmVyYXRlID0gKHtcbiAgcHJvY0lkLFxuICBzZXBhcmF0ZUluc3RhbmNlcyxcbiAgd29ya0l0ZW1zLFxufSkgPT4ge1xuICBjb25zdCBtYXhUYXNrSW5kZXggPSBNYXRoLm1heCguLi53b3JrSXRlbXMubWFwKCh7IHRhc2tJbmRleCB9KSA9PiB0YXNrSW5kZXgpKVxuICByZXR1cm4ge1xuICAgIFtwcm9jSWRdOiBbLi4uQXJyYXkobWF4VGFza0luZGV4ICsgMSldLmZpbGwoJy4nKVxuICAgICAgLm1hcChcbiAgICAgICAgKF8sIGluZGV4KSA9PiB7XG4gICAgICAgICAgY29uc3Qgd29ya0l0ZW0gPSB3b3JrSXRlbXMuZmluZCgoeyB0YXNrSW5kZXh9KSA9PiB0YXNrSW5kZXggPT09IGluZGV4KVxuICAgICAgICAgIHJldHVybiB3b3JrSXRlbSAmJiB3b3JrSXRlbS5yb2xlSW5kZXggPyB3b3JrSXRlbS5yb2xlSW5kZXggOiAwXG4gICAgICAgIH1cbiAgICAgICksXG4gICAgLi4uc2VwYXJhdGVJbnN0YW5jZXNcbiAgICAgICAgLm1hcChnZW5lcmF0ZSlcbiAgICAgICAgLnJlZHVjZShcbiAgICAgICAgICAoYWNjLCB2YWwpID0+ICh7XG4gICAgICAgICAgICAuLi5hY2MsXG4gICAgICAgICAgICAuLi52YWwsXG4gICAgICAgICAgfSksXG4gICAgICAgICAge30sXG4gICAgICAgIClcbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgZ2VuZXJhdGVcbiJdfQ==