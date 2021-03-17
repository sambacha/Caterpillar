import React from 'react'
import {
  FormikProps,
} from 'formik'
import Props from './Props' 
import FormValues from './Form-Values'
import FormFields from '../../util/Form-Fields'
import withFormik from './with-formik'

const Form: React.FunctionComponent<
  Props &
    FormikProps<FormValues>
> = ({
  handleChange,
  handleSubmit,
  errors,
  touched,
}) =>
  <form
    onSubmit={handleSubmit}
    style={{
      whiteSpace: 'pre'
    }}
  >
    <FormFields
      names={[
        'nominator',
        'nominee',
        'nomineeRole',
      ]}
      handleChange={handleChange}
      errors={errors}
      touched={touched}
    />
    <button type="submit">Nominate</button>
  </form>

export default withFormik(Form)
