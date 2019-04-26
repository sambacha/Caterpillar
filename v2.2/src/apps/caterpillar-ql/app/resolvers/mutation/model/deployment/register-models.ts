import _debug from 'debug'

import { process } from '../../../repo'
import continueRegistration from './continue-registration'

const debug = _debug('caterpillarql:model:register-models')

let registerModels = (
  web3,
  registryContract,
  currentIndex,
  sortedElements,
  nodeIndexes,
  modelInfo,
  contracts,
) => {
  let nodeName = sortedElements[currentIndex].nodeName;
  let gNodeId = sortedElements[currentIndex].nodeId;
  let controlFlowInfo = modelInfo.controlFlowInfoMap.get(gNodeId);
  if (modelInfo.globalNodeMap.get(gNodeId).$type === 'bpmn:StartEvent')
    controlFlowInfo = modelInfo.controlFlowInfoMap.get(modelInfo.globalNodeMap.get(gNodeId).$parent.id);
  if (controlFlowInfo) {
    let indexToFunctionName = [];
    let childrenSubproc = [];
    controlFlowInfo.nodeList.forEach(nodeId => {
      let element = modelInfo.globalNodeMap.get(nodeId);
      if (controlFlowInfo.nodeList.indexOf(nodeId) >= 0) {
        let type = "None";
        let role = "None";
        let indexRole = 0;
        if (controlFlowInfo.callActivities.has(nodeId) || controlFlowInfo.multiinstanceActivities.has(nodeId) || controlFlowInfo.nonInterruptingEvents.has(nodeId))
          type = "Separate-Instance";
        else if (element.$type === 'bpmn:ServiceTask')
          type = "Service";
        else if (element.$type === 'bpmn:UserTask' || element.$type === 'bpmn:ReceiveTask' || controlFlowInfo.catchingMessages.indexOf(nodeId) >= 0) {
          type = "Workitem";
          if (!controlFlowInfo.taskRoleMap.has(nodeId))
            throw 'No role related to User Task: ' + controlFlowInfo.nodeNameMap.get(nodeId);
          role = controlFlowInfo.taskRoleMap.get(nodeId);
        }
        indexToFunctionName[controlFlowInfo.nodeIndexMap.get(nodeId)] = {
          name: controlFlowInfo.nodeNameMap.get(nodeId),
          id: nodeId,
          type: type,
          role: role
        };
        if (controlFlowInfo.callActivities.has(nodeId) || controlFlowInfo.multiinstanceActivities.has(nodeId) || controlFlowInfo.nonInterruptingEvents.has(nodeId)) {
          childrenSubproc.push(nodeId);
          sortedElements[nodeIndexes.get(nodeId)].nodeIndex = controlFlowInfo.nodeIndexMap.get(nodeId);
          if (controlFlowInfo.externalBundles.has(nodeId))
            sortedElements[nodeIndexes.get(nodeId)].bundleId = controlFlowInfo.externalBundles.get(nodeId);
        }
      }
    });
    let bpmnModel = currentIndex < sortedElements.length - 1 ? 'empty' : modelInfo.bpmn;
    let worklistAbi = contracts[`${nodeName}_worklist`] ? contracts[`${nodeName}_worklist`].abi : 'undefined';
    return process.create(
      {
        rootProcessID: gNodeId,
        rootProcessName: nodeName,
        bpmnModel: bpmnModel,
        solidityCode: modelInfo.solidity,
        abi:JSON.stringify(contracts[`${nodeName}_Contract`].abi),
        bytecode: contracts[`${nodeName}_Contract`].bytecode,
        indexToElement: indexToFunctionName,
        worklistAbi: JSON.stringify(worklistAbi)
      },
    )
      .then(
        (repoData) => {
          let idAsString = repoData._id.toString();
          sortedElements[currentIndex].bundleId = idAsString;
          sortedElements[currentIndex].bundleParent = idAsString;
          childrenSubproc.forEach(childId => {
            sortedElements[nodeIndexes.get(childId)].bundleParent = idAsString;
          });
          debug(`Compilation artifacts of ${nodeName} updated in repository with id ${idAsString}`);
          return continueRegistration(web3, registryContract, currentIndex, sortedElements, nodeIndexes, modelInfo, contracts, registerModels);
        }
      )
  } else {
    return continueRegistration(web3, registryContract, currentIndex, sortedElements, nodeIndexes, modelInfo, contracts, registerModels);
  }
};

export default registerModels
