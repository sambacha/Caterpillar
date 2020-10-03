"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compiledProcessSchema = void 0;
const mongoose = require("mongoose");
exports.compiledProcessSchema = mongoose.model('ProcessRepo', {
    rootProcessID: String,
    rootProcessName: String,
    bpmnModel: String,
    solidityCode: String,
    abi: String,
    bytecode: String,
    indexToElement: [mongoose.Schema.Types.Mixed],
    worklistAbi: String,
});
//# sourceMappingURL=compiled-process-repo.js.map