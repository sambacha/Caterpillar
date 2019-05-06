import ControlFlowInfo from './Control-Flow-Info'

export default class ModelInfo {
  name: string
  id: string
  bpmn: string
  solidity: string
  controlFlowInfoMap: Map<string, ControlFlowInfo>
  globalNodeMap: Map<string, any>
  entryContractName: string
  contracts: Map<string, any>
}