"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _registry = _interopRequireDefault(require("./registry"));

var _model = _interopRequireDefault(require("./model"));

var _policy = _interopRequireDefault(require("./policy"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = web3 => ({
  registry: async () => (0, _registry.default)({
    web3
  }),
  model: async (_, {
    bpmn,
    registry
  }) => (0, _model.default)({
    bpmn,
    registry,
    web3
  }),
  policy: async (_, {
    model,
    registry
  }) => (0, _policy.default)({
    model,
    registry,
    web3
  })
});

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvbXV0YXRpb24vaW5kZXgudHMiXSwibmFtZXMiOlsid2ViMyIsInJlZ2lzdHJ5IiwibW9kZWwiLCJfIiwiYnBtbiIsInBvbGljeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOzs7O2VBRWdCQSxJQUFELEtBQW1CO0FBQ2hDQyxFQUFBQSxRQUFRLEVBQUUsWUFDUix1QkFBUztBQUFFRCxJQUFBQTtBQUFGLEdBQVQsQ0FGOEI7QUFHOUJFLEVBQUFBLEtBQUssRUFBRSxPQUNMQyxDQURLLEVBRUw7QUFDRUMsSUFBQUEsSUFERjtBQUVFSCxJQUFBQTtBQUZGLEdBRkssS0FPSCxvQkFBTTtBQUNKRyxJQUFBQSxJQURJO0FBRUpILElBQUFBLFFBRkk7QUFHSkQsSUFBQUE7QUFISSxHQUFOLENBVjBCO0FBZTlCSyxFQUFBQSxNQUFNLEVBQUUsT0FDSkYsQ0FESSxFQUVKO0FBQ0VELElBQUFBLEtBREY7QUFFRUQsSUFBQUE7QUFGRixHQUZJLEtBT0YscUJBQU87QUFDTEMsSUFBQUEsS0FESztBQUVMRCxJQUFBQSxRQUZLO0FBR0xELElBQUFBO0FBSEssR0FBUDtBQXRCd0IsQ0FBbkIsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCByZWdpc3RyeSBmcm9tICcuL3JlZ2lzdHJ5J1xuaW1wb3J0IG1vZGVsIGZyb20gJy4vbW9kZWwnXG5pbXBvcnQgcG9saWN5IGZyb20gJy4vcG9saWN5J1xuXG5leHBvcnQgZGVmYXVsdCAod2ViMyk6IG9iamVjdCA9PiAoe1xuICByZWdpc3RyeTogYXN5bmMgKCk6IFByb21pc2U8YW55PiA9PlxuICAgIHJlZ2lzdHJ5KHsgd2ViMyB9KSxcbiAgICBtb2RlbDogYXN5bmMgKFxuICAgICAgXyxcbiAgICAgIHtcbiAgICAgICAgYnBtbixcbiAgICAgICAgcmVnaXN0cnksXG4gICAgICB9LFxuICAgICk6UHJvbWlzZTxhbnk+ID0+XG4gICAgICAgIG1vZGVsKHtcbiAgICAgICAgICBicG1uLFxuICAgICAgICAgIHJlZ2lzdHJ5LFxuICAgICAgICAgIHdlYjMsXG4gICAgICAgIH0pLFxuICAgIHBvbGljeTogYXN5bmMgKFxuICAgICAgICBfLFxuICAgICAgICB7XG4gICAgICAgICAgbW9kZWwsXG4gICAgICAgICAgcmVnaXN0cnksXG4gICAgICAgIH0sXG4gICAgICApOlByb21pc2U8YW55PiA9PlxuICAgICAgICAgIHBvbGljeSh7XG4gICAgICAgICAgICBtb2RlbCxcbiAgICAgICAgICAgIHJlZ2lzdHJ5LFxuICAgICAgICAgICAgd2ViMyxcbiAgICAgICAgICB9KSxcbn0pIl19