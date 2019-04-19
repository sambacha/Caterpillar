"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mutation = _interopRequireDefault(require("./mutation"));

var _query = _interopRequireDefault(require("./query"));

var _processContract = _interopRequireDefault(require("./process-contract"));

var _registry = _interopRequireDefault(require("./registry"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = function _default(web3) {
  return {
    Mutation: (0, _mutation["default"])(web3),
    Query: (0, _query["default"])(web3),
    ProcessContract: (0, _processContract["default"])(web3),
    Registry: (0, _registry["default"])(web3)
  };
};

exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2FwcC9yZXNvbHZlcnMvaW5kZXgudHMiXSwibmFtZXMiOlsid2ViMyIsIk11dGF0aW9uIiwiUXVlcnkiLCJQcm9jZXNzQ29udHJhY3QiLCJSZWdpc3RyeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOzs7O2VBRWUsa0JBQUNBLElBQUQ7QUFBQSxTQUFtQjtBQUNoQ0MsSUFBQUEsUUFBUSxFQUFFLDBCQUFTRCxJQUFULENBRHNCO0FBRWhDRSxJQUFBQSxLQUFLLEVBQUUsdUJBQU1GLElBQU4sQ0FGeUI7QUFHaENHLElBQUFBLGVBQWUsRUFBRSxpQ0FBZ0JILElBQWhCLENBSGU7QUFJaENJLElBQUFBLFFBQVEsRUFBRSwwQkFBU0osSUFBVDtBQUpzQixHQUFuQjtBQUFBLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbXV0YXRpb24gZnJvbSAnLi9tdXRhdGlvbidcbmltcG9ydCBxdWVyeSBmcm9tICcuL3F1ZXJ5J1xuaW1wb3J0IHByb2Nlc3NDb250cmFjdCBmcm9tICcuL3Byb2Nlc3MtY29udHJhY3QnXG5pbXBvcnQgcmVnaXN0cnkgZnJvbSAnLi9yZWdpc3RyeSdcblxuZXhwb3J0IGRlZmF1bHQgKHdlYjMpOiBvYmplY3QgPT4gKHtcbiAgTXV0YXRpb246IG11dGF0aW9uKHdlYjMpLFxuICBRdWVyeTogcXVlcnkod2ViMyksXG4gIFByb2Nlc3NDb250cmFjdDogcHJvY2Vzc0NvbnRyYWN0KHdlYjMpLFxuICBSZWdpc3RyeTogcmVnaXN0cnkod2ViMyksXG59KVxuIl19