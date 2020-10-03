"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompilationInfo = exports.CompilationResult = exports.CompilationError = exports.CompilationOutput = void 0;
class CompilationOutput {
    constructor(contractName, solidityCode) {
        this.contractName = contractName;
    }
}
exports.CompilationOutput = CompilationOutput;
class CompilationError extends CompilationOutput {
    constructor(contractName, errors) {
        super(contractName);
        this.errors = errors;
    }
}
exports.CompilationError = CompilationError;
class CompilationResult extends CompilationOutput {
    constructor(contractName, abi, bytecode) {
        super(contractName);
        this.abi = abi;
        this.bytecode = bytecode;
    }
}
exports.CompilationResult = CompilationResult;
class CompilationInfo extends CompilationOutput {
    constructor(rootProcessName, solidityCode) {
        super(rootProcessName);
        this.solidityCode = solidityCode;
    }
}
exports.CompilationInfo = CompilationInfo;
//# sourceMappingURL=compilation-output.js.map