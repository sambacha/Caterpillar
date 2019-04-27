import Web3 from 'web3'
import { process } from '../../repo'
import createContract from '../../util/create-contract'
import _debug from 'debug'

const debug = _debug('caterpillarql:process-contract:instance-state')

const findParameters = (contractAbi, functionName) => {
  let jsonAbi = JSON.parse(contractAbi);
  let candidates = [];
  jsonAbi.forEach(element => {
      if (element.name === functionName) {
          candidates = element.inputs;
      }
  });
  let res = [];
  candidates.forEach(element => {
      if (element.name && element.name !== 'workitemId')
          res.push(element);
  });
  return res;
};


export default (
  {
    web3,
    bpmnModel,
    registryContract,
  } : {
    web3: Web3,
    bpmnModel: string,
    registryContract: import('caterpillar-lib').RegistryContract,
  }
): Function => async (
  contractAddress,
): Promise<any> => {
  debug({ contractAddress })

  // the model id
  const bundleId = await registryContract
    .bundleFor({ instance: contractAddress })

  const [{
    abi,
    indexToElement,
    worklistAbi,
  }] = await process
    .find({ _id: bundleId })
  
  // this is the contract for this instance
  const instanceContract = createContract(web3)(JSON.parse(abi), contractAddress)

  // this is the address of the worklist contract for the instance
  const worklistAddress = await instanceContract
    .methods
    .getWorklistAddress.call()
  debug({ worklistAddress })
  // what does it mean when it is 0??
  const worklistContract = worklistAddress.toString() !== '0x0000000000000000000000000000000000000000' &&
    createContract(web3)(JSON.parse(worklistAbi), worklistAddress)
  if (!worklistContract) {
    return null
  }
  const startedActivities = web3.utils.toBN(
    await instanceContract
      .methods
      .startedActivities
      .call()
  ).toString(2).split('').reverse()

  debug({ startedActivities })

  const s = await Promise.all(
    startedActivities
      .map(
        (state, index) => ({
          index,
          state,
        })
      )
      .filter(
        ({ state, index }) =>
          state === '1' &&
            indexToElement[index].type === 'Workitem'
      )
      .map(
        ({
          state,
          index,
        }) => worklistContract
          .methods
          .workItemsFor(index, contractAddress)
          .call()
          .then(
            async (x): Promise<any> => ({
              index,
              refs: await Promise.all(
                web3.utils.toBN(x).toString(2).split('').reverse()
                  .map(
                    (val, index) => ({
                      index,
                      val,
                    })
                  )
                  .filter(
                    ({ val }) => val === '1'
                  )
                  .map(
                    ({
                      index,
                    }) => worklistContract
                      .methods.processInstanceFor(index)
                      .call()
                      .then(
                        processAddress => ({
                          index,
                          processAddress,
                          worklistAddress,
                        })
                      )
                  )
              )
            })
          )
      ),
  )
  debug(JSON.stringify(s, null,2))
  return {
    bpmn: bpmnModel,
    workItems: s
      .map(
        ({ index, refs }) => ({
          elementId: indexToElement[index].id,
          elementName: indexToElement[index].name,
          input: findParameters(worklistAbi, indexToElement[index].name),
          refs,
          worklistAddress,
        })
      )

  }
}
