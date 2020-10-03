"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleNewRoleTaskMap = exports.handleNewBPolicyInstance = exports.handleNewAccessControl = exports.deployAccessControl = exports.deployTaskRoleMap = exports.deployBindingPolicy = void 0;
const fs = require("fs");
const error_logs_1 = require("../../adapters/messages/error-logs");
const repo_models_1 = require("./../../adapters/mongo-db/repo-models");
const console_log_1 = require("../../adapters/messages/console-log");
const compilation_output_1 = require("./../../adapters/ethereum-blockchain/structs/compilation-output");
const compilation_input_1 = require("./../../adapters/ethereum-blockchain/structs/compilation-input");
const contract_info_1 = require("./../../adapters/ethereum-blockchain/structs/contract-info");
const async_requests_1 = require("./../utils/structs/async-requests");
const solidityCompiler = require("./../../adapters/ethereum-blockchain/solidity-compiler");
const ethereumAdapter = require("./../../adapters/ethereum-blockchain/ethereum-adapter");
const mongoDBAdapter = require("./../../adapters/mongo-db/mongo-db-adapter");
const eventMonitor = require("./../../adapters/event-monitor/event-monitor");
const repo_types_1 = require("../../adapters/mongo-db/repo-types");
const app_1 = require("../../app");
let defaultAccount;
exports.deployBindingPolicy = async (rbPolicy) => {
    try {
        let [cInfo, transactionHash] = await deployContract("RoleBindingPolicy", rbPolicy.solidity);
        let newRequest = new async_requests_1.NewBPolicyInstance(transactionHash, this.handleNewBPolicyInstance, cInfo, rbPolicy.model, rbPolicy.roleIndexMap);
        eventMonitor.listenForPendingTransaction(newRequest);
        printNewTransaction(transactionHash, cInfo.contractName);
        return transactionHash;
    }
    catch (error) {
        return Promise.reject(error);
    }
};
exports.deployTaskRoleMap = async (contractName, taskRolePairs, solidityCode) => {
    try {
        let [cInfo, transactionHash] = await deployContract(contractName, solidityCode);
        let newRequest = new async_requests_1.NewRoleTaskMap(transactionHash, this.handleNewRoleTaskMap, cInfo, taskRolePairs);
        eventMonitor.listenForPendingTransaction(newRequest);
        printNewTransaction(transactionHash, cInfo.contractName);
        return transactionHash;
    }
    catch (error) {
        return Promise.reject(error);
    }
};
exports.deployAccessControl = async () => {
    let [cInfo, transactionHash] = await deployContract("BindingAccessControl", fs.readFileSync("./src/dynamic-access-control/utils/solidity-interfaces/binding-access-control.sol", "utf8"));
    let newRequest = new async_requests_1.NewInstanceRequest(transactionHash, this.handleNewAccessControl, cInfo);
    eventMonitor.listenForPendingTransaction(newRequest);
    printNewTransaction(transactionHash, cInfo.contractName);
    return transactionHash;
};
/////////////////////////////////////////////////////
/////// CALLBACKS FOR ASYNCHRONOUS OPERATIONS ///////
/////////////////////////////////////////////////////
exports.handleNewAccessControl = async (cInfo) => {
    try {
        let repoId = await mongoDBAdapter.updateRepository(repo_types_1.RepoType.SmartContract, new repo_models_1.ModelMetadata(toContractInfo(cInfo)));
        sendResponse(cInfo, repoId);
    }
    catch (error) {
        handleError("handleNewBPolicyInstance", error);
    }
};
exports.handleNewBPolicyInstance = async (policyInfo) => {
    try {
        let policyID = await mongoDBAdapter.updateRepository(repo_types_1.RepoType.RoleBindingPolicy, new repo_models_1.RoleBindingPolicy(policyInfo.policyModel, policyInfo.roleIndexMap, toContractInfo(policyInfo)));
        sendResponse(policyInfo, policyID);
    }
    catch (error) {
        handleError("handleNewBPolicyInstance", error);
    }
};
exports.handleNewRoleTaskMap = async (mapInfo) => {
    try {
        let policyID = await mongoDBAdapter.updateRepository(repo_types_1.RepoType.RoleTaskMap, new repo_models_1.RoleTaskMap(toArray(mapInfo.roleTaskPairs), toContractInfo(mapInfo)));
        sendResponse(mapInfo, policyID);
    }
    catch (error) {
        handleError("handleNewRoleTaskMap", error);
    }
};
////////////////////////////////////////////
//////////// PRIVATE FUNCTIONS /////////////
////////////////////////////////////////////
let compilePolicyContract = async (contractName, solidityCode) => {
    try {
        let inputContract = new compilation_input_1.CompilationInput(contractName, solidityCode, []);
        let compiledContracts = solidityCompiler.compileSmartContracts(inputContract);
        if (compiledContracts[0] instanceof compilation_output_1.CompilationError)
            return Promise.reject(compiledContracts[0]);
        let result = compiledContracts[0];
        result.solidity = solidityCode;
        return result;
    }
    catch (error) {
        return Promise.reject(error);
    }
};
let deployContract = async (contractName, solidityCode, args) => {
    try {
        let cInfo = await compilePolicyContract(contractName, solidityCode);
        if (cInfo instanceof compilation_output_1.CompilationResult) {
            if (!this.defaultAccount)
                this.defaultAccount = await ethereumAdapter.defaultDeployment();
            let transactionHash = await ethereumAdapter.deploySmartContractAsync(cInfo, this.defaultAccount, args);
            return [cInfo, transactionHash];
        }
        else {
            throw new Error(cInfo);
        }
    }
    catch (error) {
        console_log_1.print(error, console_log_1.TypeMessage.error);
        throw new Error(error);
    }
};
let validateInfoToLink = async (processId, isCompiled, accessControlId, rbPolicyID, trMapAddrID) => {
    try {
        let rbPolicyInfo = await mongoDBAdapter.findModelMetadataById(repo_types_1.RepoType.RoleBindingPolicy, rbPolicyID);
        if (!(rbPolicyInfo instanceof repo_models_1.ModelMetadata))
            return Promise.reject("Invalid policy ID");
        let taskRoleInfo = await mongoDBAdapter.findModelMetadataById(repo_types_1.RepoType.RoleTaskMap, trMapAddrID);
        if (!(taskRoleInfo instanceof repo_models_1.ModelMetadata))
            return Promise.reject("Invalid task role map id");
        let accessControlInfo = await mongoDBAdapter.findContractInfoById(repo_types_1.RepoType.SmartContract, accessControlId);
        if (!(accessControlInfo instanceof contract_info_1.ContractInfo))
            return Promise.reject("Invalid access control id");
        let processInfo = await mongoDBAdapter.findModelMetadataById(isCompiled === false
            ? repo_types_1.RepoType.ProcessCompiledEngine
            : repo_types_1.RepoType.ProcessInterpretedEngine, processId);
        if (!(processInfo instanceof repo_models_1.ModelMetadata))
            return Promise.reject("Invalid process id");
        if (!this.defaultAccount)
            this.defaultAccount = await ethereumAdapter.defaultDeployment();
        return [
            rbPolicyInfo.contractInfo.address,
            taskRoleInfo.contractInfo.address,
            accessControlInfo,
        ];
    }
    catch (error) {
        return Promise.reject(error);
    }
};
let toContractInfo = (resultInfo) => {
    return new contract_info_1.ContractInfo(resultInfo.compilationInfo.contractName, resultInfo.compilationInfo.abi, resultInfo.compilationInfo.bytecode, resultInfo.compilationInfo.solidity, resultInfo.contractAddress);
};
let toArray = (roleTask) => {
    let result = [];
    roleTask.forEach((element) => {
        result[element.taskIndex] = element.roleIndex;
    });
    return result;
};
let sendResponse = (info, id) => {
    console_log_1.print(`SUCCESS: ${info.compilationInfo.contractName} deployed succesfully`, console_log_1.TypeMessage.success);
    console_log_1.print(`   Transaction Hash: ${info.transactionHash}`, console_log_1.TypeMessage.data);
    console_log_1.print(`   Address: ${info.contractAddress}`, console_log_1.TypeMessage.data);
    console_log_1.print(`   Cost: ${info.gasCost} gas`, console_log_1.TypeMessage.data);
    console_log_1.print(`   Repository ID: ${id}`, console_log_1.TypeMessage.data);
    console_log_1.printSeparator();
    app_1.sendThroughSocket(JSON.stringify({
        repoID: id,
        policyInfo: JSON.stringify(info),
    }));
};
let printNewTransaction = (transactionHash, contractName) => {
    console_log_1.print(`SUBMITTED: new instance of ${contractName} submitted`, console_log_1.TypeMessage.pending);
    console_log_1.print(`   Transaction Hash: ${transactionHash}`, console_log_1.TypeMessage.data);
    console_log_1.printSeparator();
};
let handleError = (functName, errorMessage) => {
    error_logs_1.printError("ERROR: DYNAMIC-ACCESS CONTROL: deployment-mediator", functName, errorMessage);
    app_1.sendThroughSocket(errorMessage.toString());
};
let printExecutionInfo = (callInfo) => {
    console_log_1.print(`SUCCESS: Function RuntimeRegistry.relateProcessToPolicy executed succesfully`, console_log_1.TypeMessage.success);
    console_log_1.print(`   Transaction Hash: ${callInfo.transactionHash}`, console_log_1.TypeMessage.data);
    console_log_1.print(`   Cost: ${callInfo.gasCost} gas`, console_log_1.TypeMessage.data);
    console_log_1.print(`   Policy Address: ${callInfo.policyAddress}`, console_log_1.TypeMessage.data);
    console_log_1.print(`   Task-Role Address: ${callInfo.taskRoleAddress}`, console_log_1.TypeMessage.data);
    console_log_1.print(`   Access Control Address: ${callInfo.accessControlInfo.address}`, console_log_1.TypeMessage.data);
    console_log_1.printSeparator();
};
//# sourceMappingURL=deployment-mediator.js.map