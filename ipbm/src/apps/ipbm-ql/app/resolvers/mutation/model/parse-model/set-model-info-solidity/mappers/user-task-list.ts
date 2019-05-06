import is from '../../is'

export default globalNodeMap => ({
  nodeList,
  catchingMessages,
  localParameters,
  userTaskList,
  parameterInfo,
}) => {
  console.log(
    nodeList
      .reduce(
        (acc, key) => ({
          ...acc,
          [key]: globalNodeMap[key],
        }),
        {},
      )
  )
  const nodes = nodeList
    .map(
      nodeId =>
        globalNodeMap[nodeId]
    )
      .filter(
        node =>
          is(node, 'bpmn:UserTask') ||
            is(node, 'bpmn:ReceiveTask')
      )
  return {
    catchingMessages,
    localParameters,
    userTaskList: [
      ...userTaskList,
      ...nodes
        .map(
          ({
            id
          }) => id,
        ),
      ...catchingMessages
    ],
    parameterInfo: nodes
      .filter(
        ({
          id
        }) =>
          localParameters.has(id) &&
          (
            localParameters.get(id).get('input').length > 0 ||
              localParameters.get(id).get('output').length > 0
          )
      )
      .reduce(
        (acc, { id }) => acc.set(id, localParameters.get(id)),
        parameterInfo,
      )
  }
}