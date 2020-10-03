"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findRoleTaskMapMetadata = exports.findRBPolicyMetadata = exports.parseAndDeployTaskRoleMap = exports.parseAndDeployRBPolicy = void 0;
const policyParsingService = require("./../services/binding-policy-parser");
const deploymentService = require("./../services/deployment-mediator");
const policyInfoCollector = require("./../services/policy-info-collector");
const request_logs_1 = require("../../adapters/messages/request-logs");
let runtimeRegistry;
exports.parseAndDeployRBPolicy = (request, response) => {
    request_logs_1.printl(20, request.body.policy);
    policyParsingService
        .generatePolicy(request.body.policy, "BindingPolicy")
        .then((rbPolicy) => {
        rbPolicy.model = request.body.policy;
        return deploymentService.deployBindingPolicy(rbPolicy);
    })
        .then((compilationResult) => {
        response.status(202).send(JSON.stringify(compilationResult));
    })
        .catch((error) => {
        response.status(400).send(error);
    });
};
exports.parseAndDeployTaskRoleMap = (request, response) => {
    request_logs_1.printl(21, request.body.roleTaskPairs);
    policyParsingService
        .generateRoleTaskContract(JSON.parse(request.body.roleTaskPairs), request.body.contractName, true)
        .then((solidityCode) => {
        return deploymentService.deployTaskRoleMap(request.body.contractName, JSON.parse(request.body.roleTaskPairs), solidityCode);
    })
        .then((compilationResult) => {
        response.status(202).send(JSON.stringify(compilationResult));
    })
        .catch((error) => {
        response.status(400).send(error);
    });
};
exports.findRBPolicyMetadata = (request, response) => {
    request_logs_1.printl(24, ["Role-Binding Policy", request.params.rbPolicyAddr]);
    policyInfoCollector
        .findPolicyMetadata(request.params.rbPolicyAddr)
        .then((policyInfo) => {
        response.status(200).send(JSON.stringify(policyInfo));
    })
        .catch((error) => {
        response
            .status(400)
            .send({ Error: "Policy Metadata NOT Found", response: error });
    });
};
exports.findRoleTaskMapMetadata = (request, response) => {
    request_logs_1.printl(24, ["Role-Task Map", request.params.taskRoleMAddr]);
    policyInfoCollector
        .findRoleTaskMapMetadata(request.params.taskRoleMAddr)
        .then((roleTaskInfo) => {
        response.status(200).send(JSON.stringify(roleTaskInfo));
    })
        .catch((error) => {
        response
            .status(400)
            .send({ Error: "RoleTaskMap Metadata NOT Found", response: error });
    });
};
//# sourceMappingURL=role-binding-controller.js.map