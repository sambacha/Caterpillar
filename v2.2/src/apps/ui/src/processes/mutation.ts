import gql from "graphql-tag";

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
      id
    }
  }
`
