import gql from "graphql-tag";

export default gql`
  mutation RoleTask(
    $policy : String!
    $model: String!
    $registry: String!
  ) {
    roleTask(
      registry: $registry
      rootProc: $model
      policyId: $policy
    ) {
      _id
      address
      solidityCode
      abi
      bytecode
    }
  }
`
