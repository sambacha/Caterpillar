"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleTransactionFromLog = exports.handleMinedTransaction = exports.listenForPendingLogs = exports.listenForPendingTransaction = void 0;
const event_monitor_structs_1 = require("./event-monitor-structs");
const ethereumAdapter = require("./../ethereum-blockchain/ethereum-adapter");
let pendingRequests = new Map();
exports.listenForPendingTransaction = (requestInfo) => {
    pendingRequests.set(requestInfo.transactionHash, requestInfo);
    ethereumAdapter.listenForTransactionMined(requestInfo.transactionHash, this.handleMinedTransaction);
};
exports.listenForPendingLogs = (contractAddress, contractAbi, eventType, requestInfo) => {
    pendingRequests.set(requestInfo.transactionHash, requestInfo);
    ethereumAdapter.subscribeToLog(contractAddress, contractAbi, event_monitor_structs_1.eventParameters(eventType), this.handleTransactionFromLog);
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
//# sourceMappingURL=event-monitor.js.map