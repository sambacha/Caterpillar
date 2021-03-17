import _debug from 'debug'

const debug = _debug('caterpillarql:model:continue-worklist-creation')

const continueWorklistCreation = (
  web3,
  registryContract,
  currentIndex,
  sortedElements,
  outputContracts,
  modelInfo,
  createWorklistInstances,
  registryId,
) => {
  if (currentIndex + 1 < sortedElements.length) {
    return createWorklistInstances(
      web3,
      registryContract,
      currentIndex + 1,
      sortedElements,
      outputContracts,
      modelInfo,
      registryId,
    )
  } else {
    let bundleId = ''
    for (let i = 0; i < sortedElements.length; i++) {
      if (sortedElements[i].nodeName === modelInfo.name) {
        bundleId = sortedElements[i].bundleId
        break
      }
    }
    debug('----------------------------------------------------------------------------------------------')
    return {
      _id: bundleId,
      name: modelInfo.name,
      bpmn: modelInfo.bpmn,
      solidity: modelInfo.solidity,
      registryContract,
    }
  }
}

export default continueWorklistCreation
