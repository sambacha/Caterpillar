import is from '../../is'
import getNodeName from '../get-node-name'

export default globalNodeMap => ({
  nodeList,
  ...rest
}) => ({
  nodeList,
  ...rest,
  multiinstanceActivities: nodeList
    .map(nodeId => globalNodeMap[nodeId])
    .filter(
      e => (is(e, "bpmn:Task") || is(e, "bpmn:SubProcess")) &&
      e.loopCharacteristics &&
      e.loopCharacteristics.$type === "bpmn:MultiInstanceLoopCharacteristics"
    )
    .reduce(
      (acc, e) =>
        acc.set(e.id, getNodeName(e)),
      new Map(),
    ),
  })
