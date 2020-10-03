"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleTaskSchema = void 0;
const mongoose = require("mongoose");
exports.roleTaskSchema = mongoose.model('RoleTaskRepo', {
    address: String,
    solidityCode: String,
    abi: String,
    bytecode: String,
});
//# sourceMappingURL=role-task-map-repo.js.map