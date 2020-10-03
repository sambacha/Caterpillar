"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileIFactory = exports.compileIData = exports.compileBPMNINterpreter = exports.compileIFlow = void 0;
const fs = require("fs");
const compilation_output_1 = require("../../../adapters/ethereum-blockchain/structs/compilation-output");
const solidityCompiler = require("../../../adapters/ethereum-blockchain/solidity-compiler");
const compilation_input_1 = require("../../../adapters/ethereum-blockchain/structs/compilation-input");
exports.compileIFlow = async () => {
    try {
        let cInput = newFileInput("IFlow", "./src/interpretation-engine/utils/solidity-interfaces/i-flow.sol");
        return withSolidityCode(cInput, await compileSmartContract(cInput, "IFlowImpl"));
    }
    catch (error) {
        return Promise.reject(error);
    }
};
exports.compileBPMNINterpreter = async () => {
    try {
        let cInput = newFileInput("BPMNInterpreter", "./src/interpretation-engine/utils/solidity-interfaces/bpmn-interpreter.sol", [
            newFileInput("IFactory", "./src/interpretation-engine/utils/solidity-interfaces/i-factory.sol"),
            newFileInput("IData", "./src/interpretation-engine/utils/solidity-interfaces/i-data.sol"),
            newFileInput("IFlow", "./src/interpretation-engine/utils/solidity-interfaces/i-flow.sol"),
        ]);
        return withSolidityCode(cInput, await compileSmartContract(cInput, "BPMNInterpreter"));
    }
    catch (error) {
        return Promise.reject(error);
    }
};
exports.compileIData = async (procInfo) => {
    return await compileContractList(procInfo, "Data");
};
exports.compileIFactory = async (procInfo) => {
    return await compileContractList(procInfo, "Factory");
};
////////////////////////////////////////////////
/////////////// PRIVATE FUNCTIONS   ////////////
////////////////////////////////////////////////
let compileContractList = async (procInfo, suffix) => {
    try {
        let processes = new Array();
        processes.push(procInfo);
        let compiledContracts = new Array();
        while (processes.length > 0) {
            let topProc = processes.pop();
            let cInput = suffix === "Data"
                ? extractIDataInfo(topProc)
                : extractFactoryInfo(topProc);
            let compilationInfo = await compileSmartContract(cInput, topProc.procName + suffix);
            if (compilationInfo instanceof compilation_output_1.CompilationError)
                return Promise.reject(compilationInfo);
            compiledContracts.push(withSolidityCode(cInput, compilationInfo));
            for (let i = 0; i < topProc.children.length; i++)
                processes.push(topProc.children[i]);
        }
        return compiledContracts;
    }
    catch (error) {
        return Promise.reject(error);
    }
};
let compileSmartContract = (inputContract, targetContract) => {
    return new Promise((resolve, reject) => {
        let compiledContracts = solidityCompiler.compileSmartContracts(inputContract);
        if (compiledContracts[0] instanceof compilation_output_1.CompilationError)
            reject(compiledContracts[0]);
        let res = compiledContracts.find((elem) => {
            return elem.contractName === targetContract;
        });
        resolve(res);
    });
};
let extractFactoryInfo = (element) => {
    return new compilation_input_1.CompilationInput(element.procName + "Factory", element.iData.factorySolidity, [
        newFileInput("IDataImp", "./src/interpretation-engine/utils/solidity-interfaces/i-data.sol"),
        new compilation_input_1.CompilationInput(element.procName + "Data", element.iData.iDataSolidity, []),
    ]);
};
let extractIDataInfo = (element) => {
    return new compilation_input_1.CompilationInput(element.procName + "Data", element.iData.iDataSolidity, [
        newFileInput("IDataImp", "./src/interpretation-engine/utils/solidity-interfaces/i-data.sol"),
    ]);
};
let newFileInput = (outName, filePath, dependencies) => {
    return new compilation_input_1.CompilationInput(outName, fs.readFileSync(filePath, "utf8"), dependencies ? dependencies : []);
};
let withSolidityCode = (cInput, cOutput) => {
    cOutput.solidity = cInput.solidityCode;
    return cOutput;
};
//# sourceMappingURL=bpmn-compiler.js.map