import React from 'react'
import {
  Query,
} from 'react-apollo'

import {
  Route,
  Switch,
} from 'react-router-dom'

import fourOFour from '../util/four-o-four'

import Modal from 'react-modal'

import { Link } from 'react-router-relative-link'
import { withState } from 'recompose'
import query from './query'
import Data from './types/Data'
import QueryVariables from './types/Query-Variables'
import WorkItem from './Work-Item'
import Nominate from './Nominate'
import VoteNominate from './Vote-Nominate'
import Release from './Release'
import VoteRelease from './Vote-Release'
import Viewer from '../models/Viewer'
import HereIfNot from '../util/Here-If-Not'

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
}
const Process: React.FunctionComponent<
  {
    match: any
  } & {
    element: any,
    setElement: (element: any) => any,
  }
> =
  ({
    match: {
      params: {
        registryId,
        process,
      },
      path,
      url,
    },
    element,
    setElement,
  }) =>
    <Query<Data, QueryVariables>
      query={query}
      variables={{
        registryId,
        process,
      }}
    >
      {
        ({
          data,
          loading,
        }) =>
          ( !loading && data && data.registries[0] &&
            data.registries[0].processes &&
            data.registries[0].processes[0] &&
            <div>
              <HereIfNot
                url={url}
              >
                .
              </HereIfNot>
              <Link to='./nominate'>nominate</Link>
              <Link to='./vote-nominate'>vote-nominate</Link>
              <Link to='./release'>release</Link>
              <Link to='./vote-release'>vote-release</Link>
              <Switch>
                <Route
                  exact
                  path={url}
                  render={
                    () =>
                      <div
                        style={{
                          whiteSpace: 'pre'
                        }}
                      >
                        {JSON.stringify(element)}
                        <Modal
                          isOpen={!!element}
                          onRequestClose={() => setElement(undefined)}
                          style={customStyles}
                          contentLabel="Example Modal"
                        >
                          <div
                            style={{
                              whiteSpace: 'pre'
                            }}
                          >
                            <WorkItem
                              registryAddress={data.registries[0].address}
                              element={element}
                              instanceState={data.registries[0].processes[0].instanceState}
                             />
                          </div>
                        </Modal>
                        <Viewer
                          id={data.registries[0].processes[0].address}
                          model={data.registries[0].processes[0].instanceState.bpmn}
                          workItems={data.registries[0].processes[0].instanceState.workItems}
                          onClick={
                            (element: any) => {
                              if(
                                data
                                  .registries[0]
                                  .processes[0]
                                  .instanceState
                                  .workItems
                                  .find(
                                    ({ elementId }: { elementId: any }) => elementId === element.id
                                  )
                              ) {
                                setElement(element)
                              }
                            }
                          }
                        />
                      </div>
                  }
                />
                <Route
                  path={`${url}/nominate`}
                  render={
                    () =>
                      <Nominate
                        processAddress={process}
                        registryAddress={data.registries[0].address}
                      />
                  }
                />
                <Route
                  path={`${url}/vote-nominate`}
                  render={
                    () =>
                      <VoteNominate
                        processAddress={process}
                        registryAddress={data.registries[0].address}
                      />
                  }
                />
                <Route
                  path={`${url}/release`}
                  render={
                    () =>
                      <Release
                        processAddress={process}
                        registryAddress={data.registries[0].address}
                      />
                  }
                />
                <Route
                  path={`${url}/vote-release`}
                  render={
                    () =>
                      <VoteRelease
                        processAddress={process}
                        registryAddress={data.registries[0].address}
                      />
                  }
                />
                <Route
                  component={fourOFour({ url })}
                />
              </Switch>
            </div>  
      ) || null
    }
  </Query>

export default withState('element', 'setElement', undefined)(Process)
