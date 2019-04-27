"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var ejs = _interopRequireWildcard(require("ejs"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

/* babel-plugin-inline-import '../../../../../../templates/processRole2solArray.ejs' */
const procesRole2ArrsolEJS = "pragma solidity ^0.5.0;\n\ncontract <%= contractName %>_Contract {\n\n    function getRoleFromTask(uint taskIndex, bytes32 processId) public pure returns(uint) {\n<%  for (let [key, indexes] of Object.entries(processData)) { \n    let first = true; -%>\n        if (processId == '<%= key %>') {\n            uint[<%= indexes.length %>] memory I<%= key %> = [<% indexes.forEach(ind => { if (!first) { %>, <%= ind %><% } else { first = false; %>uint(<%= ind %>)<% } }) %>];\n            if(taskIndex < <%= indexes.length %>)\n                return I<%= key %>[taskIndex];\n        }\n<% } -%>\n        return 0;\n    }\n}";
let procesRole2solArrTemplate = ejs.compile(procesRole2ArrsolEJS);

var _default = ({
  contractName,
  processData
}) => procesRole2solArrTemplate({
  contractName,
  processData
});

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvbXV0YXRpb24vcm9sZS10YXNrL2RlcGxveW1lbnQvZHluYW1pYy1iaW5kaW5nL3ZhbGlkYXRpb25fY29kZV9nZW4vZ2VuZXJhdGUtcm9sZS10YXNrLWNvbnRyYWN0LnRzIl0sIm5hbWVzIjpbInByb2Nlc1JvbGUyc29sQXJyVGVtcGxhdGUiLCJlanMiLCJjb21waWxlIiwicHJvY2VzUm9sZTJBcnJzb2xFSlMiLCJjb250cmFjdE5hbWUiLCJwcm9jZXNzRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7Ozs7QUFHQSxJQUFJQSx5QkFBeUIsR0FBR0MsR0FBRyxDQUFDQyxPQUFKLENBQVlDLG9CQUFaLENBQWhDOztlQUVlLENBQUM7QUFDZEMsRUFBQUEsWUFEYztBQUVkQyxFQUFBQTtBQUZjLENBQUQsS0FJYkwseUJBQXlCLENBQUM7QUFDeEJJLEVBQUFBLFlBRHdCO0FBRXhCQyxFQUFBQTtBQUZ3QixDQUFELEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBlanMgZnJvbSBcImVqc1wiXG5pbXBvcnQgcHJvY2VzUm9sZTJBcnJzb2xFSlMgZnJvbSAnLi4vLi4vLi4vLi4vLi4vLi4vdGVtcGxhdGVzL3Byb2Nlc3NSb2xlMnNvbEFycmF5LmVqcydcblxubGV0IHByb2Nlc1JvbGUyc29sQXJyVGVtcGxhdGUgPSBlanMuY29tcGlsZShwcm9jZXNSb2xlMkFycnNvbEVKUyk7XG5cbmV4cG9ydCBkZWZhdWx0ICh7XG4gIGNvbnRyYWN0TmFtZSxcbiAgcHJvY2Vzc0RhdGFcbiB9KSA9PlxuICBwcm9jZXNSb2xlMnNvbEFyclRlbXBsYXRlKHtcbiAgICBjb250cmFjdE5hbWUsXG4gICAgcHJvY2Vzc0RhdGFcbiAgfSkiXX0=