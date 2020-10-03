"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewInstRequest = exports.TaskCompletedRequest = exports.IRequest = void 0;
class IRequest {
    constructor(transactionHash, functionCallback) {
        this.transactionHash = transactionHash;
        this.functionCallback = functionCallback;
        this.gasUsed = 0;
    }
    executeCallback(logInfo) {
        this.functionCallback(logInfo);
    }
}
exports.IRequest = IRequest;
class TaskCompletedRequest extends IRequest {
    constructor(taskName, workitemIndex, worklistAddress, transactionHash, functionCallback) {
        super(transactionHash, functionCallback);
        this.taskName = taskName;
        this.workitemIndex = workitemIndex;
        this.worklistAddress = worklistAddress;
    }
    executeCallback(logInfo) {
        this.functionCallback(this.taskName, this.workitemIndex, this.worklistAddress, this.transactionHash, this.gasUsed, logInfo);
    }
}
exports.TaskCompletedRequest = TaskCompletedRequest;
class NewInstRequest extends IRequest {
    constructor(workflowContractName, processId, transactionHash, functionCallback) {
        super(transactionHash, functionCallback);
        this.workflowContractName = workflowContractName;
        this.processId = processId;
    }
    executeCallback(logInfo) {
        this.functionCallback(this.workflowContractName, this.processId, this.transactionHash, logInfo, this.gasUsed);
    }
}
exports.NewInstRequest = NewInstRequest;
//# sourceMappingURL=async-requests.js.map