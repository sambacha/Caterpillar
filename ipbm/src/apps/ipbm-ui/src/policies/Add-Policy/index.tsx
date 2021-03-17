import React, { ReactNode } from 'react'
import {
  Mutation,
} from 'react-apollo'
import Data from '../types/Data'
import mutation from '../mutation'
import Form from './Form'
import Props from './Props'

const AddPolicy: React.FunctionComponent<
  Props
> = ({
  registryId
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
        registryId={registryId}
      >
        {JSON.stringify(data)}
      </Form>  
    )}
  </Mutation>

export default AddPolicy
