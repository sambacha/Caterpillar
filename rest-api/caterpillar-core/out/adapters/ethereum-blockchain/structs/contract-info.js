"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidContractInfo = exports.ContractInfo = void 0;
class ContractInfo {
    constructor(contractName, abi, bytecode, solidityCode, address) {
        this.contractName = contractName;
        this.abi = abi;
        this.bytecode = bytecode;
        this.solidityCode = solidityCode;
        this.address = address;
        this._id = undefined;
        this._relId = undefined;
    }
}
exports.ContractInfo = ContractInfo;
class InvalidContractInfo {
    constructor(idContract, error) {
        this.idContract = idContract;
        this.error = error;
    }
}
exports.InvalidContractInfo = InvalidContractInfo;
//# sourceMappingURL=contract-info.js.map