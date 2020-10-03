"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileProcessModel = void 0;
const fs = require("fs");
const console_log_1 = require("../../adapters/messages/console-log");
const compilation_input_1 = require("../../adapters/ethereum-blockchain/structs/compilation-input");
const compilation_output_1 = require("../../adapters/ethereum-blockchain/structs/compilation-output");
const console_log_2 = require("../../adapters/messages/console-log");
const compilation_output_2 = require("./../../adapters/ethereum-blockchain/structs/compilation-output");
const solidityCompiler = require("../../adapters/ethereum-blockchain/solidity-compiler");
exports.compileProcessModel = (modelInfo) => {
    console_log_2.print("SUBMITED: Compile smart contracts ...", console_log_2.TypeMessage.pending);
    return new Promise((resolve, reject) => {
        let dependencies = [
            new compilation_input_1.CompilationInput("IFactory", fs.readFileSync("./src/compilation-engine/utils/solidity-interfaces/factory-interface.sol", "utf8"), []),
            new compilation_input_1.CompilationInput("IWorkflow", fs.readFileSync("./src/compilation-engine/utils/solidity-interfaces/workflow-interface.sol", "utf8"), []),
            new compilation_input_1.CompilationInput("IWorklist", fs.readFileSync("./src/compilation-engine/utils/solidity-interfaces/worklist-interface.sol", "utf8"), []),
            new compilation_input_1.CompilationInput("IRegistry", fs.readFileSync("./src/compilation-engine/utils/solidity-interfaces/registry-interface.sol", "utf8"), []),
        ];
        let contractsToCompile = new compilation_input_1.CompilationInput(modelInfo.name + "Workflow", modelInfo.solidity, dependencies);
        let compiledContracts = solidityCompiler.compileSmartContracts(contractsToCompile);
        if (compiledContracts[0] instanceof compilation_output_2.CompilationError) {
            printCompilationResult(compiledContracts[0], modelInfo.solidity);
            return compiledContracts[0].errors;
        }
        let response = new compilation_output_1.CompilationInfo(contractsToCompile.smartContractName, contractsToCompile.solidityCode);
        response.codeDependencies = dependencies.map((elem) => {
            return elem.solidityCode;
        });
        response.compilationMetadata = (compiledContracts).map((elem) => {
            return new compilation_output_2.CompilationResult(elem.contractName, elem.abi, elem.bytecode);
        });
        printCompilationResult(response);
        resolve(response);
    });
};
////////////////////////////////////////////
//////////// PRIVATE FUNCTIONS /////////////
////////////////////////////////////////////
let printCompilationResult = (compilationInfo, solidityCode) => {
    if (compilationInfo instanceof compilation_output_2.CompilationError) {
        console_log_2.print("Errors compiling smart contracts ...", console_log_2.TypeMessage.error);
        console_log_2.print(solidityCode, console_log_2.TypeMessage.data);
        console_log_2.print(compilationInfo.errors, console_log_2.TypeMessage.error);
    }
    else {
        console_log_2.print("SUCCESS: Smart contracts compiled", console_log_2.TypeMessage.success);
        console_log_2.print(`${JSON.stringify(compilationInfo)}`, console_log_2.TypeMessage.data);
    }
    console_log_1.printSeparator();
};
//# sourceMappingURL=bpmn-compiler.js.map