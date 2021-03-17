import gql from "graphql-tag"

export default gql`
  mutation RoleTask(
    $policyId : String!
    $modelId: String!
    $registryAddress: String!
  ) {
    roleTask(
      registryAddress: $registryAddress
      modelId: $modelId
      policyId: $policyId
    ) {
      _id
      address
      solidityCode
      abi
      bytecode
    }
  }
`
