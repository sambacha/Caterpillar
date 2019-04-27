import React, { ReactNode } from 'react'
import {
  Mutation,
  MutationResult,
  MutationFn,
} from 'react-apollo'

import mutation from './mutation'

const Registries: React.FC = () =>
  <Mutation
    mutation={mutation}
  >
    {(
      add: MutationFn,
      { data }: MutationResult<any>,
    ): ReactNode => (
      <div>
        <form
          onSubmit={e => {
            e.preventDefault()
            add()
          }}
        >
          {JSON.stringify(data)}
            <button type="submit">Add Registry</button>
        </form>
      </div>
    )}
  </Mutation>

export default Registries
