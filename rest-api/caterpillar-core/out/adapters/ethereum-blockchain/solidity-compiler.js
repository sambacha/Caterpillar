"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileSmartContracts = void 0;
const compilation_output_1 = require("./structs/compilation-output");
const solc = require("solc");
let contractDependencies;
exports.compileSmartContracts = (contractInfo) => {
    contractDependencies = contractInfo.dependencies;
    let config = createConfiguration(contractInfo.smartContractName, contractInfo.solidityCode);
    try {
        let output = JSON.parse(solc.compile(JSON.stringify(config), { import: configureDependencies }));
        let errors = filterErrors(output.errors);
        if (errors.length > 0) {
            return [
                new compilation_output_1.CompilationError(contractInfo.smartContractName, errors),
            ];
        }
        else {
            let contracts = new Array();
            for (let name in output.contracts["contractContent"]) {
                contracts.push(new compilation_output_1.CompilationResult(name, JSON.stringify(output.contracts["contractContent"][name].abi), output.contracts["contractContent"][name].evm.bytecode.object));
            }
            return contracts;
        }
    }
    catch (error) {
        return [new compilation_output_1.CompilationError(contractInfo.smartContractName, error)];
    }
};
let createConfiguration = (contractName, smartContract) => {
    return {
        language: "Solidity",
        sources: {
            contractContent: {
                content: smartContract,
            },
        },
        settings: {
            optimizer: {
                enabled: true,
            },
            outputSelection: {
                "*": {
                    "*": ["*"],
                },
            },
        },
    };
};
let configureDependencies = (dependency) => {
    let contract = contractDependencies.find((c) => {
        return c.smartContractName === dependency;
    });
    return contract
        ? { contents: contract.solidityCode }
        : { error: `${dependency} -- Dependency NOT Found` };
};
let filterErrors = (outputErrors) => {
    return outputErrors ?
        outputErrors.filter(error => {
            return error.type !== "Warning";
        }) : [];
};
//# sourceMappingURL=solidity-compiler.js.map