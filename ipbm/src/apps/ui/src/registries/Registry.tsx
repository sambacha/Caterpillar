import React from 'react';
import {
  Query,
} from 'react-apollo';

import { Route } from 'react-router-dom';

import { Link } from 'react-router-relative-link'

import Models from '../models/Models'
import Policies from '../policies/Policies'
import Policy from '../policies/Policy'
import Processes from '../processes/Processes'
import Process from '../processes/Process'

import AddPolicy from '../policies/Add-Policy'
import AddModel from '../models/Add-Model'
import query from './query'

const Registry: React.FC<{ match: any }> = ({ match: { params: { registry }, url, path } }) => {
  return (
    <Query
      query={query}
      variables={{ _id: registry }}
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
            !loading && registries && <div
              style={{
                whiteSpace: 'pre'
              }}
            >
              <Link to='.'>.</Link>
              <Link to='./models'>models</Link>
              <Link to='./models-add'>+</Link>
              <Link to='./policies'>policies</Link>
              <Link to='./policies-add'>+</Link>
              <Link to='./processes'>processes</Link>
              <Route
                exact
                path={url}
                render={
                  () => <div>
                      {registries[0].solidityCode}
                    </div>
                }
              />
              <Route
                path={`${url}/models-add`}
                render={
                  () =>
                    <AddModel
                      registry={registries[0].address}
                    />
                }
              />
              <Route
                path={`${path}/models`}
                component={Models}
              />
              <Route
                path={`${url}/policies-add`}
                render={
                  () =>
                    <AddPolicy
                      registry={registries[0].address}
                    />
                }
              />
              <Route
                exact
                path={`${path}/policies`}
                component={Policies}
              />
              <Route
                path={`${path}/policies/:policy`}
                component={Policy}
              />
              <Route
                exact
                path={`${path}/processes`}
                component={Processes}
              />
              <Route
                path={`${path}/processes/:process`}
                component={Process}
              />
              
              
            </div>
          ) || null
      }
    </Query>
  );
}

export default Registry;
