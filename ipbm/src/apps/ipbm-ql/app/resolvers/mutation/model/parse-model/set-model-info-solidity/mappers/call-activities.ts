import is from '../../is'
import getNodeName from '../get-node-name'

export default globalNodeMap => ({
  nodeList,
  ...rest
}) => ({
  nodeList,
  ...rest,
  callActivities: nodeList
    .map(nodeId => globalNodeMap[nodeId])
    .filter(
      e => is(e, "bpmn:CallActivity")
    )
    .reduce(
      (acc, e) =>
        acc.set(e.id, getNodeName(e)),
      new Map(),
    ),
  })
