import is from '../../is'
import getNodeName from '../get-node-name'

export default globalNodeMap => ({
  nodeList,
  ...rest
}) => {
  const callActivities = nodeList
    .map(nodeId => globalNodeMap[nodeId])
    .filter(
      e => is(e, "bpmn:CallActivity"),
    )
  return callActivities.length &&
      {
        callActivities:
          callActivities
            .reduce(
              (acc, e) =>
                acc.set(e.id, getNodeName(e)),
              new Map(),
            )
      }
}
