import React, { ReactNode } from 'react';
import {
  Mutation,
  MutationResult,
  MutationFn,
} from 'react-apollo';

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
            creator: '0x2453e15Ba2655FD12830790bbc9f5d40eEe884A7',
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
