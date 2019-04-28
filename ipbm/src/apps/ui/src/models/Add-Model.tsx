import React, { ReactNode } from 'react';
import {
  Mutation,
  MutationResult,
  MutationFn,
} from 'react-apollo';
import { withState } from 'recompose'

import mutation from './mutation'
import Modeler from './Modeler'
import emptyBpmn from './empty-bpmn'
import Data from './types/Data'

const AddModel: React.FunctionComponent<{
  registryAddress: string,
} & {
  file: string,
  setFile: (state: string) => string,
}> = ({
  file,
  setFile,
  registryAddress,
}) =>
  <Mutation<Data>
    mutation={mutation}
  >
    {(
      add: MutationFn,
      { data }: MutationResult<any>,
    ): ReactNode => (
      <div>
        <form
          onSubmit={e => {
            e.preventDefault();
          }}
        >
          <div>
            <Modeler
              model={file}
              save={
                (bpmn: string) => add({
                  variables: {
                    registryAddress,
                    bpmn,
                  }
                })
              }
            />
          </div>
          <input
            type="file"
            id="upload-file"
            onChange={
              evt => {
                if (evt.target.files) {
                  var reader = new FileReader();

                  reader.onload = function(e) {
                    setFile((reader.result && reader.result.toString()) || '')
                    console.log(e && e.target)
                  };
        
                  reader.readAsText(evt.target.files[0]);
                }
              }
            }
          />
        </form>
      </div>
    )}
  </Mutation>

export default withState('file', 'setFile', emptyBpmn)(AddModel)
