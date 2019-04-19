"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default = function _default(repoArr) {
  var roleIndexMap = new Map();

  for (var i = 1; i < repoArr.length; i++) {
    if (repoArr[i]) roleIndexMap.set(repoArr[i], i);
  }

  return roleIndexMap;
};

exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvcHJvY2Vzcy1jb250cmFjdC9yZXNvdXJjZXMvZmluZC1yb2xlLW1hcC50cyJdLCJuYW1lcyI6WyJyZXBvQXJyIiwicm9sZUluZGV4TWFwIiwiTWFwIiwiaSIsImxlbmd0aCIsInNldCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztlQUFlLGtCQUFDQSxPQUFELEVBQWE7QUFDMUIsTUFBSUMsWUFBaUMsR0FBRyxJQUFJQyxHQUFKLEVBQXhDOztBQUNBLE9BQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0gsT0FBTyxDQUFDSSxNQUE1QixFQUFvQ0QsQ0FBQyxFQUFyQztBQUNJLFFBQUdILE9BQU8sQ0FBQ0csQ0FBRCxDQUFWLEVBQ0lGLFlBQVksQ0FBQ0ksR0FBYixDQUFpQkwsT0FBTyxDQUFDRyxDQUFELENBQXhCLEVBQTZCQSxDQUE3QjtBQUZSOztBQUdBLFNBQU9GLFlBQVA7QUFDRCxDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgKHJlcG9BcnIpID0+IHtcbiAgbGV0IHJvbGVJbmRleE1hcDogTWFwPHN0cmluZywgbnVtYmVyPiA9IG5ldyBNYXAoKTtcbiAgZm9yIChsZXQgaSA9IDE7IGkgPCByZXBvQXJyLmxlbmd0aDsgaSsrKVxuICAgICAgaWYocmVwb0FycltpXSkgXG4gICAgICAgICAgcm9sZUluZGV4TWFwLnNldChyZXBvQXJyW2ldLCBpKTtcbiAgcmV0dXJuIHJvbGVJbmRleE1hcDsgICAgXG59Il19