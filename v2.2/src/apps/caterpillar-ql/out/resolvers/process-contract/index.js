"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _instanceState2 = _interopRequireDefault(require("./instance-state"));

var _resources2 = _interopRequireDefault(require("./resources"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = function _default(web3) {
  return {
    instanceState: function instanceState(_ref) {
      var address = _ref.address,
          registryContract = _ref.registryContract,
          bpmnModel = _ref.bpmnModel;
      return (0, _instanceState2["default"])({
        web3: web3,
        registryContract: registryContract,
        bpmnModel: bpmnModel
      })(address);
    },
    resources: function resources(_ref2, _ref3) {
      var address = _ref2.address,
          registryContract = _ref2.registryContract;
      var role = _ref3.role;
      return (0, _resources2["default"])({
        web3: web3,
        registryContract: registryContract
      })(address, role);
    }
  };
};

exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvcHJvY2Vzcy1jb250cmFjdC9pbmRleC50cyJdLCJuYW1lcyI6WyJ3ZWIzIiwiaW5zdGFuY2VTdGF0ZSIsImFkZHJlc3MiLCJyZWdpc3RyeUNvbnRyYWN0IiwiYnBtbk1vZGVsIiwicmVzb3VyY2VzIiwicm9sZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOzs7O2VBRWUsa0JBQUNBLElBQUQ7QUFBQSxTQUFtQjtBQUNoQ0MsSUFBQUEsYUFBYSxFQUFFO0FBQUEsVUFBR0MsT0FBSCxRQUFHQSxPQUFIO0FBQUEsVUFBWUMsZ0JBQVosUUFBWUEsZ0JBQVo7QUFBQSxVQUE4QkMsU0FBOUIsUUFBOEJBLFNBQTlCO0FBQUEsYUFDYixnQ0FBYztBQUFFSixRQUFBQSxJQUFJLEVBQUpBLElBQUY7QUFBUUcsUUFBQUEsZ0JBQWdCLEVBQWhCQSxnQkFBUjtBQUEwQkMsUUFBQUEsU0FBUyxFQUFUQTtBQUExQixPQUFkLEVBQXFERixPQUFyRCxDQURhO0FBQUEsS0FEaUI7QUFHaENHLElBQUFBLFNBQVMsRUFBRTtBQUFBLFVBQUdILE9BQUgsU0FBR0EsT0FBSDtBQUFBLFVBQVlDLGdCQUFaLFNBQVlBLGdCQUFaO0FBQUEsVUFBa0NHLElBQWxDLFNBQWtDQSxJQUFsQztBQUFBLGFBQ1QsNEJBQVU7QUFBRU4sUUFBQUEsSUFBSSxFQUFKQSxJQUFGO0FBQVFHLFFBQUFBLGdCQUFnQixFQUFoQkE7QUFBUixPQUFWLEVBQXNDRCxPQUF0QyxFQUErQ0ksSUFBL0MsQ0FEUztBQUFBO0FBSHFCLEdBQW5CO0FBQUEsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBpbnN0YW5jZVN0YXRlIGZyb20gJy4vaW5zdGFuY2Utc3RhdGUnXG5pbXBvcnQgcmVzb3VyY2VzIGZyb20gJy4vcmVzb3VyY2VzJ1xuXG5leHBvcnQgZGVmYXVsdCAod2ViMyk6IG9iamVjdCA9PiAoe1xuICBpbnN0YW5jZVN0YXRlOiAoeyBhZGRyZXNzLCByZWdpc3RyeUNvbnRyYWN0LCBicG1uTW9kZWwgfSkgPT5cbiAgICBpbnN0YW5jZVN0YXRlKHsgd2ViMywgcmVnaXN0cnlDb250cmFjdCwgYnBtbk1vZGVsIH0pKGFkZHJlc3MpLFxuICByZXNvdXJjZXM6ICh7IGFkZHJlc3MsIHJlZ2lzdHJ5Q29udHJhY3QgfSwgeyByb2xlIH0pID0+XG4gICAgcmVzb3VyY2VzKHsgd2ViMywgcmVnaXN0cnlDb250cmFjdCB9KShhZGRyZXNzLCByb2xlKSxcblxufSkiXX0=