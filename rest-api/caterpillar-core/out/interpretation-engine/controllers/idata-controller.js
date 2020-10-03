"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkInTaskInProcessInstance = exports.checkOutTaskInProcessInstance = exports.getProcessInstanceState = exports.getProcessInstancesList = exports.createNewProcessInstance = void 0;
const request_logs_1 = require("../../adapters/messages/request-logs");
const executionMediatorService = require("./../services/worklist-handler/execution-mediator");
const processInfoCollectorService = require("./../services/worklist-handler/process-info-collector");
const runtimeRegistryService = require("./../../runtime-registry/services/registry-service");
let runtimeRegistry;
exports.createNewProcessInstance = (request, response) => {
    request_logs_1.printl(1, ['IFlow address', request.params.cfAddress]);
    runtimeRegistryService
        .validateRegistry(request.body.registryAddress, this.runtimeRegistry)
        .then((runtimeRegistry) => {
        this.runtimeRegistry = runtimeRegistry;
        return executionMediatorService.createNewProcessInstance(request.params.cfAddress, this.runtimeRegistry, request.body.accessCtrlAddr, request.body.rbPolicyAddr, request.body.taskRoleMapAddr);
    })
        .then((transactionHash) => {
        response.status(202).send({ transactionHash: transactionHash });
    })
        .catch((error) => {
        response.status(400).send(error);
    });
};
exports.getProcessInstancesList = (request, response) => {
    request_logs_1.printl(2, ['IFlow address', request.params.cfAddress]);
    processInfoCollectorService
        .findIDataInstances(request.params.cfAddress)
        .then((instancesList) => {
        response.status(200).send(JSON.stringify(instancesList));
    })
        .catch((error) => {
        response.status(400).send(error);
    });
};
exports.getProcessInstanceState = (request, response) => {
    request_logs_1.printl(3, request.params.pcAddress);
    runtimeRegistryService
        .validateRegistry(request.get("registryAddress"), this.runtimeRegistry)
        .then((runtimeRegistry) => {
        this.runtimeRegistry = runtimeRegistry;
        return executionMediatorService.queryProcessState(request.params.pcAddress, this.runtimeRegistry);
    })
        .then((processState) => {
        response.status(200).send(JSON.stringify(processState));
    })
        .catch((error) => {
        response.status(400).send(error);
    });
};
exports.checkOutTaskInProcessInstance = (request, response) => {
    request_logs_1.printl(12, [request.params.eIndex, request.params.pcAddress]);
    runtimeRegistryService
        .validateRegistry(request.get("registryAddress"), this.runtimeRegistry)
        .then((runtimeRegistry) => {
        this.runtimeRegistry = runtimeRegistry;
        return executionMediatorService.checkOutTaskData(request.params.eIndex, request.params.pcAddress, JSON.parse(request.get("outParams")), this.runtimeRegistry);
    })
        .then((processData) => {
        response.status(200).send({ output: processData });
    })
        .catch((error) => {
        response.status(400).send(error);
    });
};
exports.checkInTaskInProcessInstance = (request, response) => {
    request_logs_1.printl(11, [request.params.eIndex, request.params.pcAddress]);
    runtimeRegistryService
        .validateRegistry(request.body.registryAddress, this.runtimeRegistry)
        .then((runtimeRegistry) => {
        this.runtimeRegistry = runtimeRegistry;
        return executionMediatorService.executeTask(request.params.eIndex, request.params.pcAddress, JSON.parse(request.body.inParams), this.runtimeRegistry);
    })
        .then((transactionHash) => {
        response.status(202).send(JSON.stringify(transactionHash));
    })
        .catch((error) => {
        response.status(400).send(error);
    });
};
//# sourceMappingURL=idata-controller.js.map