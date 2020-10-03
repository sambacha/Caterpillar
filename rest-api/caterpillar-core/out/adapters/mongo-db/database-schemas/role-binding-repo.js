"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.policySchema = void 0;
const mongoose = require("mongoose");
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
//# sourceMappingURL=role-binding-repo.js.map