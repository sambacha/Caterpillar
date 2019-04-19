"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ControlFlowInfo = exports.OracleInfo = exports.ParameterInfo = exports.ModelInfo = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ModelInfo = function ModelInfo() {
  _classCallCheck(this, ModelInfo);

  _defineProperty(this, "name", void 0);

  _defineProperty(this, "id", void 0);

  _defineProperty(this, "bpmn", void 0);

  _defineProperty(this, "solidity", void 0);

  _defineProperty(this, "controlFlowInfoMap", void 0);

  _defineProperty(this, "globalNodeMap", void 0);

  _defineProperty(this, "entryContractName", void 0);

  _defineProperty(this, "contracts", void 0);
};

exports.ModelInfo = ModelInfo;

var ParameterInfo = function ParameterInfo(type, name) {
  _classCallCheck(this, ParameterInfo);

  this.type = type;
  this.name = name;
};

exports.ParameterInfo = ParameterInfo;

var OracleInfo = function OracleInfo(oracleName) {
  _classCallCheck(this, OracleInfo);

  this.oracleName = oracleName;

  _defineProperty(this, "address", null);

  _defineProperty(this, "functionName", null);

  _defineProperty(this, "functionParameters", new Array());
};

exports.OracleInfo = OracleInfo;

var ControlFlowInfo = function ControlFlowInfo(self, nodeList, edgeList, sources, boundaryEvents) {
  _classCallCheck(this, ControlFlowInfo);

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
};

