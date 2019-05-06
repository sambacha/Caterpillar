import React from 'react'
import {
  compose,
  withState,
} from 'recompose'
import { FormikProps } from 'formik'

import Props from './Props'
import FormValues from './Form-Values'
import Mutate from './Mutate'
import withFormik from './with-formik'
import SetFileProps from './Set-File-Props'

const Form: React.FunctionComponent<
  Props &
    FormValues &
    Mutate &
    SetFileProps &
    FormikProps<{}>
> = ({
  children,
  file,
  handleSubmit,
  setFile,
}) =>
    <form
      onSubmit={handleSubmit}
    >
      <div>
        <textarea
          style={{
            width: '100%',
            height: '100px',
          }}
          value={file}
          onChange={
            e => {
              setFile(e.target.value)
              console.log(e.target.value)
            }
          }
        />
      </div>
      <input
        type="file"
        id="upload-file"
        onChange={
          evt => {
            if (evt.target.files) {
              const reader = new FileReader()
              reader.onload = function(e) {
                setFile((reader.result && reader.result.toString()) || '')
              }  
              reader.readAsText(evt.target.files[0])
            }
          }
        }
      />
      <button type="submit">Add Policy</button>
      {children}
    </form>

export default withFormik(Form)
