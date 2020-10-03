"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeWorkitem = exports.queryProcessState = exports.handleWorkitemExecuted = exports.handleNewInstance = exports.createProcessInstance = void 0;
const promise_error_1 = require("./../../adapters/errors/promise-error");
const function_info_1 = require("../../adapters/ethereum-blockchain/structs/function-info");
const console_log_1 = require("../../adapters/messages/console-log");
const ethereumAdapter = require("../../adapters/ethereum-blockchain/ethereum-adapter");
const mongoDBAdapper = require("../../adapters/mongo-db/mongo-db-adapter");
const repo_types_1 = require("../../adapters/mongo-db/repo-types");
let defaultAccount;
exports.createProcessInstance = async (processId, runtimeRegistry, accessCtrolAddr, rbPolicyAddr, taskRoleMapAddr) => {
    if (!defaultAccount)
        defaultAccount = await ethereumAdapter.defaultDeployment();
    return await ethereumAdapter.execContractFunctionAsync(runtimeRegistry.address, runtimeRegistry.abi, new function_info_1.FunctionInfo("newRestrictedCInstanceFor", ["bytes32", "address", "address", "address", "address"]), defaultAccount, [
        processId,
        "0x0000000000000000000000000000000000000000",
        accessCtrolAddr,
        rbPolicyAddr,
        taskRoleMapAddr
    ]);
};
exports.handleNewInstance = (contractName, repoId, transactionHash, processAddress, gasUsed) => {
    console_log_1.print(`New Instance of contract ${contractName} (ID: ${repoId}) Created`, console_log_1.TypeMessage.success);
    console_log_1.print(`  TransactionHash: ${transactionHash}`, console_log_1.TypeMessage.info);
    console_log_1.print(`  Address: ${processAddress}`, console_log_1.TypeMessage.info);
    console_log_1.print(`  GasUsed: ${gasUsed} units`, console_log_1.TypeMessage.info);
    console_log_1.printSeparator();
};
exports.handleWorkitemExecuted = (taskName, workitemIndex, worklistAddress, transactionHash, gasUsed) => {
    console_log_1.print(`Task ${taskName} (Workitem: ${workitemIndex} in worklist at ${worklistAddress}) executed successfully`, console_log_1.TypeMessage.success);
    console_log_1.print(`  TransactionHash: ${transactionHash}`, console_log_1.TypeMessage.info);
    console_log_1.print(`  GasUsed: ${gasUsed} units`, console_log_1.TypeMessage.info);
    console_log_1.printSeparator();
};
exports.queryProcessState = async (pAddress, runtimeRegistry) => {
    if (!ethereumAdapter.isValidBlockchainAddress(pAddress))
        return Promise.reject(`Invalid Process Instance Address ${pAddress}`);
    try {
        let defaultAccount = await ethereumAdapter.defaultDeployment();
        let nestedContractsQueue = [pAddress];
        let enabledWorkitems = [];
        for (let i = 0; i < nestedContractsQueue.length; i++) {
            pAddress = nestedContractsQueue[i];
            let pId = await ethereumAdapter.callContractFunction(runtimeRegistry.address, runtimeRegistry.abi, new function_info_1.FunctionInfo("bundleFor", ["address"], "bytes32"), defaultAccount, [pAddress]);
            let processInfo = await mongoDBAdapper.findModelMetadataById(repo_types_1.RepoType.ProcessCompiledEngine, pId);
            let worklistAddress = await ethereumAdapter.callContractFunction(pAddress, processInfo.contractInfo.abi, new function_info_1.FunctionInfo("getWorklistAddress", [], "address"), defaultAccount, []);
            let startedActivities = ethereumAdapter.toBinaryArray(await ethereumAdapter.callContractFunction(pAddress, processInfo.contractInfo.abi, new function_info_1.FunctionInfo("startedActivities", [], "uint"), defaultAccount, []));
            let dictionary = processInfo.indexToElementMap;
            let worklistAbi = processInfo.worklistABI;
            for (let bit = 0; bit < startedActivities.length; bit++) {
                if (startedActivities[bit] === "1") {
                    if (dictionary[bit].type === "Workitem") {
                        let reqInd = ethereumAdapter.toBinaryArray(await ethereumAdapter.callContractFunction(worklistAddress, worklistAbi, new function_info_1.FunctionInfo("workItemsFor", ["uint256", "address"], "uint256"), defaultAccount, [bit, pAddress]));
                        for (let l = 0; l < reqInd.length; l++) {
                            if (reqInd[l] === "1") {
                                let notFound = true;
                                for (let m = 0; m < enabledWorkitems.length; m++) {
                                    if (enabledWorkitems[m].elementId === dictionary[bit].id &&
                                        enabledWorkitems[m].bundleId === pId) {
                                        enabledWorkitems[m].hrefs.push(`/worklists/${worklistAddress}/workitems/${l}`);
                                        enabledWorkitems[m].pCases.push(await ethereumAdapter.callContractFunction(worklistAddress, worklistAbi, new function_info_1.FunctionInfo("processInstanceFor", ["uint"], "address"), defaultAccount, [l]));
                                        notFound = false;
                                        break;
                                    }
                                }
                                if (notFound) {
                                    enabledWorkitems.push({
                                        elementId: dictionary[bit].id,
                                        elementName: dictionary[bit].name,
                                        input: findParameters(worklistAbi, dictionary[bit].name),
                                        bundleId: pId,
                                        processAddress: pAddress,
                                        pCases: [pAddress],
                                        hrefs: [`/worklists/${worklistAddress}/workitems/${l}`],
                                    });
                                }
                            }
                        }
                    }
                    else if (dictionary[bit].type === "Service") {
                        // PENDING
                    }
                    else if (dictionary[bit].type === "Separate-Instance") {
                        let startedInstances = ethereumAdapter.toBinaryArray(await ethereumAdapter.callContractFunction(pAddress, processInfo.contractInfo.abi, new function_info_1.FunctionInfo("startedInstanceIndexFor", ["uint256"], "uint256"), defaultAccount, [bit]));
                        let allInstances = await ethereumAdapter.callContractFunction(pAddress, processInfo.contractInfo.abi, new function_info_1.FunctionInfo("allInstanceAddresses", [], "address[]"), defaultAccount, []);
                        for (let l = 0; l < startedInstances.length; l++)
                            if (startedInstances[l] === "1")
                                nestedContractsQueue.push(allInstances[l]);
                    }
                }
            }
        }
        console_log_1.print("Started Workitems (Enabled Tasks) Info: ");
        console_log_1.print(JSON.stringify(enabledWorkitems), console_log_1.TypeMessage.data);
        console_log_1.printSeparator();
        return enabledWorkitems;
    }
    catch (error) {
        return Promise.reject(new promise_error_1.PromiseError(`Error Qerying the state of process instance at address ${pAddress}`, error, [new promise_error_1.Component("execution-monitor", "queryProcessState")]));
    }
};
exports.executeWorkitem = async (wlAddress, wiIndex, inputParameters, runtimeRegistry) => {
    try {
        if (!ethereumAdapter.isValidBlockchainAddress(wlAddress))
            return Promise.reject(`Invalid Worklist Instance Address ${wlAddress}`);
        let defaultAccount = await ethereumAdapter.defaultDeployment();
        let pId = await ethereumAdapter.callContractFunction(runtimeRegistry.address, runtimeRegistry.abi, new function_info_1.FunctionInfo("worklistBundleFor", ["address"], "bytes32"), defaultAccount, [wlAddress]);
        let processInfo = await mongoDBAdapper.findModelMetadataById(repo_types_1.RepoType.ProcessCompiledEngine, pId);
        let worklistAbi = processInfo.worklistABI;
        let nodeIndex = await ethereumAdapter.callContractFunction(wlAddress, worklistAbi, new function_info_1.FunctionInfo("elementIndexFor", ["uint256"], "uint256"), defaultAccount, [wiIndex]);
        let taskInfo = processInfo.indexToElementMap[nodeIndex];
        inputParameters = [wiIndex].concat(inputParameters);
        console_log_1.print(`Starting Execution of Task ${taskInfo.name}, on worklist ${wlAddress}`, console_log_1.TypeMessage.pending);
        let transactionHash = await ethereumAdapter.execContractFunctionAsync(wlAddress, worklistAbi, new function_info_1.FunctionInfo(taskInfo.name, ["uint256", "bool"]), defaultAccount, inputParameters);
        return {
            transactionHash: transactionHash,
            worklistAbi: worklistAbi,
            taskName: taskInfo.name,
        };
    }
    catch (error) {
        return Promise.reject(new promise_error_1.PromiseError(`Error Executing Workitme from Worklist at address ${wlAddress}`, error, [new promise_error_1.Component("execution-monitor", "executeWorkitem")]));
    }
};
////////////////////////////////////////////////
/////////////// PRIVATE FUNCTIONS //////////////
////////////////////////////////////////////////
let findParameters = (contractAbi, functionName) => {
    let jsonAbi = JSON.parse(contractAbi);
    let candidates = [];
    jsonAbi.forEach((element) => {
        if (element.name === functionName) {
            candidates = element.inputs;
        }
    });
    let res = [];
    candidates.forEach((element) => {
        if (element.name && element.name !== "workitemId")
            res.push(element);
    });
    return res;
};
//# sourceMappingURL=execution-monitor.js.map