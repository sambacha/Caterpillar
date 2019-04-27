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
            creator: '0xeF6a1229F4aaA1cA27442A7eB34D1A19a7E98350',
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
