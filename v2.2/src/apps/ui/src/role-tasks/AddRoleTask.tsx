import React, { ReactNode } from 'react';
import {
  Query,
  Mutation,
  MutationResult,
  MutationFn,
} from 'react-apollo';
import { withState } from 'recompose'

import mutation from './mutation'
import policiesQuery from '../policies/query'

import PoliciesData from '../policies/types/Data'
import PoliciesQueryVariables from '../policies/types/QueryVariables'

const AddRoleTask: React.StatelessComponent<{
  model: string,
  registry: string,
  registryAddress: string,
}> = ({
  model,
  registry,
  registryAddress
}) =>
  <Query<PoliciesData, PoliciesQueryVariables>
    query={policiesQuery}
    variables={{ registry }}
  >
    {
      ({
        data,
        loading,
      }) =>
        (
          !loading && data && data.registries[0] &&
            <div
              style={{
                whiteSpace: 'pre'
              }}
            >
            {
                data
                  .registries[0]
                  .policies
                  .map(
                    (policy: any) =>(
                      <div key={policy._id}>
                        <div>
                          {policy._id}
                        </div>
                        <Mutation
                          mutation={mutation}
                        >
                          {(
                            add: MutationFn,
                            { data }: MutationResult<any>,
                          ): ReactNode => (
                            <div>
                              {JSON.stringify(data)}
                              <form
                                onSubmit={e => {
                                  e.preventDefault();
                                  add({
                                    variables: {
                                      registry: registryAddress,
                                      model,
                                      policy: policy._id
                                    }
                                  });
                                }}
                              >
                                <button type="submit">Add Role Task</button>
                              </form>
                            </div>
                          )}
                        </Mutation>
                      </div>
                    )
                  )

              }
            </div>
        ) || null
    }
  </Query>
/*
  
*/
export default AddRoleTask
