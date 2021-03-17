import React from 'react';
import ApolloClient from 'apollo-boost';
import {
  ApolloProvider,
} from 'react-apollo';

import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import { Link } from 'react-router-relative-link'
import {
  InMemoryCache,
  defaultDataIdFromObject,
} from 'apollo-cache-inmemory';

import Accounts from './Accounts'

import Registries from './registries/Registries'
import AddRegistry from './registries/Add-Registry'
import fourOFour from './util/four-o-four'
import './App.css'
import './font-awesome'

const client = new ApolloClient({
  cache: new InMemoryCache({
    dataIdFromObject: (object: any) => {
      if(object.__typename ==='ProcessContract') {
        return object.address
      }
      return defaultDataIdFromObject(object)
    }
  }),
  uri: "http://localhost:6500/graphql"
});


const App: React.FC = () => {
  return (
    <Router>
      <Link
        to='./'
      >
        <h1>Caterpillar</h1>
      </Link>
      <Link
        to='./accounts'
      >
        accounts
      </Link>
      <Link
        to='./registries'
      >
        registries
      </Link>
      <Link
        to='./registries-add'
      >
        +
      </Link>
      <ApolloProvider
        client={client}
      >
        <Switch>
          <Route
            path='/accounts'
            component={Accounts}
          />
          <Route
            exact
            path='/registries-add'
            component={AddRegistry}
          />
          <Route
            path='/registries'
            component={Registries}
          />
          <Route
            component={fourOFour({ url: '/' })}
          />
        </Switch>
      </ApolloProvider>
    </Router>
  );
}

export default App;
