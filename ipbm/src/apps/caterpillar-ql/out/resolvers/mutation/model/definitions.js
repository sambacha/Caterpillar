"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ControlFlowInfo = exports.OracleInfo = exports.ParameterInfo = exports.ModelInfo = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ModelInfo {
  constructor() {
    _defineProperty(this, "name", void 0);

    _defineProperty(this, "id", void 0);

    _defineProperty(this, "bpmn", void 0);

    _defineProperty(this, "solidity", void 0);

    _defineProperty(this, "controlFlowInfoMap", void 0);

    _defineProperty(this, "globalNodeMap", void 0);

    _defineProperty(this, "entryContractName", void 0);

    _defineProperty(this, "contracts", void 0);
  }

}

exports.ModelInfo = ModelInfo;

class ParameterInfo {
  constructor(type, name) {
    this.type = type;
    this.name = name;
  }

}

exports.ParameterInfo = ParameterInfo;

class OracleInfo {
  constructor(oracleName) {
    this.oracleName = oracleName;

    _defineProperty(this, "address", null);

    _defineProperty(this, "functionName", null);

    _defineProperty(this, "functionParameters", new Array());
  }

}

exports.OracleInfo = OracleInfo;

class ControlFlowInfo {
  constructor(self, nodeList, edgeList, sources, boundaryEvents) {
    this.self = self;
    this.nodeList = nodeList;
    this.edgeList = edgeList;
    this.sources = sources;
    this.boundaryEvents = boundaryEvents;

    _defineProperty(this, "parent", null);

    _defineProperty(this, "isEmbedded", false);

    _defineProperty(this, "nodeNameMap", new Map());

    _defineProperty(this, "nodeIndexMap", new Map());

    _defineProperty(this, "edgeIndexMap", new Map());

    _defineProperty(this, "multiinstanceActivities", new Map());

    _defineProperty(this, "nonInterruptingEvents", new Map());

    _defineProperty(this, "callActivities", new Map());

    _defineProperty(this, "externalBundles", new Map());

    _defineProperty(this, "catchingMessages", void 0);

    _defineProperty(this, "globalParameters", "");

    _defineProperty(this, "localParameters", new Map());

    _defineProperty(this, "oracleInfo", new Map());

    _defineProperty(this, "oracleTaskMap", new Map());

    _defineProperty(this, "taskRoleMap", new Map());
  }

}

