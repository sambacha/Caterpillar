import gql from "graphql-tag"

export default (name: string) => gql`
  fragment ${name} on ProcessContract {
    id
    name
    address
    policyId
    resources {
      role
      binding
    }
    instanceState {
      bpmn,
      workItems {
        elementName
        input {
          name
        }
        refs {
          index
          worklistAddress
          processAddress  
        }
        bundleId
        elementId
        worklistAddress
      }
    }
    runtimePolicyAddress
  }
`
