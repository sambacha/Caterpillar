"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeploymentResult = exports.DeploymentError = exports.DeploymentOutput = void 0;
class DeploymentOutput {
    constructor(smartContractName) {
        this.smartContractName = smartContractName;
    }
}
exports.DeploymentOutput = DeploymentOutput;
class DeploymentError extends DeploymentOutput {
    constructor(smartContractName, error) {
        super(smartContractName);
        this.error = error;
    }
}
exports.DeploymentError = DeploymentError;
class DeploymentResult extends DeploymentOutput {
    constructor(smartContractName, transactionHash, contractAddress, gasCost) {
        super(smartContractName);
        if (transactionHash)
            this.transactionHash = transactionHash;
        if (contractAddress)
            this.contractAddress = contractAddress;
        if (gasCost)
            this.gasCost = gasCost;
    }
}
exports.DeploymentResult = DeploymentResult;
//# sourceMappingURL=deployment-output.js.map