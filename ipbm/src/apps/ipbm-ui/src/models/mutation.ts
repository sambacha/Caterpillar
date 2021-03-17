import gql from "graphql-tag";
import fragment from './fragment'

export default gql`
  mutation Model(
    $registryId: String!
    $bpmn: String!
  ) {
    model(
      registryId: $registryId,
      bpmn: $bpmn
    ) {
      _id
      ...Model
    }
  }
  ${fragment('Model')}
`