exports.ControlFlowInfo = ControlFlowInfo;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvcmVwby9kZWZpbml0aW9ucy50cyJdLCJuYW1lcyI6WyJNb2RlbEluZm8iLCJQYXJhbWV0ZXJJbmZvIiwidHlwZSIsIm5hbWUiLCJPcmFjbGVJbmZvIiwib3JhY2xlTmFtZSIsIkFycmF5IiwiQ29udHJvbEZsb3dJbmZvIiwic2VsZiIsIm5vZGVMaXN0IiwiZWRnZUxpc3QiLCJzb3VyY2VzIiwiYm91bmRhcnlFdmVudHMiLCJNYXAiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBQ2FBLFM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFXQUMsYSxHQUNULHVCQUFtQkMsSUFBbkIsRUFBd0NDLElBQXhDLEVBQXNEO0FBQUE7O0FBQUE7QUFBQTtBQUFFLEM7Ozs7SUFHL0NDLFUsR0FLVCxvQkFBb0JDLFVBQXBCLEVBQXdDO0FBQUE7O0FBQUE7O0FBQUEsbUNBSnRCLElBSXNCOztBQUFBLHdDQUhqQixJQUdpQjs7QUFBQSw4Q0FGRyxJQUFJQyxLQUFKLEVBRUg7QUFBRSxDOzs7O0lBR2pDQyxlLEdBaUJULHlCQUFtQkMsSUFBbkIsRUFBb0NDLFFBQXBDLEVBQ21CQyxRQURuQixFQUNtREMsT0FEbkQsRUFFbUJDLGNBRm5CLEVBRWtEO0FBQUE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQSxrQ0FsQnhCLElBa0J3Qjs7QUFBQSxzQ0FqQjVCLEtBaUI0Qjs7QUFBQSx1Q0FoQmYsSUFBSUMsR0FBSixFQWdCZTs7QUFBQSx3Q0FmZCxJQUFJQSxHQUFKLEVBZWM7O0FBQUEsd0NBZGQsSUFBSUEsR0FBSixFQWNjOztBQUFBLG1EQWJILElBQUlBLEdBQUosRUFhRzs7QUFBQSxpREFaTCxJQUFJQSxHQUFKLEVBWUs7O0FBQUEsMENBWFosSUFBSUEsR0FBSixFQVdZOztBQUFBLDJDQVZYLElBQUlBLEdBQUosRUFVVzs7QUFBQTs7QUFBQSw0Q0FSdkIsRUFRdUI7O0FBQUEsMkNBUGUsSUFBSUEsR0FBSixFQU9mOztBQUFBLHNDQU5aLElBQUlBLEdBQUosRUFNWTs7QUFBQSx5Q0FMYixJQUFJQSxHQUFKLEVBS2E7O0FBQUEsdUNBSmYsSUFBSUEsR0FBSixFQUllO0FBQUUsQyIsInNvdXJjZXNDb250ZW50IjpbIlxuZXhwb3J0IGNsYXNzIE1vZGVsSW5mbyB7XG4gIG5hbWU6IHN0cmluZztcbiAgaWQ6IHN0cmluZztcbiAgYnBtbjogc3RyaW5nO1xuICBzb2xpZGl0eTogc3RyaW5nO1xuICBjb250cm9sRmxvd0luZm9NYXA6IE1hcDxzdHJpbmcsIENvbnRyb2xGbG93SW5mbz47XG4gIGdsb2JhbE5vZGVNYXA6IE1hcDxzdHJpbmcsIGFueT47XG4gIGVudHJ5Q29udHJhY3ROYW1lOiBzdHJpbmc7XG4gIGNvbnRyYWN0czogTWFwPHN0cmluZywgYW55Pjtcbn1cblxuZXhwb3J0IGNsYXNzIFBhcmFtZXRlckluZm8ge1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0eXBlOiBzdHJpbmcsIHB1YmxpYyBuYW1lOiBzdHJpbmcpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBPcmFjbGVJbmZvIHtcbiAgICBhZGRyZXNzOiBzdHJpbmcgPSBudWxsO1xuICAgIGZ1bmN0aW9uTmFtZTogc3RyaW5nID0gbnVsbDtcbiAgICBmdW5jdGlvblBhcmFtZXRlcnM6IEFycmF5PFBhcmFtZXRlckluZm8+ID0gbmV3IEFycmF5KCk7XG5cbiAgICBjb25zdHJ1Y3RvciAocHVibGljIG9yYWNsZU5hbWU6IHN0cmluZykge31cbn1cblxuZXhwb3J0IGNsYXNzIENvbnRyb2xGbG93SW5mbyB7XG4gICAgcGFyZW50OiBDb250cm9sRmxvd0luZm8gPSBudWxsO1xuICAgIGlzRW1iZWRkZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBub2RlTmFtZU1hcDogTWFwPHN0cmluZywgc3RyaW5nPiA9IG5ldyBNYXAoKTtcbiAgICBub2RlSW5kZXhNYXA6IE1hcDxzdHJpbmcsIG51bWJlcj4gPSBuZXcgTWFwKCk7XG4gICAgZWRnZUluZGV4TWFwOiBNYXA8c3RyaW5nLCBudW1iZXI+ID0gbmV3IE1hcCgpO1xuICAgIG11bHRpaW5zdGFuY2VBY3Rpdml0aWVzOiBNYXA8c3RyaW5nLCBzdHJpbmc+ID0gbmV3IE1hcCgpO1xuICAgIG5vbkludGVycnVwdGluZ0V2ZW50czogTWFwPHN0cmluZywgc3RyaW5nPiA9IG5ldyBNYXAoKTtcbiAgICBjYWxsQWN0aXZpdGllczogTWFwPHN0cmluZywgc3RyaW5nPiA9IG5ldyBNYXAoKTtcbiAgICBleHRlcm5hbEJ1bmRsZXM6IE1hcDxzdHJpbmcsIHN0cmluZz4gPSBuZXcgTWFwKCk7XG4gICAgY2F0Y2hpbmdNZXNzYWdlczogQXJyYXk8c3RyaW5nPjtcbiAgICBnbG9iYWxQYXJhbWV0ZXJzOiBzdHJpbmcgPSBcIlwiO1xuICAgIGxvY2FsUGFyYW1ldGVyczogTWFwPHN0cmluZywgTWFwPHN0cmluZyxBcnJheTxQYXJhbWV0ZXJJbmZvPj4+ID0gbmV3IE1hcCgpO1xuICAgIG9yYWNsZUluZm86IE1hcDxzdHJpbmcsIE9yYWNsZUluZm8+ID0gbmV3IE1hcCgpO1xuICAgIG9yYWNsZVRhc2tNYXA6IE1hcDxzdHJpbmcsIHN0cmluZz4gPSBuZXcgTWFwKCk7XG4gICAgdGFza1JvbGVNYXA6IE1hcDxzdHJpbmcsIHN0cmluZz4gPSBuZXcgTWFwKCk7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc2VsZjphbnksIHB1YmxpYyBub2RlTGlzdDogQXJyYXk8c3RyaW5nPixcbiAgICAgICAgICAgICAgICBwdWJsaWMgZWRnZUxpc3Q6IEFycmF5PHN0cmluZz4sIHB1YmxpYyBzb3VyY2VzOiBBcnJheTxzdHJpbmc+LFxuICAgICAgICAgICAgICAgIHB1YmxpYyBib3VuZGFyeUV2ZW50czogQXJyYXk8c3RyaW5nPikge31cbn1cblxuXG4iXX0=