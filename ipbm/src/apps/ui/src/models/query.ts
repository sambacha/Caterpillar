import gql from "graphql-tag";

export default gql`
  query Models(
    $registryId: String,
    $model: String
  )
    {
      registries(_id: $registryId) {
        _id
        address
        models(id: $model) {
          id
          name
          bpmn
          solidity
          policyId
          taskRoleId
        }
      }
    }
`
