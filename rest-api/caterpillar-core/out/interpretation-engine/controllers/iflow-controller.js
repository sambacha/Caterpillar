"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIFlowOnChainInfo = exports.relateFactoryToIFlow = exports.setChildInIflowNode = exports.setElementInIflowNode = exports.createNewIFlowInstance = void 0;
const async_requests_1 = require("./../utils/structs/async-requests");
const request_logs_1 = require("../../adapters/messages/request-logs");
const compilationService = require("../services/process-analyser/bpmn-compiler");
const deploymentService = require("../services/process-setup-handler/deployment-mediator");
const registrationService = require("./../services/process-setup-handler/registration-mediator");
const eventMonitor = require("./../services/worklist-handler/event-monitor");
const processInfoCollector = require("./../services/worklist-handler/process-info-collector");
const runtimeRegistryService = require("./../../runtime-registry/services/registry-service");
let runtimeRegistry;
exports.createNewIFlowInstance = (request, response) => {
    request_logs_1.printl(13, "IFlow node");
    let compilationInfo;
    runtimeRegistryService
        .validateRegistry(request.body.registryAddress, this.runtimeRegistry)
        .then((runtimeRegistry) => {
        this.runtimeRegistry = runtimeRegistry;
        return compilationService.compileIFlow();
    })
        .then((cInfo) => {
        compilationInfo = cInfo;
        return deploymentService.deploySmartContractSync(cInfo, [request.body.registryAddress]);
    })
        .then((deploymentResult) => {
        response.status(201).send({
            compilation: JSON.stringify(compilationInfo),
            deployment: JSON.stringify(deploymentResult),
        });
    })
        .catch((error) => {
        response.status(400).send(error);
    });
};
exports.setElementInIflowNode = (request, response) => {
    request_logs_1.printl(14, [request.params.cfAddress, request.body.elemInfo]);
    registrationService
        .setIFlowNodeElement(request.params.cfAddress, request.body.iFlowAbi, JSON.parse(request.body.elemInfo))
        .then((transactionHash) => {
        eventMonitor.listenForPendingTransaction(transactionHash, new async_requests_1.UpdatingIFlowRequest(request.body.elemInfo, request.params.cfAddress, transactionHash, registrationService.handleIFlowElementUpdated));
        response.status(202).send({ transactionHash: transactionHash });
    })
        .catch((error) => {
        response.status(400).send({ error: error });
    });
};
exports.setChildInIflowNode = (request, response) => {
    request_logs_1.printl(15, [request.params.cfAddress, request.body.subProcessInfo]);
    registrationService
        .linkSubProcess(request.params.cfAddress, request.body.iFlowAbi, JSON.parse(request.body.subProcessInfo))
        .then((transactionHash) => {
        eventMonitor.listenForPendingTransaction(transactionHash, new async_requests_1.UpdatingIFlowRequest(request.body.subProcessInfo, request.params.cfAddress, transactionHash, registrationService.handleIFlowElementUpdated));
        response.status(202).send({ transactionHash: transactionHash });
    })
        .catch((error) => {
        response.status(400).send({ error: error });
    });
};
exports.relateFactoryToIFlow = (request, response) => {
    request_logs_1.printl(16, [request.params.cfAddress, request.body.iFactoryAddress]);
    registrationService
        .relateContractAddressToIflow(request.params.cfAddress, request.body.iFactoryAddress, request.body.iFlowAbi, "IFactory", "setFactoryInst")
        .then((transactionHash) => {
        eventMonitor.listenForPendingTransaction(transactionHash, new async_requests_1.UpdatingIFlowRequest(request.body.iFactoryAddress, request.params.cfAddress, transactionHash, registrationService.handleIFactoryIFlowRelation));
        response.status(202).send({ transactionHash: transactionHash });
    })
        .catch((error) => {
        response.status(400).send({ error: error });
    });
};
exports.getIFlowOnChainInfo = (request, response) => {
    request_logs_1.printl(17, [request.params.cfAddress]);
    processInfoCollector
        .findIFlowInfo(request.params.cfAddress)
        .then((info) => {
        response.status(200).send(info);
    })
        .catch((error) => {
        response.status(400).send(error);
    });
};
//# sourceMappingURL=iflow-controller.js.map