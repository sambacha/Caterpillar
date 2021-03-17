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

const Models: React.FC<
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
              variables={{ registryId }}
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
                      {JSON.stringify(data.registries[0].models, null, 2)}
                      {
                          data.registries[0].models
                            .map(
                              (
                                {
                                  _id,
                                  bpmn,
                                  name,
                                  policyId,
                                  taskRoleId,
                                }
                              ) =>(
                                <div key={_id}>
                                  <Link
                                    to={`./${_id}`}
                                  >
                                    {name}
                                  </Link>
                                  <div>
                                    {policyId}
                                    :
                                    {taskRoleId}
                                  </div>
                                  <Viewer
                                    id={_id}
                                    model={bpmn}
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
        path={`${path}/:modelId`}
        component={Model}
      />
    </>

export default Models;
