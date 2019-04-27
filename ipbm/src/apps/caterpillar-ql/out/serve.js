"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _apolloServer = require("apollo-server");

var _debug = _interopRequireDefault(require("debug"));

var _resolvers = _interopRequireDefault(require("./resolvers"));

var _typeDefs = _interopRequireDefault(require("./schema/type-defs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = web3 => {
  // In the most basic sense, the ApolloServer can be started
  // by passing type definitions (typeDefs) and the resolvers
  // responsible for fetching the data for those types.
  const server = new _apolloServer.ApolloServer({
    typeDefs: _typeDefs.default,
    resolvers: (0, _resolvers.default)(web3)
  }); // This `listen` method launches a web-server.  Existing apps
  // can utilize middleware options, which we'll discuss later.

  server.listen({
    port: 6500
  }).then(({
    url
  }) => {
    (0, _debug.default)('catapillarql:serve')(`🚀  Server ready at ${url}`);
  }).catch(ex => {
    (0, _debug.default)('catapillarql:serve')('error', ex);
    global.process.exit(1);
  });
};

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2FwcC9zZXJ2ZS50cyJdLCJuYW1lcyI6WyJ3ZWIzIiwic2VydmVyIiwiQXBvbGxvU2VydmVyIiwidHlwZURlZnMiLCJyZXNvbHZlcnMiLCJsaXN0ZW4iLCJwb3J0IiwidGhlbiIsInVybCIsImNhdGNoIiwiZXgiLCJnbG9iYWwiLCJwcm9jZXNzIiwiZXhpdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztBQUNBOztBQUVBOztBQUNBOzs7O2VBR2dCQSxJQUFELElBQXNCO0FBRW5DO0FBQ0E7QUFDQTtBQUNBLFFBQU1DLE1BQU0sR0FBRyxJQUFJQywwQkFBSixDQUFpQjtBQUM5QkMsSUFBQUEsUUFBUSxFQUFSQSxpQkFEOEI7QUFFOUJDLElBQUFBLFNBQVMsRUFBRSx3QkFBVUosSUFBVjtBQUZtQixHQUFqQixDQUFmLENBTG1DLENBVW5DO0FBQ0E7O0FBQ0FDLEVBQUFBLE1BQU0sQ0FBQ0ksTUFBUCxDQUFjO0FBQ1pDLElBQUFBLElBQUksRUFBRTtBQURNLEdBQWQsRUFHR0MsSUFISCxDQUlJLENBQUM7QUFBRUMsSUFBQUE7QUFBRixHQUFELEtBQW1CO0FBQ2pCLHdCQUFNLG9CQUFOLEVBQTZCLHVCQUFzQkEsR0FBSSxFQUF2RDtBQUNELEdBTkwsRUFRR0MsS0FSSCxDQVNLQyxFQUFELElBQWM7QUFDWix3QkFBTSxvQkFBTixFQUE0QixPQUE1QixFQUFxQ0EsRUFBckM7QUFDQUMsSUFBQUEsTUFBTSxDQUFDQyxPQUFQLENBQWVDLElBQWYsQ0FBb0IsQ0FBcEI7QUFDRCxHQVpMO0FBY0QsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBXZWIzIGZyb20gJ3dlYjMnXG5pbXBvcnQgeyBBcG9sbG9TZXJ2ZXIsIGdxbCB9IGZyb20gJ2Fwb2xsby1zZXJ2ZXInXG5pbXBvcnQgZGVidWcgZnJvbSAnZGVidWcnXG5cbmltcG9ydCByZXNvbHZlcnMgZnJvbSAnLi9yZXNvbHZlcnMnXG5pbXBvcnQgdHlwZURlZnMgZnJvbSAnLi9zY2hlbWEvdHlwZS1kZWZzJ1xuXG5cbmV4cG9ydCBkZWZhdWx0ICh3ZWIzOiBXZWIzKTogdm9pZCA9PiB7XG4gIFxuICAvLyBJbiB0aGUgbW9zdCBiYXNpYyBzZW5zZSwgdGhlIEFwb2xsb1NlcnZlciBjYW4gYmUgc3RhcnRlZFxuICAvLyBieSBwYXNzaW5nIHR5cGUgZGVmaW5pdGlvbnMgKHR5cGVEZWZzKSBhbmQgdGhlIHJlc29sdmVyc1xuICAvLyByZXNwb25zaWJsZSBmb3IgZmV0Y2hpbmcgdGhlIGRhdGEgZm9yIHRob3NlIHR5cGVzLlxuICBjb25zdCBzZXJ2ZXIgPSBuZXcgQXBvbGxvU2VydmVyKHtcbiAgICB0eXBlRGVmcyxcbiAgICByZXNvbHZlcnM6IHJlc29sdmVycyh3ZWIzKSxcbiAgfSk7XG5cbiAgLy8gVGhpcyBgbGlzdGVuYCBtZXRob2QgbGF1bmNoZXMgYSB3ZWItc2VydmVyLiAgRXhpc3RpbmcgYXBwc1xuICAvLyBjYW4gdXRpbGl6ZSBtaWRkbGV3YXJlIG9wdGlvbnMsIHdoaWNoIHdlJ2xsIGRpc2N1c3MgbGF0ZXIuXG4gIHNlcnZlci5saXN0ZW4oe1xuICAgIHBvcnQ6IDY1MDAsXG4gIH0pXG4gICAgLnRoZW4oXG4gICAgICAoeyB1cmwgfSk6IHZvaWQgPT4ge1xuICAgICAgICBkZWJ1ZygnY2F0YXBpbGxhcnFsOnNlcnZlJykoYPCfmoAgIFNlcnZlciByZWFkeSBhdCAke3VybH1gKVxuICAgICAgfSxcbiAgICApXG4gICAgLmNhdGNoKFxuICAgICAgKGV4KTogdm9pZCA9PiB7XG4gICAgICAgIGRlYnVnKCdjYXRhcGlsbGFycWw6c2VydmUnKSgnZXJyb3InLCBleClcbiAgICAgICAgZ2xvYmFsLnByb2Nlc3MuZXhpdCgxKVxuICAgICAgfSxcbiAgICApXG59Il19