import is from '../../is'
import getNodeName from '../get-node-name'

export default globalNodeMap => ({
  catchingMessages,
  nodeList,
}) => {
  const results = nodeList
    .map(nodeId => globalNodeMap[nodeId])
    .filter(
      e => is(e, "bpmn:IntermediateCatchEvent") &&
        is(e.eventDefinitions[0], "bpmn:MessageEventDefinition")
    )
  return results.length &&
      {
        catchingMessages:
          results
            .reduce(
              (acc, e) => [
                ...acc,
                e.id,
              ],
              catchingMessages || [],
            )
      }
}
