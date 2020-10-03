"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleEventFromMinedTransaction = exports.listenForPendingTransaction = exports.EventType = void 0;
const function_info_1 = require("../../adapters/ethereum-blockchain/structs/function-info");
const console_log_1 = require("../../adapters/messages/console-log");
const ethereumAdapter = require("../../adapters/ethereum-blockchain/ethereum-adapter");
var EventType;
(function (EventType) {
    EventType[EventType["NewProcessInstanceCreated"] = 0] = "NewProcessInstanceCreated";
    EventType[EventType["UserTaskCompleted"] = 1] = "UserTaskCompleted";
})(EventType = exports.EventType || (exports.EventType = {}));
let pendingRequests = new Map();
exports.listenForPendingTransaction = (contractAddress, contractAbi, eventType, requestInfo) => {
    try {
        pendingRequests.set(requestInfo.transactionHash, requestInfo);
        ethereumAdapter.subscribeToLog(contractAddress, contractAbi, toFunctionInfo(eventType), this.handleEventFromMinedTransaction);
    }
    catch (error) {
        printError(error, requestInfo);
    }
};
exports.handleEventFromMinedTransaction = (transactionHash, gasUsed, logInfo) => {
    try {
        if (pendingRequests.has(transactionHash)) {
            let request = pendingRequests.get(transactionHash);
            pendingRequests.delete(transactionHash);
            request.gasUsed = parseInt(gasUsed);
            request.executeCallback(logInfo.processAddress);
        }
    }
    catch (error) {
        printError(error, logInfo);
    }
};
////////////////////////////////////////////
//////////// PRIVATE FUNCTIONS /////////////
////////////////////////////////////////////
let toFunctionInfo = (eventType) => {
    switch (eventType) {
        case EventType.NewProcessInstanceCreated: {
            return new function_info_1.FunctionInfo("NewInstanceCreatedFor", ["address", "address"]);
        }
        case EventType.UserTaskCompleted: {
            return new function_info_1.FunctionInfo("TaskExecutionCompleted", ["address", "uint256"]);
        }
    }
};
let printError = (error, info) => {
    console_log_1.print("ERROR: IN EVENT MONITOR", console_log_1.TypeMessage.error);
    console_log_1.print(` { Input: ${info} }`, console_log_1.TypeMessage.error);
    console_log_1.print(` { Error: ${error} }`, console_log_1.TypeMessage.error);
    console_log_1.printSeparator();
};
//# sourceMappingURL=event-monitor.js.map