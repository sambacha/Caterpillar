"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrySchema = void 0;
const mongoose = require("mongoose");
exports.registrySchema = mongoose.model("RegistryRepo", {
    contractName: String,
    address: String,
    solidityCode: String,
    abi: String,
    bytecode: String,
});
//# sourceMappingURL=registry-schema.js.map