"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatingIFlowRequest = exports.LinkProcessRequest = exports.NewContractInstRequest = exports.FunctionCallRequest = exports.TaskExecutionRequest = exports.NewContractRequest = exports.IRequest = exports.TypeContract = void 0;
var TypeContract;
(function (TypeContract) {
    TypeContract["IFlow"] = "IFlow";
    TypeContract["IData"] = "IData";
    TypeContract["IFactory"] = "IFactory";
    TypeContract["BPMNInterpreter"] = "BPMNINterpreter";
})(TypeContract = exports.TypeContract || (exports.TypeContract = {}));
class IRequest {
    constructor(transactionHash, functionCallback) {
        this.transactionHash = transactionHash;
        this.functionCallback = functionCallback;
        this.gasCost = 0;
    }
    executeCallback(transInfo) {
        this.gasCost = parseInt(transInfo.gasUsed);
        this.functionCallback(this);
    }
}
exports.IRequest = IRequest;
class NewContractRequest extends IRequest {
    constructor(transactionHash, functionCallback, iFlowAddr) {
        super(transactionHash, functionCallback);
        this.transactionHash = transactionHash;
        this.functionCallback = functionCallback;
        this.iFlowAddr = iFlowAddr;
    }
    executeCallback(transInfo) {
        this.iDataAddr = transInfo.result.pCase;
        this.gasCost = parseInt(transInfo.gasCost);
        this.functionCallback(this);
    }
}
exports.NewContractRequest = NewContractRequest;
class TaskExecutionRequest extends IRequest {
    constructor(transactionHash, functionCallback, eName, params, iDataAddr) {
        super(transactionHash, functionCallback);
        this.transactionHash = transactionHash;
        this.functionCallback = functionCallback;
        this.eName = eName;
        this.params = params;
        this.iDataAddr = iDataAddr;
    }
}
exports.TaskExecutionRequest = TaskExecutionRequest;
class FunctionCallRequest extends IRequest {
    constructor(transactionHash, functionCallback, pInd, functionName, params) {
        super(transactionHash, functionCallback);
        this.transactionHash = transactionHash;
        this.functionCallback = functionCallback;
        this.pInd = pInd;
        this.functionName = functionName;
        this.params = params;
    }
    executeCallback(transInfo) {
        this.gasCost = parseInt(transInfo.gasUsed);
        this.functionCallback(this);
    }
}
exports.FunctionCallRequest = FunctionCallRequest;
class NewContractInstRequest extends IRequest {
    constructor(compilationInfo, pId, contractIndex, type, transactionHash, functionCallback) {
        super(transactionHash, functionCallback);
        this.compilationInfo = compilationInfo;
        this.pId = pId;
        this.contractIndex = contractIndex;
        this.type = type;
        this.transactionHash = transactionHash;
        this.functionCallback = functionCallback;
        this.contractAddress = "";
        this.repoId = "";
    }
    executeCallback(transInfo) {
        this.gasCost = parseInt(transInfo.gasUsed);
        this.contractAddress = transInfo.contractAddress;
        this.functionCallback(this);
    }
}
exports.NewContractInstRequest = NewContractInstRequest;
class LinkProcessRequest extends IRequest {
    constructor(transactionHash, functionCallback, toLink, elementInfo, iFlowP) {
        super(transactionHash, functionCallback);
        this.transactionHash = transactionHash;
        this.functionCallback = functionCallback;
        this.toLink = toLink;
        this.elementInfo = elementInfo;
        this.iFlowP = iFlowP;
    }
    executeCallback(transInfo) {
        this.gasCost = parseInt(transInfo.gasUsed);
        this.functionCallback(this);
    }
}
exports.LinkProcessRequest = LinkProcessRequest;
class UpdatingIFlowRequest extends IRequest {
    constructor(elementInfo, contractAddress, transactionHash, functionCallback) {
        super(transactionHash, functionCallback);
        this.elementInfo = elementInfo;
        this.contractAddress = contractAddress;
        this.transactionHash = transactionHash;
        this.functionCallback = functionCallback;
    }
    executeCallback(transInfo) {
        this.functionCallback(this.elementInfo, this.contractAddress, this.transactionHash, transInfo.gasUsed);
    }
}
exports.UpdatingIFlowRequest = UpdatingIFlowRequest;
//# sourceMappingURL=async-requests.js.map