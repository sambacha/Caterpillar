"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");
const bignumber_js_1 = require("bignumber.js");
// import { ANTLRInputStream, CommonTokenStream, ANTLRErrorListener } from 'antlr4ts';
// import { binding_grammarLexer } from '../antlr/binding_grammarLexer';
// import { binding_grammarParser } from '../antlr/binding_grammarParser';
// import { BindingVisitor } from './BindingPolicyParser';
const DataStructures_1 = require("./DataStructures");
const policy2solEJS = fs.readFileSync(path.join(__dirname, "../../../../templates") + "/agreement2Sol.ejs", "utf-8");
let policy2solTemplate = ejs.compile(policy2solEJS);
exports.generateAgreementPolicy = (policyStr, policyName) => {
    return new Promise((resolve, reject) => {
        try {
            /////////////////////////////////////////////
            ///      LEXER AND PAXER (ANTLR)         ///
            ////////////////////////////////////////////       
            // let policy = visitor.policy;
            let requestMap = new Map();
            let endorsementType = new Map();
            let endorsementBitSet = [];
            let endorsementRatio = new Map();
            let endorsementSet = new Map();
            let requireEndorsement = false;
            let hasDisjunctionSets = false;
            let count = 1;
            let policy = JSON.parse(policyStr);
            policy.statements.forEach(statement => {
                let rProposer = statement.requester;
                let opInd = statement.action;
                let eInd = statement.element;
                if (!requestMap.has(opInd))
                    requestMap.set(opInd, new Map());
                if (!requestMap.get(opInd).has(rProposer))
                    requestMap.get(opInd).set(rProposer, new Array());
                requestMap.get(opInd).get(rProposer).push([eInd, count]);
                if (statement.endorsers !== 0) {
                    requireEndorsement = true;
                    endorsementBitSet[count] = 1;
                    if (statement.endorsers == 2)
                        endorsementRatio.set(count, statement.ratio);
                    let dSet = new Array();
                    statement.sets.forEach(set => {
                        let cSet = new Array();
                        set.forEach(elem => {
                            cSet.push(elem);
                        });
                        dSet.push(cSet);
                    });
                    endorsementSet.set(count, dSet);
                }
                endorsementType.set(count, statement.endorsers);
                if (statement.endorsers === 1)
                    hasDisjunctionSets = true;
                count++;
            });
            /////////////////////////////////////////////
            ///  CONSISTENCY AND SEMANTIC ANALYSIS   ///
            ////////////////////////////////////////////
            /////////////////////////////////////////////
            ///     SMART CONTRACT GENERATION        ///
            ////////////////////////////////////////////
            // (1) BitSet Operations
            let bitArrayToInteger = (bitarray) => {
                if (bitarray.length > 0) {
                    let result = '0b';
                    for (let i = bitarray.length - 1; i >= 0; i--)
                        result += bitarray[i] ? '1' : '0';
                    return new bignumber_js_1.BigNumber(result).toFixed();
                }
                else {
                    return '0';
                }
            };
            let disjunctionSetMask = (reqId) => {
                let maskArray = [];
                endorsementSet.get(reqId).forEach(andSet => {
                    let bitarray = [];
                    andSet.forEach(role => {
                        bitarray[role] = 1;
                    });
                    maskArray.push(bitArrayToInteger(bitarray));
                });
                return maskArray;
            };
            let disjunctionSetJoinMask = (reqId) => {
                let bitarray = [];
                endorsementSet.get(reqId).forEach(andSet => {
                    andSet.forEach(role => {
                        bitarray[role] = 1;
                    });
                });
                return bitArrayToInteger(bitarray);
            };
            let totalVoters = (reqId) => {
                let bitarray = [];
                let count = 0;
                endorsementSet.get(reqId).forEach(andSet => {
                    andSet.forEach(role => {
                        if (bitarray[role] !== 1)
                            count++;
                        bitarray[role] = 1;
                    });
                });
                return count;
            };
            let codeGenerationInfo = {
                policyName: policyName,
                requestMap: requestMap,
                endorsementBitSet: bitArrayToInteger(endorsementBitSet),
                endorsementType: endorsementType,
                totalVoters: (reqId) => totalVoters(reqId),
                endorsementRatio: (reqId) => endorsementRatio.get(reqId),
                disjunctionSetJoinMask: (reqId) => disjunctionSetJoinMask(reqId),
                disjunctionSetMask: (reqId) => disjunctionSetMask(reqId),
                requireEndorsement: requireEndorsement,
                hasDisjunctionSets: hasDisjunctionSets
            };
            policy.solidity = policy2solTemplate(codeGenerationInfo);
            resolve(policy);
        }
        catch (ex) {
            console.log('Error: ', ex);
            reject(new DataStructures_1.AgreementPolicy());
        }
    });
};
//# sourceMappingURL=AgreementPolicyGenerator.js.map