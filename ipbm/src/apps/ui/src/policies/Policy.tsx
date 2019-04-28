import React from 'react'
import {
  Query,
} from 'react-apollo'
import {
  Route,
  Switch,
  RouteComponentProps,
} from 'react-router-dom'
import fourOFour from '../util/four-o-four'

import query from './query'
import Data from './types/Data'
import QueryVariables from './types/Query-Variables'

const Policy: React.FC<
  RouteComponentProps<
    {
      policy: string
      registryId: string
    }
  >
> =
  ({
    match: {
      params: {
        policy,
        registryId,
      },
      url,
    },
  }) => {
  return (
    <Switch>
      <Route
        exact
        path={url}
        render={
          () =>
            <Query<Data, QueryVariables>
              query={query}
              variables={{
                policy,
                registryId,
              }}
            >
              {
                ({
                  data,
                  loading,
                }) =>
                  (
                    !loading && data && data.registries[0] && data.registries[0].policies && <div
                      style={{
                        whiteSpace: 'pre'
                      }}
                    >
                      {JSON.stringify(data.registries[0].policies, null, 2)}
                      {data.registries[0].policies[0].solidityCode}
                    </div>
                  ) || null
              }
            </Query>
        }
      />
      <Route
        component={fourOFour({ url })}
      />
    </Switch>
  )
}

export default Policy
