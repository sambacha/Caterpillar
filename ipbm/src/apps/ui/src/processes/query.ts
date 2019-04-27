import gql from "graphql-tag"
import fragment from './fragment'

export default gql`
  query Policies(
    $registry: String,
    $process: String
  )
    {
      registries(
        _id: $registry
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
