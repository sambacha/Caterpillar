import gql from "graphql-tag";

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
        processes(
          address: $process
        ) {
          id
          name
          address
          #policyId
          #instanceState {
          #  bpmn,
          #  address,
          #  workItems {
          #    elementName
          #    hrefs
          #    input {
          #      name
          #    }
          #    bundleId
          #    elementId
          #    processAddress,
          #    worklistAddress
          #  }
          #}
          runtimePolicyAddress
        }
      }
    }
`
