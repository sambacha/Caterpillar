import gql from "graphql-tag"

export default gql`
  query Policies(
    $registryId: String,
    $policy: String
  )
    {
      registries(
        _id: $registryId
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
