"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _repo = require("../repo");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = async ({
  registry,
  _id
}) => _repo.policy.find(_objectSpread({
  registry
}, _id && {
  _id
}));

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvcmVnaXN0cnkvcG9saWNpZXMudHMiXSwibmFtZXMiOlsicmVnaXN0cnkiLCJfaWQiLCJwb2xpY3kiLCJmaW5kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7OztlQUllLE9BQU87QUFBRUEsRUFBQUEsUUFBRjtBQUFZQyxFQUFBQTtBQUFaLENBQVAsS0FDYkMsYUFBT0MsSUFBUDtBQUFjSCxFQUFBQTtBQUFkLEdBQTJCQyxHQUFHLElBQUk7QUFBRUEsRUFBQUE7QUFBRixDQUFsQyxFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgcG9saWN5XG59IGZyb20gJy4uL3JlcG8nXG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jICh7IHJlZ2lzdHJ5LCBfaWQgfSk6IFByb21pc2U8YW55W10+ID0+XG4gIHBvbGljeS5maW5kKHsgcmVnaXN0cnksIC4uLl9pZCAmJiB7IF9pZCB9fSlcbiAgIl19