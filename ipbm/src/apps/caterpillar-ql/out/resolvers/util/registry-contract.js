"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _caterpillarLib = require("caterpillar-lib");

var _repo = require("../repo");

var _hexToId = _interopRequireDefault(require("./hex-to-id"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = async ({
  web3,
  address
}) => _repo.registry.find({
  address
}).then(([r]) => r).then((0, _caterpillarLib.registryContract)({
  hexToId: (0, _hexToId.default)(web3),
  web3
}));

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvdXRpbC9yZWdpc3RyeS1jb250cmFjdC50cyJdLCJuYW1lcyI6WyJ3ZWIzIiwiYWRkcmVzcyIsInJlZ2lzdHJ5IiwiZmluZCIsInRoZW4iLCJyIiwiaGV4VG9JZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOzs7O2VBRWUsT0FBTztBQUNwQkEsRUFBQUEsSUFEb0I7QUFFcEJDLEVBQUFBO0FBRm9CLENBQVAsS0FJYkMsZUFDR0MsSUFESCxDQUNRO0FBQUVGLEVBQUFBO0FBQUYsQ0FEUixFQUVHRyxJQUZILENBRVEsQ0FBQyxDQUFDQyxDQUFELENBQUQsS0FBU0EsQ0FGakIsRUFHR0QsSUFISCxDQUlJLHNDQUFpQjtBQUNmRSxFQUFBQSxPQUFPLEVBQUUsc0JBQVFOLElBQVIsQ0FETTtBQUVmQSxFQUFBQTtBQUZlLENBQWpCLENBSkosQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHJlZ2lzdHJ5Q29udHJhY3QgfSBmcm9tICdjYXRlcnBpbGxhci1saWInXG5pbXBvcnQgeyByZWdpc3RyeSB9IGZyb20gJy4uL3JlcG8nXG5pbXBvcnQgaGV4VG9JZCBmcm9tICcuL2hleC10by1pZCdcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgKHtcbiAgd2ViMyxcbiAgYWRkcmVzcyxcbn0pID0+XG4gIHJlZ2lzdHJ5XG4gICAgLmZpbmQoeyBhZGRyZXNzIH0pXG4gICAgLnRoZW4oKFtyXSkgPT4gcilcbiAgICAudGhlbihcbiAgICAgIHJlZ2lzdHJ5Q29udHJhY3Qoe1xuICAgICAgICBoZXhUb0lkOiBoZXhUb0lkKHdlYjMpLFxuICAgICAgICB3ZWIzLFxuICAgICAgfSksXG4gICAgKSJdfQ==