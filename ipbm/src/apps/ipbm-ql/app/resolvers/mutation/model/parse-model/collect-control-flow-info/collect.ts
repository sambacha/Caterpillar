import is from '../is'
import ControlFlowInfo from '../definitions/Control-Flow-Info'
import dfs from './dfs'

const collect = (
  proc: any,
  globalNodeMap: Map<string, any>,
  globalControlFlowInfo: Array<ControlFlowInfo>,
): ControlFlowInfo => {
  let nodeList: Array<string> = []
  let edgeList: Array<string> = []
  let boundaryEvents: Array<string> = []
  let nonBlockingBoundaryEvents: Array<string> = []
  let controlFlowInfo: ControlFlowInfo

  for (let node of proc.flowElements.filter(e => is(e, "bpmn:FlowNode"))) {
    if (is(node, "bpmn:BoundaryEvent")) {
      boundaryEvents.push(node.id)
      if (node.cancelActivity == false) nonBlockingBoundaryEvents.push(node.id)
    } else {
      nodeList.push(node.id)
    }
    globalNodeMap.set(node.id, node)
  }

  let sources = [...nodeList]

  for (let flowEdge of proc.flowElements.filter(e =>
    is(e, "bpmn:SequenceFlow")
  )) {
    if (sources.indexOf(flowEdge.targetRef.id) > -1) {
      sources.splice(sources.indexOf(flowEdge.targetRef.id), 1)
    }
    edgeList.push(flowEdge.id)
  }

  // Let us remove all source elements from the node list
  nodeList = nodeList.filter((node: string) => sources.indexOf(node) < 0)
  if (nonBlockingBoundaryEvents.length > 0) {
    let [mainPathNodeList, mainPathEdgeList] = dfs(globalNodeMap)(sources)
    let localBoundary = []
    boundaryEvents.forEach(evtId => {
      if (nonBlockingBoundaryEvents.indexOf(evtId) < 0)
        localBoundary.push(evtId)
    })
    if (localBoundary.length > 0) {
      let [boundaryNodePath, boundaryEdgePath] = dfs(globalNodeMap)(localBoundary)
      boundaryNodePath = boundaryNodePath.filter(
        (node: string) => localBoundary.indexOf(node) < 0
      )
      mainPathNodeList = mainPathNodeList.concat(boundaryNodePath)
      mainPathEdgeList = mainPathEdgeList.concat(boundaryEdgePath)
    }

    // Let us remove all source elements from the node list
    mainPathNodeList = mainPathNodeList.filter((node: string) => sources.indexOf(node) < 0)

    controlFlowInfo = new ControlFlowInfo(
      proc,
      mainPathNodeList,
      mainPathEdgeList,
      sources,
      boundaryEvents
    )
    globalControlFlowInfo.push(controlFlowInfo)
    for (let eventId of nonBlockingBoundaryEvents) {
      let event = globalNodeMap.get(eventId)
      if (!mainPathNodeList.find((e: string) => event.attachedToRef.id === e)) {
        throw new Error(
          "ERROR: Found non-interrupting event which is not attached to a subprocess in the main process path"
        )
      }

      let [localNodeList, localEdgeList] = dfs(globalNodeMap)([eventId])
      if (
        mainPathNodeList.filter(
          (nodeId: string) => localNodeList.indexOf(nodeId) >= 0
        ).length > 0
      )
        throw new Error(
          "ERROR: Non-interrupting event outgoing path is not synchronized and merges with main process path"
        )

      // Let us remove all source elements from the node list
      localNodeList = localNodeList.filter((node: string) => sources.indexOf(node) < 0)

      let childControlFlowInfo = new ControlFlowInfo(
        event,
        localNodeList,
        localEdgeList,
        [eventId],
        []
      )
      childControlFlowInfo.parent = proc
      globalControlFlowInfo.push(childControlFlowInfo)
    }
  } else {
    controlFlowInfo = new ControlFlowInfo(
      proc,
      nodeList,
      edgeList,
      sources,
      boundaryEvents
    )
    globalControlFlowInfo.push(controlFlowInfo)
  }

  for (let subprocess of proc.flowElements.filter(e => is(e, "bpmn:SubProcess"))) {
    let subprocessControlFlowInfo = collect(
      subprocess,
      globalNodeMap,
      globalControlFlowInfo,
    )
    subprocessControlFlowInfo.parent = proc

    if (!(subprocess.loopCharacteristics && subprocess.loopCharacteristics.$type === "bpmn:MultiInstanceLoopCharacteristics")) {
      // Subprocess is embedded ... then copy all nodes and edges to the parent process
      subprocessControlFlowInfo.isEmbedded = true

      controlFlowInfo.nodeList = controlFlowInfo.nodeList.concat(subprocessControlFlowInfo.nodeList)
      controlFlowInfo.edgeList = controlFlowInfo.edgeList.concat(subprocessControlFlowInfo.edgeList)
      controlFlowInfo.boundaryEvents = controlFlowInfo.boundaryEvents.concat(subprocessControlFlowInfo.boundaryEvents)
    }
  }
  if (proc.documentation) {
    controlFlowInfo.globalParameters = proc.documentation[0].text
  }
  return controlFlowInfo
}
export default collect
