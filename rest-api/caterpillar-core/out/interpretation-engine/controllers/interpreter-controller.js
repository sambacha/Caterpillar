"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProcessModelMetadata = exports.getParsedModelList = exports.createNewInterpreterInstance = exports.parseAndDeployProcessModelFull = void 0;
const app_1 = require("./../../app");
const request_logs_1 = require("../../adapters/messages/request-logs");
const console_log_1 = require("../../adapters/messages/console-log");
const parsingService = require("../services/process-analyser/bpmn-parser");
const compilationService = require("../services/process-analyser/bpmn-compiler");
const deploymentService = require("../services/process-setup-handler/deployment-mediator");
const runtimeRegistryService = require("./../../runtime-registry/services/registry-service");
const infoCollectorService = require("./../services/worklist-handler/process-info-collector");
let runtimeRegistry;
exports.parseAndDeployProcessModelFull = async (request, response) => {
    let interpreterInfo;
    let iFlowInfo;
    let iDataInfo;
    let iFactoryInfo;
    parsingService
        .parseBpmnModel(request.body.bpmn)
        .then((procInfo) => {
        request_logs_1.printl(5, procInfo.procName);
        runtimeRegistryService
            .validateRegistry(request.body.registryAddress, this.runtimeRegistry)
            .then((runtimeRegistry) => {
            this.runtimeRegistry = runtimeRegistry;
            compilationService
                .compileBPMNINterpreter()
                .then((cInfo) => {
                interpreterInfo = cInfo;
                return compilationService.compileIFlow();
            })
                .then((cInfo) => {
                iFlowInfo = cInfo;
                return compilationService.compileIData(procInfo);
            })
                .then((cInfo) => {
                iDataInfo = cInfo;
                return compilationService.compileIFactory(procInfo);
            })
                .then((cInfo) => {
                iFactoryInfo = cInfo;
                console_log_1.print(`IData and IFactory contracts generated and compiled succesfully`, console_log_1.TypeMessage.success);
                console_log_1.print(`Starting contract deployments and registration`, console_log_1.TypeMessage.pending);
                return deploymentService.deployAllProcessContracts(procInfo, interpreterInfo, iFlowInfo, iDataInfo, iFactoryInfo, runtimeRegistry, request.body.bpmn);
            })
                .then((transactionHashes) => {
                console_log_1.print(`Deployment transactions sent`, console_log_1.TypeMessage.pending);
                console_log_1.print(transactionHashes, console_log_1.TypeMessage.data);
                response.status(201).send({
                    BPMNINterpreter: JSON.stringify(interpreterInfo),
                    IData: JSON.stringify(iDataInfo),
                    IFlow: JSON.stringify(iFlowInfo),
                    IFactry: JSON.stringify(iFactoryInfo),
                    transactionHashes: transactionHashes,
                });
            })
                .catch((error) => {
                response.status(400).send(error);
            });
        })
            .catch((error) => {
            response.status(400).send(error);
        });
    })
        .catch((error) => {
        response.status(400).send(error);
    });
};
exports.createNewInterpreterInstance = (request, response) => {
    request_logs_1.printl(13, "BPMN Interpreter");
    compilationService
        .compileBPMNINterpreter()
        .then((cInfo) => {
        return deploymentService.deploySmartContractSync(cInfo);
    })
        .then((deploymentResult) => {
        if (app_1.webSocket)
            app_1.webSocket.send(JSON.stringify(deploymentResult));
        response.status(201).send(JSON.stringify(deploymentResult));
    })
        .catch((error) => {
        response.status(400).send(error);
    });
};
exports.getParsedModelList = (request, response) => {
    request_logs_1.printl(18, ["IFlow nodes", request.get("registryAddress")]);
    runtimeRegistryService
        .validateRegistry(request.get("registryAddress"), this.runtimeRegistry)
        .then((runtimeRegistry) => {
        runtimeRegistryService
            .findAllRegisteredIFlows(runtimeRegistry)
            .then((addressList) => {
            response.status(200).send(JSON.stringify(addressList));
        })
            .catch((error) => {
            response.status(400).send(JSON.stringify(error));
        });
    })
        .catch((error) => {
        response.status(400).send(JSON.stringify(error));
    });
};
exports.getProcessModelMetadata = (request, response) => {
    request_logs_1.printl(19, [request.params.mHash]);
    infoCollectorService
        .findProcessModelMetadata(request.params.mHash)
        .then((pInfo) => {
        response.status(200).send(JSON.stringify(pInfo));
    })
        .catch((error) => {
        response.status(400).send(error);
    });
};
//# sourceMappingURL=interpreter-controller.js.map