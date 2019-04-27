import React, { ReactNode } from 'react';
import {
  Mutation,
} from 'react-apollo';
import Data from '../types/Data'
import mutation from '../mutation'
import Form from './Form'
import Props from './Props'

const AddPolicy: React.FunctionComponent<
  Props
> = ({
  registry
}) =>
  <Mutation<Data>
    mutation={mutation}
  >
    {(
      add,
      { data },
    ): ReactNode => (
      <Form
        add={add}
        registry={registry}
      >
        {JSON.stringify(data)}
      </Form>  
    )}
  </Mutation>

export default AddPolicy;
