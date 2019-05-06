import gql from "graphql-tag"
import fragment from '../fragment'

export default gql`
  mutation Process(
    $creator : String!
    $creatorRole: String!
    $modelId: String!
    $registryAddress: String!
  ) {
    process(
      modelId: $modelId
      registryAddress: $registryAddress
      creator: $creator
      creatorRole: $creatorRole
    ) {
      ...ProcessFragment
    }
  }
  ${fragment('ProcessFragment')}
`
