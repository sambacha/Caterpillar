"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBinaryArray = exports.listenForTransactionMined = exports.subscribeToLog = exports.defaultDeployment = exports.isValidBlockchainAddressList = exports.isValidBlockchainAddress = exports.callContractFunction = exports.execContractFunctionAsync = exports.execContractFunctionSync = exports.deploySmartContractAsync = exports.deploySmartContractSync = exports.getProvider = exports.setProvider = void 0;
const promise_error_1 = require("./../errors/promise-error");
const console_log_1 = require("../messages/console-log");
const account_info_1 = require("./structs/account-info");
const deployment_output_1 = require("./structs/deployment-output");
const Web3 = require("web3");
// HttpProvider does not support subscriptions for ganache-cli
// let web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
let web3 = new Web3(new Web3.providers.WebsocketProvider("ws://localhost:8545"));
exports.setProvider = (newProvider) => {
    web3.setProvider(newProvider);
};
exports.getProvider = () => {
    return web3.currentProvider;
};
exports.deploySmartContractSync = (contractInfo, accountInfo, args) => {
    return new Promise((resolve, reject) => {
        try {
            let contractEncoding = encodeSmartContract(contractInfo.abi, contractInfo.bytecode, args);
            let deploymentResult = new deployment_output_1.DeploymentResult(contractInfo.contractName);
            contractEncoding[0]
                .deploy(contractEncoding[1])
                .send(formatJsonInput(accountInfo))
                .on("error", (error) => {
                reject(new deployment_output_1.DeploymentError(contractInfo.contractName, error.toString()));
            })
                .on("receipt", (receipt) => {
                deploymentResult.gasCost = receipt.gasUsed;
                deploymentResult.transactionHash = receipt.transactionHash;
            })
                .then((contractInstance) => {
                deploymentResult.contractAddress = contractInstance.options.address;
                resolve(deploymentResult);
            })
                .catch((error) => {
                console.log(error);
                reject(new deployment_output_1.DeploymentError(contractInfo.contractName, error.toString()));
            });
        }
        catch (error) {
            reject(new deployment_output_1.DeploymentError(contractInfo.contractName, error.toString()));
        }
    });
};
exports.deploySmartContractAsync = (contractInfo, accountInfo, args) => {
    return new Promise((resolve, reject) => {
        try {
            let contractEncoding = encodeSmartContract(contractInfo.abi, contractInfo.bytecode, args);
            contractEncoding[0]
                .deploy(contractEncoding[1])
                .send(formatJsonInput(accountInfo))
                .on("error", (error) => {
                reject(new deployment_output_1.DeploymentError(contractInfo.contractName, error.toString()));
            })
                .on("transactionHash", (transactionHash) => {
                resolve(transactionHash);
            })
                .catch((error) => {
                reject(new deployment_output_1.DeploymentError(contractInfo.contractName, error.toString()));
            });
        }
        catch (error) {
            reject(new deployment_output_1.DeploymentError(contractInfo.contractName, error.toString()));
        }
    });
};
let encodeSmartContract = (contractAbi, contractBytecode, args) => {
    let deploy_contract = new web3.eth.Contract(JSON.parse(contractAbi));
    let payload = args
        ? {
            data: contractBytecode,
            arguments: args,
        }
        : {
            data: contractBytecode,
        };
    return [deploy_contract, payload];
};
exports.execContractFunctionSync = (contractAddress, contractAbi, functionInfo, accountInfo, args) => {
    return new Promise((resolve, reject) => {
        let encodedFunction = encodeFunctionCall(functionInfo, contractAbi, args);
        web3.eth
            .sendTransaction({
            from: accountInfo.from,
            to: contractAddress,
            data: encodedFunction,
            gas: accountInfo.gas,
        })
            .then((receipt) => {
            resolve(new deployment_output_1.DeploymentResult(functionInfo.functionName, receipt.transactionHash, contractAddress, receipt.gasUsed));
        })
            .catch((error) => {
            reject(new deployment_output_1.DeploymentError(functionInfo.functionName, error.toString()));
        });
    });
};
exports.execContractFunctionAsync = (contractAddress, contractAbi, functionInfo, accountInfo, args) => {
    return new Promise((resolve, reject) => {
        try {
            let encodedFunction = encodeFunctionCall(functionInfo, contractAbi, args);
            web3.eth
                .sendTransaction({
                from: accountInfo.from,
                to: contractAddress,
                data: encodedFunction,
                gas: accountInfo.gas,
            })
                .once("transactionHash", (transactionHash) => {
                resolve(transactionHash);
            })
                .on("error", (error) => {
                console_log_1.print(error, console_log_1.TypeMessage.error);
                reject(new promise_error_1.PromiseError(`Invalid execution of function ${functionInfo.functionName}`, error, [new promise_error_1.Component("ethereum-adapter", "executeContractFunctionSync")]));
            });
        }
        catch (error) {
            console_log_1.print(error, console_log_1.TypeMessage.error);
            reject(new promise_error_1.PromiseError(`Invalid execution of function ${functionInfo.functionName}`, error, [new promise_error_1.Component("ethereum-adapter", "executeContractFunctionSync")]));
        }
    });
};
exports.callContractFunction = (contractAddress, contractAbi, functionInfo, accountInfo, args) => {
    return new Promise((resolve, reject) => {
        try {
            let encodedFunction = encodeFunctionCall(functionInfo, contractAbi, args);
            web3.eth
                .call({
                to: contractAddress,
                data: encodedFunction,
                gas: accountInfo.gas,
            })
                .then((callResult) => {
                resolve(functionInfo.fullInfo
                    ? decodeParametersFull(functionInfo.returnType, callResult)
                    : decodeParameter(functionInfo.returnType, callResult));
            })
                .catch((error) => {
                reject(new promise_error_1.PromiseError(`Error calling function ${functionInfo.functionName}`, error, [new promise_error_1.Component("ethereum-adapter", "callContractFunction")]));
            });
        }
        catch (error) {
            reject(new promise_error_1.PromiseError(`Error Encoding function ${functionInfo.functionName}`, error, [new promise_error_1.Component("ethereum-adapter", "callContractFunction")]));
        }
    });
};
exports.isValidBlockchainAddress = (address) => {
    if (address === "0x0000000000000000000000000000000000000000")
        return false;
    return web3.utils.isAddress(address);
};
exports.isValidBlockchainAddressList = (addresses) => {
    for (let i = 0; i < addresses.length; i++)
        if (!exports.isValidBlockchainAddress(addresses[i]))
            return false;
    return true;
};
exports.defaultDeployment = () => {
    return new Promise((resolve, reject) => {
        Promise.all([web3.eth.getAccounts(), web3.eth.getGasPrice()]).then((res) => {
            resolve(new account_info_1.AccountInfo(res[0][0], web3.utils.toHex(4700000), res[1]));
        });
    });
};
exports.subscribeToLog = async (contractAddress, contractAbi, eventInfo, functionCallback) => {
    try {
        let subscription = web3.eth.subscribe("logs", {
            fromBlock: await web3.eth.getBlockNumber(),
            address: contractAddress,
            topics: [encodeEventFromAbi(eventInfo, contractAbi)],
        }, (error, result) => {
            if (result) {
                {
                    web3.eth
                        .getTransactionReceipt(result.transactionHash)
                        .then((transactionInfo) => {
                        functionCallback(result.transactionHash, transactionInfo.gasUsed, decodeEventLogFromAbi(eventInfo, contractAbi, result.data));
                        subscription.unsubscribe();
                    });
                }
            }
            else {
                functionCallback("", error);
                subscription.unsubscribe();
            }
        });
    }
    catch (error) {
        console_log_1.print("ERROR IN ETHEREUM ADAPTER", console_log_1.TypeMessage.error);
        console_log_1.print(error, console_log_1.TypeMessage.error);
        console_log_1.printSeparator();
    }
};
exports.listenForTransactionMined = async (transactionHash, functionCallback) => {
    web3.eth
        .getTransactionReceipt(transactionHash)
        .then((transactionInfo) => {
        if (transactionInfo) {
            functionCallback(transactionHash, transactionInfo);
        }
        else {
            subscribeToNewBlock(transactionHash, functionCallback);
        }
    });
};
let subscribeToNewBlock = (transactionHash, functionCallback) => {
    let subscription = web3.eth
        .subscribe("newBlockHeaders")
        .on("data", (blockHeader) => {
        web3.eth
            .getTransactionReceipt(transactionHash)
            .then((transactionInfo) => {
            if (transactionInfo) {
                functionCallback(transactionHash, transactionInfo);
                subscription.unsubscribe();
            }
        });
    })
        .on("error", (error) => {
        console.log(error);
    });
};
exports.toBinaryArray = (inputNumber) => {
    return parseInt(inputNumber).toString(2).split("").reverse();
};
//////////////////////////////////////////////
////////////// PRIVATE FUNCTIONS /////////////
//////////////////////////////////////////////
let encodeEventFromAbi = (eventInfo, contractAbi) => {
    let eventAbi = extractEventFromAbi(eventInfo, contractAbi);
    return eventAbi ? web3.eth.abi.encodeEventSignature(eventAbi) : undefined;
};
let decodeEventLogFromAbi = (eventInfo, contractAbi, encodedData) => {
    let eventAbi = extractEventFromAbi(eventInfo, contractAbi);
    return eventAbi
        ? web3.eth.abi.decodeLog(eventAbi.inputs, encodedData)
        : undefined;
};
let decodeParametersFull = (paramTypes, data) => {
    let paramList = paramTypes.split(",");
    let decoded = web3.eth.abi.decodeParameters(paramList, data);
    return decoded;
};
let decodeParameter = (paramType, data) => {
    let decoded = web3.eth.abi.decodeParameter(paramType, data);
    if (paramType.includes("bytes32")) {
        if (decoded instanceof Array)
            return decoded.map((element) => {
                return web3.utils.hexToUtf8(element);
            });
        return web3.utils.hexToUtf8(decoded);
    }
    return decoded;
};
let extractEventFromAbi = (eventInfo, contractAbi) => {
    let jsonAbi = JSON.parse(contractAbi);
    return jsonAbi.find((element) => {
        if (element.name !== eventInfo.functionName ||
            eventInfo.paramTypes.length !== element.inputs.length) {
            return false;
        }
        let input = element.inputs;
        for (let i = 0; i < input.length; i++) {
            if (input[i].type !== eventInfo.paramTypes[i])
                return false;
        }
        return true;
    });
};
let encodeParameters = (types, values) => {
    return web3.eth.abi.encodeParameters(types, fixBytes32(types, valuesToString(values)));
};
let encodeFunctionCall = (functionInfo, contractAbi, parameters) => {
    let jsonAbi = JSON.parse(contractAbi);
    let functionAbi = jsonAbi.find((element) => {
        if (element.name !== functionInfo.functionName ||
            functionInfo.paramTypes.length !== element.inputs.length) {
            return false;
        }
        let input = element.inputs;
        for (let i = 0; i < input.length; i++) {
            if (input[i].type !== functionInfo.paramTypes[i])
                return false;
        }
        return true;
    });
    let fixedParams = parameters
        ? fixBytes32(functionInfo.paramTypes, valuesToString(parameters))
        : [];
    return functionAbi
        ? web3.eth.abi.encodeFunctionCall(functionAbi, fixedParams)
        : undefined;
};
let valuesToString = (values) => {
    let fixedValues = values.map((element) => {
        if (element instanceof Array) {
            let res = valuesToString(element);
            return res;
        }
        else {
            return element.toString();
        }
    });
    return fixedValues;
};
let fixBytes32 = (types, values) => {
    for (let i = 0; i < types.length; i++) {
        if (types[i] === "bytes32") {
            if (values[i].length > 32)
                values[i] = values[i].slice(0, 31);
            values[i] = web3.utils.fromAscii(values[i]);
        }
    }
    return values;
};
let formatJsonInput = (accountInfo) => {
    return {
        from: accountInfo.from,
        gas: accountInfo.gas,
        gasPrice: accountInfo.gasPrice,
    };
};
//# sourceMappingURL=ethereum-adapter.js.map