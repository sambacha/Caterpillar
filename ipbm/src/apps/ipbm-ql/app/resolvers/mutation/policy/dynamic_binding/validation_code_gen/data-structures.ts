import _debug from 'debug'
const debug = _debug('caterpillarql:policy:data-structures')

export class Policy {
    caseCreator: string = undefined;
    roleIndexMap: Map<string, number> = new Map();
    roleCount: number = 0;
    nominationStatements: Array<Statement> = new Array();
    releaseStatements: Array<Statement> = new Array();
    solidity: string = undefined;

    setCreator(caseCreator: string) {
      this.caseCreator = caseCreator;
      this.addRole(caseCreator);
    }
    addRole(roleId: string) : void {
      if(!this.roleIndexMap.has(roleId))
        this.roleIndexMap.set(roleId, ++this.roleCount);
    }
    addNominationStatement(statement: Statement) : void {
       this.nominationStatements.push(statement);
    }

    addReleaseStatement(statement: Statement) : void {
      this.releaseStatements.push(statement);
   }

    print() {
      debug('Roles: ')
      for (var [key, value] of this.roleIndexMap) {
        debug(key + ': ' + value);
      }
      debug('---------------------------')
      this.nominationStatements.forEach(value => {
        value.print();
        debug('---------------------------')
      })
    }

}
export class Statement {
    nominator: string;
    nominee: string;
    bindingConstraint: DisjunctionSet = undefined;
    endorsementConstraint: DisjunctionSet = undefined;
    print() {
      debug('Nominator: ', this.nominator);
      debug('Nominee: ', this.nominee);
      if(this.bindingConstraint !== undefined){
         debug('Binding Constraints ');
         this.bindingConstraint.print();
      }
      if(this.endorsementConstraint !== undefined){
        debug('Endorsement Constraints ');
        this.endorsementConstraint.print();
     }
    }

  }
  export class DisjunctionSet {
    isNegative: boolean;
    conjunctionSets: Array<ConjunctionSet> = new Array();




    print() {
      debug('  Disjunction Set: ', this.isNegative ? 'NOT IN' : 'IN');
      this.conjunctionSets.forEach(value => {
        value.print();

      })
    }
  }
  export class ConjunctionSet {
    roles: Array<string> = new Array();

    print() {
       debug('    [' + this.roles.toString() + ']')
    }
  }


