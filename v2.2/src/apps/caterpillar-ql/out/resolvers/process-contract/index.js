"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _instanceState = _interopRequireDefault(require("./instance-state"));

var _resources = _interopRequireDefault(require("./resources"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = web3 => ({
  instanceState: ({
    address,
    registryContract,
    bpmnModel
  }) => (0, _instanceState.default)({
    web3,
    registryContract,
    bpmnModel
  })(address),
  resources: ({
    address,
    registryContract
  }, {
    role
  }) => (0, _resources.default)({
    web3,
    registryContract
  })(address, role)
});

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvcHJvY2Vzcy1jb250cmFjdC9pbmRleC50cyJdLCJuYW1lcyI6WyJ3ZWIzIiwiaW5zdGFuY2VTdGF0ZSIsImFkZHJlc3MiLCJyZWdpc3RyeUNvbnRyYWN0IiwiYnBtbk1vZGVsIiwicmVzb3VyY2VzIiwicm9sZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOzs7O2VBRWdCQSxJQUFELEtBQW1CO0FBQ2hDQyxFQUFBQSxhQUFhLEVBQUUsQ0FBQztBQUFFQyxJQUFBQSxPQUFGO0FBQVdDLElBQUFBLGdCQUFYO0FBQTZCQyxJQUFBQTtBQUE3QixHQUFELEtBQ2IsNEJBQWM7QUFBRUosSUFBQUEsSUFBRjtBQUFRRyxJQUFBQSxnQkFBUjtBQUEwQkMsSUFBQUE7QUFBMUIsR0FBZCxFQUFxREYsT0FBckQsQ0FGOEI7QUFHaENHLEVBQUFBLFNBQVMsRUFBRSxDQUFDO0FBQUVILElBQUFBLE9BQUY7QUFBV0MsSUFBQUE7QUFBWCxHQUFELEVBQWdDO0FBQUVHLElBQUFBO0FBQUYsR0FBaEMsS0FDVCx3QkFBVTtBQUFFTixJQUFBQSxJQUFGO0FBQVFHLElBQUFBO0FBQVIsR0FBVixFQUFzQ0QsT0FBdEMsRUFBK0NJLElBQS9DO0FBSjhCLENBQW5CLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgaW5zdGFuY2VTdGF0ZSBmcm9tICcuL2luc3RhbmNlLXN0YXRlJ1xuaW1wb3J0IHJlc291cmNlcyBmcm9tICcuL3Jlc291cmNlcydcblxuZXhwb3J0IGRlZmF1bHQgKHdlYjMpOiBvYmplY3QgPT4gKHtcbiAgaW5zdGFuY2VTdGF0ZTogKHsgYWRkcmVzcywgcmVnaXN0cnlDb250cmFjdCwgYnBtbk1vZGVsIH0pID0+XG4gICAgaW5zdGFuY2VTdGF0ZSh7IHdlYjMsIHJlZ2lzdHJ5Q29udHJhY3QsIGJwbW5Nb2RlbCB9KShhZGRyZXNzKSxcbiAgcmVzb3VyY2VzOiAoeyBhZGRyZXNzLCByZWdpc3RyeUNvbnRyYWN0IH0sIHsgcm9sZSB9KSA9PlxuICAgIHJlc291cmNlcyh7IHdlYjMsIHJlZ2lzdHJ5Q29udHJhY3QgfSkoYWRkcmVzcywgcm9sZSksXG5cbn0pIl19