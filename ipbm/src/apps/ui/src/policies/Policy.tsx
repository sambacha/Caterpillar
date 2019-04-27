import React from 'react'
import {
  Query,
} from 'react-apollo'
import {
  Route,
  Switch,
} from 'react-router-dom'
import fourOFour from '../util/four-o-four'

import query from './query'
import Data from './types/Data'
import QueryVariables from './types/Query-Variables'

const Policy: React.FC<{
  match: any
}> =
  ({
    match: {
      params: {
        policy,
        registry,
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
              variables={{ policy, registry }}
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
