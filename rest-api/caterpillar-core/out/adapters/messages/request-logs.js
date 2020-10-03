"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printl = void 0;
const console_log_1 = require("./console-log");
exports.printl = (logId, info) => {
    switch (logId) {
        case 1: {
            console_log_1.print(`REQUESTED: Create new instance of process ${info[0]} ${info[1]}`, console_log_1.TypeMessage.pending);
            break;
        }
        case 2: {
            console_log_1.print(`REQUESTED: Query instances (blockchain addresses) of process ${info[0]} ${info[1]}`, console_log_1.TypeMessage.pending);
            break;
        }
        case 3: {
            console_log_1.print(`REQUESTED: Query state of process instance running at ${info}`, console_log_1.TypeMessage.pending);
            break;
        }
        case 4: {
            console_log_1.print(`REQUESTED: Execute workitem with ID ${info[0]} on worklist ${info[1]}`, console_log_1.TypeMessage.pending);
            break;
        }
        case 5: {
            console_log_1.print(`REQUESTED: Compile and deploy process model named ${info}`, console_log_1.TypeMessage.pending);
            break;
        }
        case 6: {
            console_log_1.print(`REQUESTED: Query IDs of process models from runtime registry at ${info}`, console_log_1.TypeMessage.pending);
            break;
        }
        case 7: {
            console_log_1.print(`REQUESTED: Query compilation metadata of process ID ${info}`, console_log_1.TypeMessage.pending);
            break;
        }
        case 8: {
            console_log_1.print(`STARTED: Generating and compiling smart contracts from process model named ${info}`, console_log_1.TypeMessage.pending);
            break;
        }
        case 9: {
            console_log_1.print(`REQUESTED: Compile and Deploy smart contract for ${info}`, console_log_1.TypeMessage.pending);
            break;
        }
        case 10: {
            console_log_1.print(`REQUESTED: Query Runtime Registry metadata from ${info[0] ? "ID " + info[0] : "address " + info[1]}`, console_log_1.TypeMessage.pending);
            break;
        }
        case 11: {
            console_log_1.print(`REQUESTED: CheckIn (execute) task ID ${info[0]} on IData at ${info[1]}`, console_log_1.TypeMessage.pending);
            break;
        }
        case 12: {
            console_log_1.print(`REQUESTED: CheckOut task ID ${info[0]} on IData at ${info[1]}`, console_log_1.TypeMessage.pending);
            break;
        }
        case 13: {
            console_log_1.print(`REQUESTED: Create new instance of ${info}`, console_log_1.TypeMessage.pending);
            break;
        }
        case 14: {
            console_log_1.print(`REQUESTED: Update IFlow node at ${info[0]} with BPMN element ${info[1]}`, console_log_1.TypeMessage.pending);
            break;
        }
        case 15: {
            console_log_1.print(`REQUESTED: Update IFlow node at ${info[0]} to link subprocess as ${info[1]}`, console_log_1.TypeMessage.pending);
            break;
        }
        case 16: {
            console_log_1.print(`REQUESTED: Update IFlow node at ${info[0]} with IFactory at ${info[1]}`, console_log_1.TypeMessage.pending);
            break;
        }
        case 17: {
            console_log_1.print(`REQUESTED: Query Process Information from IFlow node at ${info[0]}`, console_log_1.TypeMessage.pending);
            break;
        }
        case 18: {
            console_log_1.print(`REQUESTED: Query registered ${info[0]} from Runtime Registry at ${info[1]}`, console_log_1.TypeMessage.pending);
            break;
        }
        case 19: {
            console_log_1.print(`REQUESTED: Query parsed metadata from process with ID ${info}`, console_log_1.TypeMessage.pending);
            break;
        }
        case 20: {
            console_log_1.print(`REQUESTED: Compile and deploy role binding policy`, console_log_1.TypeMessage.pending);
            console_log_1.print(`${info}`, console_log_1.TypeMessage.data);
            break;
        }
        case 21: {
            console_log_1.print(`REQUESTED: Compile and deploy role-task map`, console_log_1.TypeMessage.pending);
            console_log_1.print(`   Map: ${info}`, console_log_1.TypeMessage.data);
            break;
        }
        case 22: {
            console_log_1.print(`REQUESTED: Query state of role ${info[0]} for process instance at ${info[1]}`, console_log_1.TypeMessage.pending);
            break;
        }
        case 23: {
            console_log_1.print(`REQUESTED: Perform role-binding operation ${info[0]} for process instance at ${info[1]}`, console_log_1.TypeMessage.pending);
            break;
        }
        case 24: {
            console_log_1.print(`REQUESTED: Query Metadata of ${info[0]} runing at ${info[1]}`, console_log_1.TypeMessage.pending);
            break;
        }
        case 25: {
            console_log_1.print(`REQUESTED: Query Addresses of policy-related contracts for process instance runing at ${info}`, console_log_1.TypeMessage.pending);
            break;
        }
    }
};
//# sourceMappingURL=request-logs.js.map