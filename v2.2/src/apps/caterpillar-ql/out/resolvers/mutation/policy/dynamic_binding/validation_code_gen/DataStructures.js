"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConjunctionSet = exports.DisjunctionSet = exports.Statement = exports.Policy = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Policy {
  constructor() {
    _defineProperty(this, "caseCreator", undefined);

    _defineProperty(this, "roleIndexMap", new Map());

    _defineProperty(this, "roleCount", 0);

    _defineProperty(this, "nominationStatements", new Array());

    _defineProperty(this, "releaseStatements", new Array());

    _defineProperty(this, "solidity", undefined);
  }

  setCreator(caseCreator) {
    this.caseCreator = caseCreator;
    this.addRole(caseCreator);
  }

  addRole(roleId) {
    if (!this.roleIndexMap.has(roleId)) this.roleIndexMap.set(roleId, ++this.roleCount);
  }

  addNominationStatement(statement) {
    this.nominationStatements.push(statement);
  }

  addReleaseStatement(statement) {
    this.releaseStatements.push(statement);
  }

  print() {
    console.log('Roles: ');

    for (var [key, value] of this.roleIndexMap) {
      console.log(key + ': ' + value);
    }

    console.log('---------------------------');
    this.nominationStatements.forEach(value => {
      value.print();
      console.log('---------------------------');
    });
  }

}

exports.Policy = Policy;

class Statement {
  constructor() {
    _defineProperty(this, "nominator", void 0);

    _defineProperty(this, "nominee", void 0);

    _defineProperty(this, "bindingConstraint", undefined);

    _defineProperty(this, "endorsementConstraint", undefined);
  }

  print() {
    console.log('Nominator: ', this.nominator);
    console.log('Nominee: ', this.nominee);

    if (this.bindingConstraint !== undefined) {
      console.log('Binding Constraints ');
      this.bindingConstraint.print();
    }

    if (this.endorsementConstraint !== undefined) {
      console.log('Endorsement Constraints ');
      this.endorsementConstraint.print();
    }
  }

}

exports.Statement = Statement;

class DisjunctionSet {
  constructor() {
    _defineProperty(this, "isNegative", void 0);

    _defineProperty(this, "conjunctionSets", new Array());
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
    _defineProperty(this, "roles", new Array());
  }

  print() {
    console.log('    [' + this.roles.toString() + ']');
  }

}

