"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/* babel-plugin-inline-import './types/Instance-State.gql' */
const InstanceState = "type InstanceState {\n  address: String\n  bpmn: String\n  workItems: [WorkItem]\n}\n";

/* babel-plugin-inline-import './types/Model.gql' */
const Model = "type Model {\n  id: String\n  name: String\n  bpmn: String\n  solidity: String,\n  policyId: String\n  taskRoleId: String\n}\n";

/* babel-plugin-inline-import './types/Mutation.gql' */
const Mutation = "# The \"Mutation\" type is the root of all GraphQL mutations.\ntype Mutation {\n  registry: Registry,\n  model(\n    bpmn: String!\n    registry: String!\n  ): Model\n  process(\n    modelId: String!\n    registry: String!\n    creator: String!\n    creatorRole: String!\n  ): ProcessContract\n  policy(\n    model: String!\n    registry: String!\n  ): Policy\n  roleTask(\n    policyId : String!\n    rootProc: String!\n    registry: String!\n  ): RoleTask\n  workItem(\n    id: String!\n    registry: String!\n    worklist: String!\n    from: String!\n    parameters: [String]!\n  ): ProcessContract\n  nominate(\n    pcase: String!\n    registry: String!\n    nominator: String!\n    nominatorRole: String!\n    nominee: String!\n    nomineeRole: String!\n  ): ProcessContract\n  release(\n    pcase: String!\n    registry: String!\n    nominator: String!\n    nominatorRole: String!\n    nomineeRole: String!\n  ): ProcessContract\n  voteNominate(\n    isAccepted: Boolean!\n    pcase: String!\n    registry: String!\n    endorser: String!\n    endorserRole: String!\n    nominatorRole: String!\n    nomineeRole: String!\n  ): ProcessContract\n  voteRelease(\n    isAccepted: Boolean!\n    pcase: String!\n    registry: String!\n    endorser: String!\n    endorserRole: String!\n    nominatorRole: String!\n    nomineeRole: String!\n  ): ProcessContract\n}";

/* babel-plugin-inline-import './types/Policy.gql' */
const Policy = "type Policy {\n  _id: String\n  address: String\n  model: String\n  solidityCode: String\n  abi: String\n  bytecode: String\n  indexToRole: [String]\n  accessControlAbi: String\n  accessControlBytecode: String\n}\n";

/* babel-plugin-inline-import './types/Process.gql' */
const Process = "type Process {\n  _id: String\n  rootProcessID: String\n  rootProcessName: String\n  bpmnModel: String\n  solidityCode: String\n  abi: String\n  bytecode: String\n  indexToElement: [ProcessElement]\n  worklistAbi: String\n}\n";

/* babel-plugin-inline-import './types/Process-Contract.gql' */
const ProcessContract = "type ProcessContract {\n  id: String\n  name: String\n  address: String\n  instanceState: InstanceState\n  resources(role: String): [RoleBinding]\n  policyId: String\n  runtimePolicyAddress: String\n}\n";

/* babel-plugin-inline-import './types/Process-Element.gql' */
const ProcessElement = "type ProcessElement {\n  role: String\n  type: String\n  id: String\n  name: String\n}\n";

/* babel-plugin-inline-import './types/Query.gql' */
const Query = "# The \"Query\" type is the root of all GraphQL queries.\ntype Query {\n  accounts: [String]\n  processes(\n    _id: String\n  ): [Process]\n  registries(\n    _id: String\n  ): [Registry]\n  roleTasks(\n    _id: String\n  ): [RoleTask]\n}\n";

/* babel-plugin-inline-import './types/Registry.gql' */
const Registry = "# Comments in GraphQL are defined with the hash (#) symbol.\ntype Registry {\n  _id: String\n  address: String\n  solidityCode: String\n  gasUsed: Int\n  abi: String\n  bytecode: String\n  _v: Int\n  processes(\n    address: String\n  ): [ProcessContract]\n  models(\n    id: String\n  ): [Model]\n  policies(\n    _id: String\n  ): [Policy]\n}\n";

/* babel-plugin-inline-import './types/RoleBinding.gql' */
const RoleBinding = "enum RoleBindingEnum {\n  UNDEFINED\n  BOUND\n  UNBOUND\n  NOMINATED\n  RELEASING\n}\ntype RoleBinding {\n  role: String\n  binding: RoleBindingEnum\n}\n";

/* babel-plugin-inline-import './types/Role-Task.gql' */
const RoleTask = "type RoleTask {\n  _id: String\n  address: String\n  solidityCode: String\n  abi: String\n  bytecode: String\n}\n";

/* babel-plugin-inline-import './types/Work-Item.gql' */
const WorkItem = "type WorkItem {\n  worklistAddress: String\n  bundleId: String\n  elementId: String,\n  elementName: String,\n  input: [WorkItemInput]\n  refs: [WorkItemRef]\n}\n";

