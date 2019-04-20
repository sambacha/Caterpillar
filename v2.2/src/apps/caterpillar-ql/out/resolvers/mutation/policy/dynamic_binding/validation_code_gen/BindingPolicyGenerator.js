"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generatePolicy = void 0;

var ejs = _interopRequireWildcard(require("ejs"));

var _bignumber = require("bignumber.js");

var _antlr4ts = require("antlr4ts");

var _Binding_grammarLexer = require("../antlr/Binding_grammarLexer");

var _binding_grammarParser = require("../antlr/binding_grammarParser");

var _BindingPolicyParser = require("./BindingPolicyParser");

var _DataStructures = require("./DataStructures");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

/* babel-plugin-inline-import '../../../../../templates/policy2sol.ejs' */
const policy2solEJS = "pragma solidity ^0.5.6;\n\ncontract <%= policyName %>_Contract {\n\n    function isCaseCreator(uint roleIndex) public pure returns(bool) {\n        return <%= creatorMask %> & (uint(1) << roleIndex) == <%= creatorMask %>;\n    }\n\n    function canNominate (uint rNominator, uint rNominee) public pure returns(bool) {\n        uint nomineeMask = uint(1) << rNominee;\n<% taken = [];\n    nominationStatements.forEach(statement => { \n        if(taken[roleIndex(statement.nominator)] != 1) { \n          taken[roleIndex(statement.nominator)] = 1;  -%>\n        if (rNominator == <%= roleIndex(statement.nominator) %>)\n            return nomineeMask & <%= nominationMask(statement.nominator, nominationStatements) %> != 0;\n<%     } -%>\n<%  }) -%>\n        return false;\n    }\n\n    function assertNConstraint (uint rNominator, uint rNominee, uint nomineeRoles) public pure returns(bool) {\n        uint nominatorNomineeMask = (uint(1) << rNominator) | (uint(1) << rNominee);\n<%  nominationStatements.forEach(statement => { \n        if(statement.bindingConstraint !== undefined) { -%>\n        if (nominatorNomineeMask == <%= statementMask(statement) %>)\n<%      setMask = disjunctionSetMask(statement.bindingConstraint);\n        first = true; -%>\n            return<% if(statement.bindingConstraint.isNegative) { %>!(<% } setMask.forEach(andS => { -%> <%= !first ? '||' : '' -%> nomineeRoles & <%= andS %> == <%= andS %><% first = false;}) -%><% if(statement.bindingConstraint.isNegative) { %>)<% } -%>;\n<%  }}) -%>\n        return true;\n    }\n\n    function requireNEndorsement (uint rNominator, uint rNominee) public pure returns(bool) {\n        uint nominatorNomineeMask = (uint(1) << rNominator) | (uint(1) << rNominee);\n<% if(nominationStatements != undefined) { \n    candidates = endorsementRequiredMask(nominationStatements);\n    first = true;\n    if(candidates.length > 0) { -%>\n        return<% candidates.forEach(andS => { -%> <%= !first ? '||' : '' -%> nominatorNomineeMask == <%= andS %><% first = false;}) -%>;\n<%    } else { -%>\n        return false;\n<% }}-%>\n    }\n\n    function assertNVote (uint rNominator, uint rNominee, uint rEndorser, uint endorsedBy, uint rejectedBy, bool isAccepted) public pure returns(uint) {\n        uint endorserMask = uint(1) << rEndorser;\n        require((endorsedBy | rejectedBy) & endorserMask == 0);\n        uint nominatorNomineeMask = (uint(1) << rNominator) | (uint(1) << rNominee);\n        endorsedBy |= endorserMask;\n        rejectedBy |= endorserMask;\n<%  elseCond = false;\n    nominationStatements.forEach(statement => { \n        if(statement.endorsementConstraint !== undefined) { -%>\n        <%= elseCond ? 'else ' : '' %>if (nominatorNomineeMask == <%= statementMask(statement) %>) {\n            require(endorserMask & <%= disjunctionSetJoinMask(statement.endorsementConstraint) %> != 0);\n<%      setMask = disjunctionSetMask(statement.endorsementConstraint);\n        fOr = true; fAnd = true -%>\n            if (isAccepted && (<% setMask.forEach(andS => { -%><%= !fOr ? '|| ' : '' -%>endorsedBy & <%= andS %> == <%= andS %><% fOr = false;}) -%>))\n                return 3;\n            else if (!isAccepted && (<% setMask.forEach(andS => { -%><% if(!fAnd) { -%> && <% } -%>rejectedBy & <%= andS %> != 0<% fAnd = false;}) -%>))\n                return 0;\n        }\n<%  elseCond = true; }}) -%>\n        return 2;\n    }\n\n    function canRelease (uint rNominator, uint rNominee) public pure returns(bool) {\n        uint nomineeMask = uint(1) << rNominee;\n<% taken = [];\n    releaseStatements.forEach(statement => { \n        if(taken[roleIndex(statement.nominator)] != 1) { \n          taken[roleIndex(statement.nominator)] = 1;  -%>\n        if (rNominator == <%= roleIndex(statement.nominator) %>)\n            return nomineeMask & <%= nominationMask(statement.nominator, releaseStatements) %> != 0;\n<%     } -%>\n<%  }) -%>\n        return false;\n    }\n\n    function assertRConstraint (uint rNominator, uint rNominee, uint nomineeRoles) public pure returns(bool) {\n        uint nominatorNomineeMask = (uint(1) << rNominator) | (uint(1) << rNominee);\n<%  releaseStatements.forEach(statement => { \n        if(statement.bindingConstraint !== undefined) { -%>\n        if (nominatorNomineeMask == <%= statementMask(statement) %>)\n<%      setMask = disjunctionSetMask(statement.bindingConstraint);\n        first = true; -%>\n            return<% if(statement.bindingConstraint.isNegative) { %>!(<% } setMask.forEach(andS => { -%> <%= !first ? '||' : '' -%> nomineeRoles & <%= andS %> == <%= andS %><% first = false;}) -%><% if(statement.bindingConstraint.isNegative) { %>)<% } -%>;\n<%  }}) -%>\n        return true;\n    }\n\n    function requireREndorsement (uint rNominator, uint rNominee) public pure returns(bool) {\n        uint nominatorNomineeMask = (uint(1) << rNominator) | (uint(1) << rNominee);\n<% if(releaseStatements != undefined) { \n    candidates = endorsementRequiredMask(releaseStatements);\n    first = true;\n    if(candidates.length > 0) { -%>\n        return<% candidates.forEach(andS => { -%> <%= !first ? '||' : '' -%> nominatorNomineeMask == <%= andS %><% first = false;}) -%>;\n<%    } else { -%>\n        return false;\n<% }}-%>\n    }\n\n    function assertRVote (uint rNominator, uint rNominee, uint rEndorser, uint endorsedBy, uint rejectedBy, bool isAccepted) public pure returns(uint) {\n        uint endorserMask = uint(1) << rEndorser;\n        require((endorsedBy | rejectedBy) & endorserMask == 0);\n        uint nominatorNomineeMask = (uint(1) << rNominator) | (uint(1) << rNominee);\n        endorsedBy |= endorserMask;\n        rejectedBy |= endorserMask;\n<%  elseCond = false;\n    releaseStatements.forEach(statement => { \n        if(statement.endorsementConstraint !== undefined) { -%>\n        <%= elseCond ? 'else ' : '' %>if (nominatorNomineeMask == <%= statementMask(statement) %>) {\n            require(endorserMask & <%= disjunctionSetJoinMask(statement.endorsementConstraint) %> != 0);\n<%      setMask = disjunctionSetMask(statement.endorsementConstraint);\n        fOr = true; fAnd = true -%>\n            if (isAccepted && (<% setMask.forEach(andS => { -%><%= !fOr ? '|| ' : '' -%>endorsedBy & <%= andS %> == <%= andS %><% fOr = false;}) -%>))\n                return 0;\n            else if (!isAccepted && (<% setMask.forEach(andS => { -%><% if(!fAnd) { -%> && <% } -%>rejectedBy & <%= andS %> != 0<% fAnd = false;}) -%>))\n                return 3;\n        }\n<%  elseCond = true; }}) -%>\n        return 2;\n    }\n\n}";
let policy2solTemplate = ejs.compile(policy2solEJS);

