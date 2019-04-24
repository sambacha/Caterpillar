import React, { ReactNode } from 'react';
import {
  Query,
  Mutation,
  MutationResult,
  MutationFn,
} from 'react-apollo';
import { withState } from 'recompose'

import mutation from './mutation'

const AddProcess: React.StatelessComponent<{
  model: string,
  registryAddress: string,
}> = ({
  model,
  registryAddress
}) =>
<Mutation
mutation={mutation}
>
{(
  add: MutationFn,
  { data }: MutationResult<any>,
): ReactNode => (
  <div>
    {JSON.stringify(data)}
    <form
      onSubmit={e => {
        e.preventDefault();
        add({
          variables: {
            registry: registryAddress,
            model,
            creatorRole: 'Customer',
            creator: '0x6D4E74CdA0b4aa5eA86b3d30153850B11F90E9A9',
          }
        });
      }}
    >
      <button type="submit">Add Process</button>
    </form>
  </div>
)}
</Mutation>

export default AddProcess
