"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class StatusError extends Error {
  constructor(message, status) {
    super(message);

    _defineProperty(this, "status", void 0);

    this.status = status;
  }

}

exports.default = StatusError;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2FwcC9yZXNvbHZlcnMvU3RhdHVzLUVycm9yLnRzIl0sIm5hbWVzIjpbIlN0YXR1c0Vycm9yIiwiRXJyb3IiLCJjb25zdHJ1Y3RvciIsIm1lc3NhZ2UiLCJzdGF0dXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFlLE1BQU1BLFdBQU4sU0FBMEJDLEtBQTFCLENBQWdDO0FBRTdDQyxFQUFBQSxXQUFXLENBQUNDLE9BQUQsRUFBa0JDLE1BQWxCLEVBQXdDO0FBQ2pELFVBQU1ELE9BQU47O0FBRGlEOztBQUVqRCxTQUFLQyxNQUFMLEdBQWNBLE1BQWQ7QUFDRDs7QUFMNEMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBjbGFzcyBTdGF0dXNFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgc3RhdHVzOiBudW1iZXI7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2U6IHN0cmluZywgc3RhdHVzOiBudW1iZXIpOiB2b2lkIHtcbiAgICBzdXBlcihtZXNzYWdlKVxuICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzXG4gIH1cbn0iXX0=