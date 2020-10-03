"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveModelMetadata = exports.queryProcessModels = exports.deployProcessModels = exports.compileProcessModels = void 0;
const bpmn_parser_1 = require("../services/bpmn-parser");
const compilationService = require("../services/bpmn-compiler");
const deploymentService = require("../services/deployment-mediator");
const registryService = require("../../runtime-registry/services/registry-service");
const runtimeRegistryService = require("../../runtime-registry/services/registry-service");
const request_logs_1 = require("../../adapters/messages/request-logs");
let runtimeRegistry;
exports.compileProcessModels = (request, response) => {
    let modelInfo = request.body;
    request_logs_1.printl(8, modelInfo.name);
    bpmn_parser_1.parseModel(modelInfo)
        .then(() => {
        return compilationService.compileProcessModel(modelInfo);
    })
        .then((contracts) => response.status(201).send(JSON.stringify(contracts)))
        .catch((error) => response.status(400).send(error));
};
exports.deployProcessModels = (request, response) => {
    let modelInfo = request.body;
    let contracts;
    request_logs_1.printl(5, modelInfo.name);
    runtimeRegistryService
        .validateRegistry(request.body.registryAddress, this.runtimeRegistry)
        .then((runtimeRegistry) => {
        this.runtimeRegistry = runtimeRegistry;
        bpmn_parser_1.parseModel(modelInfo)
            .then(() => {
            return compilationService.compileProcessModel(modelInfo);
        })
            .then((compiledContracts) => {
            contracts = compiledContracts;
            return deploymentService.registerProcessRepository(modelInfo, contracts);
        })
            .then((result) => {
            return deploymentService.registerParent2ChildrenRelation(result, modelInfo, this.runtimeRegistry);
        })
            .then((result) => {
            return deploymentService.deployAndRegisterFactories(result, contracts.compilationMetadata, this.runtimeRegistry);
        })
            .then((result) => {
            return deploymentService.deployAndRegisterWorklists(modelInfo, result, contracts.compilationMetadata, this.runtimeRegistry);
        })
            .then((result) => response.status(201).send({ bundleID: result }))
            .catch((error) => {
            response.status(400).send(error);
        });
    })
        .catch((error) => response.status(400).send(error));
};
exports.queryProcessModels = (request, response) => {
    request_logs_1.printl(6, request.get("registryAddress"));
    runtimeRegistryService
        .validateRegistry(request.get("registryAddress"), this.runtimeRegistry)
        .then((runtimeRegistry) => {
        this.runtimeRegistry = runtimeRegistry;
        registryService
            .findAllRegisteredModels(this.runtimeRegistry)
            .then((models) => {
            response.status(200).send(JSON.stringify(models));
        })
            .catch((error) => {
            response.status(400).send(error);
        });
    })
        .catch((error) => {
        response.status(400).send(error);
    });
};
exports.retrieveModelMetadata = (request, response) => {
    request_logs_1.printl(7, request.params.mHash);
    deploymentService
        .retrieveProcessModelMetadata(request.params.mHash)
        .then((modelInfo) => {
        response.status(200).send(modelInfo);
    })
        .catch((error) => {
        response.status(400).send(error);
    });
};
//# sourceMappingURL=process-models-controller.js.map