import _debug from 'debug'

import createParent2ChildRelation from './create-parent-to-child-relation'

const debug = _debug('caterpillarql:add-model:continue-registration')

let continueRegistration = (web3, registryContract, currentIndex, sortedElements, nodeIndexes, modelInfo, contracts, registerModels) => {
  if (currentIndex + 1 >= sortedElements.length) {
    debug('....................................................................');
    debug('RELATING PARENT TO NESTED CHILDREN IN REGISTRY  ...');
    return createParent2ChildRelation(web3, registryContract, 0, sortedElements, contracts, modelInfo);
  }
  else
    return registerModels(web3, registryContract, currentIndex + 1, sortedElements, nodeIndexes, modelInfo, contracts);
};

export default continueRegistration
