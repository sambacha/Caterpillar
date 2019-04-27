import React from 'react';
import {
  Query,
} from 'react-apollo';
import {
  Route,
  RouteComponentProps,
} from 'react-router-dom'
import { Link } from 'react-router-relative-link'
import query from './query'
import Data from './types/Data'
import QueryVariables from './types/Query-Variables'
import Policy from './Policy'

const Policies: React.FC<RouteComponentProps<{ registry: string }>> =
  ({
    match: {
      params: {
        registry,
      },
      path,
    },
  }) =>
    <>
      <Route
        exact
        path={path}
        render={
          () =>
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
        }
      />
      <Route
        path={`${path}/:policy`}
        component={Policy}
      />
    </>
export default Policies;
