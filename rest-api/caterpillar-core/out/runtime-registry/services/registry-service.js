"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllRegisteredIData = exports.findAllRegisteredIFlows = exports.findBundleFromIFlow = exports.findRunningInstancesFor = exports.findAllRegisteredModels = exports.findRegistryByAddress = exports.findRegistryById = exports.validateRegistry = exports.updateRegistryRepository = exports.deployRegistry = exports.compileRuntimeRegistry = exports.getRegistrySolidityCode = void 0;
const console_log_1 = require("../../adapters/messages/console-log");
const fs = require("fs");
const solidityCompiler = require("../../adapters/ethereum-blockchain/solidity-compiler");
const ethereumAdapter = require("../../adapters/ethereum-blockchain/ethereum-adapter");
const compilation_input_1 = require("../../adapters/ethereum-blockchain/structs/compilation-input");
const compilation_output_1 = require("../../adapters/ethereum-blockchain/structs/compilation-output");
const mongoDBAdapter = require("../../adapters/mongo-db/mongo-db-adapter");
const repo_types_1 = require("../../adapters/mongo-db/repo-types");
const repo_models_1 = require("../../adapters/mongo-db/repo-models");
const function_info_1 = require("../../adapters/ethereum-blockchain/structs/function-info");
const error_logs_1 = require("../../adapters/messages/error-logs");
exports.getRegistrySolidityCode = () => {
    return fs.readFileSync("./src/runtime-registry/solidity-code/runtime-registry.sol", "utf8");
};
exports.compileRuntimeRegistry = () => {
    let contractsToCompile = new compilation_input_1.CompilationInput("RuntimeRegistry", fs.readFileSync("./src/runtime-registry/solidity-code/runtime-registry.sol", "utf8"), []);
    let compiledContracts = solidityCompiler.compileSmartContracts(contractsToCompile);
    return compiledContracts[0] instanceof compilation_output_1.CompilationError
        ? compiledContracts[0]
        : compiledContracts.find((elem) => {
            return elem.contractName === "RuntimeRegistry";
        });
};
exports.deployRegistry = (input) => {
    return new Promise((resolve, reject) => {
        ethereumAdapter
            .defaultDeployment()
            .then((deploymentParams) => {
            resolve(ethereumAdapter.deploySmartContractSync(input, deploymentParams));
        })
            .catch((error) => {
            reject(error);
        });
    });
};
exports.updateRegistryRepository = (contractInfo) => {
    return new Promise((resolve, reject) => {
        mongoDBAdapter
            .updateRepository(repo_types_1.RepoType.RuntimeRegistry, new repo_models_1.ModelMetadata(contractInfo))
            .then((repoId) => {
            printResult(1, repoId);
            resolve(repoId);
        })
            .catch((error) => {
            printResult(2, error);
            reject(error);
        });
    });
};
exports.validateRegistry = (address, currentRegistry) => {
    return new Promise((resolve, reject) => {
        try {
            if (currentRegistry && currentRegistry.address === address) {
                resolve(currentRegistry);
            }
            else {
                exports.findRegistryByAddress(address)
                    .then((registry) => {
                    resolve(registry);
                })
                    .catch((error) => {
                    printResult(3, error);
                    reject(error);
                });
            }
        }
        catch (error) {
            reject(error);
        }
    });
};
exports.findRegistryById = (id) => {
    return new Promise((resolve, reject) => {
        mongoDBAdapter
            .findContractInfoById(repo_types_1.RepoType.RuntimeRegistry, id)
            .then((result) => resolve(result))
            .catch((error) => reject(error));
    });
};
exports.findRegistryByAddress = (address) => {
    return new Promise((resolve, reject) => {
        mongoDBAdapter
            .findContractInfoByAddress(repo_types_1.RepoType.RuntimeRegistry, address)
            .then((result) => resolve(result))
            .catch((error) => reject(error));
    });
};
////////////////////////////////////////////////////////////////
/// FUNCTIONS TO RETRIEVE REGISTERED COMPILATION ENGINE INFO ///
////////////////////////////////////////////////////////////////
exports.findAllRegisteredModels = async (runtimeRegistry) => {
    return await findFullList(runtimeRegistry, "allRegisteredModels", "bytes32[]", "findAllRegisteredModels");
};
exports.findRunningInstancesFor = async (processId, runtimeRegistry) => {
    try {
        let defaultAccount = await ethereumAdapter.defaultDeployment();
        let fullAddressList = await ethereumAdapter.callContractFunction(runtimeRegistry.address, runtimeRegistry.abi, new function_info_1.FunctionInfo("allInstances", [], "address[]"), defaultAccount, []);
        let result = await asyncFilter(fullAddressList, async (address) => {
            let id = await ethereumAdapter.callContractFunction(runtimeRegistry.address, runtimeRegistry.abi, new function_info_1.FunctionInfo("bundleFor", ["address"], "bytes32"), defaultAccount, [address]);
            return id === processId;
        });
        printResult(4, [processId, result]);
        return result;
    }
    catch (error) {
        console_log_1.print(error);
        return Promise.reject(error);
    }
};
///////////////////////////////////////////////////////////////////
/// FUNCTIONS TO RETRIEVE REGISTERED INTERPRETATION ENGINE INFO ///
///////////////////////////////////////////////////////////////////
exports.findBundleFromIFlow = async (runtimeRegistry, iFlowAddr) => {
    try {
        let defaultAccount = await ethereumAdapter.defaultDeployment();
        let repoId = await ethereumAdapter.callContractFunction(runtimeRegistry.address, runtimeRegistry.abi, new function_info_1.FunctionInfo("getBundleIdFromIFlow", ["address"], "bytes32"), defaultAccount, [iFlowAddr]);
        return repoId;
    }
    catch (error) {
        error_logs_1.printError("RuntimeRegistryService", "findBundleFromIFlow", error);
        return error;
    }
};
exports.findAllRegisteredIFlows = async (runtimeRegistry) => {
    return await findFullList(runtimeRegistry, "allRegisteredIFlows", "bytes32[]", "findAllRegisteredIFlows");
};
exports.findAllRegisteredIData = async (runtimeRegistry) => {
    return await findFullList(runtimeRegistry, "allIDataInstances", "address[]", "findAllRegisteredIData");
};
/////////////////////////////////////////
/////////// PRIVATE FUNCTIONS ///////////
/////////////////////////////////////////
let asyncFilter = async (inputArray, predicate) => {
    const results = await Promise.all(inputArray.map(predicate));
    return inputArray.filter((_v, index) => results[index]);
};
let findFullList = async (runtimeRegistry, functionName, returnTpe, sourceFunction) => {
    try {
        let defaultAccount = await ethereumAdapter.defaultDeployment();
        let resultList = await ethereumAdapter.callContractFunction(runtimeRegistry.address, runtimeRegistry.abi, new function_info_1.FunctionInfo(functionName, [], returnTpe), defaultAccount, []);
        printResult(5, [returnTpe, resultList]);
        return resultList;
    }
    catch (error) {
        error_logs_1.printError("RuntimeRegistryService", sourceFunction, error);
        return Promise.reject(error);
    }
};
let printResult = (type, info) => {
    switch (type) {
        case 1: {
            console_log_1.print("SUCCESS: Runtime Registry Metadata updated in Process Repository", console_log_1.TypeMessage.success);
            console_log_1.print(` ID: ${info}`, console_log_1.TypeMessage.info);
            console_log_1.printSeparator();
            break;
        }
        case 2: {
            console_log_1.print("ERROR: Updating Runtime Registry Metadata", console_log_1.TypeMessage.error);
            console_log_1.print(info, console_log_1.TypeMessage.error);
            console_log_1.printSeparator();
            break;
        }
        case 3: {
            console_log_1.print("ERROR: Invalid Runtime Registry", console_log_1.TypeMessage.error);
            console_log_1.print(info.toString(), console_log_1.TypeMessage.error);
            console_log_1.printSeparator();
            break;
        }
        case 4: {
            console_log_1.print(`SUCCESS: Instances of Process with ID ${info[0]} Retrieved Successfully.`, console_log_1.TypeMessage.success);
            console_log_1.print(` Addressess: ${info[1]}`, console_log_1.TypeMessage.info);
            console_log_1.printSeparator();
            break;
        }
        case 5: {
            console_log_1.print("SUCCESS: List Retrieved Successfully.", console_log_1.TypeMessage.success);
            console_log_1.print(` ${info[0]}: ${info[1]}`, console_log_1.TypeMessage.info);
            console_log_1.printSeparator();
            break;
        }
    }
};
//# sourceMappingURL=registry-service.js.map