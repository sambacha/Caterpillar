import gql from "graphql-tag"
import fragment from '../fragment'

export default gql`
  mutation WorkItem(
    $id: String!
    $registryAddress: String!
    $worklist: String!
    $from: String!
    $parameters: [String]!
  ) {
    workItem(
      id: $id
      registryAddress: $registryAddress
      worklist: $worklist
      from: $from
      parameters: $parameters
    ) {
      ...ProcessFragment
    }
  }
  ${fragment('ProcessFragment')}
`
