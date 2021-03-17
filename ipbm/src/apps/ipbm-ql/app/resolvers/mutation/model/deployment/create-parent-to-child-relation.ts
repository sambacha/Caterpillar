import _debug from 'debug'

import registerFactory from './register-factory'

const debug = _debug('caterpillarql:model:create-parent-to-child-relation')

const createParent2ChildRelation = (
  web3,
  registryContract: import('ipbm-lib').RegistryContract,
  currentIndex,
  sortedElements,
  outputContracts,
  modelInfo,
  registryId,
) => {
  return web3.eth.personal.getAccounts()
    .then(
      accounts =>
        registryContract
          .addChildBundleId({
            parentBundleId: web3.utils.fromAscii(sortedElements[currentIndex].bundleParent),
            processBundleId: web3.utils.fromAscii(sortedElements[currentIndex].bundleId),
            nodeIndex: sortedElements[currentIndex].nodeIndex,
          })
          (
            {
              from: accounts[0],
              gas: 4700000
            },
          )
          .then(
            (result) => {
              debug('child bundleId added')
              if (currentIndex + 1 < sortedElements.length) {
                return createParent2ChildRelation(
                  web3,
                  registryContract,
                  currentIndex + 1,
                  sortedElements,
                  outputContracts,
                  modelInfo,
                  registryId,
                )
              } else {
                debug('....................................................................')
                let removedCallActivities = []
                sortedElements.forEach(element => {
                  if (modelInfo.controlFlowInfoMap.has(element.nodeId) || modelInfo.globalNodeMap[element.nodeId].$type === 'bpmn:StartEvent') {
                    removedCallActivities.push(element)
                  }
                })
                if (removedCallActivities.length > 0) {
                  debug('DEPLOYING FACTORIES AND UPDATING PROCESS-FACTORY RELATION IN REGISTRY ...')
                  return registerFactory(
                    web3,
                    registryContract,
                    0,
                    removedCallActivities,
                    outputContracts,
                    modelInfo,
                    registryId,
                  )
                }
              }
            }
          )
        )
}

export default createParent2ChildRelation
