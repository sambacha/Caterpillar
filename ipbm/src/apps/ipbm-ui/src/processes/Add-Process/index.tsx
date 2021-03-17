import React, { ReactNode } from 'react'
import {
  Mutation,
} from 'react-apollo'
import mutation from './mutation'
import Data from '../types/Data'
import Form from './Form'

import Props from './Props'

const WorkItem: React.FunctionComponent<
  Props
> = ({
  registryAddress,
  modelId,
}) =>
  <Mutation<Data>
    mutation={mutation}
    >
    {(
      mutate,
      { data },
    ): ReactNode => (
      <Form
        mutate={mutate}
        modelId={modelId}
        registryAddress={registryAddress}
      >
        {JSON.stringify(data)}
      </Form>  
    )}
    </Mutation>


export default WorkItem
