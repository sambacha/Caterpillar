import is from '../../../is'
import getNodeName from '../../get-node-name'

export default ({
  eventDefinitions,
  id,
}) =>
  ({
    nodeList,
    catchingMessages,
    ...rest
  }) =>
  eventDefinitions[0] &&
    is(eventDefinitions[0], "bpmn:MessageEventDefinition")
    ? {
      nodeList: !nodeList.includes(id)
        ? [
          ...nodeList,
          id
        ]
        : nodeList,
      catchingMessages: !catchingMessages.includes(id)
        ? [
          ...catchingMessages,
          id
        ]
        : catchingMessages,
      ...rest,
    }
    : {
      nodeList,
      catchingMessages,
      ...rest,
    }