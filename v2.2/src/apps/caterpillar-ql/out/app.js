"use strict";

var _web = _interopRequireDefault(require("web3"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _debug = _interopRequireDefault(require("debug"));

var _serve = _interopRequireDefault(require("./serve"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var web3 = new _web["default"]('ws://127.0.0.1:8545');
_mongoose["default"].Promise = global.Promise;

_mongoose["default"].connect('mongodb://localhost:27017/caterpillarRepo').then(function () {
  (0, _debug["default"])('caterpillarql:app')('Conectado a MongoDB');
  (0, _serve["default"])(web3);
})["catch"](function (ex) {
  (0, _debug["default"])('caterpillarql:fatal')('Mongo db connection fail', ex);
  global.process.exit(1);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2FwcC9hcHAudHMiXSwibmFtZXMiOlsid2ViMyIsIldlYjMiLCJtb25nb29zZSIsIlByb21pc2UiLCJnbG9iYWwiLCJjb25uZWN0IiwidGhlbiIsImV4IiwicHJvY2VzcyIsImV4aXQiXSwibWFwcGluZ3MiOiI7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7QUFHQSxJQUFNQSxJQUFJLEdBQUcsSUFBSUMsZUFBSixDQUFTLHFCQUFULENBQWI7QUFFTUMsb0JBQU4sQ0FBZ0JDLE9BQWhCLEdBQTBCQyxNQUFNLENBQUNELE9BQWpDOztBQUVBRCxxQkFBU0csT0FBVCxDQUFpQiwyQ0FBakIsRUFDR0MsSUFESCxDQUVJLFlBQU07QUFDSix5QkFBTSxtQkFBTixFQUEyQixxQkFBM0I7QUFDQSx5QkFBTU4sSUFBTjtBQUNELENBTEwsV0FRSSxVQUFDTyxFQUFELEVBQVE7QUFDTix5QkFBTSxxQkFBTixFQUE2QiwwQkFBN0IsRUFBeURBLEVBQXpEO0FBQ0FILEVBQUFBLE1BQU0sQ0FBQ0ksT0FBUCxDQUFlQyxJQUFmLENBQW9CLENBQXBCO0FBQ0QsQ0FYTCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBXZWIzIGZyb20gJ3dlYjMnXG5pbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnXG5pbXBvcnQgZGVidWcgZnJvbSAnZGVidWcnXG5cbmltcG9ydCBzZXJ2ZSBmcm9tICcuL3NlcnZlJ1xuXG5cbmNvbnN0IHdlYjMgPSBuZXcgV2ViMygnd3M6Ly8xMjcuMC4wLjE6ODU0NScpO1xuXG4oPGFueT5tb25nb29zZSkuUHJvbWlzZSA9IGdsb2JhbC5Qcm9taXNlO1xuXG5tb25nb29zZS5jb25uZWN0KCdtb25nb2RiOi8vbG9jYWxob3N0OjI3MDE3L2NhdGVycGlsbGFyUmVwbycpXG4gIC50aGVuKFxuICAgICgpID0+IHtcbiAgICAgIGRlYnVnKCdjYXRlcnBpbGxhcnFsOmFwcCcpKCdDb25lY3RhZG8gYSBNb25nb0RCJylcbiAgICAgIHNlcnZlKHdlYjMpXG4gICAgfVxuICApXG4gIC5jYXRjaChcbiAgICAoZXgpID0+IHtcbiAgICAgIGRlYnVnKCdjYXRlcnBpbGxhcnFsOmZhdGFsJykoJ01vbmdvIGRiIGNvbm5lY3Rpb24gZmFpbCcsIGV4KVxuICAgICAgZ2xvYmFsLnByb2Nlc3MuZXhpdCgxKVxuICAgIH0gXG4gIClcbiJdfQ==