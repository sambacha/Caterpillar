"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _solc = _interopRequireDefault(require("solc"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = sources => JSON.parse(_solc.default.compile(JSON.stringify({
  language: 'Solidity',
  sources,
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
})));

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvdXRpbC9jb21waWxlLnRzIl0sIm5hbWVzIjpbInNvdXJjZXMiLCJKU09OIiwicGFyc2UiLCJzb2xjIiwiY29tcGlsZSIsInN0cmluZ2lmeSIsImxhbmd1YWdlIiwic2V0dGluZ3MiLCJvdXRwdXRTZWxlY3Rpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7OztlQUVlQSxPQUFPLElBQUlDLElBQUksQ0FBQ0MsS0FBTCxDQUN4QkMsY0FBS0MsT0FBTCxDQUNFSCxJQUFJLENBQUNJLFNBQUwsQ0FDRTtBQUNFQyxFQUFBQSxRQUFRLEVBQUUsVUFEWjtBQUVFTixFQUFBQSxPQUZGO0FBR0VPLEVBQUFBLFFBQVEsRUFBRTtBQUNSQyxJQUFBQSxlQUFlLEVBQUU7QUFDZixXQUFLO0FBQ0gsYUFBSyxDQUFDLEdBQUQ7QUFERjtBQURVO0FBRFQ7QUFIWixDQURGLENBREYsQ0FEd0IsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBzb2xjIGZyb20gJ3NvbGMnXG5cbmV4cG9ydCBkZWZhdWx0IHNvdXJjZXMgPT4gSlNPTi5wYXJzZShcbiAgc29sYy5jb21waWxlKFxuICAgIEpTT04uc3RyaW5naWZ5KFxuICAgICAge1xuICAgICAgICBsYW5ndWFnZTogJ1NvbGlkaXR5JyxcbiAgICAgICAgc291cmNlcyxcbiAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICBvdXRwdXRTZWxlY3Rpb246IHtcbiAgICAgICAgICAgICcqJzoge1xuICAgICAgICAgICAgICAnKic6IFsnKiddXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICksXG4gICksXG4pXG4iXX0=