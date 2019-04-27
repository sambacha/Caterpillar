import React from 'react';
import {
  FormikProps,
} from 'formik'
import Props from './Props' 
import FormValues from './Form-Values'
import FormField from '../../util/Form-Field'
import withFormik from './with-formik'

const Form: React.StatelessComponent<
  Props &
    FormikProps<FormValues>
> = ({
  handleChange,
  handleSubmit,
  errors,
  touched,
  instanceState,
}) =>
  <form
    onSubmit={handleSubmit}
    style={{
      whiteSpace: 'pre'
    }}
  >
    {JSON.stringify(instanceState.workItems, null, 2)}

    
    {
      instanceState
        .workItems[0]
        .input
        .map(
          ({ name }: { name: any }, index: any) =>
            <FormField
              key={`parameters.${name}`}
              label={name}
              name={`parameters.${index}`}
              handleChange={handleChange}
              errors={errors}
              touched={touched}
            />        
        )

    }
    <FormField
      name="froms"
      handleChange={handleChange}
      errors={errors}
      touched={touched}
    />
    {touched.from && errors.from && <div>{errors.from}</div>}
    <button
      type="submit"
    >
      Add WorkItem
    </button>
  </form>

export default withFormik(Form)