/* babel-plugin-inline-import './types/Work-Item-Ref.gql' */
const WorkItemRef = "type WorkItemRef {\n  worklistAddress: String\n  index: Int\n  processAddress: String,\n}\n";

/* babel-plugin-inline-import './types/Work-Item-Input.gql' */
const WorkItemInput = "type WorkItemInput {\n  name: String\n}\n";
var _default = [InstanceState, Model, Mutation, Policy, RoleBinding, ProcessContract, ProcessElement, Process, Query, Registry, RoleTask, WorkItem, WorkItemRef, WorkItemInput];
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2FwcC9zY2hlbWEvdHlwZS1kZWZzLnRzIl0sIm5hbWVzIjpbIkluc3RhbmNlU3RhdGUiLCJNb2RlbCIsIk11dGF0aW9uIiwiUG9saWN5IiwiUm9sZUJpbmRpbmciLCJQcm9jZXNzQ29udHJhY3QiLCJQcm9jZXNzRWxlbWVudCIsIlByb2Nlc3MiLCJRdWVyeSIsIlJlZ2lzdHJ5IiwiUm9sZVRhc2siLCJXb3JrSXRlbSIsIldvcmtJdGVtUmVmIiwiV29ya0l0ZW1JbnB1dCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2VBZWUsQ0FDYkEsYUFEYSxFQUViQyxLQUZhLEVBR2JDLFFBSGEsRUFJYkMsTUFKYSxFQUtiQyxXQUxhLEVBTWJDLGVBTmEsRUFPYkMsY0FQYSxFQVFiQyxPQVJhLEVBU2JDLEtBVGEsRUFVYkMsUUFWYSxFQVdiQyxRQVhhLEVBWWJDLFFBWmEsRUFhYkMsV0FiYSxFQWNiQyxhQWRhLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSW5zdGFuY2VTdGF0ZSBmcm9tICcuL3R5cGVzL0luc3RhbmNlLVN0YXRlLmdxbCdcbmltcG9ydCBNb2RlbCBmcm9tICcuL3R5cGVzL01vZGVsLmdxbCdcbmltcG9ydCBNdXRhdGlvbiBmcm9tICcuL3R5cGVzL011dGF0aW9uLmdxbCdcbmltcG9ydCBQb2xpY3kgZnJvbSAnLi90eXBlcy9Qb2xpY3kuZ3FsJ1xuaW1wb3J0IFByb2Nlc3MgZnJvbSAnLi90eXBlcy9Qcm9jZXNzLmdxbCdcbmltcG9ydCBQcm9jZXNzQ29udHJhY3QgZnJvbSAnLi90eXBlcy9Qcm9jZXNzLUNvbnRyYWN0LmdxbCdcbmltcG9ydCBQcm9jZXNzRWxlbWVudCBmcm9tICcuL3R5cGVzL1Byb2Nlc3MtRWxlbWVudC5ncWwnXG5pbXBvcnQgUXVlcnkgZnJvbSAnLi90eXBlcy9RdWVyeS5ncWwnXG5pbXBvcnQgUmVnaXN0cnkgZnJvbSAnLi90eXBlcy9SZWdpc3RyeS5ncWwnXG5pbXBvcnQgUm9sZUJpbmRpbmcgZnJvbSAnLi90eXBlcy9Sb2xlQmluZGluZy5ncWwnXG5pbXBvcnQgUm9sZVRhc2sgZnJvbSAnLi90eXBlcy9Sb2xlLVRhc2suZ3FsJ1xuaW1wb3J0IFdvcmtJdGVtIGZyb20gJy4vdHlwZXMvV29yay1JdGVtLmdxbCdcbmltcG9ydCBXb3JrSXRlbVJlZiBmcm9tICcuL3R5cGVzL1dvcmstSXRlbS1SZWYuZ3FsJ1xuaW1wb3J0IFdvcmtJdGVtSW5wdXQgZnJvbSAnLi90eXBlcy9Xb3JrLUl0ZW0tSW5wdXQuZ3FsJ1xuXG5leHBvcnQgZGVmYXVsdCBbXG4gIEluc3RhbmNlU3RhdGUsXG4gIE1vZGVsLFxuICBNdXRhdGlvbixcbiAgUG9saWN5LFxuICBSb2xlQmluZGluZyxcbiAgUHJvY2Vzc0NvbnRyYWN0LFxuICBQcm9jZXNzRWxlbWVudCxcbiAgUHJvY2VzcyxcbiAgUXVlcnksXG4gIFJlZ2lzdHJ5LFxuICBSb2xlVGFzayxcbiAgV29ya0l0ZW0sXG4gIFdvcmtJdGVtUmVmLFxuICBXb3JrSXRlbUlucHV0LFxuXVxuIl19