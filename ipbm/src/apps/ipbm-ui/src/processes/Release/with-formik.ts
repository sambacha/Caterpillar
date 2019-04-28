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
        mutate,
      },
    }
  ) => {
    mutate({
      variables: {
        processAddress,
        registryAddress,
        ...values,
      },
    })
  }
})