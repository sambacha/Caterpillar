"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.performOperation = exports.handleRuntimeOperation = exports.getRoleState = exports.vote = exports.release = exports.nominate = exports.nominateCaseCreator = exports.OperationType = void 0;
const app_1 = require("./../../app");
const console_log_1 = require("../../adapters/messages/console-log");
const async_requests_1 = require("./../utils/structs/async-requests");
const ethereumAdapter = require("./../../adapters/ethereum-blockchain/ethereum-adapter");
const eventMonitor = require("./../../adapters/event-monitor/event-monitor");
const policy_info_collector_1 = require("./../services/policy-info-collector");
const function_info_1 = require("../../adapters/ethereum-blockchain/structs/function-info");
var OperationType;
(function (OperationType) {
    OperationType["voteNomination"] = "voteN";
    OperationType["voteRelease"] = "voteR";
})(OperationType = exports.OperationType || (exports.OperationType = {}));
let roleStates = ["UNBOUND", "RELEASING", "NOMINATED", "BOUND"];
let defaultAcccount;
exports.nominateCaseCreator = async (runtimeRegistry, pCase, rNominee, nomineeAddr) => {
    return await exports.performOperation(runtimeRegistry, 2, "nominateCaseCreator", ["uint256", "address", "address"], ["rNominee", "nominee", "pCase"], [rNominee, nomineeAddr, pCase]);
};
exports.nominate = async (runtimeRegistry, pCase, rNominator, rNominee, nominatorAddr, nomineeAddr) => {
    return await exports.performOperation(runtimeRegistry, 4, "nominate", ["uint256", "uint256", "address", "address", "address"], ["rNominator", "rNominee", "nominator", "nominee", "pCase"], [rNominator, rNominee, nominatorAddr, nomineeAddr, pCase]);
};
exports.release = async (runtimeRegistry, pCase, rNominator, rNominee, nominatorAddr) => {
    return await exports.performOperation(runtimeRegistry, 3, "release", ["uint256", "uint256", "address", "address"], ["rNominator", "rNominee", "nominator", "pCase"], [rNominator, rNominee, nominatorAddr, pCase]);
};
exports.vote = async (runtimeRegistry, pCase, rNominator, rNominee, rEndorser, endorserAddr, isAccepted, operationType) => {
    return await exports.performOperation(runtimeRegistry, 4, operationType, ["uint256", "uint256", "uint256", "address", "address", "bool"], ["rNominator", "rNominee", "rEndorser", "endorser", "pCase", "isAccepted"], [rNominator, rNominee, rEndorser, endorserAddr, pCase, isAccepted]);
};
exports.getRoleState = async (runtimeRegistry, pCase, role) => {
    try {
        if (!this.defaultAccount)
            this.defaultAccount = await ethereumAdapter.defaultDeployment();
        let [accCtrlInfo, policyInfo] = (await policy_info_collector_1.recoverPolicyInfo(runtimeRegistry, pCase));
        let roleIndex = findRoleIndex([role], policyInfo.roleIndexMap);
        if (roleIndex[0] === role)
            return printAndReturn(role, "UNDEFINED");
        return printAndReturn(role, roleStates[await ethereumAdapter.callContractFunction(accCtrlInfo.address, accCtrlInfo.abi, new function_info_1.FunctionInfo("roleState", ["uint256", "address"], "uint256"), this.defaultAccount, [roleIndex, pCase])]);
    }
    catch (error) {
        console_log_1.print(`ERROR retrieving role-state: ${error}`, console_log_1.TypeMessage.error);
        return Promise.reject(error);
    }
};
/////////////////////////////////////////////////////
/////// CALLBACKS FOR ASYNCHRONOUS OPERATIONS ///////
/////////////////////////////////////////////////////
exports.handleRuntimeOperation = (rOperation) => {
    console_log_1.print(`SUCCESS: Runtime Operation ${rOperation.operationName} executed`, console_log_1.TypeMessage.success);
    console_log_1.print(`   TransactionHash: ${rOperation.transactionHash}`, console_log_1.TypeMessage.data);
    console_log_1.print(`   Cost: ${rOperation.gasCost}`, console_log_1.TypeMessage.data);
    console_log_1.print("   Input Paramaters:  ");
    for (let i = 0; i < rOperation.inParamsValues.length; i++)
        console_log_1.print(`     ${rOperation.inParamNames[i]}: ${rOperation.inParamsValues[i]}`, console_log_1.TypeMessage.data);
    console_log_1.printSeparator();
    app_1.sendThroughSocket(JSON.stringify(rOperation));
};
////////////////////////////////////////////
//////////// PRIVATE FUNCTIONS /////////////
////////////////////////////////////////////
let printAndReturn = (role, state) => {
    console_log_1.print(`SUCCESS: State of role ${role}  retrieved`, console_log_1.TypeMessage.success);
    console_log_1.print(` State: ${state}`, console_log_1.TypeMessage.data);
    console_log_1.printSeparator();
    return state;
};
exports.performOperation = async (runtimeRegistry, pCaseIndex, functName, inParamsType, inParamsNames, inParamsValues) => {
    try {
        if (!this.defaultAccount)
            this.defaultAccount = await ethereumAdapter.defaultDeployment();
        let pCase = inParamsValues[pCaseIndex];
        let [accCtrlInfo, policyInfo] = (await policy_info_collector_1.recoverPolicyInfo(runtimeRegistry, pCase));
        let transHash = await ethereumAdapter.execContractFunctionAsync(accCtrlInfo.address, accCtrlInfo.abi, new function_info_1.FunctionInfo(functName, inParamsType), this.defaultAccount, findRoleIndex(inParamsValues, policyInfo.roleIndexMap));
        eventMonitor.listenForPendingTransaction(new async_requests_1.RuntimeOperationCall(transHash, this.handleRuntimeOperation, functName, inParamsNames, inParamsValues));
        return { transactionHash: transHash };
    }
    catch (error) {
        return Promise.reject(error);
    }
};
let findRoleIndex = (values, roleIndexMap) => {
    return values.map((role) => {
        return roleIndexMap.has(role) ? roleIndexMap.get(role) : role;
    });
};
//# sourceMappingURL=runtime-operations-mediator.js.map