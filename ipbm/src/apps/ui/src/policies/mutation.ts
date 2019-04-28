import gql from "graphql-tag"

export default gql`
  mutation Policy(
    $registryAddress: String!
    $model: String!
  ) {
    policy(
      registryAddress: $registryAddress,
      model: $model
    ) {
      _id
      address
      model
      solidityCode
      abi
      bytecode
      indexToRole
      accessControlAbi
      accessControlBytecode
    }
  }
`
