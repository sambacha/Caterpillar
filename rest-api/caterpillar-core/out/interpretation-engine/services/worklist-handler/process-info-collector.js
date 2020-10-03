"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findIFlowInfo = exports.findIDataInstances = exports.findProcessModelMetadata = void 0;
const error_logs_1 = require("../../../adapters/messages/error-logs");
const console_log_1 = require("../../../adapters/messages/console-log");
const mongoDBAdapter = require("./../../../adapters/mongo-db/mongo-db-adapter");
const repo_types_1 = require("../../../adapters/mongo-db/repo-types");
const ethereumAdapter = require("./../../../adapters/ethereum-blockchain/ethereum-adapter");
const function_info_1 = require("../../../adapters/ethereum-blockchain/structs/function-info");
let defaultAccount;
exports.findProcessModelMetadata = async (mHash) => {
    let info = await mongoDBAdapter.findModelMetadataById(repo_types_1.RepoType.ProcessInterpretedEngine, mHash);
    printQueryInfo(0, [mHash, info]);
    return info;
};
exports.findIDataInstances = async (iFlowAddr) => {
    if (!ethereumAdapter.isValidBlockchainAddress(iFlowAddr))
        return Promise.reject(`Invalid iFlow address ${iFlowAddr}`);
    let iFlowInfo = await mongoDBAdapter.findContractInfoByAddress(repo_types_1.RepoType.SmartContract, iFlowAddr);
    if (!this.defaultAccount)
        this.defaultAccount = await ethereumAdapter.defaultDeployment();
    let pCases = await ethereumAdapter.callContractFunction(iFlowAddr, iFlowInfo.abi, new function_info_1.FunctionInfo("getIDataInstances", [], "address[]"), this.defaultAccount, []);
    printQueryInfo(1, [iFlowAddr, pCases]);
    return pCases;
};
exports.findIFlowInfo = async (iFlowAddr) => {
    try {
        if (!ethereumAdapter.isValidBlockchainAddress(iFlowAddr))
            return Promise.reject(`Invalid iFlow address ${iFlowAddr}`);
        if (!this.defaultAccount)
            this.defaultAccount = await ethereumAdapter.defaultDeployment();
        let iFlowInfo = (await mongoDBAdapter.findContractInfoByAddress(repo_types_1.RepoType.SmartContract, iFlowAddr));
        let eInd = 1;
        let elementInfo = [];
        while (true) {
            let info = await ethereumAdapter.callContractFunction(iFlowAddr, iFlowInfo.abi, new function_info_1.FunctionInfo("getElementInfo", ["uint256"], "uint256,uint256,uint256,uint256[]", true), this.defaultAccount, [eInd]);
            if (info[2] === "0")
                break;
            elementInfo.push(formatElementInfo(eInd, info));
            eInd++;
        }
        let subProcIndexes = await ethereumAdapter.callContractFunction(iFlowAddr, iFlowInfo.abi, new function_info_1.FunctionInfo("getSubProcList", [], "uint256[]"), this.defaultAccount, []);
        let subProcInfo = [];
        for (let i = 0; i < subProcIndexes.length; i++) {
            subProcInfo.push({
                subProcIndex: subProcIndexes[i],
                iFlowAddress: await ethereumAdapter.callContractFunction(iFlowAddr, iFlowInfo.abi, new function_info_1.FunctionInfo("getSubProcInst", ["uint256"], "address"), this.defaultAccount, [subProcIndexes[i]]),
            });
        }
        let result = {
            factoryAddress: await ethereumAdapter.callContractFunction(iFlowAddr, iFlowInfo.abi, new function_info_1.FunctionInfo("getFactoryInst", [], "address"), this.defaultAccount, []),
            interpreterAddress: await ethereumAdapter.callContractFunction(iFlowAddr, iFlowInfo.abi, new function_info_1.FunctionInfo("getInterpreterInst", [], "address"), this.defaultAccount, []),
            subProcesses: subProcInfo,
            elementInfo: elementInfo,
        };
        printQueryInfo(2, [iFlowAddr, result]);
        return result;
    }
    catch (error) {
        error_logs_1.printError("process-info-collector", "findIFlowInfo", error);
        return Promise.reject(error);
    }
};
////////////////////////////////////////////
//////////// PRIVATE FUNCTIONS /////////////
////////////////////////////////////////////
let formatElementInfo = (eInd, elementInfo) => {
    return {
        eInd: eInd,
        preC: elementInfo[0],
        postC: elementInfo[1],
        typeInfo: elementInfo[2],
        next: elementInfo[3],
    };
};
let printQueryInfo = (type, info) => {
    switch (type) {
        case 0: {
            console_log_1.print(`SUCCESS: Process metadata retrieved successfully from ID ${info[0]}`, console_log_1.TypeMessage.success);
            console_log_1.print(`${JSON.stringify(info[1])} `, console_log_1.TypeMessage.data);
            console_log_1.printSeparator();
            break;
        }
        case 1: {
            console_log_1.print(`SUCCESS: Process instances retrieved successfully from IFlow running at ${info[0]}`, console_log_1.TypeMessage.success);
            console_log_1.print(`  Addresses: ${info[1]} `, console_log_1.TypeMessage.data);
            console_log_1.printSeparator();
            break;
        }
        case 2: {
            console_log_1.print(`SUCCESS: Information from IFlow node at ${info[0]} collected`, console_log_1.TypeMessage.success);
            console_log_1.print(JSON.stringify(info[1]), console_log_1.TypeMessage.data);
            console_log_1.printSeparator();
            break;
        }
    }
};
//# sourceMappingURL=process-info-collector.js.map