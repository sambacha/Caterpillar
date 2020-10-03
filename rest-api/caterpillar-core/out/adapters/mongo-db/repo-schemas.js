"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleTaskMapSchema = exports.RoleBindingSchema = exports.ProcessIESchema = exports.ProcessCESchema = exports.SContractsSchema = exports.getModelSchema = void 0;
const repo_types_1 = require("./repo-types");
const mongoose = require("mongoose");
exports.getModelSchema = (repoType) => {
    switch (repoType) {
        case repo_types_1.RepoType.ProcessCompiledEngine: {
            return exports.ProcessCESchema;
        }
        case repo_types_1.RepoType.RuntimeRegistry: {
            return exports.SContractsSchema;
        }
        case repo_types_1.RepoType.ProcessInterpretedEngine: {
            return exports.ProcessIESchema;
        }
        case repo_types_1.RepoType.SmartContract: {
            return exports.SContractsSchema;
        }
        case repo_types_1.RepoType.RoleBindingPolicy: {
            return exports.RoleBindingSchema;
        }
        case repo_types_1.RepoType.RoleTaskMap: {
            return exports.RoleTaskMapSchema;
        }
        default:
            return undefined;
    }
};
exports.SContractsSchema = mongoose.model("SContractsRepo", {
    contractName: String,
    address: String,
    solidityCode: String,
    abi: String,
    bytecode: String,
    _relId: String
});
exports.ProcessCESchema = mongoose.model("ProcessCERepo", {
    rootProcessID: String,
    rootProcessName: String,
    bpmnModel: String,
    indexToElement: [mongoose.Schema.Types.Mixed],
    worklistAbi: String,
    contractName: String,
    solidityCode: String,
    abi: String,
    bytecode: String,
});
exports.ProcessIESchema = mongoose.model("ProcessIERepo", {
    processID: String,
    processName: String,
    bpmnModel: String,
    indexToElement: [mongoose.Schema.Types.Mixed],
    children: [String],
    iDataId: String,
    iFactoryId: String,
    iFlowId: String
});
exports.RoleBindingSchema = mongoose.model("RoleBinding", {
    policyModel: String,
    roleIndexMap: [String],
    contractName: String,
    address: String,
    solidityCode: String,
    abi: String,
    bytecode: String,
});
exports.RoleTaskMapSchema = mongoose.model("RoleTaskMap", {
    indexToRole: [String],
    contractName: String,
    address: String,
    solidityCode: String,
    abi: String,
    bytecode: String,
});
//# sourceMappingURL=repo-schemas.js.map