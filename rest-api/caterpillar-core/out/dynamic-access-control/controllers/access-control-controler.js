"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPolicyAddresses = exports.findAccessControlMetadata = exports.vote = exports.release = exports.nominate = exports.nominateCaseCreator = exports.findRoleState = exports.deployAccessControl = void 0;
const deploymentService = require("./../services/deployment-mediator");
const runtimeRegistryService = require("./../../runtime-registry/services/registry-service");
const runtimeOperations = require("./../services/runtime-operations-mediator");
const policyInfoCollector = require("./../services/policy-info-collector");
const request_logs_1 = require("../../adapters/messages/request-logs");
let runtimeRegistry;
exports.deployAccessControl = (request, response) => {
    request_logs_1.printl(9, "DynamicAccessControl");
    deploymentService
        .deployAccessControl()
        .then((compilationResult) => {
        response.status(202).send(JSON.stringify(compilationResult));
    })
        .catch((error) => {
        response.status(400).send(error);
    });
};
exports.findRoleState = (request, response) => {
    request_logs_1.printl(22, [request.get("role"), request.params.pCase]);
    runtimeRegistryService
        .validateRegistry(request.get("registryAddress"), this.runtimeRegistry)
        .then((runtimeRegistry) => {
        this.runtimeRegistry = runtimeRegistry;
        return runtimeOperations.getRoleState(this.runtimeRegistry, request.params.pCase, request.get("role"));
    })
        .then((roleState) => {
        response
            .status(200)
            .send({ role: request.get("role"), state: roleState });
    })
        .catch((error) => {
        response.status(400).send({ error: error });
    });
};
exports.nominateCaseCreator = (request, response) => {
    request_logs_1.printl(23, ["nominate-case-creator", request.params.pCase]);
    runtimeRegistryService
        .validateRegistry(request.body.registryAddress, this.runtimeRegistry)
        .then((runtimeRegistry) => {
        this.runtimeRegistry = runtimeRegistry;
        return runtimeOperations.nominateCaseCreator(this.runtimeRegistry, request.params.pCase, request.body.rNominee, request.body.nominee);
    })
        .then((result) => {
        response.status(202).send(JSON.stringify(result));
    })
        .catch((error) => {
        response.status(400).send(error);
    });
};
exports.nominate = (request, response) => {
    request_logs_1.printl(23, ["nominate", request.params.pCase]);
    runtimeRegistryService
        .validateRegistry(request.body.registryAddress, this.runtimeRegistry)
        .then((runtimeRegistry) => {
        this.runtimeRegistry = runtimeRegistry;
        return runtimeOperations.nominate(this.runtimeRegistry, request.params.pCase, request.body.rNominator, request.body.rNominee, request.body.nominator, request.body.nominee);
    })
        .then((result) => {
        response.status(202).send(JSON.stringify(result));
    })
        .catch((error) => {
        response.status(400).send(error);
    });
};
exports.release = (request, response) => {
    request_logs_1.printl(23, ["release", request.params.pCase]);
    runtimeRegistryService
        .validateRegistry(request.body.registryAddress, this.runtimeRegistry)
        .then((runtimeRegistry) => {
        this.runtimeRegistry = runtimeRegistry;
        return runtimeOperations.release(this.runtimeRegistry, request.params.pCase, request.body.rNominator, request.body.rNominee, request.body.nominator);
    })
        .then((result) => {
        response.status(202).send(JSON.stringify(result));
    })
        .catch((error) => {
        response.status(400).send(error);
    });
};
exports.vote = (request, response) => {
    request_logs_1.printl(23, ["vote", request.params.pCase]);
    runtimeRegistryService
        .validateRegistry(request.body.registryAddress, this.runtimeRegistry)
        .then((runtimeRegistry) => {
        this.runtimeRegistry = runtimeRegistry;
        return runtimeOperations.vote(this.runtimeRegistry, request.params.pCase, request.body.rNominator, request.body.rNominee, request.body.rEndorser, request.body.endorser, request.body.isAccepted, request.body.toEndorseOp === "nominate"
            ? runtimeOperations.OperationType.voteNomination
            : runtimeOperations.OperationType.voteRelease);
    })
        .then((result) => {
        response.status(202).send(JSON.stringify(result));
    })
        .catch((error) => {
        response.status(400).send(error);
    });
};
exports.findAccessControlMetadata = (request, response) => {
    request_logs_1.printl(24, ["Dynamic Access Control", request.params.accessCtrlAddr]);
    policyInfoCollector
        .findAccessControlMetadata(request.params.accessCtrlAddr)
        .then((accessControlInfo) => {
        response.status(200).send(JSON.stringify(accessControlInfo));
    })
        .catch((error) => {
        response
            .status(400)
            .send({ Error: "RoleTaskMap Metadata NOT Found", response: error });
    });
};
exports.findPolicyAddresses = (request, response) => {
    request_logs_1.printl(25, request.params.pCase);
    runtimeRegistryService
        .validateRegistry(request.get("registryAddress"), this.runtimeRegistry)
        .then((runtimeRegistry) => {
        this.runtimeRegistry = runtimeRegistry;
        return policyInfoCollector.findPolicyRelatedAddresses(this.runtimeRegistry, request.params.pCase);
    })
        .then((addressList) => {
        response.status(200).send({
            accessControl: addressList[0],
            bindingPolicy: addressList[1],
            roleTaskMap: addressList[2],
        });
    })
        .catch((error) => {
        response.status(400).send(error);
    });
};
//# sourceMappingURL=access-control-controler.js.map