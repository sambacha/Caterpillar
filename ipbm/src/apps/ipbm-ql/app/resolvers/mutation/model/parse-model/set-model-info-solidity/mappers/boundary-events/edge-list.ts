import is from '../../../is'
import getNodeName from '../../get-node-name'

export default globalNodeMap => ({
  boundaryEvents,
  edgeList
}) => {
  const results = boundaryEvents
    .map(nodeId => globalNodeMap[nodeId])
    .map(
      ({
        outgoing = [],
      }) => outgoing
        .map(
          ({
            id,
          }) => id,
        )
    )
    .reduce(
      (acc, val) => [
        ...acc,
        ...val,
      ],
      [],
    )
  return results.length &&
    {
      edgeList: [
        ...edgeList,
        results,
      ],
    }
}
