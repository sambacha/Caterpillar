import gql from "graphql-tag"

export default gql`
  mutation RoleTask(
    $policy : String!
    $model: String!
    $registryAddress: String!
  ) {
    roleTask(
      registryAddress: $registryAddress
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
