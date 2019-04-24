import gql from "graphql-tag";

export default gql`
  mutation Policy(
    $registry: String!
    $model: String!
  ) {
    policy(
      registry: $registry,
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
