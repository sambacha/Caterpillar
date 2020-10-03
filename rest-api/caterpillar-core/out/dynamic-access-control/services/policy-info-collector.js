"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recoverPolicyInfo = exports.findPolicyRelatedAddresses = exports.findAccessControlMetadata = exports.findRoleTaskMapMetadata = exports.findPolicyMetadata = void 0;
const contract_info_1 = require("./../../adapters/ethereum-blockchain/structs/contract-info");
const repo_models_1 = require("./../../adapters/mongo-db/repo-models");
const console_log_1 = require("../../adapters/messages/console-log");
const repo_types_1 = require("../../adapters/mongo-db/repo-types");
const ethereumAdapter = require("./../../adapters/ethereum-blockchain/ethereum-adapter");
const mongoDBAdapter = require("./../../adapters/mongo-db/mongo-db-adapter");
const function_info_1 = require("../../adapters/ethereum-blockchain/structs/function-info");
let defaultAccount;
exports.findPolicyMetadata = async (policyAddress) => {
    let policyInfo = await mongoDBAdapter.findPolicyByAddress(repo_types_1.RepoType.RoleBindingPolicy, policyAddress);
    printMetadata(policyAddress, policyInfo);
    if (policyInfo instanceof repo_models_1.RoleBindingPolicy)
        return policyInfo;
    return Promise.reject(policyInfo);
};
exports.findRoleTaskMapMetadata = async (roleTaskMapAddress) => {
    let roleTaskInfo = await mongoDBAdapter.findPolicyByAddress(repo_types_1.RepoType.RoleTaskMap, roleTaskMapAddress);
    printMetadata(roleTaskMapAddress, roleTaskInfo);
    if (roleTaskInfo instanceof repo_models_1.RoleTaskMap)
        return roleTaskInfo;
    return Promise.reject(roleTaskInfo);
};
exports.findAccessControlMetadata = async (accessControlAddr) => {
    let accessControlInfo = await mongoDBAdapter.findContractInfoByAddress(repo_types_1.RepoType.SmartContract, accessControlAddr);
    printMetadata(accessControlAddr, accessControlInfo);
    if (accessControlInfo instanceof contract_info_1.ContractInfo)
        return accessControlInfo;
    return Promise.reject(accessControlInfo);
};
exports.findPolicyRelatedAddresses = async (runtimeRegistry, pCase) => {
    try {
        let [accCtrlInfo, policyInfo] = (await exports.recoverPolicyInfo(runtimeRegistry, pCase));
        let roleTaskAddr = await ethereumAdapter.callContractFunction(accCtrlInfo.address, accCtrlInfo.abi, new function_info_1.FunctionInfo("getTaskRoleAddress", ["address"], "address"), this.defaultAccount, [pCase]);
        printAddresses([
            pCase,
            accCtrlInfo.address,
            policyInfo.contractInfo.address,
            roleTaskAddr,
        ]);
        return [accCtrlInfo.address, policyInfo.contractInfo.address, roleTaskAddr];
    }
    catch (error) {
        return Promise.reject(error);
    }
};
exports.recoverPolicyInfo = async (runtimeRegistry, pCase) => {
    try {
        if (!this.defaultAccount)
            this.defaultAccount = await ethereumAdapter.defaultDeployment();
        let accessCtrlAddr = await ethereumAdapter.callContractFunction(runtimeRegistry.address, runtimeRegistry.abi, new function_info_1.FunctionInfo("findRuntimePolicy", ["address"], "address"), this.defaultAccount, [pCase]);
        let accessCtrlInfo = (await mongoDBAdapter.findContractInfoByAddress(repo_types_1.RepoType.SmartContract, accessCtrlAddr));
        let policyAddr = await ethereumAdapter.callContractFunction(accessCtrlInfo.address, accessCtrlInfo.abi, new function_info_1.FunctionInfo("getPolicyAddress", ["address"], "address"), this.defaultAccount, [pCase]);
        let policyInfo = (await mongoDBAdapter.findPolicyByAddress(repo_types_1.RepoType.RoleBindingPolicy, policyAddr));
        return [accessCtrlInfo, policyInfo];
    }
    catch (error) {
        return Promise.reject(error);
    }
};
////////////////////////////////////////////
//////////// PRIVATE FUNCTIONS /////////////
////////////////////////////////////////////
let printMetadata = (input, policyInfo) => {
    if (policyInfo instanceof repo_models_1.RoleBindingPolicy) {
        console_log_1.print(`SUCCESS: Role-Binding Policy metadata running at ${input} recovered successfully`, console_log_1.TypeMessage.success);
        printableMap(policyInfo);
    }
    else if (policyInfo instanceof repo_models_1.RoleTaskMap) {
        console_log_1.print(`SUCCESS: Role-Task Map metadata running at ${input} recovered successfully`, console_log_1.TypeMessage.success);
        console_log_1.print(JSON.stringify(policyInfo), console_log_1.TypeMessage.data);
    }
    else if (policyInfo instanceof contract_info_1.ContractInfo) {
        console_log_1.print(`SUCCESS: Dynamic Access Control metadata running at ${input} recovered successfully`, console_log_1.TypeMessage.success);
        console_log_1.print(JSON.stringify(policyInfo), console_log_1.TypeMessage.data);
    }
    else {
        console_log_1.print(`ERROR: Recovering policy metadata at ${input}`, console_log_1.TypeMessage.error);
        console_log_1.print(`${policyInfo}`, console_log_1.TypeMessage.error);
    }
    console_log_1.printSeparator();
};
let printableMap = (policy) => {
    let jsonMap = {};
    policy.roleIndexMap.forEach((eInd, eId) => {
        jsonMap[eId] = eInd;
    });
    console_log_1.print(JSON.stringify({
        _id: policy._id,
        policyModel: policy.policyModel,
        roleIndexMap: jsonMap,
        contractInfo: policy.contractInfo,
    }), console_log_1.TypeMessage.data);
};
let printAddresses = (addreses) => {
    console_log_1.print(`SUCCESS: Addresses of policy-related contracts linked to process instance at ${addreses[0]} recovered`, console_log_1.TypeMessage.success);
    console_log_1.print(`   Access Control Address: ${addreses[1]}`, console_log_1.TypeMessage.data);
    console_log_1.print(`   Binding Policy Address: ${addreses[2]}`, console_log_1.TypeMessage.data);
    console_log_1.print(`   Role-Task Map Address:  ${addreses[3]}`, console_log_1.TypeMessage.data);
    console_log_1.printSeparator();
};
//# sourceMappingURL=policy-info-collector.js.map