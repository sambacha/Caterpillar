import React from 'react';
import {
  Query,
} from 'react-apollo';
import { Link } from 'react-router-relative-link'
import query from './query'
import Data from './types/Data'
import QueryVariables from './types/QueryVariables'

const Processes: React.FC<{
  match: any
}> =
  ({
    match: {
      params: {
        registry,
      },
    },
  }) =>
    <Query<Data, QueryVariables>
      query={query}
      variables={{ registry }}
    >
      {
        ({
          data,
          loading,
        }) =>
          (
            !loading && data && data.registries[0] &&
              <div
                style={{
                  whiteSpace: 'pre'
                }}
              >
              {JSON.stringify(
                data
                .registries[0]
                .processes
                .map(({ address }) => address)
              )}
              {
                  data
                    .registries[0]
                    .processes
                    .map(
                      (process: any) =>(
                        <div key={process.address}>
                          <Link
                            to={`./${process.address}`}
                          >
                            to
                          </Link>
                          {JSON.stringify(process, null, 2)}
                        </div>
                      )
                    )

                }
              </div>
          ) || null
      }
    </Query>

export default Processes;
