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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvcmVwby9kZWZpbml0aW9ucy50cyJdLCJuYW1lcyI6WyJNb2RlbEluZm8iLCJQYXJhbWV0ZXJJbmZvIiwiY29uc3RydWN0b3IiLCJ0eXBlIiwibmFtZSIsIk9yYWNsZUluZm8iLCJvcmFjbGVOYW1lIiwiQXJyYXkiLCJDb250cm9sRmxvd0luZm8iLCJzZWxmIiwibm9kZUxpc3QiLCJlZGdlTGlzdCIsInNvdXJjZXMiLCJib3VuZGFyeUV2ZW50cyIsIk1hcCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQ08sTUFBTUEsU0FBTixDQUFnQjtBQUFBO0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7QUFBQTs7QUFBQTs7OztBQVdoQixNQUFNQyxhQUFOLENBQW9CO0FBQ3ZCQyxFQUFBQSxXQUFXLENBQVFDLElBQVIsRUFBNkJDLElBQTdCLEVBQTJDO0FBQUE7QUFBQTtBQUFFOztBQURqQzs7OztBQUlwQixNQUFNQyxVQUFOLENBQWlCO0FBS3BCSCxFQUFBQSxXQUFXLENBQVNJLFVBQVQsRUFBNkI7QUFBQTs7QUFBQSxxQ0FKdEIsSUFJc0I7O0FBQUEsMENBSGpCLElBR2lCOztBQUFBLGdEQUZHLElBQUlDLEtBQUosRUFFSDtBQUFFOztBQUx0Qjs7OztBQVFqQixNQUFNQyxlQUFOLENBQXNCO0FBaUJ6Qk4sRUFBQUEsV0FBVyxDQUFRTyxJQUFSLEVBQXlCQyxRQUF6QixFQUNRQyxRQURSLEVBQ3dDQyxPQUR4QyxFQUVRQyxjQUZSLEVBRXVDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQSxvQ0FsQnhCLElBa0J3Qjs7QUFBQSx3Q0FqQjVCLEtBaUI0Qjs7QUFBQSx5Q0FoQmYsSUFBSUMsR0FBSixFQWdCZTs7QUFBQSwwQ0FmZCxJQUFJQSxHQUFKLEVBZWM7O0FBQUEsMENBZGQsSUFBSUEsR0FBSixFQWNjOztBQUFBLHFEQWJILElBQUlBLEdBQUosRUFhRzs7QUFBQSxtREFaTCxJQUFJQSxHQUFKLEVBWUs7O0FBQUEsNENBWFosSUFBSUEsR0FBSixFQVdZOztBQUFBLDZDQVZYLElBQUlBLEdBQUosRUFVVzs7QUFBQTs7QUFBQSw4Q0FSdkIsRUFRdUI7O0FBQUEsNkNBUGUsSUFBSUEsR0FBSixFQU9mOztBQUFBLHdDQU5aLElBQUlBLEdBQUosRUFNWTs7QUFBQSwyQ0FMYixJQUFJQSxHQUFKLEVBS2E7O0FBQUEseUNBSmYsSUFBSUEsR0FBSixFQUllO0FBQUU7O0FBbkIzQiIsInNvdXJjZXNDb250ZW50IjpbIlxuZXhwb3J0IGNsYXNzIE1vZGVsSW5mbyB7XG4gIG5hbWU6IHN0cmluZztcbiAgaWQ6IHN0cmluZztcbiAgYnBtbjogc3RyaW5nO1xuICBzb2xpZGl0eTogc3RyaW5nO1xuICBjb250cm9sRmxvd0luZm9NYXA6IE1hcDxzdHJpbmcsIENvbnRyb2xGbG93SW5mbz47XG4gIGdsb2JhbE5vZGVNYXA6IE1hcDxzdHJpbmcsIGFueT47XG4gIGVudHJ5Q29udHJhY3ROYW1lOiBzdHJpbmc7XG4gIGNvbnRyYWN0czogTWFwPHN0cmluZywgYW55Pjtcbn1cblxuZXhwb3J0IGNsYXNzIFBhcmFtZXRlckluZm8ge1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0eXBlOiBzdHJpbmcsIHB1YmxpYyBuYW1lOiBzdHJpbmcpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBPcmFjbGVJbmZvIHtcbiAgICBhZGRyZXNzOiBzdHJpbmcgPSBudWxsO1xuICAgIGZ1bmN0aW9uTmFtZTogc3RyaW5nID0gbnVsbDtcbiAgICBmdW5jdGlvblBhcmFtZXRlcnM6IEFycmF5PFBhcmFtZXRlckluZm8+ID0gbmV3IEFycmF5KCk7XG5cbiAgICBjb25zdHJ1Y3RvciAocHVibGljIG9yYWNsZU5hbWU6IHN0cmluZykge31cbn1cblxuZXhwb3J0IGNsYXNzIENvbnRyb2xGbG93SW5mbyB7XG4gICAgcGFyZW50OiBDb250cm9sRmxvd0luZm8gPSBudWxsO1xuICAgIGlzRW1iZWRkZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBub2RlTmFtZU1hcDogTWFwPHN0cmluZywgc3RyaW5nPiA9IG5ldyBNYXAoKTtcbiAgICBub2RlSW5kZXhNYXA6IE1hcDxzdHJpbmcsIG51bWJlcj4gPSBuZXcgTWFwKCk7XG4gICAgZWRnZUluZGV4TWFwOiBNYXA8c3RyaW5nLCBudW1iZXI+ID0gbmV3IE1hcCgpO1xuICAgIG11bHRpaW5zdGFuY2VBY3Rpdml0aWVzOiBNYXA8c3RyaW5nLCBzdHJpbmc+ID0gbmV3IE1hcCgpO1xuICAgIG5vbkludGVycnVwdGluZ0V2ZW50czogTWFwPHN0cmluZywgc3RyaW5nPiA9IG5ldyBNYXAoKTtcbiAgICBjYWxsQWN0aXZpdGllczogTWFwPHN0cmluZywgc3RyaW5nPiA9IG5ldyBNYXAoKTtcbiAgICBleHRlcm5hbEJ1bmRsZXM6IE1hcDxzdHJpbmcsIHN0cmluZz4gPSBuZXcgTWFwKCk7XG4gICAgY2F0Y2hpbmdNZXNzYWdlczogQXJyYXk8c3RyaW5nPjtcbiAgICBnbG9iYWxQYXJhbWV0ZXJzOiBzdHJpbmcgPSBcIlwiO1xuICAgIGxvY2FsUGFyYW1ldGVyczogTWFwPHN0cmluZywgTWFwPHN0cmluZyxBcnJheTxQYXJhbWV0ZXJJbmZvPj4+ID0gbmV3IE1hcCgpO1xuICAgIG9yYWNsZUluZm86IE1hcDxzdHJpbmcsIE9yYWNsZUluZm8+ID0gbmV3IE1hcCgpO1xuICAgIG9yYWNsZVRhc2tNYXA6IE1hcDxzdHJpbmcsIHN0cmluZz4gPSBuZXcgTWFwKCk7XG4gICAgdGFza1JvbGVNYXA6IE1hcDxzdHJpbmcsIHN0cmluZz4gPSBuZXcgTWFwKCk7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc2VsZjphbnksIHB1YmxpYyBub2RlTGlzdDogQXJyYXk8c3RyaW5nPixcbiAgICAgICAgICAgICAgICBwdWJsaWMgZWRnZUxpc3Q6IEFycmF5PHN0cmluZz4sIHB1YmxpYyBzb3VyY2VzOiBBcnJheTxzdHJpbmc+LFxuICAgICAgICAgICAgICAgIHB1YmxpYyBib3VuZGFyeUV2ZW50czogQXJyYXk8c3RyaW5nPikge31cbn1cblxuXG4iXX0=