exports.ConjunctionSet = ConjunctionSet;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvbXV0YXRpb24vcG9saWN5L2R5bmFtaWNfYmluZGluZy92YWxpZGF0aW9uX2NvZGVfZ2VuL0RhdGFTdHJ1Y3R1cmVzLnRzIl0sIm5hbWVzIjpbIlBvbGljeSIsInVuZGVmaW5lZCIsIk1hcCIsIkFycmF5Iiwic2V0Q3JlYXRvciIsImNhc2VDcmVhdG9yIiwiYWRkUm9sZSIsInJvbGVJZCIsInJvbGVJbmRleE1hcCIsImhhcyIsInNldCIsInJvbGVDb3VudCIsImFkZE5vbWluYXRpb25TdGF0ZW1lbnQiLCJzdGF0ZW1lbnQiLCJub21pbmF0aW9uU3RhdGVtZW50cyIsInB1c2giLCJhZGRSZWxlYXNlU3RhdGVtZW50IiwicmVsZWFzZVN0YXRlbWVudHMiLCJwcmludCIsImNvbnNvbGUiLCJsb2ciLCJrZXkiLCJ2YWx1ZSIsImZvckVhY2giLCJTdGF0ZW1lbnQiLCJub21pbmF0b3IiLCJub21pbmVlIiwiYmluZGluZ0NvbnN0cmFpbnQiLCJlbmRvcnNlbWVudENvbnN0cmFpbnQiLCJEaXNqdW5jdGlvblNldCIsImlzTmVnYXRpdmUiLCJjb25qdW5jdGlvblNldHMiLCJDb25qdW5jdGlvblNldCIsInJvbGVzIiwidG9TdHJpbmciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUNPLE1BQU1BLE1BQU4sQ0FBYTtBQUFBO0FBQUEseUNBQ01DLFNBRE47O0FBQUEsMENBRW9CLElBQUlDLEdBQUosRUFGcEI7O0FBQUEsdUNBR0ksQ0FISjs7QUFBQSxrREFJeUIsSUFBSUMsS0FBSixFQUp6Qjs7QUFBQSwrQ0FLc0IsSUFBSUEsS0FBSixFQUx0Qjs7QUFBQSxzQ0FNR0YsU0FOSDtBQUFBOztBQVFoQkcsRUFBQUEsVUFBVSxDQUFDQyxXQUFELEVBQXNCO0FBQzlCLFNBQUtBLFdBQUwsR0FBbUJBLFdBQW5CO0FBQ0EsU0FBS0MsT0FBTCxDQUFhRCxXQUFiO0FBQ0Q7O0FBQ0RDLEVBQUFBLE9BQU8sQ0FBQ0MsTUFBRCxFQUF3QjtBQUM3QixRQUFHLENBQUMsS0FBS0MsWUFBTCxDQUFrQkMsR0FBbEIsQ0FBc0JGLE1BQXRCLENBQUosRUFDRSxLQUFLQyxZQUFMLENBQWtCRSxHQUFsQixDQUFzQkgsTUFBdEIsRUFBOEIsRUFBRSxLQUFLSSxTQUFyQztBQUNIOztBQUNEQyxFQUFBQSxzQkFBc0IsQ0FBQ0MsU0FBRCxFQUE4QjtBQUNqRCxTQUFLQyxvQkFBTCxDQUEwQkMsSUFBMUIsQ0FBK0JGLFNBQS9CO0FBQ0Y7O0FBRURHLEVBQUFBLG1CQUFtQixDQUFDSCxTQUFELEVBQThCO0FBQy9DLFNBQUtJLGlCQUFMLENBQXVCRixJQUF2QixDQUE0QkYsU0FBNUI7QUFDRjs7QUFFQUssRUFBQUEsS0FBSyxHQUFHO0FBQ05DLElBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLFNBQVo7O0FBQ0EsU0FBSyxJQUFJLENBQUNDLEdBQUQsRUFBTUMsS0FBTixDQUFULElBQXlCLEtBQUtkLFlBQTlCLEVBQTRDO0FBQzFDVyxNQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWUMsR0FBRyxHQUFHLElBQU4sR0FBYUMsS0FBekI7QUFDRDs7QUFDREgsSUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksNkJBQVo7QUFDQSxTQUFLTixvQkFBTCxDQUEwQlMsT0FBMUIsQ0FBa0NELEtBQUssSUFBSTtBQUN6Q0EsTUFBQUEsS0FBSyxDQUFDSixLQUFOO0FBQ0FDLE1BQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLDZCQUFaO0FBQ0QsS0FIRDtBQUlEOztBQWxDZTs7OztBQXFDYixNQUFNSSxTQUFOLENBQWdCO0FBQUE7QUFBQTs7QUFBQTs7QUFBQSwrQ0FHaUJ2QixTQUhqQjs7QUFBQSxtREFJcUJBLFNBSnJCO0FBQUE7O0FBS25CaUIsRUFBQUEsS0FBSyxHQUFHO0FBQ05DLElBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLGFBQVosRUFBMkIsS0FBS0ssU0FBaEM7QUFDQU4sSUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksV0FBWixFQUF5QixLQUFLTSxPQUE5Qjs7QUFDQSxRQUFHLEtBQUtDLGlCQUFMLEtBQTJCMUIsU0FBOUIsRUFBd0M7QUFDckNrQixNQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxzQkFBWjtBQUNBLFdBQUtPLGlCQUFMLENBQXVCVCxLQUF2QjtBQUNGOztBQUNELFFBQUcsS0FBS1UscUJBQUwsS0FBK0IzQixTQUFsQyxFQUE0QztBQUMxQ2tCLE1BQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLDBCQUFaO0FBQ0EsV0FBS1EscUJBQUwsQ0FBMkJWLEtBQTNCO0FBQ0Y7QUFDRDs7QUFoQmtCOzs7O0FBbUJkLE1BQU1XLGNBQU4sQ0FBcUI7QUFBQTtBQUFBOztBQUFBLDZDQUVlLElBQUkxQixLQUFKLEVBRmY7QUFBQTs7QUFPMUJlLEVBQUFBLEtBQUssR0FBRztBQUNOQyxJQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxxQkFBWixFQUFtQyxLQUFLVSxVQUFMLEdBQWtCLFFBQWxCLEdBQTZCLElBQWhFO0FBQ0EsU0FBS0MsZUFBTCxDQUFxQlIsT0FBckIsQ0FBNkJELEtBQUssSUFBSTtBQUNwQ0EsTUFBQUEsS0FBSyxDQUFDSixLQUFOO0FBRUQsS0FIRDtBQUlEOztBQWJ5Qjs7OztBQWVyQixNQUFNYyxjQUFOLENBQXFCO0FBQUE7QUFBQSxtQ0FDSCxJQUFJN0IsS0FBSixFQURHO0FBQUE7O0FBRzFCZSxFQUFBQSxLQUFLLEdBQUc7QUFDTEMsSUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksVUFBVSxLQUFLYSxLQUFMLENBQVdDLFFBQVgsRUFBVixHQUFrQyxHQUE5QztBQUNGOztBQUx5QiIsInNvdXJjZXNDb250ZW50IjpbIlxuZXhwb3J0IGNsYXNzIFBvbGljeSB7XG4gICAgY2FzZUNyZWF0b3I6IHN0cmluZyA9IHVuZGVmaW5lZDtcbiAgICByb2xlSW5kZXhNYXA6IE1hcDxzdHJpbmcsIG51bWJlcj4gPSBuZXcgTWFwKCk7XG4gICAgcm9sZUNvdW50OiBudW1iZXIgPSAwO1xuICAgIG5vbWluYXRpb25TdGF0ZW1lbnRzOiBBcnJheTxTdGF0ZW1lbnQ+ID0gbmV3IEFycmF5KCk7XG4gICAgcmVsZWFzZVN0YXRlbWVudHM6IEFycmF5PFN0YXRlbWVudD4gPSBuZXcgQXJyYXkoKTtcbiAgICBzb2xpZGl0eTogc3RyaW5nID0gdW5kZWZpbmVkO1xuXG4gICAgc2V0Q3JlYXRvcihjYXNlQ3JlYXRvcjogc3RyaW5nKSB7XG4gICAgICB0aGlzLmNhc2VDcmVhdG9yID0gY2FzZUNyZWF0b3I7XG4gICAgICB0aGlzLmFkZFJvbGUoY2FzZUNyZWF0b3IpO1xuICAgIH1cbiAgICBhZGRSb2xlKHJvbGVJZDogc3RyaW5nKSA6IHZvaWQge1xuICAgICAgaWYoIXRoaXMucm9sZUluZGV4TWFwLmhhcyhyb2xlSWQpKVxuICAgICAgICB0aGlzLnJvbGVJbmRleE1hcC5zZXQocm9sZUlkLCArK3RoaXMucm9sZUNvdW50KTtcbiAgICB9XG4gICAgYWRkTm9taW5hdGlvblN0YXRlbWVudChzdGF0ZW1lbnQ6IFN0YXRlbWVudCkgOiB2b2lkIHtcbiAgICAgICB0aGlzLm5vbWluYXRpb25TdGF0ZW1lbnRzLnB1c2goc3RhdGVtZW50KTtcbiAgICB9XG5cbiAgICBhZGRSZWxlYXNlU3RhdGVtZW50KHN0YXRlbWVudDogU3RhdGVtZW50KSA6IHZvaWQge1xuICAgICAgdGhpcy5yZWxlYXNlU3RhdGVtZW50cy5wdXNoKHN0YXRlbWVudCk7XG4gICB9XG5cbiAgICBwcmludCgpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdSb2xlczogJylcbiAgICAgIGZvciAodmFyIFtrZXksIHZhbHVlXSBvZiB0aGlzLnJvbGVJbmRleE1hcCkge1xuICAgICAgICBjb25zb2xlLmxvZyhrZXkgKyAnOiAnICsgdmFsdWUpO1xuICAgICAgfVxuICAgICAgY29uc29sZS5sb2coJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpXG4gICAgICB0aGlzLm5vbWluYXRpb25TdGF0ZW1lbnRzLmZvckVhY2godmFsdWUgPT4ge1xuICAgICAgICB2YWx1ZS5wcmludCgpO1xuICAgICAgICBjb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJylcbiAgICAgIH0pXG4gICAgfVxuXG59XG5leHBvcnQgY2xhc3MgU3RhdGVtZW50IHtcbiAgICBub21pbmF0b3I6IHN0cmluZztcbiAgICBub21pbmVlOiBzdHJpbmc7XG4gICAgYmluZGluZ0NvbnN0cmFpbnQ6IERpc2p1bmN0aW9uU2V0ID0gdW5kZWZpbmVkO1xuICAgIGVuZG9yc2VtZW50Q29uc3RyYWludDogRGlzanVuY3Rpb25TZXQgPSB1bmRlZmluZWQ7XG4gICAgcHJpbnQoKSB7XG4gICAgICBjb25zb2xlLmxvZygnTm9taW5hdG9yOiAnLCB0aGlzLm5vbWluYXRvcik7XG4gICAgICBjb25zb2xlLmxvZygnTm9taW5lZTogJywgdGhpcy5ub21pbmVlKTtcbiAgICAgIGlmKHRoaXMuYmluZGluZ0NvbnN0cmFpbnQgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgICBjb25zb2xlLmxvZygnQmluZGluZyBDb25zdHJhaW50cyAnKTtcbiAgICAgICAgIHRoaXMuYmluZGluZ0NvbnN0cmFpbnQucHJpbnQoKTtcbiAgICAgIH1cbiAgICAgIGlmKHRoaXMuZW5kb3JzZW1lbnRDb25zdHJhaW50ICE9PSB1bmRlZmluZWQpe1xuICAgICAgICBjb25zb2xlLmxvZygnRW5kb3JzZW1lbnQgQ29uc3RyYWludHMgJyk7XG4gICAgICAgIHRoaXMuZW5kb3JzZW1lbnRDb25zdHJhaW50LnByaW50KCk7XG4gICAgIH1cbiAgICB9XG5cbiAgfVxuICBleHBvcnQgY2xhc3MgRGlzanVuY3Rpb25TZXQge1xuICAgIGlzTmVnYXRpdmU6IGJvb2xlYW47XG4gICAgY29uanVuY3Rpb25TZXRzOiBBcnJheTxDb25qdW5jdGlvblNldD4gPSBuZXcgQXJyYXkoKTtcblxuXG5cblxuICAgIHByaW50KCkge1xuICAgICAgY29uc29sZS5sb2coJyAgRGlzanVuY3Rpb24gU2V0OiAnLCB0aGlzLmlzTmVnYXRpdmUgPyAnTk9UIElOJyA6ICdJTicpO1xuICAgICAgdGhpcy5jb25qdW5jdGlvblNldHMuZm9yRWFjaCh2YWx1ZSA9PiB7XG4gICAgICAgIHZhbHVlLnByaW50KCk7XG5cbiAgICAgIH0pXG4gICAgfVxuICB9XG4gIGV4cG9ydCBjbGFzcyBDb25qdW5jdGlvblNldCB7XG4gICAgcm9sZXM6IEFycmF5PHN0cmluZz4gPSBuZXcgQXJyYXkoKTtcblxuICAgIHByaW50KCkge1xuICAgICAgIGNvbnNvbGUubG9nKCcgICAgWycgKyB0aGlzLnJvbGVzLnRvU3RyaW5nKCkgKyAnXScpXG4gICAgfVxuICB9XG5cblxuIl19