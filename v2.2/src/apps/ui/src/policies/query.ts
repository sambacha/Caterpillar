import gql from "graphql-tag";

export default gql`
  query Policies(
    $registry: String,
    $policy: String
  )
    {
      registries(
        _id: $registry
      ) {
        _id
        policies(
          _id: $policy
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
    }
`
