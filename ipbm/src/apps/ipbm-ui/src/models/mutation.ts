import gql from "graphql-tag";

export default gql`
  mutation Model(
    $registryAddress: String!
    $bpmn: String!
  ) {
    model(
      registryAddress: $registryAddress,
      bpmn: $bpmn
    ) {
      id
    }
  }
`
