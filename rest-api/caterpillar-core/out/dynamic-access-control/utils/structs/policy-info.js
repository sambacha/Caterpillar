"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConjunctionSet = exports.DisjunctionSet = exports.Statement = exports.Policy = void 0;
class Policy {
    constructor() {
        this.model = undefined;
        this.caseCreator = undefined;
        this.roleIndexMap = new Map();
        this.roleCount = 0;
        this.nominationStatements = new Array();
        this.releaseStatements = new Array();
        this.solidity = undefined;
    }
    setCreator(caseCreator) {
        this.caseCreator = caseCreator;
        this.addRole(caseCreator);
    }
    addRole(roleId) {
        if (!this.roleIndexMap.has(roleId))
            this.roleIndexMap.set(roleId, ++this.roleCount);
    }
    addNominationStatement(statement) {
        this.nominationStatements.push(statement);
    }
    addReleaseStatement(statement) {
        this.releaseStatements.push(statement);
    }
}
exports.Policy = Policy;
class Statement {
    constructor() {
        this.bindingConstraint = undefined;
        this.endorsementConstraint = undefined;
    }
}
exports.Statement = Statement;
class DisjunctionSet {
    constructor() {
        this.conjunctionSets = new Array();
    }
}
exports.DisjunctionSet = DisjunctionSet;
class ConjunctionSet {
    constructor() {
        this.roles = new Array();
    }
}
exports.ConjunctionSet = ConjunctionSet;
//# sourceMappingURL=policy-info.js.map