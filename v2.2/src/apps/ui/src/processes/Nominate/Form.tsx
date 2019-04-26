import React from 'react';
import {
  withFormik,
  FormikProps,
  Field,
} from 'formik'
import Props from './Props' 
import Mutate from './Mutate'
import FormValues from './Form-Values'

const makeField = (
  {
    handleChange,
    name,
    touched,
    errors,
  }: {
    handleChange: any
    name: any
    touched: any
    errors: any
  } 
) => <div>
  <Field
      type="text"
      name={name}
      onChange={handleChange}
    />
    <label>{name}</label>
    {touched[name] && errors[name] && <div>{errors[name]}</div>}
</div>

const Form: React.StatelessComponent<
  Props &
    FormikProps<FormValues>
> = ({
  handleChange,
  handleSubmit,
  errors,
  touched,
  registryAddress,
  processAddress,
}) =>
  <form
    onSubmit={handleSubmit}
    style={{
      whiteSpace: 'pre'
    }}
  >
    {makeField(
      {
        name: 'nominator',
        handleChange,
        errors,
        touched
      }
    )}
    {makeField(
      {
        name: 'nominatorRole',
        handleChange,
        errors,
        touched
      }
    )}
    {makeField(
      {
        name: 'nominee',
        handleChange,
        errors,
        touched
      }
    )}
    {makeField(
      {
        name: 'nomineeRole',
        handleChange,
        errors,
        touched
      }
    )}
    <button type="submit">Nominate</button>
  </form>

export default withFormik<
  Props &
    Mutate,
  FormValues
>({
  mapPropsToValues: (props) => {
    return {
      nominator: '',
      nominatorRole: '',
      nominee: '',
      nomineeRole: '',
    }
  },
  handleSubmit: (
    values,
    {
      props: {
        registryAddress,
        processAddress,
        nominate,
      },
    }
  ) => {
    nominate({
      variables: {
        processAddress,
        registryAddress,
        ...values,
      },
    })
  }
})(Form)
