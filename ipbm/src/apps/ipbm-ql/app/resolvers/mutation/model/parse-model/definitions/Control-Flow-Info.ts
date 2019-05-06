import ParameterInfo from './Parameter-Info'
import OracleInfo from './Oracle-Info'

export default class ControlFlowInfo {
  parent: ControlFlowInfo = null
  isEmbedded: boolean = false
  nodeNameMap: Map<string, string> = new Map()
  nodeIndexMap: Map<string, number> = new Map()
  edgeIndexMap: Map<string, number> = new Map()
  multiinstanceActivities: Map<string, string> = new Map()
  nonInterruptingEvents: Map<string, string> = new Map()
  callActivities: Map<string, string> = new Map()
  externalBundles: Map<string, string> = new Map()
  catchingMessages: Array<string> = []
  parameterInfo: Map<string, Map<string, Array<ParameterInfo>>> = new Map()
  userTaskList: Array<string> = []
  globalParameters: string = ""
  localParameters: Map<string, Map<string,Array<ParameterInfo>>> = new Map()
  oracleInfo: Map<string, OracleInfo> = new Map()
  oracleTaskMap: Map<string, string> = new Map()
  taskRoleMap: Map<string, string> = new Map()

  constructor(public self:any, public nodeList: Array<string>,
              public edgeList: Array<string>, public sources: Array<string>,
              public boundaryEvents: Array<string>) {}
}
