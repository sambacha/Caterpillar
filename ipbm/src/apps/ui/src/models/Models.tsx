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
import Viewer from './Viewer'
import Data from './types/Data'
import QueryVariables from './types/Query-Variables'
import Model from './Model'

const Models: React.FC<RouteComponentProps<{ registry: string }>> =
  ({
    match: {
      params: {
        registry,
      },
      path,
      url,
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
                    !loading && data && data.registries[0] && data.registries[0].models &&
                      <div
                        style={{
                          whiteSpace: 'pre'
                        }}
                      >
                      {
                          data.registries[0].models
                            .map(
                              (model: any) =>(
                                <div key={model.id}>
                                  <Link
                                    to={`./${model.id}`}
                                  >
                                    {model.name}
                                  </Link>
                                  <div>
                                    {model.taskRoleId}
                                  </div>
                                  <Viewer
                                    id={model.id}
                                    model={model.bpmn}
                                  />
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
        path={`${path}/:model`}
        component={Model}
      />
    </>

export default Models;
