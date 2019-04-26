import React from 'react';
import {
  compose,
  withState,
} from 'recompose'
import { withFormik, FormikProps } from 'formik'

import Props from './Props'
import Mutate from './Mutate'

interface SetFileProps {
  file: string,
  setFile: (state: string) => string,
}

const Form: React.StatelessComponent<
  Props &
    Mutate &
    SetFileProps &
    FormikProps<{}>
> = ({
  children,
  file,
  handleSubmit,
  setFile,
  registry
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
              const reader = new FileReader();
              reader.onload = function(e) {
                setFile((reader.result && reader.result.toString()) || '')
              };  
              reader.readAsText(evt.target.files[0]);
            }
          }
        }
      />
      <button type="submit">Add Policy</button>
      {children}
    </form>

export default compose<
  Props &
    Mutate &
    SetFileProps &
    FormikProps<{}>,
  Props &
    Mutate
>
  (
  withState<
    Props &
      Mutate,
    string,
    string,
    string
  >('file', 'setFile', ''),
  withFormik<
    Props &
      Mutate &
      SetFileProps,
    {}
  >({
    handleSubmit: (
      _,
      {
        props: {
          registry,
          add,
          file,
        },
      },
    ) => {
      add({
        variables: {
          registry,
          model: file,
        }
      })
    }
  }),
)(Form);
