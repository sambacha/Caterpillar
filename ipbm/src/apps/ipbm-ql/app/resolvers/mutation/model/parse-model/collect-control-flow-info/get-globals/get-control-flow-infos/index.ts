import is from '../../../is'
import ControlFlowInfo from '../../../definitions/Control-Flow-Info'
import withNonBlocking from './with-non-blocking'

const stuff = globalNodeMap => ({
  parent,
  proc,
  nodeList,
  nonBlockingBoundaryEvents,
  boundaryEvents,
  flowEdges,
  sources,
  subProcesses,
}) => [
  ...nonBlockingBoundaryEvents.length === 0
    ? [{
      ...new ControlFlowInfo(
        proc,
        nodeList,
        flowEdges,
        sources,
        boundaryEvents
      ),
      parent,
      isEmbedded: parent && (
        !proc.loopCharacteristics ||
          proc.loopCharacteristics.$type !== "bpmn:MultiInstanceLoopCharacteristics"
      ),
      globalParameters: proc.documentation &&
        proc.documentation[0].text,
    }]
    : withNonBlocking(globalNodeMap)({
      parent,
      proc,
      nodeList,
      nonBlockingBoundaryEvents,
      boundaryEvents,
      flowEdges,
      sources,
      subProcesses,
    }),
  ...subProcesses
    .map(stuff(globalNodeMap))
    .reduce(
      (acc, vals) => [
        ...acc,
        ...vals,
      ],
      [],
    )
]

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