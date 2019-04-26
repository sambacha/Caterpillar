import gql from "graphql-tag";
import fragment from '../fragment'

export default gql`
  mutation WorkItem(
    $id: String!
    $registry: String!
    $worklist: String!
    $from: String!
    $parameters: [String]!
  ) {
    workItem(
      id: $id
      registry: $registry
      worklist: $worklist
      from: $from
      parameters: $parameters
    ) {
      ...ProcessFragment
    }
  }
  ${fragment('ProcessFragment')}
`
