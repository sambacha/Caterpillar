import React from 'react'
import {
  Query,
} from 'react-apollo'
import gql from "graphql-tag"

const query = gql`
  {
    policies {
      _id
      abi
      model
      address
      bytecode
      indexToRole
      solidityCode
      accessControlAbi
      accessControlBytecode
    }
  }
`

const Policies: React.FC = () => {
  return (
    <Query
      query={query}
    >
      {
        ({
          data
        }: {
          data: any
        }) =>
          <div
            style={{
              whiteSpace: 'pre'
            }}
          >
            {JSON.stringify(data, null, 2)}
          </div>
      }
    </Query>
  )
}

export default Policies
