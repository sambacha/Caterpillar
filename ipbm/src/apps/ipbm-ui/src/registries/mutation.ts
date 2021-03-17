import gql from "graphql-tag"

export default gql`
  mutation Registry {
    registry {
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