import React from 'react';
import {
  Query,
} from 'react-apollo';
import {
  Route,
} from 'react-router-dom'
import { Link } from 'react-router-relative-link'
import query from './query'
import Data from './types/Data'
import QueryVariables from './types/Query-Variables'
import Process from './Process'

const Processes: React.FC<{
  match: any
}> =
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
        }
      />
      <Route
        path={`${path}/:process`}
        component={Process}
      />
    </>
export default Processes;
