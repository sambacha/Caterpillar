import is from '../../../is'
import getNodeName from '../../get-node-name'

export default ({
  outgoing,
}) =>
  ({
    edgeList,
    ...rest
  }) => (
    {
      edgeList: [
        ...edgeList,
        ...(outgoing || [])
          .map(
            ({
              id
            }) => id,
          )
      ],
      ...rest,
    }
  )
