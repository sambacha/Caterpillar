import is from '../../../is'
import ControlFlowInfo from '../../../definitions/Control-Flow-Info'
import getNodeList from './get-node-list'
import getEdgeList from './get-edge-list'

export default globalNodeMap => ({
  parent,
  proc,
  nodeList,
  nonBlockingBoundaryEvents,
  boundaryEvents,
  flowEdges,
  sources,
  subProcesses,
}): ControlFlowInfo[] => {
  const localBoundary = boundaryEvents
    .filter(
      event => !nonBlockingBoundaryEvents.includes(event)
    )
  const mainPathNodeList = [
    ...getNodeList(globalNodeMap)(sources),
    ...getNodeList(globalNodeMap)(localBoundary)
      .filter(node => !localBoundary.includes(node)),
  ]
    .filter(
      node => !sources.includes(node),
    )
  const mainPathEdgeList = [
    ...getEdgeList(globalNodeMap)(sources),
    ...getEdgeList(globalNodeMap)(localBoundary),
  ]
  return [
    {
      ...new ControlFlowInfo(
        proc,
        mainPathNodeList,
        mainPathEdgeList,
        sources,
        boundaryEvents
      ),
      parent,
      isEmbedded: parent && (
        !proc.loopCharacteristics ||
          proc.loopCharacteristics.$type !== "bpmn:MultiInstanceLoopCharacteristics"
      ),
      globalParameters: proc.documentation &&
        proc.documentation[0].text
    },
    ...nonBlockingBoundaryEvents
      .map(
        eventId => globalNodeMap[eventId],
      )
      .map(
        event => {
          if (!mainPathNodeList.find((e: string) => event.attachedToRef.id === e)) {
            throw new Error(
              "ERROR: Found non-interrupting event which is not attached to a subprocess in the main process path"
            )
          }
          const localNodeList = getNodeList(globalNodeMap)(event.id)

          const localEdgeList = getEdgeList(globalNodeMap)(event.id)
          if (
            mainPathNodeList.filter(
              (nodeId: string) => localNodeList.indexOf(nodeId) >= 0
            ).length > 0
          ) {
            throw new Error(
              "ERROR: Non-interrupting event outgoing path is not synchronized and merges with main process path"
            )
          }
          return {
            ...new ControlFlowInfo(
              event,
              localNodeList,
              localEdgeList,
              [event.id],
              [],
            ),
            parent: proc
          }
    
        }
      )
  ]
    
}