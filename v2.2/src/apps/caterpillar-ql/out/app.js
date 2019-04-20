"use strict";

var _web = _interopRequireDefault(require("web3"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _debug = _interopRequireDefault(require("debug"));

var _serve = _interopRequireDefault(require("./serve"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const web3 = new _web.default('ws://127.0.0.1:8545');
_mongoose.default.Promise = global.Promise;

_mongoose.default.connect('mongodb://localhost:27017/caterpillarRepo').then(() => {
  (0, _debug.default)('caterpillarql:app')('Conectado a MongoDB');
  (0, _serve.default)(web3);
}).catch(ex => {
  (0, _debug.default)('caterpillarql:fatal')('Mongo db connection fail', ex);
  global.process.exit(1);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2FwcC9hcHAudHMiXSwibmFtZXMiOlsid2ViMyIsIldlYjMiLCJtb25nb29zZSIsIlByb21pc2UiLCJnbG9iYWwiLCJjb25uZWN0IiwidGhlbiIsImNhdGNoIiwiZXgiLCJwcm9jZXNzIiwiZXhpdCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7QUFDQTs7QUFDQTs7QUFFQTs7OztBQUdBLE1BQU1BLElBQUksR0FBRyxJQUFJQyxZQUFKLENBQVMscUJBQVQsQ0FBYjtBQUVNQyxpQkFBTixDQUFnQkMsT0FBaEIsR0FBMEJDLE1BQU0sQ0FBQ0QsT0FBakM7O0FBRUFELGtCQUFTRyxPQUFULENBQWlCLDJDQUFqQixFQUNHQyxJQURILENBRUksTUFBTTtBQUNKLHNCQUFNLG1CQUFOLEVBQTJCLHFCQUEzQjtBQUNBLHNCQUFNTixJQUFOO0FBQ0QsQ0FMTCxFQU9HTyxLQVBILENBUUtDLEVBQUQsSUFBUTtBQUNOLHNCQUFNLHFCQUFOLEVBQTZCLDBCQUE3QixFQUF5REEsRUFBekQ7QUFDQUosRUFBQUEsTUFBTSxDQUFDSyxPQUFQLENBQWVDLElBQWYsQ0FBb0IsQ0FBcEI7QUFDRCxDQVhMIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFdlYjMgZnJvbSAnd2ViMydcbmltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSdcbmltcG9ydCBkZWJ1ZyBmcm9tICdkZWJ1ZydcblxuaW1wb3J0IHNlcnZlIGZyb20gJy4vc2VydmUnXG5cblxuY29uc3Qgd2ViMyA9IG5ldyBXZWIzKCd3czovLzEyNy4wLjAuMTo4NTQ1Jyk7XG5cbig8YW55Pm1vbmdvb3NlKS5Qcm9taXNlID0gZ2xvYmFsLlByb21pc2U7XG5cbm1vbmdvb3NlLmNvbm5lY3QoJ21vbmdvZGI6Ly9sb2NhbGhvc3Q6MjcwMTcvY2F0ZXJwaWxsYXJSZXBvJylcbiAgLnRoZW4oXG4gICAgKCkgPT4ge1xuICAgICAgZGVidWcoJ2NhdGVycGlsbGFycWw6YXBwJykoJ0NvbmVjdGFkbyBhIE1vbmdvREInKVxuICAgICAgc2VydmUod2ViMylcbiAgICB9XG4gIClcbiAgLmNhdGNoKFxuICAgIChleCkgPT4ge1xuICAgICAgZGVidWcoJ2NhdGVycGlsbGFycWw6ZmF0YWwnKSgnTW9uZ28gZGIgY29ubmVjdGlvbiBmYWlsJywgZXgpXG4gICAgICBnbG9iYWwucHJvY2Vzcy5leGl0KDEpXG4gICAgfSBcbiAgKVxuIl19