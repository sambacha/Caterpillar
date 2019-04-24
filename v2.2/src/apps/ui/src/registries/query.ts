import gql from "graphql-tag";

export default gql`
  query Registries($_id: String)
    {
      registries(_id: $_id) {
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
