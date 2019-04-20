"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _repo = require("../repo");

var _default = async ({
  web3,
  address
}) => {
  const [{
    abi
  }] = await _repo.registry.find({
    address
  });

  if (abi) {
    const c = new web3.eth.Contract(JSON.parse(abi), address);
    c.transactionConfirmationBlocks = 1;
    return c;
  }
};

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvdXRpbC9yZWdpc3RyeS1jb250cmFjdC50cyJdLCJuYW1lcyI6WyJ3ZWIzIiwiYWRkcmVzcyIsImFiaSIsInJlZ2lzdHJ5IiwiZmluZCIsImMiLCJldGgiLCJDb250cmFjdCIsIkpTT04iLCJwYXJzZSIsInRyYW5zYWN0aW9uQ29uZmlybWF0aW9uQmxvY2tzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O2VBRWUsT0FBTztBQUNwQkEsRUFBQUEsSUFEb0I7QUFFcEJDLEVBQUFBO0FBRm9CLENBQVAsS0FHSztBQUNsQixRQUFNLENBQUM7QUFBRUMsSUFBQUE7QUFBRixHQUFELElBQVksTUFBTUMsZUFDckJDLElBRHFCLENBQ2hCO0FBQUVILElBQUFBO0FBQUYsR0FEZ0IsQ0FBeEI7O0FBRUEsTUFBSUMsR0FBSixFQUFTO0FBQ1AsVUFBTUcsQ0FBQyxHQUFJLElBQUlMLElBQUksQ0FBQ00sR0FBTCxDQUFTQyxRQUFiLENBQXNCQyxJQUFJLENBQUNDLEtBQUwsQ0FBV1AsR0FBWCxDQUF0QixFQUF1Q0QsT0FBdkMsQ0FBWDtBQUNBSSxJQUFBQSxDQUFDLENBQUNLLDZCQUFGLEdBQWtDLENBQWxDO0FBQ0EsV0FBT0wsQ0FBUDtBQUNEO0FBQ0YsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHJlZ2lzdHJ5IH0gZnJvbSAnLi4vcmVwbydcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgKHtcbiAgd2ViMyxcbiAgYWRkcmVzcyxcbn0pOiBQcm9taXNlPGFueT4gPT4ge1xuICBjb25zdCBbeyBhYmkgfV0gPSBhd2FpdCByZWdpc3RyeVxuICAgIC5maW5kKHsgYWRkcmVzcyB9KVxuICBpZiAoYWJpKSB7XG4gICAgY29uc3QgYyA9ICBuZXcgd2ViMy5ldGguQ29udHJhY3QoSlNPTi5wYXJzZShhYmkpLCBhZGRyZXNzKVxuICAgIGMudHJhbnNhY3Rpb25Db25maXJtYXRpb25CbG9ja3MgPSAxXG4gICAgcmV0dXJuIGNcbiAgfVxufSJdfQ==