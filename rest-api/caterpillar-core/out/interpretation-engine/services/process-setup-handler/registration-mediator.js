"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleIFactoryIFlowRelation = exports.handleIFlowElementUpdated = exports.relateContractAddressToIflow = exports.linkSubProcess = exports.setIFlowNodeElement = void 0;
const console_log_1 = require("../../../adapters/messages/console-log");
const function_info_1 = require("./../../../adapters/ethereum-blockchain/structs/function-info");
const ethereumAdapter = require("./../../../adapters/ethereum-blockchain/ethereum-adapter");
exports.setIFlowNodeElement = async (iFlowAddress, iFlowAbi, elemInfo) => {
    if (!ethereumAdapter.isValidBlockchainAddress(iFlowAddress))
        return Promise.reject(`Invalid address ${iFlowAddress} of IFlow node`);
    if (!this.defaultAccount)
        this.defaultAccount = await ethereumAdapter.defaultDeployment();
    try {
        let transactionHash = await ethereumAdapter.execContractFunctionAsync(iFlowAddress, iFlowAbi, new function_info_1.FunctionInfo("setElement", [
            "uint256",
            "uint256",
            "uint256",
            "uint256",
            "bytes32",
            "uint256[]",
        ]), this.defaultAccount, [
            elemInfo.eInd,
            elemInfo.preC,
            elemInfo.postC,
            elemInfo.typeInfo,
            elemInfo.eName,
            toArray(elemInfo.next.toString()),
        ]);
        return transactionHash;
    }
    catch (error) {
        return Promise.reject(`Error updating element ${elemInfo.eName} into IFlow node running at ${iFlowAddress}`);
    }
};
exports.linkSubProcess = async (iFlowAddress, iFlowAbi, subprocessInfo) => {
    if (!ethereumAdapter.isValidBlockchainAddress(iFlowAddress))
        return Promise.reject(`Invalid address ${iFlowAddress} of IFlow node`);
    if (!this.defaultAccount)
        this.defaultAccount = await ethereumAdapter.defaultDeployment();
    try {
        let transactionHash = await ethereumAdapter.execContractFunctionAsync(iFlowAddress, iFlowAbi, new function_info_1.FunctionInfo("linkSubProcess", [
            "uint256",
            "address",
            "uint256[]",
            "uint256",
        ]), this.defaultAccount, [
            subprocessInfo.pInd,
            subprocessInfo.cFlowInst,
            toArray(subprocessInfo.attachedEvt.toString()),
            subprocessInfo.countInstances,
        ]);
        return transactionHash;
    }
    catch (error) {
        console.log(error);
        return Promise.reject(`Error updating child subprocess ${subprocessInfo.pInd} into IFlow node running at ${iFlowAddress}`);
    }
};
exports.relateContractAddressToIflow = async (iFlowAddress, contractAddress, iFlowAbi, contractType, functionName) => {
    if (!ethereumAdapter.isValidBlockchainAddress(iFlowAddress))
        return Promise.reject(`Invalid address ${iFlowAddress} of IFlow node`);
    if (!ethereumAdapter.isValidBlockchainAddress(contractAddress))
        return Promise.reject(`Invalid address ${contractAddress} of ${contractType} contract`);
    if (!this.defaultAccount)
        this.defaultAccount = await ethereumAdapter.defaultDeployment();
    try {
        let transactionHash = await ethereumAdapter.execContractFunctionAsync(iFlowAddress, iFlowAbi, new function_info_1.FunctionInfo(functionName, ["address"]), this.defaultAccount, [contractAddress]);
        return transactionHash;
    }
    catch (error) {
        return Promise.reject(`Error relating ${contractType} at ${contractAddress} with IFlow node running at ${iFlowAddress}`);
    }
};
//////////////////////////////////////////////////////
/////// HANDLERS FOR ASYNCHRONOUS REQUESTS ///////////
//////////////////////////////////////////////////////
exports.handleIFlowElementUpdated = (elementInfo, iFlowAddress, transactionHash, gasCost) => {
    console_log_1.print(`SUCCESS: IFlow Element updated at ${iFlowAddress}`, console_log_1.TypeMessage.success);
    console_log_1.print(` Input ${elementInfo}`, console_log_1.TypeMessage.data);
    console_log_1.print(` Transaction Hash: ${transactionHash}`, console_log_1.TypeMessage.data);
    console_log_1.print(` Cost: ${gasCost} gas`, console_log_1.TypeMessage.data);
};
exports.handleIFactoryIFlowRelation = (factoryAddress, iFlowAddress, transactionHash, gasCost) => {
    console_log_1.print(`SUCCESS: IFactory at ${factoryAddress} related to IFlow node at ${iFlowAddress}`, console_log_1.TypeMessage.success);
    console_log_1.print(` Transaction Hash: ${transactionHash}`, console_log_1.TypeMessage.data);
    console_log_1.print(` Cost: ${gasCost} gas`, console_log_1.TypeMessage.data);
};
//////////////////////////////////////////////////////
/////////////// PRIVATE FUNCTIONS ////////////////////
//////////////////////////////////////////////////////
let toArray = (stringArray) => {
    return stringArray.length < 1
        ? []
        : [stringArray
                .split(",")
                .map((element) => element.trim())];
};
//# sourceMappingURL=registration-mediator.js.map