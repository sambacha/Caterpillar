import React, { FunctionComponent } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Link } from 'react-router-relative-link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default ({ url }: { url: string }): FunctionComponent<RouteComponentProps> =>
  ({ location: { pathname } }) => pathname !== url
    ? <div>
      <Link
        to={url}
      >
        <FontAwesomeIcon icon="meh-blank" />
      </Link>
    </div>
    : null
