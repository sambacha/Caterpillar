import React from 'react';
import {
  Query,
} from 'react-apollo';
import gql from "graphql-tag";

const query = gql`
  {
    accounts
  }
`

const Accounts: React.FC = () => {
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

export default Accounts;
