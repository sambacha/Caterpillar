import gql from "graphql-tag"

export default gql`
  mutation Policy(
    $registryId: String!
    $policyModel: String!
  ) {
    policy(
      registryId: $registryId,
      policyModel: $policyModel
    ) {
      _id
      address
      registryId
      policyModel
      solidityCode
      abi
      bytecode
      indexToRole
      accessControlAbi
      accessControlBytecode
    }
  }
`
