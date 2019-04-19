"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

/* babel-plugin-inline-import './types/Instance-State.gql' */
var InstanceState = "type InstanceState {\n  bpmn: String\n  workItems: [WorkItem]\n}\n";

/* babel-plugin-inline-import './types/Model.gql' */
var Model = "type Model {\n  id: String\n  name: String\n  bpmn: String\n  solidity: String\n}\n";

/* babel-plugin-inline-import './types/Mutation.gql' */
var Mutation = "# The \"Mutation\" type is the root of all GraphQL mutations.\ntype Mutation {\n  addRegistry: Registry,\n  addModel(\n    bpmn: String\n    registry: String\n  ): Model\n}";

/* babel-plugin-inline-import './types/Policy.gql' */
var Policy = "type Policy {\n  address: String\n  model: String\n  solidityCode: String\n  abi: String\n  bytecode: String\n  indexToRole: [String]\n  accessControlAbi: String\n  accessControlBytecode: String\n}\n";

/* babel-plugin-inline-import './types/Process.gql' */
var Process = "type Process {\n  rootProcessID: String\n  rootProcessName: String\n  bpmnModel: String\n  solidityCode: String\n  abi: String\n  bytecode: String\n  indexToElement: [ProcessElement]\n  worklistAbi: String\n}\n";

/* babel-plugin-inline-import './types/Process-Contract.gql' */
var ProcessContract = "type ProcessContract {\n  id: String\n  name: String\n  address: String\n  instanceState: InstanceState\n  resources(role: String): [RoleBinding]\n}\n";

/* babel-plugin-inline-import './types/Process-Element.gql' */
var ProcessElement = "type ProcessElement {\n  role: String\n  type: String\n  id: String\n  name: String\n}\n";

/* babel-plugin-inline-import './types/Query.gql' */
var Query = "# The \"Query\" type is the root of all GraphQL queries.\ntype Query {\n  accounts: [String]\n  policies: [Policy]\n  processes: [Process]\n  registries: [Registry]\n  roleTasks: [RoleTask]\n}\n";

/* babel-plugin-inline-import './types/Registry.gql' */
var Registry = "# Comments in GraphQL are defined with the hash (#) symbol.\ntype Registry {\n  _id: String\n  address: String\n  solidityCode: String\n  gasUsed: Int\n  abi: String\n  bytecode: String\n  _v: Int\n  processes: [ProcessContract]\n  models: [Model]\n}\n";

/* babel-plugin-inline-import './types/RoleBinding.gql' */
var RoleBinding = "enum RoleBindingEnum {\n  UNDEFINED\n  BOUND\n  UNBOUND\n  NOMINATED\n  RELEASING\n}\ntype RoleBinding {\n  role: String\n  binding: RoleBindingEnum\n}\n";

/* babel-plugin-inline-import './types/Role-Task.gql' */
var RoleTask = "type RoleTask {\n  address: String\n  solidityCode: String\n  abi: String\n  bytecode: String\n}\n";

/* babel-plugin-inline-import './types/Work-Item.gql' */
var WorkItem = "type WorkItem {\n  bundleId: String\n  elementId: String,\n  elementName: String,\n  hrefs: [String],\n  input: [WorkItemInput]\n  pcases: [String],\n  processAddress: String,\n}\n";

/* babel-plugin-inline-import './types/Work-Item-Input.gql' */
var WorkItemInput = "type WorkItemInput {\n  name: String\n}\n";
var _default = [InstanceState, Model, Mutation, Policy, RoleBinding, ProcessContract, ProcessElement, Process, Query, Registry, RoleTask, WorkItem, WorkItemInput];
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2FwcC9zY2hlbWEvdHlwZS1kZWZzLnRzIl0sIm5hbWVzIjpbIkluc3RhbmNlU3RhdGUiLCJNb2RlbCIsIk11dGF0aW9uIiwiUG9saWN5IiwiUm9sZUJpbmRpbmciLCJQcm9jZXNzQ29udHJhY3QiLCJQcm9jZXNzRWxlbWVudCIsIlByb2Nlc3MiLCJRdWVyeSIsIlJlZ2lzdHJ5IiwiUm9sZVRhc2siLCJXb3JrSXRlbSIsIldvcmtJdGVtSW5wdXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztlQWNlLENBQ2JBLGFBRGEsRUFFYkMsS0FGYSxFQUdiQyxRQUhhLEVBSWJDLE1BSmEsRUFLYkMsV0FMYSxFQU1iQyxlQU5hLEVBT2JDLGNBUGEsRUFRYkMsT0FSYSxFQVNiQyxLQVRhLEVBVWJDLFFBVmEsRUFXYkMsUUFYYSxFQVliQyxRQVphLEVBYWJDLGFBYmEsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBJbnN0YW5jZVN0YXRlIGZyb20gJy4vdHlwZXMvSW5zdGFuY2UtU3RhdGUuZ3FsJ1xuaW1wb3J0IE1vZGVsIGZyb20gJy4vdHlwZXMvTW9kZWwuZ3FsJ1xuaW1wb3J0IE11dGF0aW9uIGZyb20gJy4vdHlwZXMvTXV0YXRpb24uZ3FsJ1xuaW1wb3J0IFBvbGljeSBmcm9tICcuL3R5cGVzL1BvbGljeS5ncWwnXG5pbXBvcnQgUHJvY2VzcyBmcm9tICcuL3R5cGVzL1Byb2Nlc3MuZ3FsJ1xuaW1wb3J0IFByb2Nlc3NDb250cmFjdCBmcm9tICcuL3R5cGVzL1Byb2Nlc3MtQ29udHJhY3QuZ3FsJ1xuaW1wb3J0IFByb2Nlc3NFbGVtZW50IGZyb20gJy4vdHlwZXMvUHJvY2Vzcy1FbGVtZW50LmdxbCdcbmltcG9ydCBRdWVyeSBmcm9tICcuL3R5cGVzL1F1ZXJ5LmdxbCdcbmltcG9ydCBSZWdpc3RyeSBmcm9tICcuL3R5cGVzL1JlZ2lzdHJ5LmdxbCdcbmltcG9ydCBSb2xlQmluZGluZyBmcm9tICcuL3R5cGVzL1JvbGVCaW5kaW5nLmdxbCdcbmltcG9ydCBSb2xlVGFzayBmcm9tICcuL3R5cGVzL1JvbGUtVGFzay5ncWwnXG5pbXBvcnQgV29ya0l0ZW0gZnJvbSAnLi90eXBlcy9Xb3JrLUl0ZW0uZ3FsJ1xuaW1wb3J0IFdvcmtJdGVtSW5wdXQgZnJvbSAnLi90eXBlcy9Xb3JrLUl0ZW0tSW5wdXQuZ3FsJ1xuXG5leHBvcnQgZGVmYXVsdCBbXG4gIEluc3RhbmNlU3RhdGUsXG4gIE1vZGVsLFxuICBNdXRhdGlvbixcbiAgUG9saWN5LFxuICBSb2xlQmluZGluZyxcbiAgUHJvY2Vzc0NvbnRyYWN0LFxuICBQcm9jZXNzRWxlbWVudCxcbiAgUHJvY2VzcyxcbiAgUXVlcnksXG4gIFJlZ2lzdHJ5LFxuICBSb2xlVGFzayxcbiAgV29ya0l0ZW0sXG4gIFdvcmtJdGVtSW5wdXQsXG5dXG4iXX0=