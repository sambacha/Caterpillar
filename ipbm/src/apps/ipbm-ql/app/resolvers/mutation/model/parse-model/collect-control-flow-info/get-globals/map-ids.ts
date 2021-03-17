import is from '../../is'

const mapId = toMap =>
  toMap
    .map(
      ({
        id,
      }) => id,
    )
const stuff = ({
  parent,
  proc,
  nodeList,
  nonBlockingBoundaryEvents,
  boundaryEvents,
  flowEdges,
  sources,
  subProcesses,
}) => {
  const subs = subProcesses.map(stuff)
  return {
    parent,
    proc,
    nonBlockingBoundaryEvents: mapId(nonBlockingBoundaryEvents),
    boundaryEvents: mapId(boundaryEvents),
    flowEdges: mapId(flowEdges),
    nodeList: mapId(nodeList),
    sources: mapId(sources),
    subProcesses: subProcesses
      .map(stuff),
  }
}

export default stuff 


/*

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
  catchingMessages: Array<string>
  globalParameters: string = ""
  localParameters: Map<string, Map<string,Array<ParameterInfo>>> = new Map()
  oracleInfo: Map<string, OracleInfo> = new Map()
  oracleTaskMap: Map<string, string> = new Map()
  taskRoleMap: Map<string, string> = new Map()

  constructor(public self:any, public nodeList: Array<string>,
              public edgeList: Array<string>, public sources: Array<string>,
              public boundaryEvents: Array<string>) {}
}

*/