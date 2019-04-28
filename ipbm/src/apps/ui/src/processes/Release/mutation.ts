import gql from "graphql-tag";
import fragment from '../fragment'

export default gql`
  mutation WorkItem(
    $processAddress: String!
    $registryAddress: String!
    $nominator: String!
    $nominatorRole: String!
    $nominee: String!
    $nomineeRole: String!
  ) {
    nominate(
      processAddress: $processAddress
      registryAddress: $registryAddress
      nominator: $nominator
      nominatorRole: $nominatorRole
      nominee: $nominee
      nomineeRole: $nomineeRole
    ) {
      ...ProcessFragment
    }
  }
  ${fragment('ProcessFragment')}
`
