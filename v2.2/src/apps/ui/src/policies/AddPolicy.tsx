import React, { ReactNode } from 'react';
import {
  Mutation,
  MutationResult,
  MutationFn,
} from 'react-apollo';
import { withState } from 'recompose'

import mutation from './mutation'
import Data from './types/Data'


const AddPolicyy: React.StatelessComponent<{
  registry: string,
} & {
  file: string,
  setFile: (state: string) => string,
}> = ({
  file,
  setFile,
  registry
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
            add({
              variables: {
                registry,
                model: file,
              }
            });
          }}
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
          {JSON.stringify(data)}
          <button type="submit">Add Policy</button>
        </form>
      </div>
    )}
  </Mutation>

export default withState('file', 'setFile', '')(AddPolicyy);
