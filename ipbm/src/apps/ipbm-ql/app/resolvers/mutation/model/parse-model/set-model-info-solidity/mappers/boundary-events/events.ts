import is from '../../../is'
import getNodeName from '../../get-node-name'

export default globalNodeMap => ({
  isEmbedded,
  boundaryEvents,
  nodeList,
  catchingMessages,
}) => {
  if (!isEmbedded) {
    const results = boundaryEvents
      .map(nodeId => globalNodeMap[nodeId])
      .filter(
        node =>
          node.eventDefinitions[0] &&
            is(node.eventDefinitions[0], 'bpmn:MessageEventDefinition')
      )
      .map(
        ({
          id,
        }) => id,
      )
    return results.length &&
      {
        nodeList: [
          ...nodeList,
          results
            .filter(
              result =>
                !nodeList.includes(result)
            )
        ],
        catchinMessages: [
          ...catchingMessages,
          results
            .filter(
              result =>
                !catchingMessages.includes(result)
            )
        ]
      }
  }
}
