"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IRequest = exports.eventParameters = exports.EventType = void 0;
const function_info_1 = require("../ethereum-blockchain/structs/function-info");
var EventType;
(function (EventType) {
    EventType["NewCaseCreated"] = "NewCaseCreated";
    EventType["NewProcessInstanceCreated"] = "NewInstanceCreatedFor";
    EventType["UserTaskCompleted"] = "TaskExecutionCompleted";
})(EventType = exports.EventType || (exports.EventType = {}));
exports.eventParameters = (eventType) => {
    switch (eventType) {
        case EventType.NewCaseCreated: {
            return new function_info_1.FunctionInfo(EventType.NewCaseCreated, ["address"]);
        }
        case EventType.NewProcessInstanceCreated: {
            return new function_info_1.FunctionInfo(EventType.NewProcessInstanceCreated, [
                "address",
                "address",
            ]);
        }
        case EventType.UserTaskCompleted: {
            return new function_info_1.FunctionInfo(EventType.UserTaskCompleted, [
                "address",
                "uint256",
            ]);
        }
    }
};
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
//# sourceMappingURL=event-monitor-structs.js.map