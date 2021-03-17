import _debug from 'debug'
import is from '../is'
import collect from './collect'
import ControlFlowInfo from '../definitions/Control-Flow-Info'
import getGlobals from './get-globals'

const debug = _debug('caterpillarql:collect-control-flow-info')
export default proc => {
  const {
    globalNodeMap,
    globalControlFlowInfo,
   } = getGlobals(proc)

   /*
   was...
  collect(
    proc,
    globalNodeMap,
    globalControlFlowInfo,
  )
  */
  
  // Event sub-processes appear in the source list, and not in the nodeList
  // In addition, all the elements of a non interrupting subprocess event appears embedded on its parent process
  for (let controlFlowInfo of globalControlFlowInfo) {
    let indexesToRemove = []
    controlFlowInfo.sources.forEach(nodeId => {
      if (globalNodeMap[nodeId].triggeredByEvent) {
        controlFlowInfo.nodeList.push(nodeId)
        indexesToRemove.push(controlFlowInfo.sources.indexOf(nodeId))
        let nodeInfo = globalControlFlowInfo
          .find(
            ({
              self: {
                id,
              }
            }) => id === nodeId
          )
        if (!globalNodeMap[nodeInfo.sources[0]].isInterrupting)
          nodeInfo.nodeList.forEach(childId => {
            let index = controlFlowInfo.nodeList.indexOf(childId)
            if (index >= 0) controlFlowInfo.nodeList.splice(index, 1)
          })
      }
    })
    indexesToRemove.sort((ind1, ind2) => {
      return ind2 - ind1
    })
    indexesToRemove.forEach(index => {
      controlFlowInfo.sources.splice(index, 1)
    })
    if (is(globalNodeMap[controlFlowInfo.self.id], "bpmn:SubProcess")) {
      debug('sub process')
    }
    if (is(globalNodeMap[controlFlowInfo.self.id], "bpmn:SubProcess") &&
      controlFlowInfo.self.triggeredByEvent &&
      globalNodeMap[controlFlowInfo.sources[0]].isInterrupting == false) {
      debug('setting to not embedded')
      controlFlowInfo.isEmbedded = false
    }
  }
  return {
    globalNodeMap,
    globalControlFlowInfo,
  }
}
