import React from 'react'
import FormField from './Form-Field'

const FormFields: React.FunctionComponent<{
  handleChange: any
  names: string[]
  touched: any
  errors: any
}> = ({
  names,
  ...rest
}) =>
  <>
  {
    names
      .map(
        name =>
          <FormField
            key={name}
            name={name}
            {...rest}
          />
      )
    }
  </>
export default FormFields
