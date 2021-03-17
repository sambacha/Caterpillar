import is from '../../is'
import { processFileUploads } from 'apollo-server-core';

const structure = (
  {
    flowEdges,
    flowNodes,
    proc,
    subProcesses,
  }:
  {
    flowEdges: any[]
    flowNodes: any[]
    proc: any
    subProcesses: any[]
  }
) => {
  const subs = subProcesses
    .map(structure)
    .map(
      sub => ({
        ...sub,
        parent: proc,
      })
    )
  const filteredSubs = subs
    .filter(
      ({
        proc,
      }) => !proc.loopCharacteristics ||
        proc.loopCharacteristics.$type !== "bpmn:MultiInstanceLoopCharacteristics",
      )
  return {
    proc,
    boundaryEvents: [
      ...flowNodes
        .filter(
          node => is(node, "bpmn:BoundaryEvent")
        ),
      ...filteredSubs
        .reduce(
          (acc, { boundaryEvents }) => [
            ...acc,
            ...boundaryEvents,
          ],
          [],
        ),
    ],
    nonBlockingBoundaryEvents:
      flowNodes
        .filter(
          node => is(node, "bpmn:BoundaryEvent")
        )
        .filter(
          ({ cancelActivity }) => !cancelActivity
        ),
    flowEdges: [
      ...flowEdges,
      ...filteredSubs
        .reduce(
          (acc, { flowEdges }) => [
            ...acc,
            ...flowEdges,
          ],
          [],
        ),
    ],
    nodeList: [
      ...flowNodes
        .filter(
          node => !is(node, "bpmn:BoundaryEvent")
        )
        .filter(
          ({ id }) =>
            flowEdges
              .find(
                ({
                  targetRef : {
                    id: sequenceFlowId,
                  },
                }) =>
                  id === sequenceFlowId,
              )
        ),
        ...filteredSubs
          .reduce(
            (acc, { nodeList }) => [
              ...acc,
              ...nodeList,
            ],
            [],
          )
    ],
    sources: [
      ...flowNodes
        .filter(
          node => !is(node, "bpmn:BoundaryEvent")
        )
        .filter(
          ({ id }) =>
            !flowEdges
              .find(
                ({
                  targetRef : {
                    id: sequenceFlowId,
                  },
                }) =>
                  id === sequenceFlowId,
              )
        ),
        ...filteredSubs
          .reduce(
            (acc, { sources }) => [
              ...acc,
              ...sources,
            ],
            [],
          )
    ],
    subProcesses: subs,
  }
}

export default structure 


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