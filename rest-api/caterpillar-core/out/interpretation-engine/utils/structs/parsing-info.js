"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParamInfo = exports.EdgeScript = exports.IDataInfo = exports.SubProcLinkInfo = exports.ElementIFlow = exports.IFlowInfo = exports.SubProcessInfo = void 0;
class SubProcessInfo {
    constructor(instCount) {
        this.instCount = instCount;
        this.children = new Array();
    }
}
exports.SubProcessInfo = SubProcessInfo;
class IFlowInfo {
    constructor() {
        this.nodeIndexMap = new Map();
        this.edgeIndexMap = new Map();
        this.elementInfo = new Map();
        this.attachedEvents = new Map();
        this.eventCodeMap = new Map();
    }
}
exports.IFlowInfo = IFlowInfo;
class ElementIFlow {
    constructor(eInd, eName) {
        this.eInd = eInd;
        this.eName = eName;
    }
}
exports.ElementIFlow = ElementIFlow;
class SubProcLinkInfo {
    constructor(pInd, cFlowInst, attachedEvt, countInstances) {
        this.pInd = pInd;
        this.cFlowInst = cFlowInst;
        this.attachedEvt = attachedEvt;
        this.countInstances = countInstances;
    }
}
exports.SubProcLinkInfo = SubProcLinkInfo;
class IDataInfo {
    constructor() {
        this.globalFields = new Array();
        this.scripts = new Map();
        this.userScripts = new Map();
        this.gatewayScripts = new Map();
        this.inParams = new Map();
        this.outParams = new Map();
    }
}
exports.IDataInfo = IDataInfo;
class EdgeScript {
    constructor(edgeInd, script) {
        this.edgeInd = edgeInd;
        this.script = script;
    }
}
exports.EdgeScript = EdgeScript;
class ParamInfo {
    constructor(type, name) {
        this.type = type;
        this.name = name;
    }
}
exports.ParamInfo = ParamInfo;
//# sourceMappingURL=parsing-info.js.map