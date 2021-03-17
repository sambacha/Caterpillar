import React from 'react'
import {
  Query,
} from 'react-apollo'
import {
  Route,
  RouteComponentProps,
} from 'react-router-dom'
import { Link } from 'react-router-relative-link'
import query from './query'
import Data from './types/Data'
import QueryVariables from './types/Query-Variables'
import Policy from './Policy'

const Policies: React.FC<
  RouteComponentProps<
    {
      registryId: string
    }
  >
> =
  ({
    match: {
      params: {
        registryId,
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
            variables={{
              registryId,
            }}
          >
            {
              ({
                data,
                loading,
              }) =>
                (
                  !loading &&
                    data &&
                    data.registries[0] &&
                    data
                      .registries[0]
                      .policies
                      .map(
                        ({
                          _id,
                          address,
                          policyModel,
                        }: any) =>(
                          <div key={_id}>
                            <Link
                              to={`./${_id}`}
                            >
                              {_id}: {address}
                            </Link>
                            <div>
                              {policyModel}
                            </div>
                          </div>
                        )
                      )
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
export default Policies
