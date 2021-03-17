import is from '../../../is'
import getNodeName from '../../get-node-name'
import isInterrupting from './is-interupting'
import boundaryEvents from './boundary-events'
import messageEventDefinition from './message-event-definition'
import outgoing from './outgoing'

export default globalNodeMap => ({
  nonInterruptingEvents,
  nodeList,
  catchingMessages,
  boundaryEvents,
  edgeList
}) =>
  Object.keys(globalNodeMap)
    .map(key => globalNodeMap[key])
    .filter(
      node =>
        is(node, "bpmn:SubProcess") &&
          node.triggeredByEvent &&
          nodeList.includes(node.id)
    )
    .reduce(
      (acc, node) => [
        ...acc,
        ...node
          .flowElements.filter(
            e =>
              is(e, "bpmn:FlowNode") &&
                is(e, "bpmn:StartEvent")
          )
      ],
      [],
    )
    .reduce(
      (
        acc,
        val,
      ) =>
        isInterrupting(globalNodeMap)(val)(
          boundaryEvents(val)(
            messageEventDefinition(val)(
              outgoing(val)(
                acc,
              )
            )
          )
        ),
      {
        nonInterruptingEvents,
        nodeList,
        catchingMessages,
        boundaryEvents,
        edgeList
      }
    )

