import gql from "graphql-tag";
import fragment from './fragment'

export default gql`
  mutation Process(
    $creator : String!
    $creatorRole: String!
    $model: String!
    $registry: String!
  ) {
    process(
      modelId: $model
      registry: $registry
      creator: $creator
      creatorRole: $creatorRole
    ) {
      ...ProcessFragment
    }
  }
  ${fragment('ProcessFragment')}
`
