import gql from "graphql-tag";
import fragment from './fragment'

export default gql`
  query Models(
    $registryId: String,
    $modelId: String
  )
    {
      registries(_id: $registryId) {
        _id
        address
        models(_id: $modelId) {
          ...Model
        }
      }
    }
    ${fragment('Model')}
`
