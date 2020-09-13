"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AgreementPolicy {
    constructor() {
        this.roleIndexMap = new Map();
        this.roleCount = 0;
        this.requestStatements = new Array();
        this.solidity = undefined;
    }
    addRole(roleId) {
        if (!this.roleIndexMap.has(roleId))
            this.roleIndexMap.set(roleId, ++this.roleCount);
    }
    addRequestStatement(statement) {
        this.requestStatements.push(statement);
    }
    print() {
        console.log('Roles: ');
        for (var [key, value] of this.roleIndexMap) {
            console.log(key + ': ' + value);
        }
        console.log('---------------------------');
        this.requestStatements.forEach(value => {
            value.print();
            console.log('---------------------------');
        });
    }
}
exports.AgreementPolicy = AgreementPolicy;
class AStatement {
    constructor() {
        this.endorsementConstraint = undefined;
    }
    print() {
        console.log('Proposer: ', this.proposer);
        console.log('Action: ', this.action);
        console.log('Element', this.element);
        if (this.endorsementConstraint !== undefined) {
            console.log('Endorsement Constraints ');
            this.endorsementConstraint.print();
        }
    }
}
exports.AStatement = AStatement;
class DisjunctionSet {
    constructor() {
        this.conjunctionSets = new Array();
    }
    print() {
        console.log('  Disjunction Set: ', this.isNegative ? 'NOT IN' : 'IN');
        this.conjunctionSets.forEach(value => {
            value.print();
        });
    }
}
exports.DisjunctionSet = DisjunctionSet;
class ConjunctionSet {
    constructor() {
        this.roles = new Array();
    }
    print() {
        console.log('    [' + this.roles.toString() + ']');
    }
}
exports.ConjunctionSet = ConjunctionSet;
//# sourceMappingURL=DataStructures.js.map