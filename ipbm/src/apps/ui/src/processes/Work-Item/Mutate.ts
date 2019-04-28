import FormValues from './Form-Values'

export default interface Mutate {
  mutate: (
    props: {
      variables: FormValues &
        {
          registryAddress: string
          from: string
          id: string
          worklist: string
        }
    },
  ) => any,
}