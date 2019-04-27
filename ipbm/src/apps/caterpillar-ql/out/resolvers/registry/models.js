"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _debug = _interopRequireDefault(require("debug"));

var _repo = require("../repo");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = async ({
  web3,
  contract,
  id
}) => {
  if (contract) {
    const models = await _repo.process.find(_objectSpread({
      bpmnModel: {
        $ne: 'empty'
      }
    }, id && {
      _id: id
    }));
    const children = await Promise.all(models.map(({
      _id
    }) => {
      (0, _debug.default)('caterpillarql:registry.models')('_id', {
        _id,
        is: web3.utils.fromAscii(_id.toString())
      });
      return contract.childrenFor({
        id: web3.utils.fromAscii(_id.toString()),
        index: 0
      }).then(x => x === _id.toString() && _id.toString());
    }));
    (0, _debug.default)('caterpillarql:registry.models')('filtered-children', {
      children
    });
    return models.filter(({
      _id
    }) => children.includes(_id.toString())).map(({
      _id,
      rootProcessName: name,
      bpmnModel: bpmn,
      solidityCode: solidity
    }) => ({
      id: _id.toString(),
      name,
      bpmn,
      solidity,
      registryContract: contract
    }));
  }
};

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvcmVnaXN0cnkvbW9kZWxzLnRzIl0sIm5hbWVzIjpbIndlYjMiLCJjb250cmFjdCIsImlkIiwibW9kZWxzIiwicHJvY2VzcyIsImZpbmQiLCJicG1uTW9kZWwiLCIkbmUiLCJfaWQiLCJjaGlsZHJlbiIsIlByb21pc2UiLCJhbGwiLCJtYXAiLCJpcyIsInV0aWxzIiwiZnJvbUFzY2lpIiwidG9TdHJpbmciLCJjaGlsZHJlbkZvciIsImluZGV4IiwidGhlbiIsIngiLCJmaWx0ZXIiLCJpbmNsdWRlcyIsInJvb3RQcm9jZXNzTmFtZSIsIm5hbWUiLCJicG1uIiwic29saWRpdHlDb2RlIiwic29saWRpdHkiLCJyZWdpc3RyeUNvbnRyYWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7Ozs7Ozs7O2VBSWUsT0FDYjtBQUNFQSxFQUFBQSxJQURGO0FBRUVDLEVBQUFBLFFBRkY7QUFHRUMsRUFBQUE7QUFIRixDQURhLEtBVU07QUFDbkIsTUFBSUQsUUFBSixFQUFjO0FBQ1osVUFBTUUsTUFBYSxHQUFHLE1BQU1DLGNBQ3pCQyxJQUR5QjtBQUd0QkMsTUFBQUEsU0FBUyxFQUFFO0FBQ1RDLFFBQUFBLEdBQUcsRUFBRTtBQURJO0FBSFcsT0FNbkJMLEVBQUUsSUFBSTtBQUNQTSxNQUFBQSxHQUFHLEVBQUVOO0FBREUsS0FOYSxFQUE1QjtBQVlBLFVBQU1PLFFBQVEsR0FBRyxNQUFNQyxPQUFPLENBQUNDLEdBQVIsQ0FDckJSLE1BQU0sQ0FDSFMsR0FESCxDQUVJLENBQUM7QUFBRUosTUFBQUE7QUFBRixLQUFELEtBQThCO0FBQzVCLDBCQUFNLCtCQUFOLEVBQXVDLEtBQXZDLEVBQTZDO0FBQUVBLFFBQUFBLEdBQUY7QUFBT0ssUUFBQUEsRUFBRSxFQUFFYixJQUFJLENBQUNjLEtBQUwsQ0FBV0MsU0FBWCxDQUFxQlAsR0FBRyxDQUFDUSxRQUFKLEVBQXJCO0FBQVgsT0FBN0M7QUFDQSxhQUFPZixRQUFRLENBQ1pnQixXQURJLENBQ1E7QUFDWGYsUUFBQUEsRUFBRSxFQUFFRixJQUFJLENBQUNjLEtBQUwsQ0FBV0MsU0FBWCxDQUFxQlAsR0FBRyxDQUFDUSxRQUFKLEVBQXJCLENBRE87QUFFWEUsUUFBQUEsS0FBSyxFQUFFO0FBRkksT0FEUixFQUtKQyxJQUxJLENBTUZDLENBQUQsSUFDRUEsQ0FBQyxLQUFLWixHQUFHLENBQUNRLFFBQUosRUFBTixJQUNFUixHQUFHLENBQUNRLFFBQUosRUFSRCxDQUFQO0FBVUQsS0FkTCxDQURxQixDQUF2QjtBQWtCQSx3QkFBTSwrQkFBTixFQUF1QyxtQkFBdkMsRUFBNEQ7QUFBRVAsTUFBQUE7QUFBRixLQUE1RDtBQUNBLFdBQU9OLE1BQU0sQ0FDVmtCLE1BREksQ0FFSCxDQUFDO0FBQ0NiLE1BQUFBO0FBREQsS0FBRCxLQUVlQyxRQUFRLENBQUNhLFFBQVQsQ0FBa0JkLEdBQUcsQ0FBQ1EsUUFBSixFQUFsQixDQUpaLEVBTUpKLEdBTkksQ0FPSCxDQUFDO0FBQ0NKLE1BQUFBLEdBREQ7QUFFQ2UsTUFBQUEsZUFBZSxFQUFFQyxJQUZsQjtBQUdDbEIsTUFBQUEsU0FBUyxFQUFFbUIsSUFIWjtBQUlDQyxNQUFBQSxZQUFZLEVBQUVDO0FBSmYsS0FBRCxNQUtlO0FBQ2J6QixNQUFBQSxFQUFFLEVBQUVNLEdBQUcsQ0FBQ1EsUUFBSixFQURTO0FBRWJRLE1BQUFBLElBRmE7QUFHYkMsTUFBQUEsSUFIYTtBQUliRSxNQUFBQSxRQUphO0FBS2JDLE1BQUFBLGdCQUFnQixFQUFFM0I7QUFMTCxLQUxmLENBUEcsQ0FBUDtBQW9CRDtBQUNGLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZGVidWcgZnJvbSAnZGVidWcnXG5pbXBvcnQgeyBwcm9jZXNzIH0gZnJvbSAnLi4vcmVwbydcbmltcG9ydCBoZXhUb0lkIGZyb20gJy4uL3V0aWwvaGV4LXRvLWlkJ1xuaW1wb3J0IFdlYjMgZnJvbSAnd2ViMydcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgKFxuICB7XG4gICAgd2ViMyxcbiAgICBjb250cmFjdCxcbiAgICBpZCxcbiAgfToge1xuICAgIHdlYjM6IFdlYjMsXG4gICAgY29udHJhY3Q6IGltcG9ydCgnY2F0ZXJwaWxsYXItbGliJykuUmVnaXN0cnlDb250cmFjdCxcbiAgICBpZDogU3RyaW5nLFxuICB9LFxuKTogUHJvbWlzZTxhbnlbXT4gPT4ge1xuICBpZiAoY29udHJhY3QpIHtcbiAgICBjb25zdCBtb2RlbHM6IGFueVtdID0gYXdhaXQgcHJvY2Vzc1xuICAgICAgLmZpbmQoXG4gICAgICAgIHtcbiAgICAgICAgICBicG1uTW9kZWw6IHtcbiAgICAgICAgICAgICRuZTogJ2VtcHR5JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIC4uLmlkICYmIHtcbiAgICAgICAgICAgIF9pZDogaWQsXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgKVxuICAgIFxuICAgIGNvbnN0IGNoaWxkcmVuID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICBtb2RlbHNcbiAgICAgICAgLm1hcChcbiAgICAgICAgICAoeyBfaWQgfSk6IFByb21pc2U8c3RyaW5nPiA9PiB7XG4gICAgICAgICAgICBkZWJ1ZygnY2F0ZXJwaWxsYXJxbDpyZWdpc3RyeS5tb2RlbHMnKSgnX2lkJyx7IF9pZCwgaXM6IHdlYjMudXRpbHMuZnJvbUFzY2lpKF9pZC50b1N0cmluZygpKSB9KVxuICAgICAgICAgICAgcmV0dXJuIGNvbnRyYWN0XG4gICAgICAgICAgICAgIC5jaGlsZHJlbkZvcih7XG4gICAgICAgICAgICAgICAgaWQ6IHdlYjMudXRpbHMuZnJvbUFzY2lpKF9pZC50b1N0cmluZygpKSxcbiAgICAgICAgICAgICAgICBpbmRleDogMCxcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLnRoZW4oXG4gICAgICAgICAgICAgICAgKHgpOiBzdHJpbmcgPT5cbiAgICAgICAgICAgICAgICAgIHggPT09IF9pZC50b1N0cmluZygpICYmXG4gICAgICAgICAgICAgICAgICAgIF9pZC50b1N0cmluZygpLFxuICAgICAgICAgICAgICApXG4gICAgICAgICAgfSxcbiAgICAgICAgKVxuICAgIClcbiAgICBkZWJ1ZygnY2F0ZXJwaWxsYXJxbDpyZWdpc3RyeS5tb2RlbHMnKSgnZmlsdGVyZWQtY2hpbGRyZW4nLCB7IGNoaWxkcmVuICB9KVxuICAgIHJldHVybiBtb2RlbHNcbiAgICAgIC5maWx0ZXIoXG4gICAgICAgICh7XG4gICAgICAgICAgX2lkLFxuICAgICAgICB9KTogYm9vbGVhbiA9PiBjaGlsZHJlbi5pbmNsdWRlcyhfaWQudG9TdHJpbmcoKSlcbiAgICAgIClcbiAgICAgIC5tYXAoXG4gICAgICAgICh7XG4gICAgICAgICAgX2lkLFxuICAgICAgICAgIHJvb3RQcm9jZXNzTmFtZTogbmFtZSxcbiAgICAgICAgICBicG1uTW9kZWw6IGJwbW4sXG4gICAgICAgICAgc29saWRpdHlDb2RlOiBzb2xpZGl0eSxcbiAgICAgICAgfSk6IG9iamVjdCA9PiAoe1xuICAgICAgICAgIGlkOiBfaWQudG9TdHJpbmcoKSxcbiAgICAgICAgICBuYW1lLFxuICAgICAgICAgIGJwbW4sXG4gICAgICAgICAgc29saWRpdHksXG4gICAgICAgICAgcmVnaXN0cnlDb250cmFjdDogY29udHJhY3RcbiAgICAgICAgfSlcbiAgICAgIClcbiAgfVxufVxuIl19