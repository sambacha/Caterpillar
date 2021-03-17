import {
  OracleInfo,
  ParameterInfo,
} from '../definitions'

export default (cad, nodeId, controlFlowInfo) => {
  // Extracting Roles from UserTasks functionBody

  let arr = cad.split('@')
  if (arr.length >= 3) {
    if (controlFlowInfo != null)
      controlFlowInfo.taskRoleMap.set(nodeId, arr[1].trim())
    if (arr[2].length > 1)
      cad = arr[2]
    else
      return undefined
  }

  // Extracting Information of Oracle from Service Tasks (if aplicable)
  let oracle_Data = ""
  for (let j = 0, first = false; j < cad.length; j++) {
    if (cad.charAt(j) === "(") {
      if (!first) first = true
      else {
        cad = cad.substr(j)
        break
      }
    }
    if (cad.charAt(j) === ":") {
      oracle_Data = ""
      break
    }
    oracle_Data += cad.charAt(j)
  }

  // Processing Information of function parameters (both service and user tasks)
  cad = cad
    .replace("(", " ")
    .replace(")", " ")
    .trim()
  cad = cad
    .replace("(", " ")
    .replace(")", " ")
    .trim()

  let firstSplit = cad.split(":")
  if (firstSplit.length > 2) {
    let aux = ''
    for (let i = 1; i < firstSplit.length; i++) aux += firstSplit[i]
    firstSplit = [firstSplit[0], aux]
  }
  let secondSplit = firstSplit[firstSplit.length - 1].trim().split("->")
  let resMap: Map<string, Array<string>> = new Map()

  let inputOutput = [firstSplit[0].trim(), secondSplit[0].trim()]
  let parameterType = ["input", "output"]
  resMap.set("body", [secondSplit[secondSplit.length - 1].trim()])

  for (let i = 0; i < inputOutput.length; i++) {
    let temp = inputOutput[i].split(",")
    let res = []
    temp.forEach(subCad => {
      let aux = subCad.trim().split(" ")
      if (aux[0].trim().length > 0) {
        res.push(aux[0].trim())
        res.push(aux[aux.length - 1].trim())
      }
    })
    resMap.set(parameterType[i], res)
  }
  // Updating Information of Oracle in controlFlowInfo
  if (controlFlowInfo != null) {
    let inParameters: Array<ParameterInfo> = []
    let outParameters: Array<ParameterInfo> = []
    let toIterate = resMap.get('input')
    for (let i = 0; i < toIterate.length; i += 2)
      inParameters.push(new ParameterInfo(toIterate[i], toIterate[i + 1]))
    toIterate = resMap.get('output')
    let parameters: Map<string, Array<ParameterInfo>> = new Map()
    parameters.set('input', inParameters)
    parameters.set('output', outParameters)
    for (let i = 0; i < toIterate.length; i += 2)
      outParameters.push(new ParameterInfo(toIterate[i], toIterate[i + 1]))
    if (oracle_Data.length > 0) {
      oracle_Data = oracle_Data.trim().replace(" ", "_")
      oracle_Data = oracle_Data
        .replace("(", " ")
        .replace(").", " ")
        .trim()
      let splitResult = oracle_Data.split(" ")
      if (!controlFlowInfo.oracleInfo.has(splitResult[0])) {
        controlFlowInfo.oracleInfo.set(
          splitResult[0],
          new OracleInfo(splitResult[0])
        )
      }
      controlFlowInfo.oracleTaskMap.set(nodeId, splitResult[0])
      let localOracle = controlFlowInfo.oracleInfo.get(splitResult[0])
      localOracle.address = splitResult[1]
      localOracle.functionName = splitResult[2]
      localOracle.functionParameters = parameters.get('input')
    } else controlFlowInfo.localParameters.set(nodeId, parameters)
  }
  return resMap
}
