import is from '../is'
import extractParameters from './extract-parameters'
import getNodeName from './get-node-name'

export default ({
  catchingMessages,
  controlFlowInfo,
  globalNodeIndexMap,
  globalNodeMap,
  parameterInfo,
  restrictRelation,
  userTaskList,
}) => ({
  nodeList: userTaskList,
  restrictRelation: restrictRelation,
  parameterInfo: parameterInfo,
  nodeIndex: globalNodeIndexMap,
  nodeMap: globalNodeMap,
  processId: () => controlFlowInfo.self.id,
  nodeName: nodeId => {
    return getNodeName(globalNodeMap[nodeId])
  },
  getParameterType: (nodeId, isInput, isType, hasPrevious) => {
    let res = ""
    if (parameterInfo.get(nodeId)) {
      let localParams = isInput
        ? parameterInfo.get(nodeId).get("input")
        : parameterInfo.get(nodeId).get("output")
      if (localParams && localParams.length > 0) {
        res = isType ? localParams[0].type : localParams[0].name
        for (let i = 1; i < localParams.length; i++)
          res += isType
            ? ", " + localParams[i].type
            : ", " + localParams[i].name
      }
    }
    return res.length > 0 && hasPrevious ? ", " + res : res
  },
  getParameters: (nodeId, isInput, hasType, hasPrevious) => {
    let res = ""
    if (parameterInfo.get(nodeId)) {
      let localParams = isInput
        ? parameterInfo.get(nodeId).get("input")
        : parameterInfo.get(nodeId).get("output")
      if (localParams && localParams.length > 0) {
        res = hasType
          ? localParams[0].type + " " + localParams[0].name
          : localParams[0].name
        for (let i = 1; i < localParams.length; i++)
          res += hasType
            ? ", " + localParams[i].type + " " + localParams[i].name
            : ", " + localParams[i].name
      }
    }
    return res.length > 0 && hasPrevious ? ", " + res : res
  },
  getWorkItemsGroupByParameters: (isInput) => {
    let name2Ids: Map<string, string[]> = new Map()
    controlFlowInfo.nodeList.forEach(nodeId => {
      let node = globalNodeMap[nodeId]
      if (is(node, 'bpmn:UserTask') || is(node, 'bpmn:ReceiveTask') || catchingMessages.indexOf(nodeId) >= 0) {
        let params = ""
        if (node.documentation && node.documentation[0].text && node.documentation[0].text.length > 0 && extractParameters(node.documentation[0].text, nodeId, null) !== undefined) {
          let localParams = isInput
            ? extractParameters(node.documentation[0].text, nodeId, null).get("input")
            : extractParameters(node.documentation[0].text, nodeId, null).get("output")
          if (localParams.length > 0) {
            params = localParams[0]
            for (let i = 2; i < localParams.length; i += 2) params += localParams[i]
          }
        }
        let name = getNodeName(globalNodeMap[nodeId]) + params
        if (!name2Ids.has(name)) {
          name2Ids.set(name, [])
        }
        name2Ids.get(name).push(nodeId)
      }
    })
    return name2Ids
  },
  is: is
})