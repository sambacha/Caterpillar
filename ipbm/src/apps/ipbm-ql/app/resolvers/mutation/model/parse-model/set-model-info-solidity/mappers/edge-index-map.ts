import getNodeName from '../get-node-name'

export default (
  globalEdgeIndexMap,
) => ({
  edgeList,
  edgeIndexMap,
}) => {
  return {
    edgeList,
    edgeIndexMap: edgeList
      .reduce(
        (acc, id) =>
          acc.set(id, globalEdgeIndexMap.get(id)),
        edgeIndexMap,
      )
  }
}