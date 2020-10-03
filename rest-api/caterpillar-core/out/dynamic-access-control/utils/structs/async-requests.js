"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeOperationCall = exports.PolicyLinkRequest = exports.NewRoleTaskMap = exports.NewBPolicyInstance = exports.NewInstanceRequest = void 0;
const event_monitor_structs_1 = require("./../../../adapters/event-monitor/event-monitor-structs");
class NewInstanceRequest extends event_monitor_structs_1.IRequest {
    constructor(transactionHash, functionCallback, compilationInfo) {
        super(transactionHash, functionCallback);
        this.transactionHash = transactionHash;
        this.functionCallback = functionCallback;
        this.compilationInfo = compilationInfo;
    }
    executeCallback(transInfo) {
        this.contractAddress = transInfo.contractAddress;
        this.gasCost = parseInt(transInfo.gasUsed);
        this.functionCallback(this);
    }
}
exports.NewInstanceRequest = NewInstanceRequest;
class NewBPolicyInstance extends NewInstanceRequest {
    constructor(transactionHash, functionCallback, compilationInfo, policyModel, roleIndexMap) {
        super(transactionHash, functionCallback, compilationInfo);
        this.transactionHash = transactionHash;
        this.functionCallback = functionCallback;
        this.compilationInfo = compilationInfo;
        this.policyModel = policyModel;
        this.roleIndexMap = roleIndexMap;
    }
}
exports.NewBPolicyInstance = NewBPolicyInstance;
class NewRoleTaskMap extends NewInstanceRequest {
    constructor(transactionHash, functionCallback, compilationInfo, roleTaskPairs) {
        super(transactionHash, functionCallback, compilationInfo);
        this.transactionHash = transactionHash;
        this.functionCallback = functionCallback;
        this.compilationInfo = compilationInfo;
        this.roleTaskPairs = roleTaskPairs;
    }
}
exports.NewRoleTaskMap = NewRoleTaskMap;
class PolicyLinkRequest extends event_monitor_structs_1.IRequest {
    constructor(transactionHash, functionCallback, policyAddress, taskRoleAddress, accessControlInfo) {
        super(transactionHash, functionCallback);
        this.transactionHash = transactionHash;
        this.functionCallback = functionCallback;
        this.policyAddress = policyAddress;
        this.taskRoleAddress = taskRoleAddress;
        this.accessControlInfo = accessControlInfo;
    }
}
exports.PolicyLinkRequest = PolicyLinkRequest;
class RuntimeOperationCall extends event_monitor_structs_1.IRequest {
    constructor(transactionHash, functionCallback, operationName, inParamNames, inParamsValues) {
        super(transactionHash, functionCallback);
        this.transactionHash = transactionHash;
        this.functionCallback = functionCallback;
        this.operationName = operationName;
        this.inParamNames = inParamNames;
        this.inParamsValues = inParamsValues;
    }
}
exports.RuntimeOperationCall = RuntimeOperationCall;
//# sourceMappingURL=async-requests.js.map