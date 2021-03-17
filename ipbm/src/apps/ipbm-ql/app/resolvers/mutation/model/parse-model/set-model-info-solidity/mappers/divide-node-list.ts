import hasExternalCall from '../has-external-call'

export default globalNodeMap =>
  ({
    nodeList,
  }) => ({
    nodeList: [
      ...nodeList
        .filter(
          nodeId => hasExternalCall({
            nodeId,
            globalNodeMap,
          })
        ),
      ...nodeList
        .filter(
          nodeId => !hasExternalCall({
            nodeId,
            globalNodeMap,
          })
        ),
    ]
  })
