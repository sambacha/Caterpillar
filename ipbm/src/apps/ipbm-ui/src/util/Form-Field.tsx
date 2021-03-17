import React from 'react'
import {
  Field,
} from 'formik'

const FormField: React.FunctionComponent<{
  handleChange: any
  name: string
  label?: string
  touched: any
  errors: any
}> = (
  {
    handleChange,
    name,
    label,
    touched,
    errors,
  } 
) => <div>
  <Field
      type="text"
      name={name}
      onChange={handleChange}
    />
    <label>{label || name}</label>
    {touched[name] && errors[name] && <div>{errors[name]}</div>}
</div>

export default FormField
