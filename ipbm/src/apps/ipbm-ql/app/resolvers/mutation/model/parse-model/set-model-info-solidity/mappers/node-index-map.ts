import getNodeName from '../get-node-name'

export default ({
  globalNodeMap,
  globalNodeIndexMap,
}) => ({
  nodeList,
  nodeIndexMap,
  nodeNameMap,
}) => {
  console.log('hre ')
  const nodes = nodeList
    .map(
      nodeId => globalNodeMap[nodeId]
    )
    const ret = {
      nodeList,
      nodeNameMap: nodes
        .reduce(
          (acc, node) =>
            acc.set(node.id, getNodeName(node)),
          nodeNameMap,
        ),
      nodeIndexMap: nodes
        .reduce(
          (acc, node) =>
            acc.set(node.id, globalNodeIndexMap.get(node.id)),
          nodeIndexMap,
        )
    }
    console.log({ ret })
    return ret
  }