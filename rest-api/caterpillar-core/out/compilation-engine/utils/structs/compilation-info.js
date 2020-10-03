"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParameterInfo = exports.OracleInfo = exports.ModelInfo = exports.ControlFlowInfo = void 0;
class ControlFlowInfo {
    constructor(self, nodeList, edgeList, sources, boundaryEvents) {
        this.self = self;
        this.nodeList = nodeList;
        this.edgeList = edgeList;
        this.sources = sources;
        this.boundaryEvents = boundaryEvents;
        this.parent = null;
        this.isEmbedded = false;
        this.nodeNameMap = new Map();
        this.nodeIndexMap = new Map();
        this.edgeIndexMap = new Map();
        this.multiinstanceActivities = new Map();
        this.nonInterruptingEvents = new Map();
        this.callActivities = new Map();
        this.externalBundles = new Map();
        this.globalParameters = "";
        this.localParameters = new Map();
        this.oracleInfo = new Map();
        this.oracleTaskMap = new Map();
        this.taskRoleMap = new Map();
    }
}
exports.ControlFlowInfo = ControlFlowInfo;
class ModelInfo {
}
exports.ModelInfo = ModelInfo;
class OracleInfo {
    constructor(oracleName) {
        this.oracleName = oracleName;
        this.address = null;
        this.functionName = null;
        this.functionParameters = new Array();
    }
}
exports.OracleInfo = OracleInfo;
class ParameterInfo {
    constructor(type, name) {
        this.type = type;
        this.name = name;
    }
}
exports.ParameterInfo = ParameterInfo;
//# sourceMappingURL=compilation-info.js.map