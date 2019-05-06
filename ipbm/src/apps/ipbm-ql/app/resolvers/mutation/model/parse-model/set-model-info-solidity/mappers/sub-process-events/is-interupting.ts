import is from '../../../is'
import getNodeName from '../../get-node-name'

export default globalNodeMap =>
  ({
    isInterrupting,
    $parent,
    id,
  }) =>
    ({
      nonInterruptingEvents,
      ...rest
    }) => !isInterrupting
      ? {
        nonInterruptingEvents:
          nonInterruptingEvents
            .set(
              id,
              getNodeName(globalNodeMap[$parent.id]),
            ),
        ...rest,
      }
      : {
        nonInterruptingEvents,
        ...rest
      }
