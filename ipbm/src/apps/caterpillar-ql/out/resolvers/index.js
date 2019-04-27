"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mutation = _interopRequireDefault(require("./mutation"));

var _query = _interopRequireDefault(require("./query"));

var _processContract = _interopRequireDefault(require("./process-contract"));

var _registry = _interopRequireDefault(require("./registry"));

var _model = _interopRequireDefault(require("./model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = web3 => ({
  Mutation: (0, _mutation.default)(web3),
  Query: (0, _query.default)(web3),
  ProcessContract: (0, _processContract.default)(web3),
  Registry: (0, _registry.default)(web3),
  Model: (0, _model.default)(web3)
});

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2FwcC9yZXNvbHZlcnMvaW5kZXgudHMiXSwibmFtZXMiOlsid2ViMyIsIk11dGF0aW9uIiwiUXVlcnkiLCJQcm9jZXNzQ29udHJhY3QiLCJSZWdpc3RyeSIsIk1vZGVsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7ZUFFZ0JBLElBQUQsS0FBbUI7QUFDaENDLEVBQUFBLFFBQVEsRUFBRSx1QkFBU0QsSUFBVCxDQURzQjtBQUVoQ0UsRUFBQUEsS0FBSyxFQUFFLG9CQUFNRixJQUFOLENBRnlCO0FBR2hDRyxFQUFBQSxlQUFlLEVBQUUsOEJBQWdCSCxJQUFoQixDQUhlO0FBSWhDSSxFQUFBQSxRQUFRLEVBQUUsdUJBQVNKLElBQVQsQ0FKc0I7QUFLaENLLEVBQUFBLEtBQUssRUFBRSxvQkFBTUwsSUFBTjtBQUx5QixDQUFuQixDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG11dGF0aW9uIGZyb20gJy4vbXV0YXRpb24nXG5pbXBvcnQgcXVlcnkgZnJvbSAnLi9xdWVyeSdcbmltcG9ydCBwcm9jZXNzQ29udHJhY3QgZnJvbSAnLi9wcm9jZXNzLWNvbnRyYWN0J1xuaW1wb3J0IHJlZ2lzdHJ5IGZyb20gJy4vcmVnaXN0cnknXG5pbXBvcnQgbW9kZWwgZnJvbSAnLi9tb2RlbCdcblxuZXhwb3J0IGRlZmF1bHQgKHdlYjMpOiBvYmplY3QgPT4gKHtcbiAgTXV0YXRpb246IG11dGF0aW9uKHdlYjMpLFxuICBRdWVyeTogcXVlcnkod2ViMyksXG4gIFByb2Nlc3NDb250cmFjdDogcHJvY2Vzc0NvbnRyYWN0KHdlYjMpLFxuICBSZWdpc3RyeTogcmVnaXN0cnkod2ViMyksXG4gIE1vZGVsOiBtb2RlbCh3ZWIzKSxcbn0pXG4iXX0=