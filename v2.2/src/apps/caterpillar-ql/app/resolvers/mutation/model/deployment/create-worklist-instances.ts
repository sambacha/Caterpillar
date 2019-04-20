import _debug from 'debug'

import  continueWorklistCreation from './continue-worklist-creation'

const debug = _debug('caterpillarql:model:create-worklist-instances')

const createWorklistInstances = (
  web3,
  registryContract, 
  currentIndex,
  sortedElements,
  outputContracts,
  modelInfo,
) => {
  debug('----------------------------------------------------------------------------------------')
  const workListInstanceContract = outputContracts[modelInfo.id][`${sortedElements[currentIndex].nodeName}_Worklist`]
  if (workListInstanceContract) {
    const worklistContract = new web3.eth.Contract(workListInstanceContract.abi)
    worklistContract.transactionConfirmationBlocks = 1
    return web3.eth.personal.getAccounts()
      .then(
        accounts =>
          worklistContract
            .deploy(
              {
                data: "0x" + workListInstanceContract.evm.bytecode.object,
              },
            )
            .send(
              {
                from: accounts[0],
                gas: 4700000,
              },
            )
            .then(
              contractW => {
                if (contractW.address) {
                  return registryContract
                    .methods
                    .registerWorklist(
                      web3.utils.fromAscii(sortedElements[currentIndex].bundleId),
                      contractW.address,
                    )
                    .send(
                      {
                        from: accounts[0],
                        gas: 4700000
                      },
                    )
                    .then(
                      result1 =>
                        continueWorklistCreation(
                          web3,
                          registryContract, 
                          currentIndex,
                          [
                            ...sortedElements.slice(0, currentIndex -1),
                            {
                              ...sortedElements[currentIndex],
                              worklist: contractW.address
                            },
                            ...sortedElements.slice(currentIndex + 1)
                          ],
                          outputContracts,
                          modelInfo,
                          createWorklistInstances,
                        )
                    )
                }
              }
            )
        )
  } else {
    return continueWorklistCreation(
      web3,
      registryContract,               
      currentIndex,
      sortedElements,
      outputContracts,
      modelInfo,
      createWorklistInstances,
    );
  }
};

export default createWorklistInstances
