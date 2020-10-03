"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleTaskExecutionCompleted = exports.handleNewInstanceCreated = exports.checkOutTaskData = exports.executeTask = exports.queryProcessState = exports.createNewProcessInstance = void 0;
const async_requests_1 = require("./../../utils/structs/async-requests");
const console_log_1 = require("../../../adapters/messages/console-log");
const repo_types_1 = require("../../../adapters/mongo-db/repo-types");
const error_logs_1 = require("../../../adapters/messages/error-logs");
const mongoDBAdapter = require("./../../../adapters/mongo-db/mongo-db-adapter");
const ethereumAdapter = require("./../../../adapters/ethereum-blockchain/ethereum-adapter");
const function_info_1 = require("../../../adapters/ethereum-blockchain/structs/function-info");
const eventMonitorService = require("./event-monitor");
const event_monitor_1 = require("./../worklist-handler/event-monitor");
const app_1 = require("../../../app");
let defaultAcccount;
exports.createNewProcessInstance = async (iFlowAddr, runtimeRegistry, accessCtrolAddr, rbPolicyAddr, taskRoleMapAddr) => {
    try {
        await validateAddressInput(iFlowAddr, "IFlow");
        await validateAddressInput(accessCtrolAddr, "DynamicAccessControl");
        await validateAddressInput(rbPolicyAddr, "RoleBindingPolicy");
        await validateAddressInput(taskRoleMapAddr, "TaskRoleMap");
        let interpreterInfo = await getInterpreterInfoFromIFlow(iFlowAddr);
        let transactionHash = await ethereumAdapter.execContractFunctionAsync(runtimeRegistry.address, runtimeRegistry.abi, new function_info_1.FunctionInfo("newRestrictedIInstanceFor", [
            "address",
            "address",
            "address",
            "address",
            "address",
        ]), this.defaultAccount, [
            iFlowAddr,
            interpreterInfo.address,
            accessCtrolAddr,
            rbPolicyAddr,
            taskRoleMapAddr,
        ]);
        eventMonitorService.listenForPendingLogs(interpreterInfo.address, interpreterInfo.abi, event_monitor_1.EventType.NewCaseCreated, new async_requests_1.NewContractRequest(transactionHash, this.handleNewInstanceCreated, interpreterInfo.address));
        return transactionHash;
    }
    catch (error) {
        error_logs_1.printError(`INTERPRETATION ENGINE: executionMediator`, "createNewProcessInstance", error);
        return Promise.reject(error);
    }
};
exports.queryProcessState = async (iDataAddr, runtimeRegistry) => {
    try {
        await validateAddressInput(iDataAddr, "IData");
        // Retrieving the IFlow node related to the input IData from Runtime Registry.
        let iFlowAddr = await findIFlowAddress(iDataAddr, runtimeRegistry);
        // Retrieving identifier of the process metadata entry in repository from Runtime Registry.
        let procId = await ethereumAdapter.callContractFunction(runtimeRegistry.address, runtimeRegistry.abi, new function_info_1.FunctionInfo("getBundleIdFromIFlow", ["address"], "bytes32"), this.defaultAccount, [iFlowAddr]);
        // Retrieving the Process Hierarchy metadata from process repository
        let procInfo = (await mongoDBAdapter.findModelMetadataById(repo_types_1.RepoType.ProcessInterpretedEngine, procId));
        // BFS on process hierarchy to discover enabled tasks
        let enabledWorkitems = new Array();
        let queue = [procInfo];
        let iDataAddresses = [iDataAddr];
        for (let topP = 0; topP < queue.length; topP++) {
            procInfo = queue[topP];
            iDataAddr = iDataAddresses[topP];
            let iFlowInfo = procInfo.iFlow;
            let iDataInfo = procInfo.iData;
            let tokens = ethereumAdapter.toBinaryArray(await ethereumAdapter.callContractFunction(iDataAddr, iDataInfo.abi, new function_info_1.FunctionInfo("getMarking", [], "uint256"), this.defaultAccount));
            let elementList = procInfo.indexToElement;
            for (let eInd = 1; eInd < elementList.length; eInd++) {
                let preC = ethereumAdapter.toBinaryArray(await ethereumAdapter.callContractFunction(iFlowInfo.address, iFlowInfo.abi, new function_info_1.FunctionInfo("getPreCond", ["uint256"], "uint256"), this.defaultAccount, [eInd]));
                let typeInfo = ethereumAdapter.toBinaryArray(await ethereumAdapter.callContractFunction(iFlowInfo.address, iFlowInfo.abi, new function_info_1.FunctionInfo("getTypeInfo", ["uint256"], "uint256"), this.defaultAccount, [eInd]));
                if (isWorkItem(typeInfo)) {
                    // User Task or Receive Task
                    for (let i = 0; i < preC.length; i++) {
                        if (preC[i] === "1" && i < tokens.length && tokens[i] === "1") {
                            enabledWorkitems.push({
                                elementName: JSON.parse(elementList[eInd].element).eName,
                                input: elementList[eInd].input,
                                output: elementList[eInd].output,
                                bundleId: procInfo._id,
                                hrefs: [`/i-flow/${eInd}/i-data/${iDataAddr}`],
                            });
                            break;
                        }
                    }
                }
            }
            let startedActivities = ethereumAdapter.toBinaryArray(await ethereumAdapter.callContractFunction(iDataAddr, iDataInfo.abi, new function_info_1.FunctionInfo("getStartedActivities", [], "uint256"), this.defaultAccount));
            for (let subPInd = 1; subPInd < startedActivities.length; subPInd++) {
                if (startedActivities[subPInd] === "1") {
                    let childAddresses = await ethereumAdapter.callContractFunction(iDataAddr, iDataInfo.abi, new function_info_1.FunctionInfo("getChildProcInst", ["uint256"], "address[]"), this.defaultAccount, [subPInd]);
                    for (let j = 0; j < childAddresses.length; j++) {
                        queue.push(procInfo.children[j]);
                        iDataAddresses.push(childAddresses[j]);
                    }
                }
            }
        }
        printInOutInfo(1, [iDataAddresses[0], enabledWorkitems]);
        return enabledWorkitems;
    }
    catch (error) {
        error_logs_1.printError(`INTERPRETATION ENGINE: executionMediator`, "queryProcessState", error);
        return Promise.reject(error);
    }
};
exports.executeTask = async (eIndex, iDataAddr, inParams, runtimeRegistry) => {
    try {
        await validateAddressInput(iDataAddr, "IData");
        // Retrieving the IFlow node related to the input IData from Runtime Registry.
        let iFlowAddr = await findIFlowAddress(iDataAddr, runtimeRegistry);
        let iFlowInfo = (await mongoDBAdapter.findContractInfoByAddress(repo_types_1.RepoType.SmartContract, iFlowAddr));
        let iDataInfo = (await mongoDBAdapter.findContractInfoById(repo_types_1.RepoType.SmartContract, iFlowInfo._relId));
        let [paramTypes, paramValues] = extractParams(inParams, eIndex);
        let transactionHash = await ethereumAdapter.execContractFunctionAsync(iDataAddr, iDataInfo.abi, new function_info_1.FunctionInfo("checkIn", paramTypes), this.defaultAccount, paramValues);
        eventMonitorService.listenForPendingTransaction(transactionHash, new async_requests_1.TaskExecutionRequest(transactionHash, this.handleTaskExecutionCompleted, eIndex, paramValues, iDataAddr));
        return transactionHash;
    }
    catch (error) {
        return Promise.reject(error);
    }
};
exports.checkOutTaskData = async (eIndex, iDataAddr, outParams, runtimeRegistry) => {
    try {
        if (outParams.length == 0)
            return {};
        await validateAddressInput(iDataAddr, "IData");
        // Retrieving the IFlow node related to the input IData from Runtime Registry.
        let iFlowAddr = await findIFlowAddress(iDataAddr, runtimeRegistry);
        let iFlowInfo = (await mongoDBAdapter.findContractInfoByAddress(repo_types_1.RepoType.SmartContract, iFlowAddr));
        let iDataInfo = (await mongoDBAdapter.findContractInfoById(repo_types_1.RepoType.SmartContract, iFlowInfo._relId));
        let paramInfo = extractOutParams(outParams);
        let processData = mapOutParamToValue(await ethereumAdapter.callContractFunction(iDataAddr, iDataInfo.abi, new function_info_1.FunctionInfo(paramInfo[0], ["uint256"], paramInfo[1], true), this.defaultAccount, [eIndex]), outParams);
        printInOutInfo(2, [eIndex, iDataAddr, processData]);
        return processData;
    }
    catch (error) {
        console_log_1.print(error, console_log_1.TypeMessage.error);
        return Promise.reject(error);
    }
};
/////////////////////////////////////////////////////
/////// CALLBACKS FOR ASYNCHRONOUS OPERATIONS ///////
/////////////////////////////////////////////////////
let findIFlowAddress = async (iDataAddr, runtimeRegistry) => {
    return await ethereumAdapter.callContractFunction(runtimeRegistry.address, runtimeRegistry.abi, new function_info_1.FunctionInfo("getIFlowFromIData", ["address"], "address"), this.defaultAccount, [iDataAddr]);
};
exports.handleNewInstanceCreated = async (requestInfo) => {
    if (app_1.webSocket)
        app_1.webSocket.send(JSON.stringify(requestInfo));
    printHandlerInfo(1, requestInfo);
};
exports.handleTaskExecutionCompleted = (requestInfo) => {
    if (app_1.webSocket)
        app_1.webSocket.send(JSON.stringify(requestInfo));
    printHandlerInfo(2, requestInfo);
};
////////////////////////////////////////////
//////////// PRIVATE FUNCTIONS /////////////
////////////////////////////////////////////
let validateAddressInput = async (address, nodeType) => {
    if (!ethereumAdapter.isValidBlockchainAddress(address)) {
        error_logs_1.printError(`INTERPRETATION ENGINE: executionMediator`, "createNewProcessInstance", `Invalid ${nodeType} Address ${address}`);
        throw new Error(`Invalid ${nodeType} Address ${address}`);
    }
    if (!this.defaultAccount)
        this.defaultAccount = await ethereumAdapter.defaultDeployment();
};
let isWorkItem = (typeInfo) => {
    return (typeInfo[0] === "1" &&
        typeInfo[3] === "1" &&
        (typeInfo[11] === "1" || typeInfo[14] === "1"));
};
let getInterpreterInfoFromIFlow = async (iFlowAddr) => {
    let iFlowInfo = await mongoDBAdapter.findContractInfoByAddress(repo_types_1.RepoType.SmartContract, iFlowAddr);
    let interpreterAddr = await ethereumAdapter.callContractFunction(iFlowAddr, iFlowInfo.abi, new function_info_1.FunctionInfo("getInterpreterInst", [], "address"), this.defaultAccount, []);
    let interpreterInfo = await mongoDBAdapter.findContractInfoByAddress(repo_types_1.RepoType.SmartContract, interpreterAddr);
    return interpreterInfo;
};
let extractParams = (jsonInput, eInd) => {
    let types = ["uint256"];
    let values = [eInd];
    jsonInput.forEach((param) => {
        types.push(param.type);
        values.push(param.value);
    });
    return [types, values];
};
let extractOutParams = (outParams) => {
    let functName = "checkOut";
    let paramTypes = [];
    outParams.forEach((param) => {
        functName += param.type.charAt(0).toUpperCase() + param.type.charAt(1);
        paramTypes.push(param.type.toString());
    });
    return [functName, `${paramTypes.toString()}`];
};
let mapOutParamToValue = (processData, outParams) => {
    let result = {};
    for (let i = 0; i < outParams.length; i++)
        result[outParams[i].name] = processData[i];
    return result;
};
let printInOutInfo = (type, info) => {
    switch (type) {
        case 1: {
            console_log_1.print(`Enabled activities of process running at ${info[0]} retrieved`, console_log_1.TypeMessage.success);
            console_log_1.print(JSON.stringify(info[1]), console_log_1.TypeMessage.data);
            console_log_1.printSeparator();
            break;
        }
        case 2: {
            console_log_1.print(`Output params from task ${info[0]} at IData ${info[1]} checked out`, console_log_1.TypeMessage.success);
            console_log_1.print(`   Data: ${JSON.stringify(info[2])}`, console_log_1.TypeMessage.data);
            console_log_1.printSeparator();
            break;
        }
    }
};
let printHandlerInfo = (type, requestInfo) => {
    switch (type) {
        case 1: {
            console_log_1.print(`SUCCESS: New Process Instance created from IFlow running at ${requestInfo.iFlowAddr}`, console_log_1.TypeMessage.success);
            console_log_1.print(`  TransactionHash: ${requestInfo.transactionHash}`, console_log_1.TypeMessage.info);
            console_log_1.print(`  Address: ${requestInfo.iDataAddr}`, console_log_1.TypeMessage.info);
            console_log_1.print(`  GasUsed: ${requestInfo.gasCost} units`, console_log_1.TypeMessage.info);
            console_log_1.printSeparator();
            break;
        }
        case 2: {
            console_log_1.print(`SUCCESS: Task ${requestInfo.eName} executed successfully at IData running at ${requestInfo.iDataAddr}`, console_log_1.TypeMessage.success);
            console_log_1.print(`  TransactionHash: ${requestInfo.transactionHash}`, console_log_1.TypeMessage.info);
            console_log_1.print(`  Input Params: ${requestInfo.params}`, console_log_1.TypeMessage.info);
            console_log_1.print(`  GasUsed: ${requestInfo.gasCost} units`, console_log_1.TypeMessage.info);
            console_log_1.printSeparator();
            break;
        }
    }
};
//# sourceMappingURL=execution-mediator.js.map