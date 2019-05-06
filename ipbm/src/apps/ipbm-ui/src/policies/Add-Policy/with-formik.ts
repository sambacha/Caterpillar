import {
  withFormik,
  FormikProps,
} from 'formik'
import {
  compose,
  withState,
} from 'recompose'

import Props from './Props'
import Mutate from './Mutate'
import FormValues from './Form-Values'
import SetFileProps from './Set-File-Props'

export default compose<
  Props &
  FormValues &
  Mutate &
  SetFileProps &
  FormikProps<{}>,
  Props &
  Mutate
>
  (
    withState<
      Props &
      FormValues &
      Mutate,
      string,
      string,
      string
    >('file', 'setFile', ''),
    withFormik<
      Props &
      FormValues &
      Mutate &
      SetFileProps,
      {}
    >({
      handleSubmit: (
        _,
        {
          props: {
            registryId,
            mutate,
            file,
          },
        },
      ) => {
        mutate({
          variables: {
            registryId,
            policyModel: file,
          }
        })
      }
    }),
  )