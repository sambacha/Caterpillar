import Props from './Props'
import FormValues from './Form-Values'

export default interface Mutate {
  mutate: (
    props: {
      variables: Props & FormValues
    },
  ) => any,
}