import _debug from 'debug'
import { process } from '../../../repo'
import hexToId from '../../../util/hex-to-id'

const debug = _debug('caterpillarql:role-task:search-repository')

let searchRepository = (
  web3,
  registryContract,
  procId,
  policyId,
  roleIndexMap
): Promise<any> =>
  process
    .find({ _id: procId })
    .then(
      ([repoData] = []) =>
        repoData &&
          Promise.all(
            repoData
              .indexToElement
              .map(
                (
                  element,
                  index,
                ) => ({
                  element,
                  index,
                })
              )
              .filter(
                ({ element }) =>
                  element && element.type === 'Separate-Instance'
              )
              .map(
                ({
                  index,
                }) =>
                  registryContract
                    .methods
                    .childrenFor(
                      web3.utils.fromAscii(procId.toString()),
                      index,
                    )
                    .call()
                    .then(hexToId(web3))
                    .then(
                      instanceProcId =>
                        searchRepository(
                          web3,
                          registryContract,
                          instanceProcId,
                          policyId,
                          roleIndexMap,
                        )
                    )
              )
          )
            .then(
              separateInstances => ({
                procId,
                rootProcessName: repoData.rootProcessName,
                rootProcessId: repoData.rootProcessId,
                separateInstances,
                workItems: repoData
                .indexToElement
                .map(
                  (
                    element,
                    index,
                  ) => ({
                    element,
                    index,
                  })
                )
                .filter(
                  ({ element }) =>
                  element && element.type === 'Workitem'
                )
                .map(
                  ({
                    index,
                    element,
                  }) => ({
                    element,
                    taskIndex: index,
                    roleIndex: roleIndexMap.get(element.role)
                  })
                ),
              })
            )
        )

export default searchRepository