import { process } from '../repo'


const nestedContracts = ({
  web3,
  // bpmModel,
  registryContract,
}): Function => async (
  contractAddress,
): Promise<any[]> => {
  const bundleId = await registryContract.methods.bundleFor(contractAddress).call()
    .then(
      (bundleFor): object =>
        web3.utils.toAscii(bundleFor).toString().substr(0, 24),
    )
  const [{
    abi,
    indexToElement,
    worklistAbi,
  }] = await process
    .find({ _id: bundleId })
  const contractInstance = new web3.eth.Contract(JSON.parse(abi), contractAddress)
  const worklistAddress = await contractInstance.methods.getWorklistAddress.call()
  const worklistInstance = worklistAddress.toString() !== '0x0000000000000000000000000000000000000000' &&
    new web3.eth.Contract(JSON.parse(worklistAbi), worklistAddress)
  const startedActivities = web3.utils.toBN(
    await contractInstance.methods.startedActivities.call()
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

/*


let instanceStateFor = (currentIndex, nestedContracts, bpmnModel, workitems, serviceTasks, res) => {
    let contractAddress = nestedContracts[currentIndex];
    let bundleId = web3.toAscii(processRegistryContract.bundleFor.call(contractAddress)).toString().substr(0, 24);
    repoSchema.find({_id: bundleId},
        (err, repoData) => {
            if (err) {
                console.log('ERROR ', err);
                return [];
            } else {
                let contractInstance = web3.eth.contract(JSON.parse(repoData[0].abi)).at(contractAddress);
                let worklistAddress = contractInstance.getWorklistAddress.call();
                let worklistInstance: any;
                if (worklistAddress.toString() !== '0x0000000000000000000000000000000000000000')
                    worklistInstance = web3.eth.contract(JSON.parse(repoData[0].worklistAbi)).at(worklistAddress);
                let dictionary = repoData[0].indexToElement;

                let startedActivities = contractInstance.startedActivities.call().toString(2).split('').reverse();
                for (let index = 0; index < startedActivities.length; index++) {
                    if (startedActivities[index] === '1') {
                        if (dictionary[index].type === 'Workitem') {
                            let reqInd = worklistInstance.workItemsFor.call(index, contractAddress).toString(2).split('').reverse();
                            for (let i = 0; i < reqInd.length; i++) {
                                if (reqInd[i] === '1') {
                                    let notFound = true;
                                    for (let j = 0; j < workitems.length; j++) {
                                        if (workitems[j].elementId === dictionary[index].id && workitems[j].bundleId === bundleId) {
                                            workitems[j].hrefs.push(`/workitems/${worklistAddress}/${i}`);
                                            workitems[j].pCases.push(worklistInstance.processInstanceFor.call(i));
                                            notFound = false;
                                            break;
                                        }
                                    }
                                    if (notFound) {
                                        workitems.push({
                                            elementId: dictionary[index].id,
                                            elementName: dictionary[index].name,
                                            input: findParameters(repoData[0].worklistAbi, dictionary[index].name),
                                            bundleId: bundleId,
                                            processAddress: contractAddress,
                                            pCases: [contractAddress],
                                            hrefs: [`/workitems/${worklistAddress}/${i}`]
                                        });
                                    }
                                }
                            }
                        } else if (dictionary[index].type === 'Service') {
                            // PENDING
                        } else if (dictionary[index].type === 'Separate-Instance') {
                            let startedInstances = contractInstance.startedInstanceIndexFor.call(index).toString(2).split('').reverse();
                            let allInstances = contractInstance.allInstanceAddresses.call();
                            for (let i = 0; i < startedInstances.length; i++)
                                if (startedInstances[i] === '1')
                                    nestedContracts.push(allInstances[i]);
                        }
                    }
                }
                if (currentIndex + 1 < nestedContracts.length)
                    instanceStateFor(currentIndex + 1, nestedContracts, bpmnModel, workitems, serviceTasks, res);
                else {
                    if (workitems.length == 0 && serviceTasks.length == 0)
                         console.log('No started elements ...');
                    else {
                        workitems.forEach(elem => {
                             console.log("Element ID: ", elem.elementId);
                             console.log("Element Name: ", elem.elementName);
                             console.log("Input Parameters: ", elem.input);
                             console.log("bundleId: ", elem.bundleId);
                             console.log("pCases: ", elem.pCases)
                             console.log("hrefs: ", elem.hrefs);
                             console.log("...............................................................");
                        })
                    }
                    console.log('----------------------------------------------------------------------------------------------');
                    res.status(200).send({bpmn: bpmnModel, workitems: workitems, serviceTasks: serviceTasks});
                }
            }
        });
};

*/
