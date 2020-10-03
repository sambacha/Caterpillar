"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printError = void 0;
const console_log_1 = require("./console-log");
exports.printError = (componentName, functionName, error) => {
    console_log_1.print(`Error at Interpretation engine -- deploymentDediator.${functionName}`, console_log_1.TypeMessage.error);
    console_log_1.print(error, console_log_1.TypeMessage.error);
    console_log_1.printSeparator();
};
//# sourceMappingURL=error-logs.js.map