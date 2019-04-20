import _debug from 'debug'

import registerFactory from './register-factory'

const debug = _debug('caterpillarql:model:create-parent-to-child-relation')

const createParent2ChildRelation = (web3, registryContract, currentIndex, sortedElements, outputContracts, modelInfo) => {
  return web3.eth.personal.getAccounts()
    .then(
      accounts =>
        registryContract
          .methods
          .addChildBundleId(
            web3.utils.fromAscii(sortedElements[currentIndex].bundleParent),
            web3.utils.fromAscii(sortedElements[currentIndex].bundleId),
            sortedElements[currentIndex].nodeIndex,
          )
          .send(
            {
              from: accounts[0],
              gas: 4700000
            },
          )
          .then(
            (result) => {
              if (currentIndex + 1 < sortedElements.length) {
                return createParent2ChildRelation(web3, registryContract, currentIndex + 1, sortedElements, outputContracts, modelInfo);
              } else {
                debug('....................................................................');
                let removedCallActivities = [];
                sortedElements.forEach(element => {
                  if (modelInfo.controlFlowInfoMap.has(element.nodeId) || modelInfo.globalNodeMap.get(element.nodeId).$type === 'bpmn:StartEvent') {
                    removedCallActivities.push(element);
                  }
                });
                if (removedCallActivities.length > 0) {
                  debug('DEPLOYING FACTORIES AND UPDATING PROCESS-FACTORY RELATION IN REGISTRY ...');
                  return registerFactory(web3, registryContract, 0, removedCallActivities, outputContracts, modelInfo);
                }
              }
            }
          )
        )
};

export default createParent2ChildRelation
