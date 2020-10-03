"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleTaskMap = exports.RoleBindingPolicy = exports.ProcessIEInput = exports.ProcessIEMetadata = exports.ProcessCEMetadata = exports.ModelMetadata = void 0;
class ModelMetadata {
    constructor(contractInfo) {
        this.contractInfo = contractInfo;
    }
}
exports.ModelMetadata = ModelMetadata;
class ProcessCEMetadata extends ModelMetadata {
    constructor(repoId, rootModelID, rootModelName, bpmnModel, indexToElementMap, worklistABI, contractInfo) {
        super(contractInfo);
        this.repoId = repoId;
        this.rootModelID = rootModelID;
        this.rootModelName = rootModelName;
        this.bpmnModel = bpmnModel;
        this.indexToElementMap = indexToElementMap;
        this.worklistABI = worklistABI;
        this.contractInfo = contractInfo;
    }
}
exports.ProcessCEMetadata = ProcessCEMetadata;
class ProcessIEMetadata extends ModelMetadata {
    constructor(processID, prpcessName, bpmnModel, indexToElement, children, iData, iFactory, iFlow) {
        super(iData);
        this.processID = processID;
        this.prpcessName = prpcessName;
        this.bpmnModel = bpmnModel;
        this.indexToElement = indexToElement;
        this.children = children;
        this.iData = iData;
        this.iFactory = iFactory;
        this.iFlow = iFlow;
        this._id = "";
    }
}
exports.ProcessIEMetadata = ProcessIEMetadata;
class ProcessIEInput extends ModelMetadata {
    constructor(processID, processName, bpmnModel, indexToElement, children, iFactory, iFlow) {
        super(undefined);
        this.processID = processID;
        this.processName = processName;
        this.bpmnModel = bpmnModel;
        this.indexToElement = indexToElement;
        this.children = children;
        this.iFactory = iFactory;
        this.iFlow = iFlow;
    }
}
exports.ProcessIEInput = ProcessIEInput;
class RoleBindingPolicy extends ModelMetadata {
    constructor(policyModel, roleIndexMap, contractInfo) {
        super(contractInfo);
        this.policyModel = policyModel;
        this.roleIndexMap = roleIndexMap;
        this._id = "";
    }
}
exports.RoleBindingPolicy = RoleBindingPolicy;
class RoleTaskMap extends ModelMetadata {
    constructor(indexToRole, contractInfo) {
        super(contractInfo);
        this.indexToRole = indexToRole;
        this._id = "";
    }
}
exports.RoleTaskMap = RoleTaskMap;
//# sourceMappingURL=repo-models.js.map