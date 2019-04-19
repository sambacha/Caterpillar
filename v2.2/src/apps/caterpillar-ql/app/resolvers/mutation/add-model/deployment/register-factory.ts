import _debug from 'debug'

import continueFactoryRegistration from './continue-factory-registration'

const debug = _debug('caterpillarql:add-model:register-factory')

const registerFactory = (web3, registryContract, currentIndex, sortedElements, outputContracts, modelInfo) => {
  debug('------------------------------------------------------------------------')
  const factoryContract = new web3.eth.Contract(outputContracts[modelInfo.id][`${sortedElements[currentIndex].nodeName}_Factory`].abi);
  factoryContract.transactionConfirmationBlocks = 1;
  return web3.eth.personal.getAccounts()
    .then(
      accounts =>
        factoryContract
          .deploy(
            {
              data: "0x" + outputContracts[modelInfo.id][`${sortedElements[currentIndex].nodeName}_Factory`].evm.bytecode.object,
            },
          )
          .send(
            {
              from: accounts[0],
              gas: 4700000.
            },
          )
          .then(
            contractF =>
              continueFactoryRegistration(
                web3,
                registryContract,
                currentIndex,
                sortedElements,
                outputContracts,
                contractF,
                modelInfo,
                registerFactory,
              )
          )
    )
  };

export default registerFactory
