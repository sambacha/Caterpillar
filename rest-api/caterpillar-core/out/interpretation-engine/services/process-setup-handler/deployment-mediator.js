"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSubprocessLink = exports.handleFunctionCallRequest = exports.handleNewInstanceCreated = exports.deployAllProcessContracts = exports.deploySmartContractAsync = exports.deploySmartContractSync = void 0;
const repo_models_1 = require("./../../../adapters/mongo-db/repo-models");
const console_log_1 = require("../../../adapters/messages/console-log");
const parsing_info_1 = require("./../../utils/structs/parsing-info");
const contract_info_1 = require("./../../../adapters/ethereum-blockchain/structs/contract-info");
const async_requests_1 = require("./../../utils/structs/async-requests");
const console_log_2 = require("../../../adapters/messages/console-log");
const error_logs_1 = require("../../../adapters/messages/error-logs");
const ethereumAdapter = require("../../../adapters/ethereum-blockchain/ethereum-adapter");
const mongoDBAdapter = require("./../../../adapters/mongo-db/mongo-db-adapter");
const eventMonitor = require("./../worklist-handler/event-monitor");
const registrationService = require("./../process-setup-handler/registration-mediator");
const repo_types_1 = require("../../../adapters/mongo-db/repo-types");
const repo_models_2 = require("../../../adapters/mongo-db/repo-models");
const function_info_1 = require("../../../adapters/ethereum-blockchain/structs/function-info");
const app_1 = require("../../../app");
class SetUpInfo {
    constructor(processInfo, iDataInfo, runtimeRegistry, bpmnModel) {
        this.processInfo = processInfo;
        this.iDataInfo = iDataInfo;
        this.runtimeRegistry = runtimeRegistry;
        this.bpmnModel = bpmnModel;
        this.rootId = undefined;
        this.factoryIFlowRel = new Map();
    }
}
let defaultAcccount;
let setUpInfo = new Map();
let contractDeploymentCount = new Map();
let functionTransactionCount = new Map();
let lastInd = 0;
exports.deploySmartContractSync = async (compilationInfo, params) => {
    try {
        if (!this.defaultAccount)
            this.defaultAccount = await ethereumAdapter.defaultDeployment();
        let contractDeployment = await ethereumAdapter.deploySmartContractSync(compilationInfo, this.defaultAccount, params);
        printDplInfo(compilationInfo, contractDeployment);
        return contractDeployment;
    }
    catch (error) {
        error_logs_1.printError("DeploymentMediator", "deploySmartContractSync", exports.deploySmartContractSync);
        return error;
    }
};
exports.deploySmartContractAsync = async (compilationInfo, pId, procIndex, type, params) => {
    try {
        if (!this.defaultAccount)
            this.defaultAccount = await ethereumAdapter.defaultDeployment();
        let transactionHash = await ethereumAdapter.deploySmartContractAsync(compilationInfo, this.defaultAccount, params);
        let newRequest = new async_requests_1.NewContractInstRequest(compilationInfo, pId, procIndex, type, transactionHash, this.handleNewInstanceCreated);
        eventMonitor.listenForPendingTransaction(transactionHash, newRequest);
        return transactionHash;
    }
    catch (error) {
        error_logs_1.printError("DeploymentMediator", "deploySmartContractAsync", error);
        return error;
    }
};
exports.deployAllProcessContracts = async (processInfo, interpreterInfo, iFlowInfo, iDataInfo, iFactoryInfo, runtimeRegistry, bpmnModel) => {
    try {
        let interpreterTHash = await exports.deploySmartContractAsync(interpreterInfo, lastInd, 0, async_requests_1.TypeContract.BPMNInterpreter);
        let sortedProcesses = sortProcessHierarchy(processInfo, iDataInfo, iFactoryInfo);
        iFactoryInfo = sortedProcesses[2];
        setUpInfo.set(lastInd, new SetUpInfo(sortedProcesses[0], sortedProcesses[1], runtimeRegistry, bpmnModel));
        findTotalTransactionCount(lastInd, sortedProcesses[0]);
        let iFlowTHashes = new Array();
        let iFactoryTHashes = new Array();
        for (let i = 0; i < iDataInfo.length; i++) {
            iFlowTHashes.push(await exports.deploySmartContractAsync(iFlowInfo, lastInd, i, async_requests_1.TypeContract.IFlow, [runtimeRegistry.address]));
            iFactoryTHashes.push(await exports.deploySmartContractAsync(iFactoryInfo[i], lastInd, i, async_requests_1.TypeContract.IFactory));
        }
        lastInd++;
        return {
            interpreterTHash: interpreterTHash,
            iFlowTHashes: iFlowTHashes,
            iFactoryTHashes: iFactoryTHashes,
        };
    }
    catch (error) {
        console_log_2.print(error, console_log_2.TypeMessage.error);
        return error;
    }
};
/////////////////////////////////////////////////////
/////// CALLBACKS FOR ASYNCHRONOUS OPERATIONS ///////
/////////////////////////////////////////////////////
exports.handleNewInstanceCreated = async (reqInfo) => {
    try {
        printHandlerInfo(1, reqInfo);
        // (1) Check and relate IFactory and BPMNInterpreter into IFlow once the instances are mined
        checkAndUpdateIFlowRel(reqInfo);
        // (2) Register all the BPMN elements into IFlow, and decrease pending transaction count
        let iDataId = undefined;
        if (reqInfo.type === async_requests_1.TypeContract.IFlow) {
            registerIFlowElementList(setUpInfo.get(reqInfo.pId).processInfo[reqInfo.contractIndex], reqInfo);
            let spInfo = setUpInfo.get(reqInfo.pId);
            iDataId = await updateContractRepository(spInfo.iDataInfo[reqInfo.contractIndex], "");
            printHandlerInfo(2, [spInfo, reqInfo, iDataId]);
        }
        contractDeploymentCount.set(reqInfo.pId, contractDeploymentCount.get(reqInfo.pId) - 1);
        reqInfo.repoId = await updateContractRepository(reqInfo.compilationInfo, reqInfo.contractAddress, iDataId);
        printHandlerInfo(3, reqInfo);
        checkAndLinkSubProcess(reqInfo.pId);
        checkAndUpdateProcessRepository(reqInfo.pId);
    }
    catch (error) {
        error_logs_1.printError("DeploymentMediator", "handleNewInstanceCreated", error);
    }
};
exports.handleFunctionCallRequest = (fRequest) => {
    functionTransactionCount.set(fRequest.pInd, functionTransactionCount.get(fRequest.pInd) - 1);
    printFunctionCallHandled(fRequest.functionName, fRequest.gasCost, fRequest.params);
    if (functionTransactionCount.get(fRequest.pInd) === 0)
        app_1.webSocket.send(JSON.stringify({ bundleId: setUpInfo.get(fRequest.pInd).rootId }));
};
exports.handleSubprocessLink = async (linkRequest) => {
    try {
        functionTransactionCount.set(linkRequest.iFlowP.pId, functionTransactionCount.get(linkRequest.iFlowP.pId) - 1);
        printFunctionCallHandled("setElement", linkRequest.gasCost, linkRequest.elementInfo);
        let transactionHash = await registrationService.linkSubProcess(linkRequest.iFlowP.contractAddress, linkRequest.iFlowP.compilationInfo.abi, linkRequest.toLink);
        eventMonitor.listenForPendingTransaction(transactionHash, new async_requests_1.FunctionCallRequest(transactionHash, this.handleFunctionCallRequest, linkRequest.iFlowP.pId, "linkSubProcess", linkRequest.toLink));
    }
    catch (error) {
        error_logs_1.printError("DeploymentMediator", "handleSubprocessLink", error);
    }
};
////////////////////////////////////////////
//////////// PRIVATE FUNCTIONS /////////////
////////////////////////////////////////////
let sortProcessHierarchy = (pInfo, iDataInfo, iFactoryInfo) => {
    let nodes = [pInfo];
    let sortedFactory = [];
    let sortedData = [];
    for (let i = 0; i < nodes.length; i++)
        nodes = nodes.concat(nodes[i].children);
    nodes = nodes.reverse();
    nodes.forEach((node) => {
        sortedFactory.push(iFactoryInfo.filter((fContract) => {
            return fContract.contractName === node.procName + "Factory";
        }));
        sortedData.push(iDataInfo.filter((fContract) => {
            return fContract.contractName === node.procName + "Data";
        }));
    });
    return [nodes, sortedData.flat(), sortedFactory.flat()];
};
let findTotalTransactionCount = (pIndex, processes) => {
    let contractCount = 1; // Deployment of Interpreter
    let functionCount = 1; // Update of Root process in Runtime Registry
    for (let i = 0; i < processes.length; i++) {
        contractCount += 2; // Deployment of IFactory and IFlow contracts
        functionCount += processes[i].iflow.elementInfo.size + 2; // BPMN Elements to Register + Rel(Iflow-IFactory) + Rel(IFlow-INterpreter)
        functionCount += processes[i].children.length; // Children registration
    }
    contractDeploymentCount.set(pIndex, contractCount);
    functionTransactionCount.set(pIndex, functionCount);
};
let registerIFlowElementList = (procInfo, iFlowInfo) => {
    procInfo.iflow.nodeIndexMap.forEach(async (eInd, eId) => {
        try {
            if (!isSubprocess(eId, procInfo)) {
                let eInfo = procInfo.iflow.elementInfo.get(eInd);
                let transactionHash = await registrationService.setIFlowNodeElement(iFlowInfo.contractAddress, iFlowInfo.compilationInfo.abi, eInfo);
                eventMonitor.listenForPendingTransaction(transactionHash, new async_requests_1.FunctionCallRequest(transactionHash, this.handleFunctionCallRequest, iFlowInfo.pId, "setElement", eInfo));
            }
        }
        catch (error) {
            error_logs_1.printError("DeploymentMediator", "registerIflowElementList", error);
        }
    });
};
let isSubprocess = (eId, iFlowInfo) => {
    return (iFlowInfo.children.filter((node) => {
        return node.procBpmnId === eId;
    }).length > 0);
};
let checkAndUpdateIFlowRel = async (reqInfo) => {
    try {
        let spInd = reqInfo.contractIndex;
        let pInfo = setUpInfo.get(reqInfo.pId);
        if (reqInfo.type === async_requests_1.TypeContract.BPMNInterpreter) {
            pInfo.interpreterInfo = reqInfo;
        }
        else {
            if (!pInfo.factoryIFlowRel.has(spInd)) {
                pInfo.factoryIFlowRel.set(spInd, new Map());
            }
            pInfo.factoryIFlowRel.get(spInd).set(reqInfo.type, reqInfo);
        }
        if (pInfo.interpreterInfo &&
            pInfo.factoryIFlowRel.has(spInd) &&
            pInfo.factoryIFlowRel.get(spInd).get(async_requests_1.TypeContract.IFlow) &&
            pInfo.factoryIFlowRel.get(spInd).get(async_requests_1.TypeContract.IFactory)) {
            let iFlow = pInfo.factoryIFlowRel.get(spInd).get(async_requests_1.TypeContract.IFlow);
            let iFactory = pInfo.factoryIFlowRel
                .get(spInd)
                .get(async_requests_1.TypeContract.IFactory);
            if (!this.defaultAccount)
                this.defaultAccount = await ethereumAdapter.defaultDeployment();
            registerContractAddress(iFlow.contractAddress, iFlow.compilationInfo.abi, reqInfo.pId, "setFactoryInst", iFactory.contractAddress);
            registerContractAddress(iFlow.contractAddress, iFlow.compilationInfo.abi, reqInfo.pId, "setInterpreterInst", pInfo.interpreterInfo.contractAddress);
        }
    }
    catch (error) {
        error_logs_1.printError("DeploymentMediator", "checkAndUpdateIFlowRel", error);
    }
};
let checkAndUpdateProcessRepository = async (pInd) => {
    try {
        if (contractDeploymentCount.get(pInd) === 0) {
            let procHash = undefined;
            let spInfo = setUpInfo.get(pInd);
            let procChildren = new Map();
            for (let i = 0; i < spInfo.processInfo.length; i++)
                procChildren.set(spInfo.processInfo[i].procName, new Array());
            for (let i = 0; i < spInfo.iDataInfo.length; i++) {
                let processInfo = spInfo.processInfo[i];
                procHash = await mongoDBAdapter.updateRepository(repo_types_1.RepoType.ProcessInterpretedEngine, new repo_models_1.ProcessIEInput(processInfo.procBpmnId, processInfo.procName, spInfo.bpmnModel, infoToArray(processInfo.iflow.elementInfo, processInfo.iData), procChildren.get(processInfo.procName), spInfo.factoryIFlowRel.get(i).get(async_requests_1.TypeContract.IFactory).repoId, spInfo.factoryIFlowRel.get(i).get(async_requests_1.TypeContract.IFlow).repoId));
                if (processInfo.parent)
                    procChildren.get(processInfo.parent.procName).push(procHash);
                console_log_2.print(`Process ${processInfo.procName} updated in repositpry`, console_log_2.TypeMessage.success);
                console_log_2.print(`  ID: ${procHash}`, console_log_2.TypeMessage.data);
                console_log_1.printSeparator();
            }
            let rootProc = spInfo.processInfo.length - 1;
            spInfo.rootId = procHash;
            updateRuntimeRegistry(pInd, spInfo.runtimeRegistry, procHash, spInfo.factoryIFlowRel.get(rootProc).get(async_requests_1.TypeContract.IFlow)
                .contractAddress);
        }
    }
    catch (error) {
        error_logs_1.printError("DeploymentMediator", "checkAndUpdateProcessRepository", error);
    }
};
let checkAndLinkSubProcess = async (pInd) => {
    try {
        if (contractDeploymentCount.get(pInd) === 0) {
            let processes = setUpInfo.get(pInd).processInfo;
            let stInfo = setUpInfo.get(pInd);
            for (let i = 0; i < processes.length - 1; i++) {
                let childP = processes[i];
                if (childP.parent) {
                    let parentP = childP.parent;
                    let prtInd = -1;
                    for (let j = i + 1; j < processes.length; j++)
                        if (processes[j].procName === parentP.procName) {
                            prtInd = j;
                            break;
                        }
                    if (prtInd !== -1) {
                        let iFlowP = stInfo.factoryIFlowRel
                            .get(prtInd)
                            .get(async_requests_1.TypeContract.IFlow);
                        let iFlowC = stInfo.factoryIFlowRel.get(i).get(async_requests_1.TypeContract.IFlow);
                        let childIndex = parentP.iflow.nodeIndexMap.get(childP.procBpmnId);
                        let toLink = new parsing_info_1.SubProcLinkInfo(childIndex, iFlowC.contractAddress, parentP.iflow.attachedEvents.get(childIndex)
                            ? parentP.iflow.attachedEvents.get(childIndex)
                            : [], childP.instCount);
                        let transactionHash = await registrationService.setIFlowNodeElement(iFlowP.contractAddress, iFlowP.compilationInfo.abi, parentP.iflow.elementInfo.get(childIndex));
                        eventMonitor.listenForPendingTransaction(transactionHash, new async_requests_1.LinkProcessRequest(transactionHash, this.handleSubprocessLink, toLink, parentP.iflow.elementInfo.get(childIndex), iFlowP));
                    }
                }
            }
        }
    }
    catch (error) {
        error_logs_1.printError("DeploymentMediator", "checkAndLinkSubProcess", error);
    }
};
let updateRuntimeRegistry = async (pInd, runtimeRegistry, rootProcId, iFlowAddress) => {
    try {
        if (!this.defaultAccount)
            this.defaultAccount = await ethereumAdapter.defaultDeployment();
        let transactionHash = await ethereumAdapter.execContractFunctionAsync(runtimeRegistry.address, runtimeRegistry.abi, new function_info_1.FunctionInfo("registerIFlow", ["bytes32", "address"]), this.defaultAccount, [rootProcId, iFlowAddress]);
        eventMonitor.listenForPendingTransaction(transactionHash, new async_requests_1.FunctionCallRequest(transactionHash, this.handleFunctionCallRequest, pInd, "registerIFlow", [rootProcId, iFlowAddress]));
    }
    catch (error) {
        error_logs_1.printError("DeploymentMediator", "updateRuntimeRegistry", error);
    }
};
let infoToArray = (iFlowMap, iDataInfo) => {
    let result = [];
    iFlowMap.forEach((element, index) => {
        let input = iDataInfo.inParams.has(index)
            ? iDataInfo.inParams.get(index)
            : [];
        let output = iDataInfo.outParams.has(index)
            ? iDataInfo.outParams.get(index)
            : [];
        result[index] = {
            element: JSON.stringify(element),
            input: JSON.stringify(input),
            output: JSON.stringify(output),
        };
    });
    return result;
};
let updateContractRepository = async (cInfo, address, linkedId) => {
    try {
        let toSave = new contract_info_1.ContractInfo(cInfo.contractName, cInfo.abi, cInfo.bytecode, cInfo.solidity, address);
        if (linkedId)
            toSave._relId = linkedId;
        return await mongoDBAdapter.updateRepository(repo_types_1.RepoType.SmartContract, new repo_models_2.ModelMetadata(toSave));
    }
    catch (error) {
        error_logs_1.printError("DeploymentMediator", "updateContractRepository", error);
    }
};
let registerContractAddress = async (contractAddress, contractAbi, pInd, funcName, addressToRegister) => {
    try {
        let transactionHash = await ethereumAdapter.execContractFunctionAsync(contractAddress, contractAbi, new function_info_1.FunctionInfo(funcName, ["address"]), this.defaultAccount, [addressToRegister]);
        eventMonitor.listenForPendingTransaction(transactionHash, new async_requests_1.FunctionCallRequest(transactionHash, this.handleFunctionCallRequest, pInd, funcName, addressToRegister));
    }
    catch (error) {
        error_logs_1.printError("DeploymentMediator", "registerContractAddress", error);
    }
};
let printFunctionCallHandled = (functionName, gasCost, params) => {
    let cName = functionName === "registerIFlow" ? "RuntimeRegistry" : "IFlow";
    console_log_2.print(`SUCCESS: Executed function ${cName}.${functionName}`, console_log_2.TypeMessage.success);
    console_log_2.print(` ${JSON.stringify(params)}`, console_log_2.TypeMessage.data);
    console_log_2.print(` Cost: ${gasCost} gas`, console_log_2.TypeMessage.data);
    console_log_1.printSeparator();
};
let printDplInfo = (compilationInfo, contractDeployment) => {
    console_log_2.print(`SUCCESS: ${compilationInfo.contractName} deployed successfully`, console_log_2.TypeMessage.success);
    console_log_2.print(` Address: ${contractDeployment.contractAddress}`, console_log_2.TypeMessage.info);
    console_log_2.print(` Cost: ${contractDeployment.gasCost} gas units`, console_log_2.TypeMessage.info);
    console_log_1.printSeparator();
};
let printHandlerInfo = (type, info) => {
    switch (type) {
        case 1: {
            console_log_2.print(`SUCCESS: Transaction ${info.transactionHash} for deploying ${info.type} accepted`, console_log_2.TypeMessage.success);
            console_log_2.print(` Contract Address ${info.contractAddress}`, console_log_2.TypeMessage.data);
            console_log_2.print(` Cost ${info.gasCost} gas units`, console_log_2.TypeMessage.data);
            console_log_1.printSeparator();
            break;
        }
        case 2: {
            console_log_2.print(`SUCCESS: IData metadata from ${info[0].processInfo[info[1].contractIndex].procName} updated in repositpry`, console_log_2.TypeMessage.success);
            console_log_2.print(`  ID: ${info[2]}`, console_log_2.TypeMessage.data);
            console_log_1.printSeparator();
            break;
        }
        case 3: {
            console_log_2.print(`SUCCESS: ${info.type} running at ${info.contractAddress} updated in repositpry`, console_log_2.TypeMessage.success);
            console_log_2.print(`  ID: ${info.repoId}`, console_log_2.TypeMessage.data);
            console_log_1.printSeparator();
            break;
        }
    }
};
//# sourceMappingURL=deployment-mediator.js.map