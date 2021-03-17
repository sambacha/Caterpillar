import React from 'react'
import {
  Query,
} from 'react-apollo'
import { Link } from 'react-router-relative-link'
import {
  Route,
  RouteComponentProps,
} from 'react-router-dom'
import Registry from './Registry'

import query from './query'

const Registries: React.FC<
  RouteComponentProps
> = ({
  match: {
    path,
  }
}) => {
  return (
    <>
      <Route
        exact
        path={path}
        render={
          () =>
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
                      registries
                        .map(
                          ({
                            address,
                            _id
                          }) =>(
                            <div key={_id}>
                              <Link
                                to={`./${_id}`}
                              >
                                {_id}:{address}
                              </Link>
                            </div>
                          )
                        )
                  ) || null
              }
            </Query>
        }
      />
      <Route
        path={`${path}/:registryId`}
        component={Registry}
      />
    </>
  )
}

export default Registries
