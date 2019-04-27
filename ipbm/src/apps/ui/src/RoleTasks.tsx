import React from 'react';
import {
  Query,
} from 'react-apollo';
import gql from "graphql-tag";

const query = gql`
  {
    roleTasks {
      _id
      abi
      address
      bytecode
      solidityCode
    }
  }
`

const RoleTasks: React.FC = () => {
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
  );
}

export default RoleTasks;
