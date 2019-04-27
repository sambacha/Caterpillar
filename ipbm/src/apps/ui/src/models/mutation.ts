import gql from "graphql-tag";

export default gql`
  mutation Model(
    $registry: String!
    $bpmn: String!
  ) {
    model(
      registry: $registry,
      bpmn: $bpmn
    ) {
      id
    }
  }
`
