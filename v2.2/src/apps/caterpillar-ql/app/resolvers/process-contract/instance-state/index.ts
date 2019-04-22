import getNestedContracts from './get-nested-contracts'


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


export default ({
  web3,
  bpmnModel,
  registryContract,
}): Function => async (
  contractAddress,
): Promise<any> => {
  const nestedContracts = await getNestedContracts({
    web3,
    registryContract,  
  })(contractAddress)

  const x = await Promise.all(
    nestedContracts
      .map(
        async ({
          bundleId,
          contractAddress,
          abi,
          indexToElement,
          worklistAbi,
          worklistAddress,
          worklistInstance,
          startedActivities,
          startedInstances,
        }): Promise<any> => Promise.all(
          startedActivities
            .map(
              async (
                startedActivity,
                index,
              ): Promise<any> => {
                if (startedActivity === '1' && indexToElement[index].type === 'Workitem') {
                  const reqInd = await worklistInstance.methods.workItemsFor(index, contractAddress).call()
                    .then(
                      (x): any =>
                        web3.utils.toBN(x).toString(2).split('').reverse(),
                    )
                  
                  const ret = await Promise.all(
                    reqInd
                      .map(
                        async (req, i): Promise<any> => {
                          if (req === '1') {
                            return {
                              worklistAddress,
                              bundleId: bundleId,
                              elementId: indexToElement[index].id,
                              elementName: indexToElement[index].name,
                              hrefs: [`/workitems/${worklistAddress}/${i}`],
                              input: findParameters(worklistAbi, indexToElement[index].name),
                              pcases: [ await worklistInstance.methods.processInstanceFor(i).call()],
                              processAddress: contractAddress,
                            }
                          }
                        }
                      )
                  )
                  return ret
                }
                // return Promise.resolve()
              }
            )
        ),
      )
  )
  const workItems = x
    .reduce(
      (acc, items) => [
        ...acc,
        ...items || [],
      ],
      [],
    )
    .reduce(
      (acc, items) => [
        ...acc,
        ...items || [],
      ],
      [],
    )
    .filter(x => x)
    .map(
      (item, index) => ({
        ...item,
        index,
      })
    )
    .reduce(
      (acc, item) => {
        const exists = acc.find(
          ({ elementId, bundleId }) =>
            elementId === item.elementId &&
              bundleId === item.bundleId,
        )
        if (exists) {
          return [
            ...acc.filter(a => a !== exists),
            {
              ...exists,
              hrefs:[
                ...exists.hrefs,
                ...item.hrefs,
              ],
              pcases: [
                ...exists.pcases,
                ...item.pcases,
              ]
            }
          ]
        }
        return [
          ...acc,
          item,
        ]  
        
      },
      [],
    )
    .sort(
      ({ index }) => index,
    )
  return {
    bpmn: bpmnModel,
    workItems
  }
}
