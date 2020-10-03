"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRuntimeRegistryInfo = exports.deployRuntimeRegistry = void 0;
const compilation_output_1 = require("./../../adapters/ethereum-blockchain/structs/compilation-output");
const contract_info_1 = require("../../adapters/ethereum-blockchain/structs/contract-info");
const registryService = require("../services/registry-service");
const request_logs_1 = require("../../adapters/messages/request-logs");
exports.deployRuntimeRegistry = (request, response) => {
    try {
        request_logs_1.printl(9, "Runtime Registry");
        let compilationInfo = registryService.compileRuntimeRegistry();
        if (compilationInfo instanceof compilation_output_1.CompilationError) {
            response
                .status(400)
                .send(JSON.stringify(compilationInfo.errors));
        }
        else {
            registryService
                .deployRegistry(compilationInfo)
                .then((deploymentInfo) => {
                return registryService.updateRegistryRepository(new contract_info_1.ContractInfo("Runtime Registry", compilationInfo.abi, compilationInfo.bytecode, registryService.getRegistrySolidityCode(), deploymentInfo.contractAddress));
            })
                .then((repoID) => {
                response.status(201).send({ ID: repoID });
            })
                .catch((error) => {
                response.status(400).send(JSON.stringify(error));
            });
        }
    }
    catch (error) {
        response.status(400).send(error.toString());
    }
};
exports.getRuntimeRegistryInfo = (request, response) => {
    request_logs_1.printl(10, [
        request.params.registryId,
        request.params.registryAddress,
    ]);
    let query = request.params.registryId
        ? registryService.findRegistryById(request.params.registryId)
        : registryService.findRegistryByAddress(request.params.registryAddress);
    query
        .then((data) => {
        response.status(200).send(JSON.stringify(data));
    })
        .catch((error) => {
        console.log(error);
        response.status(400).send(JSON.stringify(error));
    });
};
//# sourceMappingURL=registry-controller.js.map