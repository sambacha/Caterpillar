import React from 'react';
import {
  Query,
} from 'react-apollo';


import {
  Route,
  Switch,
} from 'react-router-dom';

import { Link } from 'react-router-relative-link'

import query from './query'
import Viewer from './Viewer'

import Data from './types/Data'
import QueryVariables from './types/QueryVariables'

import AddRoleTask from '../role-tasks/AddRoleTask'
import AddProcess from '../processes/AddProcess'

const Model: React.FC<{
  match: any
}> =
  ({
    match: {
      params: {
        model,
        registry,
      },
      path,
      url,
    },
  }) =>
    <Query<Data, QueryVariables>
      query={query}
      variables={{ model, registry }}
    >
      {
        ({
          data,
          loading,
        }) =>
          ( !loading && data && data.registries[0] &&
            data.registries[0].models &&
            <div>
              r: {registry}
              m: {model}
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
                        model={model}
                        registry={data.registries[0]._id}
                        registryAddress={data.registries[0].address}
                      />
                  }
                />
                <Route
                  path={`${url}/process-add`}
                  render={
                    () =>
                      <AddProcess
                        model={model}
                        registryAddress={data.registries[0].address}
                      />
                  }
                />
                
                <Route
                  render={
                    () =>
                      <div>
                        <div>??</div>
                        <Link to='.'>..</Link>
                      </div>
                  }
                />
              </Switch>
            </div>  
      ) || null
    }
  </Query>

export default Model;
