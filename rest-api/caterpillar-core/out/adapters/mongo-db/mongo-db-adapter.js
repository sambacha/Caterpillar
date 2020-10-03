"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPolicyByAddress = exports.findModelMetadataById = exports.findContractInfoByAddress = exports.findContractInfoById = exports.updateRepository = void 0;
const repo_types_1 = require("./repo-types");
const repoSchemas = require("./repo-schemas");
const repoDocuments = require("./repo-documents");
const contract_info_1 = require("./../ethereum-blockchain/structs/contract-info");
const repo_models_1 = require("./repo-models");
const promise_error_1 = require("../errors/promise-error");
exports.updateRepository = (repoType, modelMetadata) => {
    return new Promise((resolve, reject) => {
        try {
            let mongoDBModel = repoSchemas.getModelSchema(repoType);
            if (!mongoDBModel)
                reject("undefined database schema");
            mongoDBModel.create(repoDocuments.getJsonDocument(repoType, modelMetadata), (error, repoData) => {
                if (error)
                    reject(error);
                else {
                    resolve(repoData._id);
                }
            });
        }
        catch (error) {
            reject(error);
        }
    });
};
exports.findContractInfoById = (repoType, id) => {
    return new Promise((resolve, reject) => {
        let mongoDBModel = repoSchemas.getModelSchema(repoType);
        mongoDBModel.find({ _id: id }, (error, repoData) => {
            if (error) {
                reject(new promise_error_1.PromiseError(`Querying metadata of contract info with ID ${id} from repository`, error, [new promise_error_1.Component("MongoDB Adapter", "findContractInfoById")]));
            }
            else {
                try {
                    resolve(toContractInfo(repoData));
                }
                catch (error) {
                    reject(error);
                }
            }
        });
    });
};
exports.findContractInfoByAddress = (repoType, address) => {
    return new Promise((resolve, reject) => {
        let mongoDBModel = repoSchemas.getModelSchema(repoType);
        mongoDBModel.find({ address: address }, (error, repoData) => {
            if (error) {
                reject(new promise_error_1.PromiseError(`Querying contract metadata from address ${address} from repository`, error, [new promise_error_1.Component("MongoDB Adapter", "findContractInfoByAddress")]));
            }
            else {
                try {
                    resolve(toContractInfo(repoData));
                }
                catch (error) {
                    reject(error);
                }
            }
        });
    });
};
exports.findModelMetadataById = (repoType, id) => {
    return new Promise((resolve, reject) => {
        let mongoDBModel = repoSchemas.getModelSchema(repoType);
        mongoDBModel.find({ _id: id }, async (error, repoData) => {
            if (error) {
                reject(new promise_error_1.PromiseError(`Querying metadata of process with ID ${id} from repository`, error, [new promise_error_1.Component("MongoDB Adapter", "findModelMetadataById")]));
            }
            else {
                try {
                    switch (repoType) {
                        case repo_types_1.RepoType.ProcessCompiledEngine: {
                            resolve(toProcessMetadata(repoData)[0]);
                            break;
                        }
                        case repo_types_1.RepoType.ProcessInterpretedEngine: {
                            let processInfo = await toProcessIEMetadata(repoData);
                            resolve(processInfo[0]);
                            break;
                        }
                        case repo_types_1.RepoType.RoleBindingPolicy: {
                            resolve(toRoleBindingPolicy(repoData));
                            break;
                        }
                        case repo_types_1.RepoType.RoleTaskMap: {
                            resolve(toRoleTaskMap(repoData));
                            break;
                        }
                        default: {
                            reject(`Invalid type ${repoData}`);
                        }
                    }
                }
                catch (error) {
                    reject(error);
                }
            }
        });
    });
};
exports.findPolicyByAddress = (repoType, address) => {
    return new Promise((resolve, reject) => {
        let mongoDBModel = repoSchemas.getModelSchema(repoType);
        mongoDBModel.find({ address: address }, async (error, repoData) => {
            if (error) {
                reject(new promise_error_1.PromiseError(`Querying metadata of process with ID ${address} from repository`, error, [new promise_error_1.Component("MongoDB Adapter", "findPolicyByAddress")]));
            }
            else {
                try {
                    switch (repoType) {
                        case repo_types_1.RepoType.RoleBindingPolicy: {
                            resolve(toRoleBindingPolicy(repoData));
                            break;
                        }
                        case repo_types_1.RepoType.RoleTaskMap: {
                            resolve(toRoleTaskMap(repoData));
                            break;
                        }
                        default: {
                            reject(`Invalid type ${repoData}`);
                        }
                    }
                }
                catch (error) {
                    reject(error);
                }
            }
        });
    });
};
let toContractInfo = (repoData) => {
    let result = new contract_info_1.ContractInfo(repoData[0].contractName, repoData[0].abi, repoData[0].bytecode, repoData[0].solidityCode, repoData[0].address);
    if (repoData[0]._relId)
        result._relId = repoData[0]._relId;
    return result;
};
let toRoleBindingPolicy = (repoData) => {
    let result = new repo_models_1.RoleBindingPolicy(repoData[0].policyModel, createMap(repoData[0].roleIndexMap), toContractInfo(repoData));
    result._id = repoData._id;
    return result;
};
let toRoleTaskMap = (repoData) => {
    let result = new repo_models_1.RoleTaskMap(repoData[0].indexToRole, toContractInfo(repoData));
    result._id = repoData._id;
    return result;
};
let toProcessMetadata = (repoData) => {
    return repoData.map((modelInfo) => {
        return new repo_models_1.ProcessCEMetadata(modelInfo._id, modelInfo.rootProcessID, modelInfo.rootProcessName, modelInfo.bpmnModel, modelInfo.indexToElement, modelInfo.worklistAbi, new contract_info_1.ContractInfo(modelInfo.contractName, modelInfo.abi, modelInfo.bytecode, modelInfo.solidityCode, undefined));
    });
};
let toProcessIEMetadata = async (repoData) => {
    let result = new Array();
    for (let i = 0; i < repoData.length; i++) {
        let relatedContracts = await extractContractInfo(repoData[i]);
        result[i] = new repo_models_1.ProcessIEMetadata(repoData[i].processID, repoData[i].processName, repoData[i].bpmnModel, repoData[i].indexToElement, await extractChildren(repoData[i].children), relatedContracts[0], relatedContracts[1], relatedContracts[2]);
        result[i]._id = repoData[i]._id;
    }
    return result;
};
let extractChildren = async (children) => {
    let result = new Array();
    for (let i = 0; i < children.length; i++) {
        let pInfo = await exports.findModelMetadataById(repo_types_1.RepoType.ProcessInterpretedEngine, children[i]);
        result.push(pInfo);
    }
    return result;
};
let extractContractInfo = async (repoData) => {
    let iFlow = await exports.findContractInfoById(repo_types_1.RepoType.SmartContract, repoData.iFlowId);
    let iData = await exports.findContractInfoById(repo_types_1.RepoType.SmartContract, iFlow._relId);
    let iFactory = await exports.findContractInfoById(repo_types_1.RepoType.SmartContract, repoData.iFactoryId);
    return [iData, iFactory, iFlow];
};
let createMap = (indexArr) => {
    let result = new Map();
    for (let i = 0; i < indexArr.length; i++)
        result.set(indexArr[i], i);
    return result;
};
//# sourceMappingURL=mongo-db-adapter.js.map