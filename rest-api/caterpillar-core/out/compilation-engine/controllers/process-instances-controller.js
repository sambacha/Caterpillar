"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeWorkitem = exports.queryProcessState = exports.queryProcessInstances = exports.createNewProcessInstance = void 0;
const async_requests_1 = require("./../utils/structs/async-requests");
const async_requests_2 = require("../utils/structs/async-requests");
const executionService = require("../services/execution-monitor");
const runtimeRegistryService = require("../../runtime-registry/services/registry-service");
const eventMonitor = require("../services/event-monitor");
const request_logs_1 = require("../../adapters/messages/request-logs");
let runtimeRegistry;
exports.createNewProcessInstance = (request, response) => {
    request_logs_1.printl(1, ['ID', request.params.mHash]);
    runtimeRegistryService
        .validateRegistry(request.body.registryAddress, this.runtimeRegistry)
        .then((runtimeRegistry) => {
        this.runtimeRegistry = runtimeRegistry;
        return executionService.createProcessInstance(request.params.mHash, this.runtimeRegistry, request.body.accessCtrlAddr, request.body.rbPolicyAddr, request.body.taskRoleMapAddr);
    })
        .then((transactionHash) => {
        eventMonitor.listenForPendingTransaction(this.runtimeRegistry.address, this.runtimeRegistry.abi, eventMonitor.EventType.NewProcessInstanceCreated, new async_requests_2.NewInstRequest(request.params.mHash, request.params.mHash, transactionHash, executionService.handleNewInstance));
        response.status(202).send({ transactionHash: transactionHash });
    })
        .catch((error) => {
        response.status(400).send(error);
    });
};
exports.queryProcessInstances = (request, response) => {
    request_logs_1.printl(2, ['ID', request.params.mHash]);
    runtimeRegistryService
        .validateRegistry(request.get("registryAddress"), this.runtimeRegistry)
        .then((runtimeRegistry) => {
        this.runtimeRegistry = runtimeRegistry;
        runtimeRegistryService
            .findRunningInstancesFor(request.params.mHash, this.runtimeRegistry)
            .then((instances) => {
            response.status(200).send(JSON.stringify(instances));
        })
            .catch((error) => {
            response.status(400).send(error);
        });
    })
        .catch((error) => {
        response.status(400).send(error);
    });
};
exports.queryProcessState = (request, response) => {
    request_logs_1.printl(3, request.params.pAddress);
    runtimeRegistryService
        .validateRegistry(request.get("registryAddress"), this.runtimeRegistry)
        .then((runtimeRegistry) => {
        this.runtimeRegistry = runtimeRegistry;
        executionService
            .queryProcessState(request.params.pAddress, this.runtimeRegistry)
            .then((workitems) => {
            response.status(200).send(JSON.stringify(workitems));
        })
            .catch((error) => {
            response.status(400).send(error);
        });
    })
        .catch((error) => {
        response.status(400).send(error);
    });
};
exports.executeWorkitem = (request, response) => {
    request_logs_1.printl(4, [request.params.wi, request.params.wlAddress]);
    runtimeRegistryService
        .validateRegistry(request.body.registryAddress, this.runtimeRegistry)
        .then((runtimeRegistry) => {
        this.runtimeRegistry = runtimeRegistry;
        return executionService.executeWorkitem(request.params.wlAddress, parseInt(request.params.wiIndex), request.body.inputParameters, this.runtimeRegistry);
    })
        .then((result) => {
        eventMonitor.listenForPendingTransaction(request.params.wlAddress, result.worklistAbi, eventMonitor.EventType.UserTaskCompleted, new async_requests_1.TaskCompletedRequest(result.taskName, parseInt(request.params.wiIndex), request.params.wlAddress, result.transactionHash, executionService.handleWorkitemExecuted));
        response.status(202).send({ transactionHash: result.transactionHash });
    })
        .catch((error) => {
        response.status(400).send(error);
    });
};
//# sourceMappingURL=process-instances-controller.js.map