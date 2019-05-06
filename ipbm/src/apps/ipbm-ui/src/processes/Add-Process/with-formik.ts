import {
  withFormik,
} from 'formik'
import Props from './Props' 
import Mutate from './Mutate'
import FormValues from './Form-Values'

export default withFormik<
  Props &
    Mutate,
  FormValues
>({
  mapPropsToValues: (props) => {
    return {
      creator: '',
      creatorRole: '',
    }
  },
  handleSubmit: (
    values,
    {
      props: {
        registryAddress,
        modelId,
        mutate,
      },
    }
  ) => {
    mutate({
      variables: {
        modelId,
        registryAddress,
        ...values,
      },
    })
  }
})