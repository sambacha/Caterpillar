"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveProcessModelMetadata = exports.deployAndRegisterWorklists = exports.deployAndRegisterFactories = exports.registerParent2ChildrenRelation = exports.registerProcessRepository = void 0;
const pending_logs_1 = require("../../adapters/messages/pending-logs");
const promise_error_1 = require("./../../adapters/errors/promise-error");
const repo_models_1 = require("../../adapters/mongo-db/repo-models");
const deployment_output_1 = require("../../adapters/ethereum-blockchain/structs/deployment-output");
const function_info_1 = require("../../adapters/ethereum-blockchain/structs/function-info");
const contract_info_1 = require("../../adapters/ethereum-blockchain/structs/contract-info");
const ethereumAdapter = require("../../adapters/ethereum-blockchain/ethereum-adapter");
const console_log_1 = require("../../adapters/messages/console-log");
const mongoDBAdapter = require("../../adapters/mongo-db/mongo-db-adapter");
const repo_types_1 = require("../../adapters/mongo-db/repo-types");
let defaultAccount;
// Step 1. Model Registration: Collects the compilation artifacts of the produced models,
//         and saves all these metadata as an entry in the Process Repository.
exports.registerProcessRepository = (modelInfo, contracts) => {
    pending_logs_1.printp(2);
    return new Promise((resolve, reject) => {
        // Sorting elements such that children are created first
        let queue = [
            {
                nodeId: modelInfo.id,
                nodeName: modelInfo.name,
                bundleId: "",
                nodeIndex: 0,
                bundleParent: "",
                factoryContract: "",
            },
        ];
        for (let i = 0; i < queue.length; i++) {
            if (modelInfo.controlFlowInfoMap.has(queue[i].nodeId)) {
                let cfInfo = modelInfo.controlFlowInfoMap.get(queue[i].nodeId);
                let candidates = [
                    cfInfo.multiinstanceActivities,
                    cfInfo.nonInterruptingEvents,
                    cfInfo.callActivities,
                ];
                candidates.forEach((children) => {
                    if (children) {
                        children.forEach((value, key) => {
                            queue.push({
                                nodeId: key,
                                nodeName: value,
                                bundleId: "",
                                nodeIndex: 0,
                                bundleParent: "",
                                factoryContract: "",
                            });
                        });
                    }
                });
            }
        }
        queue.reverse();
        let nodeIndexes = new Map();
        for (let i = 0; i < queue.length; i++)
            nodeIndexes.set(queue[i].nodeId, i);
        saveProcessInRepository(queue, nodeIndexes, modelInfo, contracts)
            .then((sortedElements) => {
            resolve(sortedElements);
        })
            .catch((error) => {
            reject(error);
        });
    });
};
exports.registerParent2ChildrenRelation = async (sortedElements, modelInfo, runtimeRegistry) => {
    pending_logs_1.printp(3);
    try {
        if (!defaultAccount)
            defaultAccount = await ethereumAdapter.defaultDeployment();
        for (let i = 0; i < sortedElements.length; i++) {
            let executionRes = await ethereumAdapter.execContractFunctionSync(runtimeRegistry.address, runtimeRegistry.abi, new function_info_1.FunctionInfo("addChildBundleId", ["bytes32", "bytes32", "uint256"]), defaultAccount, [
                sortedElements[i].bundleParent,
                sortedElements[i].bundleId,
                sortedElements[i].nodeIndex,
            ]);
            if (executionRes instanceof deployment_output_1.DeploymentError) {
                printTreeRelations(sortedElements[i], executionRes);
                return Promise.reject([executionRes.error]);
            }
            else
                printTreeRelations(sortedElements[i], executionRes);
        }
        let removedCallActivities = [];
        sortedElements.forEach((element) => {
            if (modelInfo.controlFlowInfoMap.has(element.nodeId) ||
                modelInfo.globalNodeMap.get(element.nodeId).$type === "bpmn:StartEvent") {
                removedCallActivities.push(element);
            }
        });
        console_log_1.printSeparator();
        return removedCallActivities;
    }
    catch (error) {
        printTreeRelations(undefined, undefined, error);
        return Promise.reject(error);
    }
};
exports.deployAndRegisterFactories = async (sortedElements, contracts, runtimeRegistry) => {
    pending_logs_1.printp(4);
    return await deployAndRegisterContract("Factory", sortedElements, contracts, runtimeRegistry);
};
exports.deployAndRegisterWorklists = async (modelInfo, sortedElements, contracts, runtimeRegistry) => {
    pending_logs_1.printp(5);
    await deployAndRegisterContract("Worklist", sortedElements, contracts, runtimeRegistry);
    let bundleId = "";
    for (let i = 0; i < sortedElements.length; i++) {
        if (sortedElements[i].nodeName === modelInfo.name) {
            bundleId = sortedElements[i].bundleId;
            break;
        }
    }
    return bundleId;
};
exports.retrieveProcessModelMetadata = async (mHash) => {
    let modelInfo = await mongoDBAdapter.findModelMetadataById(repo_types_1.RepoType.ProcessCompiledEngine, mHash);
    if (modelInfo instanceof promise_error_1.PromiseError) {
        modelInfo.components.push(new promise_error_1.Component("deployment-mediator", "retrieveProcessModelMetadata"));
        return Promise.reject(modelInfo);
    }
    console_log_1.print(JSON.stringify(modelInfo));
    console_log_1.printSeparator();
    return modelInfo;
};
////////////////////////////////////////////////
////////////   PRIVATE FUNCTIONS   /////////////
////////////////////////////////////////////////
let saveProcessInRepository = async (sortedElements, nodeIndexes, modelInfo, contracts) => {
    for (let i = 0; i < sortedElements.length; i++) {
        let nodeName = sortedElements[i].nodeName;
        let gNodeId = sortedElements[i].nodeId;
        let controlFlowInfo = modelInfo.controlFlowInfoMap.get(gNodeId);
        if (modelInfo.globalNodeMap.get(gNodeId).$type === "bpmn:StartEvent")
            controlFlowInfo = modelInfo.controlFlowInfoMap.get(modelInfo.globalNodeMap.get(gNodeId).$parent.id);
        if (controlFlowInfo) {
            let indexToFunctionName = [];
            let childrenSubproc = [];
            controlFlowInfo.nodeList.forEach((nodeId) => {
                let element = modelInfo.globalNodeMap.get(nodeId);
                if (controlFlowInfo.nodeList.indexOf(nodeId) >= 0) {
                    let type = "None";
                    let role = "None";
                    if (controlFlowInfo.callActivities.has(nodeId) ||
                        controlFlowInfo.multiinstanceActivities.has(nodeId) ||
                        controlFlowInfo.nonInterruptingEvents.has(nodeId))
                        type = "Separate-Instance";
                    else if (element.$type === "bpmn:ServiceTask")
                        type = "Service";
                    else if (element.$type === "bpmn:UserTask" ||
                        element.$type === "bpmn:ReceiveTask" ||
                        controlFlowInfo.catchingMessages.indexOf(nodeId) >= 0) {
                        type = "Workitem";
                    }
                    indexToFunctionName[controlFlowInfo.nodeIndexMap.get(nodeId)] = {
                        name: controlFlowInfo.nodeNameMap.get(nodeId),
                        id: nodeId,
                        type: type,
                        role: role,
                    };
                    if (controlFlowInfo.callActivities.has(nodeId) ||
                        controlFlowInfo.multiinstanceActivities.has(nodeId) ||
                        controlFlowInfo.nonInterruptingEvents.has(nodeId)) {
                        childrenSubproc.push(nodeId);
                        sortedElements[nodeIndexes.get(nodeId)].nodeIndex = controlFlowInfo.nodeIndexMap.get(nodeId);
                        if (controlFlowInfo.externalBundles.has(nodeId))
                            sortedElements[nodeIndexes.get(nodeId)].bundleId = controlFlowInfo.externalBundles.get(nodeId);
                    }
                }
            });
            try {
                let processRepoId = await mongoDBAdapter.updateRepository(repo_types_1.RepoType.ProcessCompiledEngine, new repo_models_1.ProcessCEMetadata("", gNodeId, nodeName, i < sortedElements.length - 1 ? "empty" : modelInfo.bpmn, indexToFunctionName, getContractAbi(`${nodeName}Worklist`, contracts.compilationMetadata), new contract_info_1.ContractInfo(`${nodeName}Workflow`, getContractAbi(`${nodeName}Workflow`, contracts.compilationMetadata), getContractBytecode(`${nodeName}Workflow`, contracts.compilationMetadata), modelInfo.solidity, undefined)));
                sortedElements[i].bundleId = processRepoId;
                sortedElements[i].bundleParent = processRepoId;
                childrenSubproc.forEach((childId) => {
                    sortedElements[nodeIndexes.get(childId)].bundleParent = processRepoId;
                });
                printRepoUpdates(`${nodeName}Workflow`, processRepoId);
            }
            catch (error) {
                printRepoUpdates(`${nodeName}Workflow`, undefined, error);
                return Promise.reject(error);
            }
        }
    }
    return sortedElements;
};
let deployAndRegisterContract = async (nameSuffix, sortedElements, contracts, runtimeRegistry) => {
    try {
        if (!defaultAccount)
            defaultAccount = await ethereumAdapter.defaultDeployment();
        for (let i = 0; i < sortedElements.length; i++) {
            let contractName = sortedElements[i].nodeName + nameSuffix;
            let compilationInfo = getCompilationResults(contractName, contracts);
            if (!compilationInfo)
                continue;
            let contractDeployment = (await ethereumAdapter.deploySmartContractSync(compilationInfo, defaultAccount));
            printDeployment(`${nameSuffix} ${contractName}`, contractDeployment);
            let executionResult = (await ethereumAdapter.execContractFunctionSync(runtimeRegistry.address, runtimeRegistry.abi, new function_info_1.FunctionInfo("register" + nameSuffix, ["bytes32", "address"]), defaultAccount, [sortedElements[i].bundleId, contractDeployment.contractAddress]));
            printRegistryUpdates(`${nameSuffix} ${contractName}`, executionResult);
        }
        return sortedElements;
    }
    catch (error) {
        return Promise.reject(error);
    }
};
let getCompilationResults = (contractName, contracts) => {
    let contract = contracts.find((contract) => {
        return contract.contractName === contractName;
    });
    return contract ? contract : undefined;
};
let getContractAbi = (contractName, contracts) => {
    let compilationResults = getCompilationResults(contractName, contracts);
    return compilationResults ? compilationResults.abi : undefined;
};
let getContractBytecode = (contractName, contracts) => {
    let compilationResults = getCompilationResults(contractName, contracts);
    return compilationResults ? compilationResults.bytecode : undefined;
};
let printRepoUpdates = (contractName, id, error) => {
    if (error) {
        console_log_1.print(`ERROR: Updating process repository with contract ${contractName}`, console_log_1.TypeMessage.error);
        console_log_1.print(error.toString(), console_log_1.TypeMessage.error);
    }
    else {
        console_log_1.print(`SUCCESS: Metadata of contract ${contractName} updated in process repository`, console_log_1.TypeMessage.success);
        console_log_1.print(` ID: ${id}`, console_log_1.TypeMessage.info);
    }
    console_log_1.printSeparator();
};
let printDeployment = (contractName, contractDeployment) => {
    console_log_1.print(`SUCCESS: ${contractName} deployed`, console_log_1.TypeMessage.success);
    console_log_1.print(` Address: ${contractDeployment.contractAddress})`, console_log_1.TypeMessage.info);
    console_log_1.print(` Cost: ${contractDeployment.gasCost} gas units`, console_log_1.TypeMessage.info);
    console_log_1.printSeparator();
};
let printRegistryUpdates = (contractName, executionResult) => {
    console_log_1.print(`SUCCESS: Runtime registry updated with: ${contractName}`, console_log_1.TypeMessage.success);
    console_log_1.print(` Cost: ${executionResult.gasCost} gas units`, console_log_1.TypeMessage.info);
    console_log_1.printSeparator();
};
let printTreeRelations = (sortedElement, result, error) => {
    if (error) {
        console_log_1.print("ERROR: Registering process hierarchical relations in runtime registry", console_log_1.TypeMessage.error);
        console_log_1.print(error.toString(), console_log_1.TypeMessage.error);
        console_log_1.printSeparator();
    }
    else if (result instanceof deployment_output_1.DeploymentError) {
        console_log_1.print(`ERROR: registering Parent-Child Relation in Contract ${sortedElement.name}`, console_log_1.TypeMessage.error);
        console_log_1.print(result.error.toString(), console_log_1.TypeMessage.error);
        console_log_1.printSeparator();
    }
    else {
        console_log_1.print(`SUCCESS: Relation Parent(${sortedElement.bundleParent})-Child(${sortedElement.bundleId}) updated`, console_log_1.TypeMessage.success);
        console_log_1.print(` Cost: ${result.gasCost} gas units`, console_log_1.TypeMessage.info);
    }
};
//# sourceMappingURL=deployment-mediator.js.map