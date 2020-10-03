"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interpreterSchema = void 0;
const mongoose = require("mongoose");
exports.interpreterSchema = mongoose.model('InterpreterRepo', {
    procID: String,
    procName: String,
    bpmnModel: String,
    indexToElement: [mongoose.Schema.Types.Mixed],
});
//# sourceMappingURL=interpreted-process-repo.js.map