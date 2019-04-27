import React from 'react'
import {
  Route,
  Switch,
} from 'react-router-dom';

import { Link } from 'react-router-relative-link'

const HereIfNot: React.FunctionComponent<{
  url: string
}> = ({
  children,
  url,
}) =>
  <Switch>
    <Route
      exact
      path={url}
    />
    <Route
      render={
        () =>
          <Link
            to={url}
          >
            {children}
          </Link>
      }
    />
  </Switch>

export default HereIfNot
