import is from '../../../is'
import getNodeName from '../../get-node-name'

export default globalNodeMap => ({
  isEmbedded,
  boundaryEvents,
  nonInterruptingEvents,
  nodeList,
  catchingMessages,
}) => {
  if (!isEmbedded) {
    const results = boundaryEvents
      .map(nodeId => globalNodeMap[nodeId])
      .filter(
        ({
          cancelActivity,
        }) => !cancelActivity,
      )
    const resultIds = results
      .map(
        ({
          id,
        }) => id,
      )
    return results.length &&
      {
        nonInterruptingEvents: [
          ...nonInterruptingEvents,
          resultIds,
        ],
        nodeList: [ // eager reinsertion
          ...nodeList,
          resultIds,
        ],
        catchingMessages: [
          ...catchingMessages,
          results
            .filter(
              node =>
                node.eventDefinitions[0] &&
                  is(node.eventDefinitions[0], 'bpmn:MessageEventDefinition')
            )
            .filter(
              node => !catchingMessages.includes(node.id)
            )
            .map(
              ({
                id,
              }) => id
            )
        ]
      }
  }
}
