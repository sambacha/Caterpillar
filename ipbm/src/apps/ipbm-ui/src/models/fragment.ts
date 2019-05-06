import gql from "graphql-tag"

export default (name: string) => gql`
  fragment ${name} on Model {
    _id
    registryId
    name
    rootProcessId
    bpmn
    solidity
    policyId
    taskRoleId
  }
`
