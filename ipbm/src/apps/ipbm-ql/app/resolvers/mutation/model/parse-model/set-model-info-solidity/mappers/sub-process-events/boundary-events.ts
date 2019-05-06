import is from '../../../is'
import getNodeName from '../../get-node-name'

export default ({
  $parent,
  id,
}) =>
  ({
    boundaryEvents,
    nodeList,
    ...rest
  }) => (
    {
      boundaryEvents: 
        !boundaryEvents.includes(id)
        ? [
          ...boundaryEvents,
          id,
        ]
        : boundaryEvents,
      nodeList: !nodeList.includes($parent.id)
        ? [
          ...nodeList,
          $parent.id,
        ]
        : nodeList,
      ...rest
    }
  )
