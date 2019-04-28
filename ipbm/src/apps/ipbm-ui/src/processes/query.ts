import gql from "graphql-tag"
import fragment from './fragment'

export default gql`
  query Policies(
    $registryId: String,
    $process: String
  )
    {
      registries(
        _id: $registryId
      ) {
        _id
        address,
        processes(
          address: $process
        ) {
          ...ProcessFragment
        }
      }
    }
    ${fragment('ProcessFragment')}
`