exports.ControlFlowInfo = ControlFlowInfo;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvbXV0YXRpb24vbW9kZWwvZGVmaW5pdGlvbnMudHMiXSwibmFtZXMiOlsiTW9kZWxJbmZvIiwiUGFyYW1ldGVySW5mbyIsImNvbnN0cnVjdG9yIiwidHlwZSIsIm5hbWUiLCJPcmFjbGVJbmZvIiwib3JhY2xlTmFtZSIsIkFycmF5IiwiQ29udHJvbEZsb3dJbmZvIiwic2VsZiIsIm5vZGVMaXN0IiwiZWRnZUxpc3QiLCJzb3VyY2VzIiwiYm91bmRhcnlFdmVudHMiLCJNYXAiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUNPLE1BQU1BLFNBQU4sQ0FBZ0I7QUFBQTtBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBO0FBQUE7O0FBQUE7Ozs7QUFXaEIsTUFBTUMsYUFBTixDQUFvQjtBQUN2QkMsRUFBQUEsV0FBVyxDQUFRQyxJQUFSLEVBQTZCQyxJQUE3QixFQUEyQztBQUFBO0FBQUE7QUFBRTs7QUFEakM7Ozs7QUFJcEIsTUFBTUMsVUFBTixDQUFpQjtBQUtwQkgsRUFBQUEsV0FBVyxDQUFTSSxVQUFULEVBQTZCO0FBQUE7O0FBQUEscUNBSnRCLElBSXNCOztBQUFBLDBDQUhqQixJQUdpQjs7QUFBQSxnREFGRyxJQUFJQyxLQUFKLEVBRUg7QUFBRTs7QUFMdEI7Ozs7QUFRakIsTUFBTUMsZUFBTixDQUFzQjtBQWlCekJOLEVBQUFBLFdBQVcsQ0FBUU8sSUFBUixFQUF5QkMsUUFBekIsRUFDUUMsUUFEUixFQUN3Q0MsT0FEeEMsRUFFUUMsY0FGUixFQUV1QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUEsb0NBbEJ4QixJQWtCd0I7O0FBQUEsd0NBakI1QixLQWlCNEI7O0FBQUEseUNBaEJmLElBQUlDLEdBQUosRUFnQmU7O0FBQUEsMENBZmQsSUFBSUEsR0FBSixFQWVjOztBQUFBLDBDQWRkLElBQUlBLEdBQUosRUFjYzs7QUFBQSxxREFiSCxJQUFJQSxHQUFKLEVBYUc7O0FBQUEsbURBWkwsSUFBSUEsR0FBSixFQVlLOztBQUFBLDRDQVhaLElBQUlBLEdBQUosRUFXWTs7QUFBQSw2Q0FWWCxJQUFJQSxHQUFKLEVBVVc7O0FBQUE7O0FBQUEsOENBUnZCLEVBUXVCOztBQUFBLDZDQVBlLElBQUlBLEdBQUosRUFPZjs7QUFBQSx3Q0FOWixJQUFJQSxHQUFKLEVBTVk7O0FBQUEsMkNBTGIsSUFBSUEsR0FBSixFQUthOztBQUFBLHlDQUpmLElBQUlBLEdBQUosRUFJZTtBQUFFOztBQW5CM0IiLCJzb3VyY2VzQ29udGVudCI6WyJcbmV4cG9ydCBjbGFzcyBNb2RlbEluZm8ge1xuICBuYW1lOiBzdHJpbmc7XG4gIGlkOiBzdHJpbmc7XG4gIGJwbW46IHN0cmluZztcbiAgc29saWRpdHk6IHN0cmluZztcbiAgY29udHJvbEZsb3dJbmZvTWFwOiBNYXA8c3RyaW5nLCBDb250cm9sRmxvd0luZm8+O1xuICBnbG9iYWxOb2RlTWFwOiBNYXA8c3RyaW5nLCBhbnk+O1xuICBlbnRyeUNvbnRyYWN0TmFtZTogc3RyaW5nO1xuICBjb250cmFjdHM6IE1hcDxzdHJpbmcsIGFueT47XG59XG5cbmV4cG9ydCBjbGFzcyBQYXJhbWV0ZXJJbmZvIHtcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdHlwZTogc3RyaW5nLCBwdWJsaWMgbmFtZTogc3RyaW5nKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgT3JhY2xlSW5mbyB7XG4gICAgYWRkcmVzczogc3RyaW5nID0gbnVsbDtcbiAgICBmdW5jdGlvbk5hbWU6IHN0cmluZyA9IG51bGw7XG4gICAgZnVuY3Rpb25QYXJhbWV0ZXJzOiBBcnJheTxQYXJhbWV0ZXJJbmZvPiA9IG5ldyBBcnJheSgpO1xuXG4gICAgY29uc3RydWN0b3IgKHB1YmxpYyBvcmFjbGVOYW1lOiBzdHJpbmcpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBDb250cm9sRmxvd0luZm8ge1xuICAgIHBhcmVudDogQ29udHJvbEZsb3dJbmZvID0gbnVsbDtcbiAgICBpc0VtYmVkZGVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgbm9kZU5hbWVNYXA6IE1hcDxzdHJpbmcsIHN0cmluZz4gPSBuZXcgTWFwKCk7XG4gICAgbm9kZUluZGV4TWFwOiBNYXA8c3RyaW5nLCBudW1iZXI+ID0gbmV3IE1hcCgpO1xuICAgIGVkZ2VJbmRleE1hcDogTWFwPHN0cmluZywgbnVtYmVyPiA9IG5ldyBNYXAoKTtcbiAgICBtdWx0aWluc3RhbmNlQWN0aXZpdGllczogTWFwPHN0cmluZywgc3RyaW5nPiA9IG5ldyBNYXAoKTtcbiAgICBub25JbnRlcnJ1cHRpbmdFdmVudHM6IE1hcDxzdHJpbmcsIHN0cmluZz4gPSBuZXcgTWFwKCk7XG4gICAgY2FsbEFjdGl2aXRpZXM6IE1hcDxzdHJpbmcsIHN0cmluZz4gPSBuZXcgTWFwKCk7XG4gICAgZXh0ZXJuYWxCdW5kbGVzOiBNYXA8c3RyaW5nLCBzdHJpbmc+ID0gbmV3IE1hcCgpO1xuICAgIGNhdGNoaW5nTWVzc2FnZXM6IEFycmF5PHN0cmluZz47XG4gICAgZ2xvYmFsUGFyYW1ldGVyczogc3RyaW5nID0gXCJcIjtcbiAgICBsb2NhbFBhcmFtZXRlcnM6IE1hcDxzdHJpbmcsIE1hcDxzdHJpbmcsQXJyYXk8UGFyYW1ldGVySW5mbz4+PiA9IG5ldyBNYXAoKTtcbiAgICBvcmFjbGVJbmZvOiBNYXA8c3RyaW5nLCBPcmFjbGVJbmZvPiA9IG5ldyBNYXAoKTtcbiAgICBvcmFjbGVUYXNrTWFwOiBNYXA8c3RyaW5nLCBzdHJpbmc+ID0gbmV3IE1hcCgpO1xuICAgIHRhc2tSb2xlTWFwOiBNYXA8c3RyaW5nLCBzdHJpbmc+ID0gbmV3IE1hcCgpO1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIHNlbGY6YW55LCBwdWJsaWMgbm9kZUxpc3Q6IEFycmF5PHN0cmluZz4sXG4gICAgICAgICAgICAgICAgcHVibGljIGVkZ2VMaXN0OiBBcnJheTxzdHJpbmc+LCBwdWJsaWMgc291cmNlczogQXJyYXk8c3RyaW5nPixcbiAgICAgICAgICAgICAgICBwdWJsaWMgYm91bmRhcnlFdmVudHM6IEFycmF5PHN0cmluZz4pIHt9XG59XG5cblxuIl19