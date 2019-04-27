import gql from "graphql-tag";

export default gql`
  query Models($registry: String, $model: String)
    {
      registries(_id: $registry) {
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
