import is from '../../is'
import getNodeName from '../get-node-name'

export default globalNodeMap => ({
  catchingMessages,
  nodeList,
  sources,
}) => {
  const results = sources
    .map(nodeId => globalNodeMap[nodeId])
    .filter(
      start => start.eventDefinitions && start.eventDefinitions[0] &&
        is(start.eventDefinitions[0], "bpmn:MessageEventDefinition") &&
        !nodeList.includes(start.id)
    )
    .map(
      ({
        id,
      }) => id
    )
  return results.length &&
    {
      nodeList: [
        ...nodeList,
        results,
      ],
      catchingMessages: [
        ...catchingMessages,
        ...results
          .filter(
            id =>
              !catchingMessages.includes(id)
          )
      ]
    }
}
