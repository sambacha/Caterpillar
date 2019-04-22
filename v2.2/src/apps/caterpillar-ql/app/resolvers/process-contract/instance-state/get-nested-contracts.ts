import { process } from '../../repo'
import hexToId from '../../util/hex-to-id'


const nestedContracts = ({
  web3,
  // bpmModel,
  registryContract,
}): Function => async (
  contractAddress,
): Promise<any[]> => {
  const bundleId = await registryContract.methods.bundleFor(contractAddress).call()
    .then(hexToId(web3))
  const [{
    abi,
    indexToElement,
    worklistAbi,
  }] = await process
    .find({ _id: bundleId })
  // shouldnt need this...
  if (!abi || !worklistAbi) {
    return []
  }
  const contractInstance = new web3.eth.Contract(JSON.parse(abi), contractAddress)
  contractInstance.transactionConfirmationBlocks = 1;
  const worklistAddress = await contractInstance.methods.getWorklistAddress.call()
  const worklistInstance = worklistAddress.toString() !== '0x0000000000000000000000000000000000000000' &&
    new web3.eth.Contract(JSON.parse(worklistAbi), worklistAddress)
  if (worklistInstance) {
    worklistInstance.transactionConfirmationBlocks = 1;
  }
  const startedActivities = web3.utils.toBN(
    await contractInstance
      .methods
      .startedActivities
      .call()
  ).toString(2).split('').reverse()
  const startedInstances = await Promise.all(
    startedActivities
      .map(
        (activityState, index): string => activityState === '1' &&
          indexToElement[index].type,
      )
      .map(
        (type, index): Promise<any[]> => {
          if (type !== 'Separate-Instance') {
            return Promise.resolve([])
          }
          return contractInstance.methods.startedInstanceIndexFor(index).call()
            .then(
              (x): any =>
                web3.utils.toBN(x).toString(2).split('').reverse(),
            )
            .then(
              (startedInstances): string[] =>
                contractInstance.methods.allInstanceAddresses.call()
                  .then(
                    (allInstances): string =>
                      startedInstances
                        .map(
                          (startedInstance, index): string => startedInstance === '1' &&
                            allInstances[index]
                        )
                        .filter(
                          (instance): string => instance
                        )
                  )
            )
        }
      )
  )
  const instanceStates = await Promise.all(
    startedInstances
      .reduce<string[]>(
        (acc: string[], instances: string[]): string[] => [
          ...acc,
          ...instances,
        ],
        [],
      )
      .map(
        (state): any => nestedContracts({
          web3,
          registryContract,
        })(state)
      )
  )

  return instanceStates
    .reduce<any[]>(
      (acc: any[], instances): any[] => [
        ...acc,
        ...instances,
      ],
      [{
        bundleId,
        contractAddress,
        abi,
        indexToElement,
        worklistAbi,
        worklistAddress,
        worklistInstance,
        startedActivities,
        startedInstances,
      }],
    )
    
}

export default nestedContracts
