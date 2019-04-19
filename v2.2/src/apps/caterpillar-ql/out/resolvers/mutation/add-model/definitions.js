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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvbXV0YXRpb24vYWRkLW1vZGVsL2RlZmluaXRpb25zLnRzIl0sIm5hbWVzIjpbIk1vZGVsSW5mbyIsIlBhcmFtZXRlckluZm8iLCJ0eXBlIiwibmFtZSIsIk9yYWNsZUluZm8iLCJvcmFjbGVOYW1lIiwiQXJyYXkiLCJDb250cm9sRmxvd0luZm8iLCJzZWxmIiwibm9kZUxpc3QiLCJlZGdlTGlzdCIsInNvdXJjZXMiLCJib3VuZGFyeUV2ZW50cyIsIk1hcCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFDYUEsUzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQVdBQyxhLEdBQ1QsdUJBQW1CQyxJQUFuQixFQUF3Q0MsSUFBeEMsRUFBc0Q7QUFBQTs7QUFBQTtBQUFBO0FBQUUsQzs7OztJQUcvQ0MsVSxHQUtULG9CQUFvQkMsVUFBcEIsRUFBd0M7QUFBQTs7QUFBQTs7QUFBQSxtQ0FKdEIsSUFJc0I7O0FBQUEsd0NBSGpCLElBR2lCOztBQUFBLDhDQUZHLElBQUlDLEtBQUosRUFFSDtBQUFFLEM7Ozs7SUFHakNDLGUsR0FpQlQseUJBQW1CQyxJQUFuQixFQUFvQ0MsUUFBcEMsRUFDbUJDLFFBRG5CLEVBQ21EQyxPQURuRCxFQUVtQkMsY0FGbkIsRUFFa0Q7QUFBQTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBLGtDQWxCeEIsSUFrQndCOztBQUFBLHNDQWpCNUIsS0FpQjRCOztBQUFBLHVDQWhCZixJQUFJQyxHQUFKLEVBZ0JlOztBQUFBLHdDQWZkLElBQUlBLEdBQUosRUFlYzs7QUFBQSx3Q0FkZCxJQUFJQSxHQUFKLEVBY2M7O0FBQUEsbURBYkgsSUFBSUEsR0FBSixFQWFHOztBQUFBLGlEQVpMLElBQUlBLEdBQUosRUFZSzs7QUFBQSwwQ0FYWixJQUFJQSxHQUFKLEVBV1k7O0FBQUEsMkNBVlgsSUFBSUEsR0FBSixFQVVXOztBQUFBOztBQUFBLDRDQVJ2QixFQVF1Qjs7QUFBQSwyQ0FQZSxJQUFJQSxHQUFKLEVBT2Y7O0FBQUEsc0NBTlosSUFBSUEsR0FBSixFQU1ZOztBQUFBLHlDQUxiLElBQUlBLEdBQUosRUFLYTs7QUFBQSx1Q0FKZixJQUFJQSxHQUFKLEVBSWU7QUFBRSxDIiwic291cmNlc0NvbnRlbnQiOlsiXG5leHBvcnQgY2xhc3MgTW9kZWxJbmZvIHtcbiAgbmFtZTogc3RyaW5nO1xuICBpZDogc3RyaW5nO1xuICBicG1uOiBzdHJpbmc7XG4gIHNvbGlkaXR5OiBzdHJpbmc7XG4gIGNvbnRyb2xGbG93SW5mb01hcDogTWFwPHN0cmluZywgQ29udHJvbEZsb3dJbmZvPjtcbiAgZ2xvYmFsTm9kZU1hcDogTWFwPHN0cmluZywgYW55PjtcbiAgZW50cnlDb250cmFjdE5hbWU6IHN0cmluZztcbiAgY29udHJhY3RzOiBNYXA8c3RyaW5nLCBhbnk+O1xufVxuXG5leHBvcnQgY2xhc3MgUGFyYW1ldGVySW5mbyB7XG4gICAgY29uc3RydWN0b3IocHVibGljIHR5cGU6IHN0cmluZywgcHVibGljIG5hbWU6IHN0cmluZykge31cbn1cblxuZXhwb3J0IGNsYXNzIE9yYWNsZUluZm8ge1xuICAgIGFkZHJlc3M6IHN0cmluZyA9IG51bGw7XG4gICAgZnVuY3Rpb25OYW1lOiBzdHJpbmcgPSBudWxsO1xuICAgIGZ1bmN0aW9uUGFyYW1ldGVyczogQXJyYXk8UGFyYW1ldGVySW5mbz4gPSBuZXcgQXJyYXkoKTtcblxuICAgIGNvbnN0cnVjdG9yIChwdWJsaWMgb3JhY2xlTmFtZTogc3RyaW5nKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgQ29udHJvbEZsb3dJbmZvIHtcbiAgICBwYXJlbnQ6IENvbnRyb2xGbG93SW5mbyA9IG51bGw7XG4gICAgaXNFbWJlZGRlZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIG5vZGVOYW1lTWFwOiBNYXA8c3RyaW5nLCBzdHJpbmc+ID0gbmV3IE1hcCgpO1xuICAgIG5vZGVJbmRleE1hcDogTWFwPHN0cmluZywgbnVtYmVyPiA9IG5ldyBNYXAoKTtcbiAgICBlZGdlSW5kZXhNYXA6IE1hcDxzdHJpbmcsIG51bWJlcj4gPSBuZXcgTWFwKCk7XG4gICAgbXVsdGlpbnN0YW5jZUFjdGl2aXRpZXM6IE1hcDxzdHJpbmcsIHN0cmluZz4gPSBuZXcgTWFwKCk7XG4gICAgbm9uSW50ZXJydXB0aW5nRXZlbnRzOiBNYXA8c3RyaW5nLCBzdHJpbmc+ID0gbmV3IE1hcCgpO1xuICAgIGNhbGxBY3Rpdml0aWVzOiBNYXA8c3RyaW5nLCBzdHJpbmc+ID0gbmV3IE1hcCgpO1xuICAgIGV4dGVybmFsQnVuZGxlczogTWFwPHN0cmluZywgc3RyaW5nPiA9IG5ldyBNYXAoKTtcbiAgICBjYXRjaGluZ01lc3NhZ2VzOiBBcnJheTxzdHJpbmc+O1xuICAgIGdsb2JhbFBhcmFtZXRlcnM6IHN0cmluZyA9IFwiXCI7XG4gICAgbG9jYWxQYXJhbWV0ZXJzOiBNYXA8c3RyaW5nLCBNYXA8c3RyaW5nLEFycmF5PFBhcmFtZXRlckluZm8+Pj4gPSBuZXcgTWFwKCk7XG4gICAgb3JhY2xlSW5mbzogTWFwPHN0cmluZywgT3JhY2xlSW5mbz4gPSBuZXcgTWFwKCk7XG4gICAgb3JhY2xlVGFza01hcDogTWFwPHN0cmluZywgc3RyaW5nPiA9IG5ldyBNYXAoKTtcbiAgICB0YXNrUm9sZU1hcDogTWFwPHN0cmluZywgc3RyaW5nPiA9IG5ldyBNYXAoKTtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBzZWxmOmFueSwgcHVibGljIG5vZGVMaXN0OiBBcnJheTxzdHJpbmc+LFxuICAgICAgICAgICAgICAgIHB1YmxpYyBlZGdlTGlzdDogQXJyYXk8c3RyaW5nPiwgcHVibGljIHNvdXJjZXM6IEFycmF5PHN0cmluZz4sXG4gICAgICAgICAgICAgICAgcHVibGljIGJvdW5kYXJ5RXZlbnRzOiBBcnJheTxzdHJpbmc+KSB7fVxufVxuXG5cbiJdfQ==