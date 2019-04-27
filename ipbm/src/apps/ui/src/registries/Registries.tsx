import React from 'react';
import {
  Query,
} from 'react-apollo';
import { Link } from 'react-router-relative-link'
import query from './query'

const Registries: React.FC = () => {
  return (
    <Query
      query={query}
    >
      {
        ({
          data: {
            registries
          } = {},
          loading,
        }: {
          data: {
            registries?: [any],
          },
          loading: boolean,
        }) =>
          (
            !loading && registries &&
              <div
                style={{
                  whiteSpace: 'pre'
                }}
              > {
                  registries
                    .map(
                      (registry) =>(
                        <div key={registry._id}>
                          <Link
                            to={`./${registry._id}`}
                          >to</Link>
                          {JSON.stringify(registry, null, 2)}
                        </div>
                      )
                    )

                }
                {JSON.stringify(registries, null, 2)}
              </div>
          ) || null
      }
    </Query>
  );
}

export default Registries;
