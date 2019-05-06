import is from '../is'

export default ({
  nodeId,
  globalNodeMap,
}) => {
  let node = globalNodeMap[nodeId]
  return is(node, "bpmn:ServiceTask")
}