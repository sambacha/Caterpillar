import _debug from 'debug'
import {
  modelSchema,
} from '../../../repo'

const debug = _debug('caterpillarql:role-task:search-repository')

let searchRepository = (
  web3,
  registryContract: import('ipbm-lib').RegistryContract,
  modelId,
  policyId,
  roleIndexMap
): Promise<any> =>
  modelSchema
    .find({ _id: modelId })
    .then(
      ([model] = []) =>
        model &&
          Promise.all(
            model
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
                    .childrenFor({
                      id: web3.utils.fromAscii(modelId.toString()),
                      index,
                    })
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
                procId: modelId,
                rootProcessName: model.rootProcessName,
                rootProcessId: model.rootProcessId,
                separateInstances:
                  separateInstances
                    .filter(s => s),
                workItems: model
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