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
            creator: '0x4Fb071E73eAFEf84B4f5CD012C4f07f007B93ADD',
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
