import React from 'react';
import {
  Query,
} from 'react-apollo';
import { Link } from 'react-router-relative-link'
import query from './query'
import Data from './types/Data'
import QueryVariables from './types/QueryVariables'

const Policies: React.FC<{
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
              {
                  data
                    .registries[0]
                    .policies
                    .map(
                      (policy: any) =>(
                        <div key={policy._id}>
                          <Link
                            to={`./${policy._id}`}
                          >
                            to
                          </Link>
                          {JSON.stringify(policy, null, 2)}
                        </div>
                      )
                    )

                }
              </div>
          ) || null
      }
    </Query>

export default Policies;
