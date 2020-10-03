"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printp = void 0;
const console_log_1 = require("./console-log");
exports.printp = (logId, info) => {
    switch (logId) {
        case 1: {
            console_log_1.print(`Parsing process model ...`, console_log_1.TypeMessage.pending);
            break;
        }
        case 2: {
            console_log_1.print("SUBMITED: Update compilation metadata in process repository ...", console_log_1.TypeMessage.pending);
            break;
        }
        case 3: {
            console_log_1.print("SUBMITED: Update process hierarchical relationships in runtime registry ...", console_log_1.TypeMessage.pending);
            break;
        }
        case 4: {
            console_log_1.print(`SUBMITED: Deploy and register factory contracts ...`, console_log_1.TypeMessage.pending);
            break;
        }
        case 5: {
            console_log_1.print("SUBMITED: Deploy and register worklist contracts ...", console_log_1.TypeMessage.pending);
            break;
        }
        case 6: {
            console_log_1.print(``, console_log_1.TypeMessage.pending);
            break;
        }
        case 7: {
            console_log_1.print(``, console_log_1.TypeMessage.pending);
            break;
        }
        case 8: {
            console_log_1.print(``, console_log_1.TypeMessage.pending);
            break;
        }
        case 9: {
            console_log_1.print(``, console_log_1.TypeMessage.pending);
            break;
        }
        case 10: {
            console_log_1.print(``, console_log_1.TypeMessage.pending);
            break;
        }
        case 11: {
            console_log_1.print(``, console_log_1.TypeMessage.pending);
            break;
        }
        case 12: {
            console_log_1.print(``, console_log_1.TypeMessage.pending);
            break;
        }
    }
};
//# sourceMappingURL=pending-logs.js.map