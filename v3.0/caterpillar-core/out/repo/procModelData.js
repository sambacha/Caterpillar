"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.repoSchema = mongoose.model('ProcessRepo', {
    rootProcessID: String,
    rootProcessName: String,
    bpmnModel: String,
    solidityCode: String,
    abi: String,
    bytecode: String,
    indexToElement: [mongoose.Schema.Types.Mixed],
    worklistAbi: String,
});
exports.registrySchema = mongoose.model('RegistryRepo', {
    address: String,
    solidityCode: String,
    abi: String,
    bytecode: String,
});
exports.policySchema = mongoose.model('PolicyRepo', {
    address: String,
    model: String,
    solidityCode: String,
    abi: String,
    bytecode: String,
    indexToRole: [String],
    accessControlAbi: String,
    accessControlBytecode: String,
});
exports.roleTaskSchema = mongoose.model('RoleTaskRepo', {
    address: String,
    solidityCode: String,
    abi: String,
    bytecode: String,
});
exports.interpreterSchema = mongoose.model('InterpreterRepo', {
    procID: String,
    procName: String,
    bpmnModel: String,
    indexToElement: [mongoose.Schema.Types.Mixed],
});
//# sourceMappingURL=procModelData.js.map