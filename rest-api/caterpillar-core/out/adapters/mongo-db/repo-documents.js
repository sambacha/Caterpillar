"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJsonDocument = void 0;
const repo_types_1 = require("./repo-types");
exports.getJsonDocument = (repoType, modelMetadata) => {
    let jsonDocument = modelMetadata.contractInfo
        ? {
            contractName: modelMetadata.contractInfo.contractName,
            address: modelMetadata.contractInfo.address,
            solidityCode: modelMetadata.contractInfo.solidityCode,
            abi: modelMetadata.contractInfo.abi,
            bytecode: modelMetadata.contractInfo.bytecode,
        }
        : undefined;
    switch (repoType) {
        case repo_types_1.RepoType.ProcessCompiledEngine: {
            return createProcessDocument(jsonDocument, modelMetadata);
        }
        case repo_types_1.RepoType.ProcessInterpretedEngine: {
            return createProcessIEDocument(modelMetadata);
        }
        case repo_types_1.RepoType.RoleBindingPolicy: {
            jsonDocument["policyModel"] = modelMetadata.policyModel;
            jsonDocument["roleIndexMap"] = mapToArray(modelMetadata.roleIndexMap);
            return jsonDocument;
        }
        case repo_types_1.RepoType.RoleTaskMap: {
            jsonDocument["indexToRole"] = modelMetadata.indexToRole;
            return jsonDocument;
        }
        default: {
            jsonDocument["_relId"] = modelMetadata.contractInfo._relId;
            return jsonDocument;
        }
    }
};
let createProcessDocument = (jsonDocument, processMetadata) => {
    jsonDocument["rootProcessID"] = processMetadata.rootModelID;
    jsonDocument["rootProcessName"] = processMetadata.rootModelName;
    jsonDocument["bpmnModel"] = processMetadata.bpmnModel;
    jsonDocument["indexToElement"] = processMetadata.indexToElementMap;
    jsonDocument["worklistAbi"] = processMetadata.worklistABI;
    return jsonDocument;
};
let createProcessIEDocument = (processMetadata) => {
    return {
        processID: processMetadata.processID,
        processName: processMetadata.processName,
        bpmnModel: processMetadata.bpmnModel,
        indexToElement: processMetadata.indexToElement,
        children: processMetadata.children,
        iFactoryId: processMetadata.iFactory,
        iFlowId: processMetadata.iFlow,
    };
};
let extractIds = (children) => {
    return children.map((subProc) => {
        return subProc._id;
    });
};
let mapToArray = (roleIndexMap) => {
    let indexes = [];
    roleIndexMap.forEach((rInd, role) => {
        indexes[rInd] = role;
    });
    return indexes;
};
//# sourceMappingURL=repo-documents.js.map