let generatePolicy = (policyStr, policyName) => {
  return new Promise((resolve, reject) => {
    try {
      /////////////////////////////////////////////
      ///      LEXER AND PAXER (ANTLR)         ///
      ////////////////////////////////////////////
      let inputStream = new _antlr4ts.ANTLRInputStream(policyStr);
      let lexer = new _Binding_grammarLexer.Binding_grammarLexer(inputStream);
      let tokenStream = new _antlr4ts.CommonTokenStream(lexer);
      let parser = new _binding_grammarParser.binding_grammarParser(tokenStream);
      parser.buildParseTree = true;
      let tree = parser.binding_policy();
      let visitor = new _BindingPolicyParser.BindingVisitor();
      visitor.visit(tree);
      let policy = visitor.policy; /////////////////////////////////////////////
      ///  CONSISTENCY AND SEMANTIC ANALYSIS   ///
      ////////////////////////////////////////////
      // (1) every role must appear as case creator or nominee in some statement.

      for (let [key, value] of policy.roleIndexMap) {
        let found = false;

        if (policy.caseCreator !== key) {
          for (let i = 0; i < policy.nominationStatements.length; i++) {
            if (policy.nominationStatements[i].nominee == key) {
              found = true;
              break;
            }
          }

          if (!found) throw 'Role [' + key + '] cannot be nominated. \n Check that every role in the policy must appear as nominee, or case creator.';
        }
      } // (2) In each statement the nominator and every role in the binding and endorsement constraints must be BOUND before the nominee
      // (2.1) Constructing the Nomination Net
      // pB will be the index of the role (policy.indexRoleMap[role]), in case of self pU will be policy.indexRoleMap[role] + countRoles


      let transitions = [];
      let marking = [];
      marking[policy.roleIndexMap.get(policy.caseCreator)] = 1;
      policy.nominationStatements.forEach(statement => {
        let output = policy.roleIndexMap.get(statement.nominee);
        let input = [];
        let taken = [];
        taken[policy.roleIndexMap.get(statement.nominee)] = 1;

        let addArc = rIndex => {
          if (taken[rIndex] !== 1) {
            input.push(rIndex);
            taken[rIndex] = 1;
          }
        };

        let updateConstraint = conjunctionSet => {
          conjunctionSet.forEach(andSet => {
            andSet.roles.forEach(role => {
              addArc(policy.roleIndexMap.get(role));
            });
          });
        };

        if (statement.nominator === statement.nominee || statement.nominee === 'self') {
          addArc(policy.roleIndexMap.get(statement.nominator) + policy.roleCount);
          if (taken[policy.roleIndexMap.get(statement.nominator) + policy.roleCount] !== 1) marking[policy.roleIndexMap.get(statement.nominator) + policy.roleCount] = 1;
        } else addArc(policy.roleIndexMap.get(statement.nominator));

        if (statement.bindingConstraint !== undefined) updateConstraint(statement.bindingConstraint.conjunctionSets);
        if (statement.endorsementConstraint !== undefined) updateConstraint(statement.endorsementConstraint.conjunctionSets);
        transitions.push({
          input: input,
          output: output
        });
      }); // (2.2) Validating the precedences (no dead transitions in the nomination net)

      let firedTransitions = [];
      let firedCount = 0;
      let roleOrder = [];
      let level = 0;

      while (true) {
        let toFire = [];

        for (let i = 0; i < transitions.length; i++) {
          if (firedTransitions[i] !== 1) {
            let input = transitions[i].input; // Validating If enabled

            let enabled = true;

            for (let j = 0; j < input.length; j++) if (marking[input[j]] !== 1) {
              enabled = false;
              break;
            }

            if (enabled) toFire.push(i);
          }
        } // No new enabled transition


        if (toFire.length === 0) break;
        level++; // Firing new enabled transitions

        toFire.forEach(trIndex => {
          marking[transitions[trIndex].output] = 1;
          firedTransitions[trIndex] = 1;
          firedCount++;
          roleOrder[transitions[trIndex].output] = level;
        }); // Every transition already fired, no dead transition

        if (firedCount === transitions.length) break;
      }

      if (firedCount < transitions.length) {
        let invalid = '';

        for (let [key, value] of policy.roleIndexMap) {
          if (marking[value] !== 1) invalid += '[' + key + '] ';
        }

        throw 'Roles ' + invalid + 'cannot be nominated';
      } else {
        console.log('Success, the policy is consistent. Role precedence:');
        console.log(0 + ': ' + policy.caseCreator);

        for (let i = 1; i <= level; i++) {
          let inLevel = '';

          for (let [key, value] of policy.roleIndexMap) {
            if (roleOrder[value] === i) inLevel += key + ' ';
          }

          console.log(i + ': ' + inLevel);
        }

        console.log('...............................................................');
      } /////////////////////////////////////////////
      ///     SMART CONTRACT GENERATION        ///
      ////////////////////////////////////////////
      // (1) BitSet Operations


      let bitArrayToInteger = bitarray => {
        if (bitarray.length > 0) {
          let result = '0b';

          for (let i = bitarray.length - 1; i >= 0; i--) result += bitarray[i] ? '1' : '0';

          return new _bignumber.BigNumber(result).toFixed();
        } else {
          return '0';
        }
      };

      let roleMask = roleId => {
        if (policy.roleIndexMap.has(roleId)) {
          let bitarray = [];
          bitarray[policy.roleIndexMap.get(roleId)] = 1;
          return bitArrayToInteger(bitarray);
        } else {
          return '0';
        }
      };

      let nominatorMask = (statementList, nominator) => {
        let bitarray = [];
        statementList.forEach(statement => {
          if (statement.nominator === nominator) {
            bitarray[policy.roleIndexMap.get(statement.nominee)] = 1;
          }
        });
        return bitArrayToInteger(bitarray);
      };

      let disjunctionSetMask = disjunctionSet => {
        let maskArray = [];
        disjunctionSet.conjunctionSets.forEach(andSet => {
          let bitarray = [];
          andSet.roles.forEach(role => {
            bitarray[policy.roleIndexMap.get(role)] = 1;
          });
          maskArray.push(bitArrayToInteger(bitarray));
        });
        return maskArray;
      };

      let disjunctionSetJoinMask = disjunctionSet => {
        let bitarray = [];
        disjunctionSet.conjunctionSets.forEach(andSet => {
          andSet.roles.forEach(role => {
            bitarray[policy.roleIndexMap.get(role)] = 1;
          });
        });
        return bitArrayToInteger(bitarray);
      };

      let statementMask = statement => {
        let bitarray = [];
        bitarray[policy.roleIndexMap.get(statement.nominator)] = 1;
        bitarray[policy.roleIndexMap.get(statement.nominee)] = 1;
        return bitArrayToInteger(bitarray);
      };

      let endorsementRequiredMask = statements => {
        let maskArray = [];
        statements.forEach(statement => {
          if (statement.endorsementConstraint !== undefined) maskArray.push(statementMask(statement));
        });
        return maskArray;
      };

      let codeGenerationInfo = {
        policyName: policyName,
        roleIndex: roleId => policy.roleIndexMap.get(roleId),
        creatorMask: roleMask(policy.caseCreator),
        statementMask: statement => statementMask(statement),
        nominationStatements: policy.nominationStatements,
        nominationMask: (nominator, statements) => nominatorMask(statements, nominator),
        disjunctionSetJoinMask: disjunctionSet => disjunctionSetJoinMask(disjunctionSet),
        disjunctionSetMask: disjunctionSet => disjunctionSetMask(disjunctionSet),
        endorsementRequiredMask: statements => endorsementRequiredMask(statements),
        releaseStatements: policy.releaseStatements
      };
      policy.solidity = policy2solTemplate(codeGenerationInfo);
      resolve(policy);
    } catch (ex) {
      console.log('Error: ', ex);
      reject(new _DataStructures.Policy());
    }
  });
};

