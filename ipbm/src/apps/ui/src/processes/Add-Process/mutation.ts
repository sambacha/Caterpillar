import gql from "graphql-tag";
import fragment from '../fragment'

export default gql`
  mutation Process(
    $creator : String!
    $creatorRole: String!
    $model: String!
    $registryAddress: String!
  ) {
    process(
      modelId: $model
      registry: $registryAddress
      creator: $creator
      creatorRole: $creatorRole
    ) {
      ...ProcessFragment
    }
  }
  ${fragment('ProcessFragment')}
`
