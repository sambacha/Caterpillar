"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleTransactionFromLog = exports.handleMinedTransaction = exports.listenForPendingLogs = exports.listenForPendingTransaction = exports.EventType = void 0;
const ethereumAdapter = require("./../../../adapters/ethereum-blockchain/ethereum-adapter");
const function_info_1 = require("../../../adapters/ethereum-blockchain/structs/function-info");
let pendingRequests = new Map();
var EventType;
(function (EventType) {
    EventType[EventType["NewCaseCreated"] = 0] = "NewCaseCreated";
})(EventType = exports.EventType || (exports.EventType = {}));
exports.listenForPendingTransaction = (transactionHash, requestInfo) => {
    pendingRequests.set(transactionHash, requestInfo);
    ethereumAdapter.listenForTransactionMined(transactionHash, this.handleMinedTransaction);
};
exports.listenForPendingLogs = (contractAddress, contractAbi, eventType, requestInfo) => {
    pendingRequests.set(requestInfo.transactionHash, requestInfo);
    ethereumAdapter.subscribeToLog(contractAddress, contractAbi, toFunctionInfo(eventType), this.handleTransactionFromLog);
};
exports.handleMinedTransaction = (transactionHash, transactionInfo) => {
    try {
        if (pendingRequests.has(transactionHash)) {
            let request = pendingRequests.get(transactionHash);
            pendingRequests.delete(transactionHash);
            request.executeCallback(transactionInfo);
        }
    }
    catch (error) {
        console.log(error);
    }
};
exports.handleTransactionFromLog = (transactionHash, gasCost, transactionInfo) => {
    try {
        if (pendingRequests.has(transactionHash)) {
            let request = pendingRequests.get(transactionHash);
            pendingRequests.delete(transactionHash);
            request.executeCallback({
                gasCost: gasCost,
                result: transactionInfo,
            });
        }
    }
    catch (error) {
        console.log(error);
    }
};
let toFunctionInfo = (eventType) => {
    switch (eventType) {
        case EventType.NewCaseCreated: {
            return new function_info_1.FunctionInfo("NewCaseCreated", ["address"]);
        }
    }
};
//# sourceMappingURL=event-monitor.js.map