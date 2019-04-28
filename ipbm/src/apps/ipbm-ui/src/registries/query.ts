import gql from "graphql-tag"

export default gql`
  query Registries($registryId: String)
    {
      registries(_id: $registryId) {
        _id
        address
        solidityCode
        gasUsed
        abi
        bytecode
        _v
      }
    }
`
