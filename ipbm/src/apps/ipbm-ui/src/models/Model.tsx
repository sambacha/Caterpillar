import React from 'react';
import {
  Query,
} from 'react-apollo';

import {
  Route,
  Switch,
  RouteComponentProps,
} from 'react-router-dom';

import { Link } from 'react-router-relative-link'

import query from './query'
import Viewer from './Viewer'

import Data from './types/Data'
import QueryVariables from './types/Query-Variables'

import AddRoleTask from '../role-tasks/Add-Role-Task'
import AddProcess from '../processes/Add-Process'
import fourOFour from '../util/four-o-four'

const Model: React.FC<
  RouteComponentProps<
    {
      modelId: string
      registryId: string
    }
  >
> =
  ({
    match: {
      params: {
        modelId,
        registryId,
      },
      path,
      url,
    },
  }) =>
    <Query<Data, QueryVariables>
      query={query}
      variables={{
        modelId,
        registryId,
      }}
    >
      {
        ({
          data,
          loading,
        }) =>
          ( !loading && data && data.registries[0] &&
            data.registries[0].models &&
            <Switch>
              <Route
                exact
                path={url}
                render={
                  () =>
                    <div
                      style={{
                        whiteSpace: 'pre'
                      }}
                    >
                      <Link to='.'>.</Link>
                      <div>
                        {data.registries[0].models[0].policyId}
                        :
                        {data.registries[0].models[0].taskRoleId}
                      </div>
                      <Link
                        to={`${url}/role-task-add`}
                      >
                        add role task
                      </Link>
                      <Link
                        to={`${url}/process-add`}
                      >
                        add process
                      </Link>
                      {JSON.stringify(data.registries[0].models[0])}
                      <Viewer
                        id={data.registries[0].models[0].id}
                        model={data.registries[0].models[0].bpmn}
                      />
                      <div>
                        {data.registries[0].models[0].solidity}
                      </div>
                    </div>
                }
              />
              <Route
                path={`${url}/role-task-add`}
                render={
                  () =>
                    <AddRoleTask
                      modelId={modelId}
                      registryId={data.registries[0]._id}
                      registryAddress={data.registries[0].address}
                    />
                }
              />
              <Route
                path={`${url}/process-add`}
                render={
                  () =>
                    <AddProcess
                      modelId={modelId}
                      registryAddress={data.registries[0].address}
                    />
                }
              />
              
              <Route
                component={fourOFour({ url })}
              />
            </Switch>
      ) || null
    }
  </Query>

export default Model;
