import React from 'react';
import {
  compose,
  withState,
} from 'recompose'
import {
  withFormik,
  FormikProps,
  Field,
} from 'formik'
import Props from './Props' 
import Mutate from './Mutate'
import FormValues from './Form-Values'

const Form: React.StatelessComponent<
  Props &
    FormikProps<FormValues>
> = ({
  element,
  handleChange,
  handleSubmit,
  errors,
  touched,
  instanceState,
  registry,
}) =>
  <form
    onSubmit={handleSubmit}
    style={{
      whiteSpace: 'pre'
    }}
  >
    {JSON.stringify(instanceState.workItems, null, 2)}
    {
      instanceState
        .workItems[0]
        .input
        .map(
          ({ name }: { name: any }, index: any) =>
            <Field
              key={name}
              type="text"
              name={`parameters.${index}`}
              onChange={handleChange}
            />        
        )

    }
    <Field
      type="text"
      name="address"
      onChange={handleChange}
    />
    {touched.address && errors.address && <div>{errors.address}</div>}
    <button type="submit">Add WorkItem</button>
  </form>

export default withFormik<
  Props &
    Mutate,
  FormValues
>({
  mapPropsToValues: (props) => {
    return {
      address: '',
      parameters: [],
    }
  },
  handleSubmit: (o, bag) => {
    console.log( bag
      .props
      .instanceState
      .workItems)
    console.log(bag.props.element.id)
    const refs = bag
      .props
      .instanceState
      .workItems
      .find(
        ({
          elementId,
        }: { elementId: any}
        ) =>
          elementId === bag.props.element.id,
      ).refs
    bag
      .props
      .add({
        variables: {
          id: refs[0].index.toString(),
          registry: bag.props.registry,
          from: o.address,
          parameters: o.parameters,
          worklist: refs[0].worklistAddress,
        },
      })
  }
})(Form)
