import gql from "graphql-tag";
import fragment from '../fragment'

export default gql`
  mutation WorkItem(
    $isAccepted: Boolean!
    $processAddress: String!
    $registryAddress: String!
    $endorser: String!
    $nominatorRole: String!
    $nominee: String!
    $nomineeRole: String!
  ) {
    nominate(
      processAddress: $processAddress
      registryAddress: $registryAddress
      endorser: $endorser
      nominatorRole: $nominatorRole
      nominee: $nominee
      nomineeRole: $nomineeRole
    ) {
      ...ProcessFragment
    }
  }
  ${fragment('ProcessFragment')}
`
