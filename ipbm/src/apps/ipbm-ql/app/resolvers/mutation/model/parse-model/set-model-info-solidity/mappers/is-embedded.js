export default ({
  globalNodeIndexMap,
  globalEdgeIndexMap,
}) => ({
  nodeList,
  edgeList,
  nodeIndexMap,
  globalEdgeIndexMap,
}) => ({
  nodeList,
  nodeIndexMap: nodeList
    .reduce(
      (acc, id) =>
        acc.set(id, globalNodeIndexMap.get(id)),
      nodeIndexMap,
    ),
  edgeList,
  edgeIndexMap: edgeList
    .reduce(
      (acc, id) =>
        acc.set(id, globalEdgeIndexMap.get(id)),
      edgeIndexMap,
    ),
})