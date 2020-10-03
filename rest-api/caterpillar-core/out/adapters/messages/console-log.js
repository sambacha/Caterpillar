"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printSeparator = exports.print = exports.TypeMessage = exports.printActive = void 0;
let colors = require("colors/safe");
const util = require("util");
exports.printActive = true;
var TypeMessage;
(function (TypeMessage) {
    TypeMessage[TypeMessage["info"] = 0] = "info";
    TypeMessage[TypeMessage["data"] = 1] = "data";
    TypeMessage[TypeMessage["success"] = 2] = "success";
    TypeMessage[TypeMessage["error"] = 3] = "error";
    TypeMessage[TypeMessage["pending"] = 4] = "pending";
    TypeMessage[TypeMessage["separator"] = 5] = "separator";
})(TypeMessage = exports.TypeMessage || (exports.TypeMessage = {}));
exports.print = (message, customMessage) => {
    if (exports.printActive) {
        try {
            let toPrint = JSON.parse(message);
            console.log(util.inspect(toPrint, false, null, true /* enable colors */));
        }
        catch (e) {
            switch (customMessage) {
                case TypeMessage.error: {
                    console.log(colors.bgRed(message));
                    break;
                }
                case TypeMessage.success: {
                    console.log(colors.green(message));
                    break;
                }
                case TypeMessage.pending: {
                    console.log(colors.cyan(message));
                    break;
                }
                case TypeMessage.data: {
                    console.log(colors.gray(message));
                    break;
                }
                case TypeMessage.info: {
                    console.log(colors.gray(message));
                    break;
                }
                default: {
                    console.log(message);
                }
            }
        }
    }
};
exports.printSeparator = () => {
    if (exports.printActive) {
        console.log(colors.black("----------------------------------------------------------------"));
    }
};
//# sourceMappingURL=console-log.js.map