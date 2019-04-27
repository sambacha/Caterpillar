import React, { ReactNode } from 'react'
import {
  Mutation,
} from 'react-apollo';
import mutation from './mutation'
import Data from '../types/Data'
import Form from './Form'

import Props from './Props'
import Add from './Mutate'

const WorkItem: React.StatelessComponent<
  Props
> = ({
  registryAddress,
  processAddress,
}) =>
  <Mutation<Data>
    mutation={mutation}
    >
    {(
      mutate,
      { data },
    ): ReactNode => (
      <Form
        nominate={mutate}
        processAddress={processAddress}
        registryAddress={registryAddress}
      >
        {JSON.stringify(data)}
      </Form>  
    )}
    </Mutation>


export default WorkItem
