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
      from: '',
      parameters: [],
    }
  },
  handleSubmit: (
    o,
    {
      props: {
        element,
        instanceState: {
          workItems,
        },
        registry,
        mutate,
      }
    }
    ) => {
    const refs = workItems
      .find(
        ({
          elementId,
        }: { elementId: any}
        ) =>
          elementId === element.id,
      ).refs
    mutate({
        variables: {
          id: refs[0].index.toString(),
          registry: registry,
          worklist: refs[0].worklistAddress,
          ...o,
        },
      })
  }
})
