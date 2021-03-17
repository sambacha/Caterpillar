import _debug from 'debug'

import registerModels from './register-models'
// Step 1. Model Registration: Collects the compilation artifacts of the produced models, 
//         and saves all these metadata as an entry in the Process Repository.

const debug = _debug('caterpillarql:model:register-model')

export default (
  web3,
  registryContract,
  modelInfo,
  contracts,
  registryId
) => {
  // Sorting elements such that children are created first
  let queue = [
    {
      nodeId: modelInfo.id,
      nodeName: modelInfo.name,
      bundleId: '',
      nodeIndex: 0,
      bundleParent: '',
      factoryContract: '',
    }
  ]
  for (let i = 0; i < queue.length; i++) {
    if (modelInfo.controlFlowInfoMap.has(queue[i].nodeId)) {
      let cfInfo = modelInfo.controlFlowInfoMap.get(queue[i].nodeId)
      let candidates = [cfInfo.multiinstanceActivities, cfInfo.nonInterruptingEvents, cfInfo.callActivities]
      candidates.forEach(children => {
        if (children) {
          children.forEach((value, key) => {
            queue.push({ nodeId: key, nodeName: value, bundleId: '', nodeIndex: 0, bundleParent: '', factoryContract: '' })
          })
        }
      })
    }
  }
  queue.reverse();
  let nodeIndexes = new Map();
  for (let i = 0; i < queue.length; i++)
    nodeIndexes.set(queue[i].nodeId, i)
  debug('....................................................................')
  debug('UPDATING COMPILATION ARTIFACTS IN REPOSITORY ...')
  return registerModels(
    web3,
    registryContract,
    0,
    queue,
    nodeIndexes,
    modelInfo,
    contracts,
    registryId,
  )
}
