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
  registry,
  element,
  instanceState,
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
        element={element}
        registry={registry}
        instanceState={instanceState}
      >
        {JSON.stringify(data)}
      </Form>  
    )}
    </Mutation>


export default WorkItem