exports.generatePolicy = generatePolicy;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvbXV0YXRpb24vcG9saWN5L2R5bmFtaWNfYmluZGluZy92YWxpZGF0aW9uX2NvZGVfZ2VuL0JpbmRpbmdQb2xpY3lHZW5lcmF0b3IudHMiXSwibmFtZXMiOlsicG9saWN5MnNvbFRlbXBsYXRlIiwiZWpzIiwiY29tcGlsZSIsInBvbGljeTJzb2xFSlMiLCJnZW5lcmF0ZVBvbGljeSIsInBvbGljeVN0ciIsInBvbGljeU5hbWUiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImlucHV0U3RyZWFtIiwiQU5UTFJJbnB1dFN0cmVhbSIsImxleGVyIiwiQmluZGluZ19ncmFtbWFyTGV4ZXIiLCJ0b2tlblN0cmVhbSIsIkNvbW1vblRva2VuU3RyZWFtIiwicGFyc2VyIiwiYmluZGluZ19ncmFtbWFyUGFyc2VyIiwiYnVpbGRQYXJzZVRyZWUiLCJ0cmVlIiwiYmluZGluZ19wb2xpY3kiLCJ2aXNpdG9yIiwiQmluZGluZ1Zpc2l0b3IiLCJ2aXNpdCIsInBvbGljeSIsImtleSIsInZhbHVlIiwicm9sZUluZGV4TWFwIiwiZm91bmQiLCJjYXNlQ3JlYXRvciIsImkiLCJub21pbmF0aW9uU3RhdGVtZW50cyIsImxlbmd0aCIsIm5vbWluZWUiLCJ0cmFuc2l0aW9ucyIsIm1hcmtpbmciLCJnZXQiLCJmb3JFYWNoIiwic3RhdGVtZW50Iiwib3V0cHV0IiwiaW5wdXQiLCJ0YWtlbiIsImFkZEFyYyIsInJJbmRleCIsInB1c2giLCJ1cGRhdGVDb25zdHJhaW50IiwiY29uanVuY3Rpb25TZXQiLCJhbmRTZXQiLCJyb2xlcyIsInJvbGUiLCJub21pbmF0b3IiLCJyb2xlQ291bnQiLCJiaW5kaW5nQ29uc3RyYWludCIsInVuZGVmaW5lZCIsImNvbmp1bmN0aW9uU2V0cyIsImVuZG9yc2VtZW50Q29uc3RyYWludCIsImZpcmVkVHJhbnNpdGlvbnMiLCJmaXJlZENvdW50Iiwicm9sZU9yZGVyIiwibGV2ZWwiLCJ0b0ZpcmUiLCJlbmFibGVkIiwiaiIsInRySW5kZXgiLCJpbnZhbGlkIiwiY29uc29sZSIsImxvZyIsImluTGV2ZWwiLCJiaXRBcnJheVRvSW50ZWdlciIsImJpdGFycmF5IiwicmVzdWx0IiwiQmlnTnVtYmVyIiwidG9GaXhlZCIsInJvbGVNYXNrIiwicm9sZUlkIiwiaGFzIiwibm9taW5hdG9yTWFzayIsInN0YXRlbWVudExpc3QiLCJkaXNqdW5jdGlvblNldE1hc2siLCJkaXNqdW5jdGlvblNldCIsIm1hc2tBcnJheSIsImRpc2p1bmN0aW9uU2V0Sm9pbk1hc2siLCJzdGF0ZW1lbnRNYXNrIiwiZW5kb3JzZW1lbnRSZXF1aXJlZE1hc2siLCJzdGF0ZW1lbnRzIiwiY29kZUdlbmVyYXRpb25JbmZvIiwicm9sZUluZGV4IiwiY3JlYXRvck1hc2siLCJub21pbmF0aW9uTWFzayIsInJlbGVhc2VTdGF0ZW1lbnRzIiwic29saWRpdHkiLCJleCIsIlBvbGljeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOztBQUVBOztBQUtBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7QUFHQSxJQUFJQSxrQkFBa0IsR0FBR0MsR0FBRyxDQUFDQyxPQUFKLENBQVlDLGFBQVosQ0FBekI7O0FBRU8sSUFBSUMsY0FBYyxHQUFHLENBQUNDLFNBQUQsRUFBb0JDLFVBQXBCLEtBQTRDO0FBRXBFLFNBQU8sSUFBSUMsT0FBSixDQUFvQixDQUFDQyxPQUFELEVBQVVDLE1BQVYsS0FBcUI7QUFFNUMsUUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUVJLFVBQUlDLFdBQVcsR0FBRyxJQUFJQywwQkFBSixDQUFxQk4sU0FBckIsQ0FBbEI7QUFDQSxVQUFJTyxLQUFLLEdBQUcsSUFBSUMsMENBQUosQ0FBeUJILFdBQXpCLENBQVo7QUFFQSxVQUFJSSxXQUFXLEdBQUcsSUFBSUMsMkJBQUosQ0FBc0JILEtBQXRCLENBQWxCO0FBQ0EsVUFBSUksTUFBTSxHQUFHLElBQUlDLDRDQUFKLENBQTBCSCxXQUExQixDQUFiO0FBRUFFLE1BQUFBLE1BQU0sQ0FBQ0UsY0FBUCxHQUF3QixJQUF4QjtBQUVBLFVBQUlDLElBQUksR0FBR0gsTUFBTSxDQUFDSSxjQUFQLEVBQVg7QUFFQSxVQUFJQyxPQUFPLEdBQUcsSUFBSUMsbUNBQUosRUFBZDtBQUVBRCxNQUFBQSxPQUFPLENBQUNFLEtBQVIsQ0FBY0osSUFBZDtBQUVBLFVBQUlLLE1BQU0sR0FBR0gsT0FBTyxDQUFDRyxNQUFyQixDQW5CQSxDQXFCSjtBQUNBO0FBQ0E7QUFFQTs7QUFDQSxXQUFLLElBQUksQ0FBQ0MsR0FBRCxFQUFNQyxLQUFOLENBQVQsSUFBeUJGLE1BQU0sQ0FBQ0csWUFBaEMsRUFBOEM7QUFDMUMsWUFBSUMsS0FBSyxHQUFHLEtBQVo7O0FBQ0EsWUFBR0osTUFBTSxDQUFDSyxXQUFQLEtBQXVCSixHQUExQixFQUErQjtBQUMzQixlQUFJLElBQUlLLENBQUMsR0FBRyxDQUFaLEVBQWVBLENBQUMsR0FBR04sTUFBTSxDQUFDTyxvQkFBUCxDQUE0QkMsTUFBL0MsRUFBdURGLENBQUMsRUFBeEQsRUFBNEQ7QUFDeEQsZ0JBQUdOLE1BQU0sQ0FBQ08sb0JBQVAsQ0FBNEJELENBQTVCLEVBQStCRyxPQUEvQixJQUEwQ1IsR0FBN0MsRUFBa0Q7QUFDOUNHLGNBQUFBLEtBQUssR0FBRyxJQUFSO0FBQ0E7QUFDSDtBQUNKOztBQUNELGNBQUcsQ0FBQ0EsS0FBSixFQUNJLE1BQU0sV0FBV0gsR0FBWCxHQUFpQix3R0FBdkI7QUFDUDtBQUNKLE9BdENHLENBd0NKO0FBRUE7QUFDQTs7O0FBRUEsVUFBSVMsV0FBVyxHQUFHLEVBQWxCO0FBQ0EsVUFBSUMsT0FBTyxHQUFHLEVBQWQ7QUFDQUEsTUFBQUEsT0FBTyxDQUFDWCxNQUFNLENBQUNHLFlBQVAsQ0FBb0JTLEdBQXBCLENBQXdCWixNQUFNLENBQUNLLFdBQS9CLENBQUQsQ0FBUCxHQUF1RCxDQUF2RDtBQUNBTCxNQUFBQSxNQUFNLENBQUNPLG9CQUFQLENBQTRCTSxPQUE1QixDQUFvQ0MsU0FBUyxJQUFJO0FBQzdDLFlBQUlDLE1BQU0sR0FBR2YsTUFBTSxDQUFDRyxZQUFQLENBQW9CUyxHQUFwQixDQUF3QkUsU0FBUyxDQUFDTCxPQUFsQyxDQUFiO0FBQ0EsWUFBSU8sS0FBSyxHQUFHLEVBQVo7QUFDQSxZQUFJQyxLQUFLLEdBQUcsRUFBWjtBQUNBQSxRQUFBQSxLQUFLLENBQUNqQixNQUFNLENBQUNHLFlBQVAsQ0FBb0JTLEdBQXBCLENBQXdCRSxTQUFTLENBQUNMLE9BQWxDLENBQUQsQ0FBTCxHQUFvRCxDQUFwRDs7QUFDQSxZQUFJUyxNQUFNLEdBQUlDLE1BQUQsSUFBWTtBQUNyQixjQUFHRixLQUFLLENBQUNFLE1BQUQsQ0FBTCxLQUFrQixDQUFyQixFQUF3QjtBQUNwQkgsWUFBQUEsS0FBSyxDQUFDSSxJQUFOLENBQVdELE1BQVg7QUFDQUYsWUFBQUEsS0FBSyxDQUFDRSxNQUFELENBQUwsR0FBZ0IsQ0FBaEI7QUFDSDtBQUNKLFNBTEQ7O0FBTUEsWUFBSUUsZ0JBQWdCLEdBQUlDLGNBQUQsSUFBb0I7QUFDdkNBLFVBQUFBLGNBQWMsQ0FBQ1QsT0FBZixDQUF1QlUsTUFBTSxJQUFJO0FBQzdCQSxZQUFBQSxNQUFNLENBQUNDLEtBQVAsQ0FBYVgsT0FBYixDQUFxQlksSUFBSSxJQUFJO0FBQ3pCUCxjQUFBQSxNQUFNLENBQUNsQixNQUFNLENBQUNHLFlBQVAsQ0FBb0JTLEdBQXBCLENBQXdCYSxJQUF4QixDQUFELENBQU47QUFDSCxhQUZEO0FBR0gsV0FKRDtBQUtILFNBTkQ7O0FBT0EsWUFBR1gsU0FBUyxDQUFDWSxTQUFWLEtBQXdCWixTQUFTLENBQUNMLE9BQWxDLElBQTZDSyxTQUFTLENBQUNMLE9BQVYsS0FBc0IsTUFBdEUsRUFBOEU7QUFDMUVTLFVBQUFBLE1BQU0sQ0FBQ2xCLE1BQU0sQ0FBQ0csWUFBUCxDQUFvQlMsR0FBcEIsQ0FBd0JFLFNBQVMsQ0FBQ1ksU0FBbEMsSUFBK0MxQixNQUFNLENBQUMyQixTQUF2RCxDQUFOO0FBQ0EsY0FBR1YsS0FBSyxDQUFDakIsTUFBTSxDQUFDRyxZQUFQLENBQW9CUyxHQUFwQixDQUF3QkUsU0FBUyxDQUFDWSxTQUFsQyxJQUErQzFCLE1BQU0sQ0FBQzJCLFNBQXZELENBQUwsS0FBMkUsQ0FBOUUsRUFDSWhCLE9BQU8sQ0FBQ1gsTUFBTSxDQUFDRyxZQUFQLENBQW9CUyxHQUFwQixDQUF3QkUsU0FBUyxDQUFDWSxTQUFsQyxJQUErQzFCLE1BQU0sQ0FBQzJCLFNBQXZELENBQVAsR0FBMkUsQ0FBM0U7QUFDUCxTQUpELE1BS0lULE1BQU0sQ0FBQ2xCLE1BQU0sQ0FBQ0csWUFBUCxDQUFvQlMsR0FBcEIsQ0FBd0JFLFNBQVMsQ0FBQ1ksU0FBbEMsQ0FBRCxDQUFOOztBQUNKLFlBQUdaLFNBQVMsQ0FBQ2MsaUJBQVYsS0FBZ0NDLFNBQW5DLEVBQ0lSLGdCQUFnQixDQUFDUCxTQUFTLENBQUNjLGlCQUFWLENBQTRCRSxlQUE3QixDQUFoQjtBQUNKLFlBQUdoQixTQUFTLENBQUNpQixxQkFBVixLQUFvQ0YsU0FBdkMsRUFDSVIsZ0JBQWdCLENBQUNQLFNBQVMsQ0FBQ2lCLHFCQUFWLENBQWdDRCxlQUFqQyxDQUFoQjtBQUNKcEIsUUFBQUEsV0FBVyxDQUFDVSxJQUFaLENBQWlCO0FBQUNKLFVBQUFBLEtBQUssRUFBRUEsS0FBUjtBQUFlRCxVQUFBQSxNQUFNLEVBQUVBO0FBQXZCLFNBQWpCO0FBQ0gsT0E3QkQsRUFoREksQ0ErRUo7O0FBRUEsVUFBSWlCLGdCQUFnQixHQUFHLEVBQXZCO0FBQ0EsVUFBSUMsVUFBVSxHQUFHLENBQWpCO0FBQ0EsVUFBSUMsU0FBUyxHQUFHLEVBQWhCO0FBQ0EsVUFBSUMsS0FBSyxHQUFHLENBQVo7O0FBRUEsYUFBTSxJQUFOLEVBQVk7QUFDUixZQUFJQyxNQUFNLEdBQUcsRUFBYjs7QUFDQSxhQUFJLElBQUk5QixDQUFDLEdBQUcsQ0FBWixFQUFlQSxDQUFDLEdBQUdJLFdBQVcsQ0FBQ0YsTUFBL0IsRUFBdUNGLENBQUMsRUFBeEMsRUFBNEM7QUFDeEMsY0FBSTBCLGdCQUFnQixDQUFDMUIsQ0FBRCxDQUFoQixLQUF3QixDQUE1QixFQUErQjtBQUMzQixnQkFBSVUsS0FBSyxHQUFHTixXQUFXLENBQUNKLENBQUQsQ0FBWCxDQUFlVSxLQUEzQixDQUQyQixDQUUzQjs7QUFDQSxnQkFBSXFCLE9BQU8sR0FBRyxJQUFkOztBQUNBLGlCQUFJLElBQUlDLENBQUMsR0FBRyxDQUFaLEVBQWVBLENBQUMsR0FBR3RCLEtBQUssQ0FBQ1IsTUFBekIsRUFBaUM4QixDQUFDLEVBQWxDLEVBQ0ksSUFBRzNCLE9BQU8sQ0FBQ0ssS0FBSyxDQUFDc0IsQ0FBRCxDQUFOLENBQVAsS0FBc0IsQ0FBekIsRUFBNEI7QUFDeEJELGNBQUFBLE9BQU8sR0FBRyxLQUFWO0FBQ0E7QUFDSDs7QUFDTCxnQkFBR0EsT0FBSCxFQUNJRCxNQUFNLENBQUNoQixJQUFQLENBQVlkLENBQVo7QUFDUDtBQUNKLFNBZk8sQ0FnQlI7OztBQUNBLFlBQUc4QixNQUFNLENBQUM1QixNQUFQLEtBQWtCLENBQXJCLEVBQ0k7QUFDSjJCLFFBQUFBLEtBQUssR0FuQkcsQ0FvQlI7O0FBQ0FDLFFBQUFBLE1BQU0sQ0FBQ3ZCLE9BQVAsQ0FBZTBCLE9BQU8sSUFBSTtBQUN0QjVCLFVBQUFBLE9BQU8sQ0FBQ0QsV0FBVyxDQUFDNkIsT0FBRCxDQUFYLENBQXFCeEIsTUFBdEIsQ0FBUCxHQUF1QyxDQUF2QztBQUNBaUIsVUFBQUEsZ0JBQWdCLENBQUNPLE9BQUQsQ0FBaEIsR0FBNEIsQ0FBNUI7QUFDQU4sVUFBQUEsVUFBVTtBQUNWQyxVQUFBQSxTQUFTLENBQUN4QixXQUFXLENBQUM2QixPQUFELENBQVgsQ0FBcUJ4QixNQUF0QixDQUFULEdBQXlDb0IsS0FBekM7QUFDSCxTQUxELEVBckJRLENBMkJSOztBQUNBLFlBQUdGLFVBQVUsS0FBS3ZCLFdBQVcsQ0FBQ0YsTUFBOUIsRUFDSTtBQUNQOztBQUNELFVBQUl5QixVQUFVLEdBQUd2QixXQUFXLENBQUNGLE1BQTdCLEVBQXFDO0FBQ2pDLFlBQUlnQyxPQUFPLEdBQUcsRUFBZDs7QUFDQSxhQUFLLElBQUksQ0FBQ3ZDLEdBQUQsRUFBTUMsS0FBTixDQUFULElBQXlCRixNQUFNLENBQUNHLFlBQWhDLEVBQThDO0FBQzFDLGNBQUdRLE9BQU8sQ0FBQ1QsS0FBRCxDQUFQLEtBQW1CLENBQXRCLEVBQ0lzQyxPQUFPLElBQUksTUFBTXZDLEdBQU4sR0FBWSxJQUF2QjtBQUNQOztBQUNELGNBQU0sV0FBV3VDLE9BQVgsR0FBcUIscUJBQTNCO0FBQ0gsT0FQRCxNQU9PO0FBQ0hDLFFBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLHFEQUFaO0FBQ0FELFFBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLElBQUksSUFBSixHQUFXMUMsTUFBTSxDQUFDSyxXQUE5Qjs7QUFDQSxhQUFJLElBQUlDLENBQUMsR0FBRyxDQUFaLEVBQWVBLENBQUMsSUFBSTZCLEtBQXBCLEVBQTJCN0IsQ0FBQyxFQUE1QixFQUFnQztBQUM1QixjQUFJcUMsT0FBTyxHQUFHLEVBQWQ7O0FBQ0EsZUFBSyxJQUFJLENBQUMxQyxHQUFELEVBQU1DLEtBQU4sQ0FBVCxJQUF5QkYsTUFBTSxDQUFDRyxZQUFoQyxFQUE4QztBQUMxQyxnQkFBRytCLFNBQVMsQ0FBQ2hDLEtBQUQsQ0FBVCxLQUFxQkksQ0FBeEIsRUFDSXFDLE9BQU8sSUFBSTFDLEdBQUcsR0FBRyxHQUFqQjtBQUNQOztBQUNEd0MsVUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVlwQyxDQUFDLEdBQUcsSUFBSixHQUFXcUMsT0FBdkI7QUFDSDs7QUFDREYsUUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksaUVBQVo7QUFDSCxPQXhJRyxDQTBJSjtBQUNBO0FBQ0E7QUFFQTs7O0FBRUksVUFBSUUsaUJBQWlCLEdBQUlDLFFBQUQsSUFBYztBQUNsQyxZQUFHQSxRQUFRLENBQUNyQyxNQUFULEdBQWtCLENBQXJCLEVBQXdCO0FBQ3BCLGNBQUlzQyxNQUFNLEdBQUcsSUFBYjs7QUFDQSxlQUFLLElBQUl4QyxDQUFDLEdBQUd1QyxRQUFRLENBQUNyQyxNQUFULEdBQWtCLENBQS9CLEVBQWtDRixDQUFDLElBQUksQ0FBdkMsRUFBMENBLENBQUMsRUFBM0MsRUFDRXdDLE1BQU0sSUFBSUQsUUFBUSxDQUFDdkMsQ0FBRCxDQUFSLEdBQWMsR0FBZCxHQUFvQixHQUE5Qjs7QUFDRixpQkFBTyxJQUFJeUMsb0JBQUosQ0FBY0QsTUFBZCxFQUFzQkUsT0FBdEIsRUFBUDtBQUNILFNBTEQsTUFLTztBQUNILGlCQUFPLEdBQVA7QUFDSDtBQUNKLE9BVEQ7O0FBV0EsVUFBSUMsUUFBUSxHQUFJQyxNQUFELElBQVk7QUFDdkIsWUFBR2xELE1BQU0sQ0FBQ0csWUFBUCxDQUFvQmdELEdBQXBCLENBQXdCRCxNQUF4QixDQUFILEVBQW9DO0FBQ2hDLGNBQUlMLFFBQVEsR0FBRyxFQUFmO0FBQ0FBLFVBQUFBLFFBQVEsQ0FBQzdDLE1BQU0sQ0FBQ0csWUFBUCxDQUFvQlMsR0FBcEIsQ0FBd0JzQyxNQUF4QixDQUFELENBQVIsR0FBNEMsQ0FBNUM7QUFDQSxpQkFBT04saUJBQWlCLENBQUNDLFFBQUQsQ0FBeEI7QUFDSCxTQUpELE1BSU87QUFDSCxpQkFBTyxHQUFQO0FBQ0g7QUFDSixPQVJEOztBQVVBLFVBQUlPLGFBQWEsR0FBRyxDQUFDQyxhQUFELEVBQWdCM0IsU0FBaEIsS0FBOEI7QUFDOUMsWUFBSW1CLFFBQVEsR0FBRyxFQUFmO0FBQ0FRLFFBQUFBLGFBQWEsQ0FBQ3hDLE9BQWQsQ0FBc0JDLFNBQVMsSUFBSTtBQUMvQixjQUFHQSxTQUFTLENBQUNZLFNBQVYsS0FBd0JBLFNBQTNCLEVBQXNDO0FBQ2xDbUIsWUFBQUEsUUFBUSxDQUFDN0MsTUFBTSxDQUFDRyxZQUFQLENBQW9CUyxHQUFwQixDQUF3QkUsU0FBUyxDQUFDTCxPQUFsQyxDQUFELENBQVIsR0FBdUQsQ0FBdkQ7QUFDSDtBQUNKLFNBSkQ7QUFLQSxlQUFPbUMsaUJBQWlCLENBQUNDLFFBQUQsQ0FBeEI7QUFDSCxPQVJEOztBQVVBLFVBQUlTLGtCQUFrQixHQUFJQyxjQUFELElBQW9CO0FBQ3pDLFlBQUlDLFNBQVMsR0FBRyxFQUFoQjtBQUNBRCxRQUFBQSxjQUFjLENBQUN6QixlQUFmLENBQStCakIsT0FBL0IsQ0FBdUNVLE1BQU0sSUFBSTtBQUM3QyxjQUFJc0IsUUFBUSxHQUFHLEVBQWY7QUFDQXRCLFVBQUFBLE1BQU0sQ0FBQ0MsS0FBUCxDQUFhWCxPQUFiLENBQXFCWSxJQUFJLElBQUk7QUFDekJvQixZQUFBQSxRQUFRLENBQUM3QyxNQUFNLENBQUNHLFlBQVAsQ0FBb0JTLEdBQXBCLENBQXdCYSxJQUF4QixDQUFELENBQVIsR0FBMEMsQ0FBMUM7QUFDSCxXQUZEO0FBR0ErQixVQUFBQSxTQUFTLENBQUNwQyxJQUFWLENBQWV3QixpQkFBaUIsQ0FBQ0MsUUFBRCxDQUFoQztBQUNILFNBTkQ7QUFPQSxlQUFPVyxTQUFQO0FBQ0gsT0FWRDs7QUFZQSxVQUFJQyxzQkFBc0IsR0FBSUYsY0FBRCxJQUFvQjtBQUM3QyxZQUFJVixRQUFRLEdBQUcsRUFBZjtBQUNBVSxRQUFBQSxjQUFjLENBQUN6QixlQUFmLENBQStCakIsT0FBL0IsQ0FBdUNVLE1BQU0sSUFBSTtBQUM3Q0EsVUFBQUEsTUFBTSxDQUFDQyxLQUFQLENBQWFYLE9BQWIsQ0FBcUJZLElBQUksSUFBSTtBQUN6Qm9CLFlBQUFBLFFBQVEsQ0FBQzdDLE1BQU0sQ0FBQ0csWUFBUCxDQUFvQlMsR0FBcEIsQ0FBd0JhLElBQXhCLENBQUQsQ0FBUixHQUEwQyxDQUExQztBQUNILFdBRkQ7QUFHSCxTQUpEO0FBS0EsZUFBT21CLGlCQUFpQixDQUFDQyxRQUFELENBQXhCO0FBQ0gsT0FSRDs7QUFVQSxVQUFJYSxhQUFhLEdBQUk1QyxTQUFELElBQWU7QUFDL0IsWUFBSStCLFFBQVEsR0FBRyxFQUFmO0FBQ0FBLFFBQUFBLFFBQVEsQ0FBQzdDLE1BQU0sQ0FBQ0csWUFBUCxDQUFvQlMsR0FBcEIsQ0FBd0JFLFNBQVMsQ0FBQ1ksU0FBbEMsQ0FBRCxDQUFSLEdBQXlELENBQXpEO0FBQ0FtQixRQUFBQSxRQUFRLENBQUM3QyxNQUFNLENBQUNHLFlBQVAsQ0FBb0JTLEdBQXBCLENBQXdCRSxTQUFTLENBQUNMLE9BQWxDLENBQUQsQ0FBUixHQUF1RCxDQUF2RDtBQUNBLGVBQU9tQyxpQkFBaUIsQ0FBQ0MsUUFBRCxDQUF4QjtBQUNILE9BTEQ7O0FBT0EsVUFBSWMsdUJBQXVCLEdBQUlDLFVBQUQsSUFBZ0I7QUFDMUMsWUFBSUosU0FBUyxHQUFHLEVBQWhCO0FBQ0FJLFFBQUFBLFVBQVUsQ0FBQy9DLE9BQVgsQ0FBbUJDLFNBQVMsSUFBSTtBQUM1QixjQUFJQSxTQUFTLENBQUNpQixxQkFBVixLQUFvQ0YsU0FBeEMsRUFDSTJCLFNBQVMsQ0FBQ3BDLElBQVYsQ0FBZXNDLGFBQWEsQ0FBQzVDLFNBQUQsQ0FBNUI7QUFDUCxTQUhEO0FBSUEsZUFBTzBDLFNBQVA7QUFDSCxPQVBEOztBQVNBLFVBQUlLLGtCQUFrQixHQUFHO0FBQ3JCL0UsUUFBQUEsVUFBVSxFQUFFQSxVQURTO0FBRXJCZ0YsUUFBQUEsU0FBUyxFQUFHWixNQUFELElBQVlsRCxNQUFNLENBQUNHLFlBQVAsQ0FBb0JTLEdBQXBCLENBQXdCc0MsTUFBeEIsQ0FGRjtBQUdyQmEsUUFBQUEsV0FBVyxFQUFFZCxRQUFRLENBQUNqRCxNQUFNLENBQUNLLFdBQVIsQ0FIQTtBQUlyQnFELFFBQUFBLGFBQWEsRUFBRzVDLFNBQUQsSUFBZTRDLGFBQWEsQ0FBQzVDLFNBQUQsQ0FKdEI7QUFLckJQLFFBQUFBLG9CQUFvQixFQUFFUCxNQUFNLENBQUNPLG9CQUxSO0FBTXJCeUQsUUFBQUEsY0FBYyxFQUFFLENBQUN0QyxTQUFELEVBQVlrQyxVQUFaLEtBQTJCUixhQUFhLENBQUNRLFVBQUQsRUFBYWxDLFNBQWIsQ0FObkM7QUFPckIrQixRQUFBQSxzQkFBc0IsRUFBR0YsY0FBRCxJQUFvQkUsc0JBQXNCLENBQUNGLGNBQUQsQ0FQN0M7QUFRckJELFFBQUFBLGtCQUFrQixFQUFHQyxjQUFELElBQW9CRCxrQkFBa0IsQ0FBQ0MsY0FBRCxDQVJyQztBQVNyQkksUUFBQUEsdUJBQXVCLEVBQUdDLFVBQUQsSUFBZ0JELHVCQUF1QixDQUFDQyxVQUFELENBVDNDO0FBVXJCSyxRQUFBQSxpQkFBaUIsRUFBRWpFLE1BQU0sQ0FBQ2lFO0FBVkwsT0FBekI7QUFhQWpFLE1BQUFBLE1BQU0sQ0FBQ2tFLFFBQVAsR0FBa0IxRixrQkFBa0IsQ0FBQ3FGLGtCQUFELENBQXBDO0FBQ0E3RSxNQUFBQSxPQUFPLENBQUNnQixNQUFELENBQVA7QUFFSCxLQXJPRCxDQXFPRSxPQUFNbUUsRUFBTixFQUFVO0FBQ1IxQixNQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxTQUFaLEVBQXVCeUIsRUFBdkI7QUFDQWxGLE1BQUFBLE1BQU0sQ0FBQyxJQUFJbUYsc0JBQUosRUFBRCxDQUFOO0FBQ0g7QUFFSixHQTVPTSxDQUFQO0FBOE9ILENBaFBNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSBcImZzXCI7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgKiBhcyBlanMgZnJvbSBcImVqc1wiO1xuXG5pbXBvcnQgeyBCaWdOdW1iZXIgfSBmcm9tIFwiYmlnbnVtYmVyLmpzXCI7XG5cbmltcG9ydCBhbnRscjQgZnJvbSAnYW50bHI0J1xuaW1wb3J0IHBvbGljeTJzb2xFSlMgZnJvbSAnLi4vLi4vLi4vLi4vLi4vdGVtcGxhdGVzL3BvbGljeTJzb2wuZWpzJ1xuXG5pbXBvcnQgeyBBTlRMUklucHV0U3RyZWFtLCBDb21tb25Ub2tlblN0cmVhbSwgQU5UTFJFcnJvckxpc3RlbmVyIH0gZnJvbSAnYW50bHI0dHMnO1xuaW1wb3J0IHsgQmluZGluZ19ncmFtbWFyTGV4ZXIgfSBmcm9tICcuLi9hbnRsci9CaW5kaW5nX2dyYW1tYXJMZXhlcic7XG5pbXBvcnQgeyBiaW5kaW5nX2dyYW1tYXJQYXJzZXIgfSBmcm9tICcuLi9hbnRsci9iaW5kaW5nX2dyYW1tYXJQYXJzZXInO1xuaW1wb3J0IHsgQmluZGluZ1Zpc2l0b3IgfSBmcm9tICcuL0JpbmRpbmdQb2xpY3lQYXJzZXInO1xuaW1wb3J0IHsgUG9saWN5LCBEaXNqdW5jdGlvblNldCwgQ29uanVuY3Rpb25TZXQgfSBmcm9tICcuL0RhdGFTdHJ1Y3R1cmVzJztcblxuXG5sZXQgcG9saWN5MnNvbFRlbXBsYXRlID0gZWpzLmNvbXBpbGUocG9saWN5MnNvbEVKUyk7XG5cbmV4cG9ydCBsZXQgZ2VuZXJhdGVQb2xpY3kgPSAocG9saWN5U3RyOiBzdHJpbmcsIHBvbGljeU5hbWU6IHN0cmluZykgID0+IHtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZTxQb2xpY3k+KChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgICB0cnkge1xuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgLy8vICAgICAgTEVYRVIgQU5EIFBBWEVSIChBTlRMUikgICAgICAgICAvLy9cbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbGV0IGlucHV0U3RyZWFtID0gbmV3IEFOVExSSW5wdXRTdHJlYW0ocG9saWN5U3RyKTtcbiAgICAgICAgICAgIGxldCBsZXhlciA9IG5ldyBCaW5kaW5nX2dyYW1tYXJMZXhlcihpbnB1dFN0cmVhbSk7XG5cbiAgICAgICAgICAgIGxldCB0b2tlblN0cmVhbSA9IG5ldyBDb21tb25Ub2tlblN0cmVhbShsZXhlcik7XG4gICAgICAgICAgICBsZXQgcGFyc2VyID0gbmV3IGJpbmRpbmdfZ3JhbW1hclBhcnNlcih0b2tlblN0cmVhbSk7XG4gICAgICAgIFxuICAgICAgICAgICAgcGFyc2VyLmJ1aWxkUGFyc2VUcmVlID0gdHJ1ZTtcbiAgICAgICAgXG4gICAgICAgICAgICBsZXQgdHJlZSA9IHBhcnNlci5iaW5kaW5nX3BvbGljeSgpO1xuXG4gICAgICAgICAgICBsZXQgdmlzaXRvciA9IG5ldyBCaW5kaW5nVmlzaXRvcigpO1xuICAgICAgICBcbiAgICAgICAgICAgIHZpc2l0b3IudmlzaXQodHJlZSk7XG5cbiAgICAgICAgICAgIGxldCBwb2xpY3kgPSB2aXNpdG9yLnBvbGljeTtcblxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgLy8vICBDT05TSVNURU5DWSBBTkQgU0VNQU5USUMgQU5BTFlTSVMgICAvLy9cbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAgICAgXG4gICAgICAgIC8vICgxKSBldmVyeSByb2xlIG11c3QgYXBwZWFyIGFzIGNhc2UgY3JlYXRvciBvciBub21pbmVlIGluIHNvbWUgc3RhdGVtZW50LlxuICAgICAgICBmb3IgKGxldCBba2V5LCB2YWx1ZV0gb2YgcG9saWN5LnJvbGVJbmRleE1hcCkge1xuICAgICAgICAgICAgbGV0IGZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICBpZihwb2xpY3kuY2FzZUNyZWF0b3IgIT09IGtleSkge1xuICAgICAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBwb2xpY3kubm9taW5hdGlvblN0YXRlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYocG9saWN5Lm5vbWluYXRpb25TdGF0ZW1lbnRzW2ldLm5vbWluZWUgPT0ga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZighZm91bmQpXG4gICAgICAgICAgICAgICAgICAgIHRocm93ICdSb2xlIFsnICsga2V5ICsgJ10gY2Fubm90IGJlIG5vbWluYXRlZC4gXFxuIENoZWNrIHRoYXQgZXZlcnkgcm9sZSBpbiB0aGUgcG9saWN5IG11c3QgYXBwZWFyIGFzIG5vbWluZWUsIG9yIGNhc2UgY3JlYXRvci4nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gKDIpIEluIGVhY2ggc3RhdGVtZW50IHRoZSBub21pbmF0b3IgYW5kIGV2ZXJ5IHJvbGUgaW4gdGhlIGJpbmRpbmcgYW5kIGVuZG9yc2VtZW50IGNvbnN0cmFpbnRzIG11c3QgYmUgQk9VTkQgYmVmb3JlIHRoZSBub21pbmVlXG5cbiAgICAgICAgLy8gKDIuMSkgQ29uc3RydWN0aW5nIHRoZSBOb21pbmF0aW9uIE5ldFxuICAgICAgICAvLyBwQiB3aWxsIGJlIHRoZSBpbmRleCBvZiB0aGUgcm9sZSAocG9saWN5LmluZGV4Um9sZU1hcFtyb2xlXSksIGluIGNhc2Ugb2Ygc2VsZiBwVSB3aWxsIGJlIHBvbGljeS5pbmRleFJvbGVNYXBbcm9sZV0gKyBjb3VudFJvbGVzXG5cbiAgICAgICAgbGV0IHRyYW5zaXRpb25zID0gW107XG4gICAgICAgIGxldCBtYXJraW5nID0gW107XG4gICAgICAgIG1hcmtpbmdbcG9saWN5LnJvbGVJbmRleE1hcC5nZXQocG9saWN5LmNhc2VDcmVhdG9yKV0gPSAxO1xuICAgICAgICBwb2xpY3kubm9taW5hdGlvblN0YXRlbWVudHMuZm9yRWFjaChzdGF0ZW1lbnQgPT4ge1xuICAgICAgICAgICAgbGV0IG91dHB1dCA9IHBvbGljeS5yb2xlSW5kZXhNYXAuZ2V0KHN0YXRlbWVudC5ub21pbmVlKTtcbiAgICAgICAgICAgIGxldCBpbnB1dCA9IFtdO1xuICAgICAgICAgICAgbGV0IHRha2VuID0gW107XG4gICAgICAgICAgICB0YWtlbltwb2xpY3kucm9sZUluZGV4TWFwLmdldChzdGF0ZW1lbnQubm9taW5lZSldID0gMTtcbiAgICAgICAgICAgIGxldCBhZGRBcmMgPSAockluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYodGFrZW5bckluZGV4XSAhPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBpbnB1dC5wdXNoKHJJbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIHRha2VuW3JJbmRleF0gPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCB1cGRhdGVDb25zdHJhaW50ID0gKGNvbmp1bmN0aW9uU2V0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uanVuY3Rpb25TZXQuZm9yRWFjaChhbmRTZXQgPT4ge1xuICAgICAgICAgICAgICAgICAgICBhbmRTZXQucm9sZXMuZm9yRWFjaChyb2xlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZEFyYyhwb2xpY3kucm9sZUluZGV4TWFwLmdldChyb2xlKSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihzdGF0ZW1lbnQubm9taW5hdG9yID09PSBzdGF0ZW1lbnQubm9taW5lZSB8fCBzdGF0ZW1lbnQubm9taW5lZSA9PT0gJ3NlbGYnKSB7XG4gICAgICAgICAgICAgICAgYWRkQXJjKHBvbGljeS5yb2xlSW5kZXhNYXAuZ2V0KHN0YXRlbWVudC5ub21pbmF0b3IpICsgcG9saWN5LnJvbGVDb3VudCk7XG4gICAgICAgICAgICAgICAgaWYodGFrZW5bcG9saWN5LnJvbGVJbmRleE1hcC5nZXQoc3RhdGVtZW50Lm5vbWluYXRvcikgKyBwb2xpY3kucm9sZUNvdW50XSAhPT0gMSlcbiAgICAgICAgICAgICAgICAgICAgbWFya2luZ1twb2xpY3kucm9sZUluZGV4TWFwLmdldChzdGF0ZW1lbnQubm9taW5hdG9yKSArIHBvbGljeS5yb2xlQ291bnRdID0gMTtcbiAgICAgICAgICAgIH0gZWxzZSBcbiAgICAgICAgICAgICAgICBhZGRBcmMocG9saWN5LnJvbGVJbmRleE1hcC5nZXQoc3RhdGVtZW50Lm5vbWluYXRvcikpO1xuICAgICAgICAgICAgaWYoc3RhdGVtZW50LmJpbmRpbmdDb25zdHJhaW50ICE9PSB1bmRlZmluZWQpIFxuICAgICAgICAgICAgICAgIHVwZGF0ZUNvbnN0cmFpbnQoc3RhdGVtZW50LmJpbmRpbmdDb25zdHJhaW50LmNvbmp1bmN0aW9uU2V0cyk7ICAgXG4gICAgICAgICAgICBpZihzdGF0ZW1lbnQuZW5kb3JzZW1lbnRDb25zdHJhaW50ICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgdXBkYXRlQ29uc3RyYWludChzdGF0ZW1lbnQuZW5kb3JzZW1lbnRDb25zdHJhaW50LmNvbmp1bmN0aW9uU2V0cyk7XG4gICAgICAgICAgICB0cmFuc2l0aW9ucy5wdXNoKHtpbnB1dDogaW5wdXQsIG91dHB1dDogb3V0cHV0fSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vICgyLjIpIFZhbGlkYXRpbmcgdGhlIHByZWNlZGVuY2VzIChubyBkZWFkIHRyYW5zaXRpb25zIGluIHRoZSBub21pbmF0aW9uIG5ldClcblxuICAgICAgICBsZXQgZmlyZWRUcmFuc2l0aW9ucyA9IFtdO1xuICAgICAgICBsZXQgZmlyZWRDb3VudCA9IDA7XG4gICAgICAgIGxldCByb2xlT3JkZXIgPSBbXTtcbiAgICAgICAgbGV0IGxldmVsID0gMDtcblxuICAgICAgICB3aGlsZSh0cnVlKSB7XG4gICAgICAgICAgICBsZXQgdG9GaXJlID0gW107XG4gICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdHJhbnNpdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoZmlyZWRUcmFuc2l0aW9uc1tpXSAhPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgaW5wdXQgPSB0cmFuc2l0aW9uc1tpXS5pbnB1dDtcbiAgICAgICAgICAgICAgICAgICAgLy8gVmFsaWRhdGluZyBJZiBlbmFibGVkXG4gICAgICAgICAgICAgICAgICAgIGxldCBlbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgZm9yKGxldCBqID0gMDsgaiA8IGlucHV0Lmxlbmd0aDsgaisrKSBcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKG1hcmtpbmdbaW5wdXRbal1dICE9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZihlbmFibGVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgdG9GaXJlLnB1c2goaSk7XG4gICAgICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIE5vIG5ldyBlbmFibGVkIHRyYW5zaXRpb25cbiAgICAgICAgICAgIGlmKHRvRmlyZS5sZW5ndGggPT09IDApXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBsZXZlbCsrO1xuICAgICAgICAgICAgLy8gRmlyaW5nIG5ldyBlbmFibGVkIHRyYW5zaXRpb25zXG4gICAgICAgICAgICB0b0ZpcmUuZm9yRWFjaCh0ckluZGV4ID0+IHtcbiAgICAgICAgICAgICAgICBtYXJraW5nW3RyYW5zaXRpb25zW3RySW5kZXhdLm91dHB1dF0gPSAxO1xuICAgICAgICAgICAgICAgIGZpcmVkVHJhbnNpdGlvbnNbdHJJbmRleF0gPSAxO1xuICAgICAgICAgICAgICAgIGZpcmVkQ291bnQrKztcbiAgICAgICAgICAgICAgICByb2xlT3JkZXJbdHJhbnNpdGlvbnNbdHJJbmRleF0ub3V0cHV0XSA9IGxldmVsO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC8vIEV2ZXJ5IHRyYW5zaXRpb24gYWxyZWFkeSBmaXJlZCwgbm8gZGVhZCB0cmFuc2l0aW9uXG4gICAgICAgICAgICBpZihmaXJlZENvdW50ID09PSB0cmFuc2l0aW9ucy5sZW5ndGgpXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpcmVkQ291bnQgPCB0cmFuc2l0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGxldCBpbnZhbGlkID0gJyc7XG4gICAgICAgICAgICBmb3IgKGxldCBba2V5LCB2YWx1ZV0gb2YgcG9saWN5LnJvbGVJbmRleE1hcCkgeyBcbiAgICAgICAgICAgICAgICBpZihtYXJraW5nW3ZhbHVlXSAhPT0gMSkgXG4gICAgICAgICAgICAgICAgICAgIGludmFsaWQgKz0gJ1snICsga2V5ICsgJ10gJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93ICdSb2xlcyAnICsgaW52YWxpZCArICdjYW5ub3QgYmUgbm9taW5hdGVkJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTdWNjZXNzLCB0aGUgcG9saWN5IGlzIGNvbnNpc3RlbnQuIFJvbGUgcHJlY2VkZW5jZTonKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKDAgKyAnOiAnICsgcG9saWN5LmNhc2VDcmVhdG9yKTtcbiAgICAgICAgICAgIGZvcihsZXQgaSA9IDE7IGkgPD0gbGV2ZWw7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBpbkxldmVsID0gJyc7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgW2tleSwgdmFsdWVdIG9mIHBvbGljeS5yb2xlSW5kZXhNYXApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYocm9sZU9yZGVyW3ZhbHVlXSA9PT0gaSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGluTGV2ZWwgKz0ga2V5ICsgJyAnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpICsgJzogJyArIGluTGV2ZWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc29sZS5sb2coJy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgICAgIC8vLyAgICAgU01BUlQgQ09OVFJBQ1QgR0VORVJBVElPTiAgICAgICAgLy8vXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgICAgICAgICBcbiAgICAgICAgLy8gKDEpIEJpdFNldCBPcGVyYXRpb25zXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGxldCBiaXRBcnJheVRvSW50ZWdlciA9IChiaXRhcnJheSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmKGJpdGFycmF5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9ICcwYic7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSBiaXRhcnJheS5sZW5ndGggLSAxOyBpID49IDA7IGktLSlcbiAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gYml0YXJyYXlbaV0gPyAnMScgOiAnMCc7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgQmlnTnVtYmVyKHJlc3VsdCkudG9GaXhlZCgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnMCc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgcm9sZU1hc2sgPSAocm9sZUlkKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYocG9saWN5LnJvbGVJbmRleE1hcC5oYXMocm9sZUlkKSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgYml0YXJyYXkgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgYml0YXJyYXlbcG9saWN5LnJvbGVJbmRleE1hcC5nZXQocm9sZUlkKV0gPSAxO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYml0QXJyYXlUb0ludGVnZXIoYml0YXJyYXkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnMCc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgbm9taW5hdG9yTWFzayA9IChzdGF0ZW1lbnRMaXN0LCBub21pbmF0b3IpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgYml0YXJyYXkgPSBbXTtcbiAgICAgICAgICAgICAgICBzdGF0ZW1lbnRMaXN0LmZvckVhY2goc3RhdGVtZW50ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYoc3RhdGVtZW50Lm5vbWluYXRvciA9PT0gbm9taW5hdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBiaXRhcnJheVtwb2xpY3kucm9sZUluZGV4TWFwLmdldChzdGF0ZW1lbnQubm9taW5lZSldID0gMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgcmV0dXJuIGJpdEFycmF5VG9JbnRlZ2VyKGJpdGFycmF5KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGRpc2p1bmN0aW9uU2V0TWFzayA9IChkaXNqdW5jdGlvblNldCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBtYXNrQXJyYXkgPSBbXTtcbiAgICAgICAgICAgICAgICBkaXNqdW5jdGlvblNldC5jb25qdW5jdGlvblNldHMuZm9yRWFjaChhbmRTZXQgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgYml0YXJyYXkgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgYW5kU2V0LnJvbGVzLmZvckVhY2gocm9sZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBiaXRhcnJheVtwb2xpY3kucm9sZUluZGV4TWFwLmdldChyb2xlKV0gPSAxOyAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgbWFza0FycmF5LnB1c2goYml0QXJyYXlUb0ludGVnZXIoYml0YXJyYXkpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWFza0FycmF5O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgZGlzanVuY3Rpb25TZXRKb2luTWFzayA9IChkaXNqdW5jdGlvblNldCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBiaXRhcnJheSA9IFtdO1xuICAgICAgICAgICAgICAgIGRpc2p1bmN0aW9uU2V0LmNvbmp1bmN0aW9uU2V0cy5mb3JFYWNoKGFuZFNldCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGFuZFNldC5yb2xlcy5mb3JFYWNoKHJvbGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgYml0YXJyYXlbcG9saWN5LnJvbGVJbmRleE1hcC5nZXQocm9sZSldID0gMTsgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGJpdEFycmF5VG9JbnRlZ2VyKGJpdGFycmF5KTtcbiAgICAgICAgICAgIH0gXG5cbiAgICAgICAgICAgIGxldCBzdGF0ZW1lbnRNYXNrID0gKHN0YXRlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBiaXRhcnJheSA9IFtdO1xuICAgICAgICAgICAgICAgIGJpdGFycmF5W3BvbGljeS5yb2xlSW5kZXhNYXAuZ2V0KHN0YXRlbWVudC5ub21pbmF0b3IpXSA9IDE7XG4gICAgICAgICAgICAgICAgYml0YXJyYXlbcG9saWN5LnJvbGVJbmRleE1hcC5nZXQoc3RhdGVtZW50Lm5vbWluZWUpXSA9IDE7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGJpdEFycmF5VG9JbnRlZ2VyKGJpdGFycmF5KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGVuZG9yc2VtZW50UmVxdWlyZWRNYXNrID0gKHN0YXRlbWVudHMpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgbWFza0FycmF5ID0gW107XG4gICAgICAgICAgICAgICAgc3RhdGVtZW50cy5mb3JFYWNoKHN0YXRlbWVudCA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGF0ZW1lbnQuZW5kb3JzZW1lbnRDb25zdHJhaW50ICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXNrQXJyYXkucHVzaChzdGF0ZW1lbnRNYXNrKHN0YXRlbWVudCkpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBtYXNrQXJyYXk7XG4gICAgICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAgICAgbGV0IGNvZGVHZW5lcmF0aW9uSW5mbyA9IHtcbiAgICAgICAgICAgICAgICBwb2xpY3lOYW1lOiBwb2xpY3lOYW1lLFxuICAgICAgICAgICAgICAgIHJvbGVJbmRleDogKHJvbGVJZCkgPT4gcG9saWN5LnJvbGVJbmRleE1hcC5nZXQocm9sZUlkKSxcbiAgICAgICAgICAgICAgICBjcmVhdG9yTWFzazogcm9sZU1hc2socG9saWN5LmNhc2VDcmVhdG9yKSxcbiAgICAgICAgICAgICAgICBzdGF0ZW1lbnRNYXNrOiAoc3RhdGVtZW50KSA9PiBzdGF0ZW1lbnRNYXNrKHN0YXRlbWVudCksXG4gICAgICAgICAgICAgICAgbm9taW5hdGlvblN0YXRlbWVudHM6IHBvbGljeS5ub21pbmF0aW9uU3RhdGVtZW50cyxcbiAgICAgICAgICAgICAgICBub21pbmF0aW9uTWFzazogKG5vbWluYXRvciwgc3RhdGVtZW50cykgPT4gbm9taW5hdG9yTWFzayhzdGF0ZW1lbnRzLCBub21pbmF0b3IpLFxuICAgICAgICAgICAgICAgIGRpc2p1bmN0aW9uU2V0Sm9pbk1hc2s6IChkaXNqdW5jdGlvblNldCkgPT4gZGlzanVuY3Rpb25TZXRKb2luTWFzayhkaXNqdW5jdGlvblNldCksXG4gICAgICAgICAgICAgICAgZGlzanVuY3Rpb25TZXRNYXNrOiAoZGlzanVuY3Rpb25TZXQpID0+IGRpc2p1bmN0aW9uU2V0TWFzayhkaXNqdW5jdGlvblNldCksXG4gICAgICAgICAgICAgICAgZW5kb3JzZW1lbnRSZXF1aXJlZE1hc2s6IChzdGF0ZW1lbnRzKSA9PiBlbmRvcnNlbWVudFJlcXVpcmVkTWFzayhzdGF0ZW1lbnRzKSxcbiAgICAgICAgICAgICAgICByZWxlYXNlU3RhdGVtZW50czogcG9saWN5LnJlbGVhc2VTdGF0ZW1lbnRzXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHBvbGljeS5zb2xpZGl0eSA9IHBvbGljeTJzb2xUZW1wbGF0ZShjb2RlR2VuZXJhdGlvbkluZm8pO1xuICAgICAgICAgICAgcmVzb2x2ZShwb2xpY3kpO1xuICAgICAgICAgICAgXG4gICAgICAgIH0gY2F0Y2goZXgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvcjogJywgZXgpO1xuICAgICAgICAgICAgcmVqZWN0KG5ldyBQb2xpY3koKSk7XG4gICAgICAgIH1cblxuICAgIH0pXG4gICAgXG59XG5cblxuXG5cblxuXG5cbiJdfQ==