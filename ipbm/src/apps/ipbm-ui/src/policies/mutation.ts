import gql from "graphql-tag"

export default gql`
  mutation Policy(
    $registryAddress: String!
    $policyModel: String!
  ) {
    policy(
      registryAddress: $registryAddress,
      policyModel: $policyModel
    ) {
      _id
      address
      registryAddress
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
