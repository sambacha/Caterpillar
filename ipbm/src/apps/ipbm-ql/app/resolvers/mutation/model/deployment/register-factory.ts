import _debug from 'debug'

import continueFactoryRegistration from './continue-factory-registration'

const debug = _debug('caterpillarql:model:register-factory')

const registerFactory = (
  web3,
  registryContract,
  currentIndex,
  sortedElements,
  outputContracts,
  modelInfo,
  registryId,
) => {
  debug('------------------------------------------------------------------------')
  debug(
    'adding factory..',
    modelInfo.id,
    `${sortedElements[currentIndex].nodeName}_Factory`,
    Object.keys(
      outputContracts[`${sortedElements[currentIndex].nodeName}_Factory`],
    )
  )
  const factoryContract = new web3.eth.Contract(outputContracts[`${sortedElements[currentIndex].nodeName}_Factory`].abi)
  factoryContract.transactionConfirmationBlocks = 1
  return web3.eth.personal.getAccounts()
    .then(
      accounts =>
        factoryContract
          .deploy(
            {
              data: outputContracts[`${sortedElements[currentIndex].nodeName}_Factory`].bytecode,
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
                registryId,
              )
          )
    )
  }

export default registerFactory
