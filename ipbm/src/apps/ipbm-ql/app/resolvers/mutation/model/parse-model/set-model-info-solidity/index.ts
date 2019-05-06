import * as ejs from "ejs"
import _debug from 'debug'

import is from '../is'
import getNodeName from './get-node-name'
import hasExternalCall from './has-external-call'
import extractParameters from './extract-parameters'
import {
  ParameterInfo,
} from "../definitions"

import multiInstanceActivities from './mappers/multi-instance-activities'
import callActivities from './mappers/call-activities'
import intermediateCatchEvents from './mappers/intermediate-catch-events'
import startEvents from './mappers/start-events'

import boundaryEventsOnEmbeddedSubProcesses from './mappers/boundary-events-of-embedded-sub-processes'
import boundaryEventsEdgeList from './mappers/boundary-events/edge-list'
import boundaryEventsNonInterrupting from './mappers/boundary-events/non-interrupting-events'
import boundaryEvents from './mappers/boundary-events/events'
import subProcessEvents from './mappers/sub-process-events'
import divideNodeList from './mappers/divide-node-list'

import nodeIndexMap from './mappers/node-index-map'
import externalBundles from './mappers/external-bundles'
import edgeIndexMap from './mappers/edge-index-map'

import userTaskList from './mappers/user-task-list'
import isEmbedded from './mappers/is-embedded'

import generate from './mappers/generate'

const debug = _debug('caterpillarql:set-model-info-solidity')


export default ({
  globalControlFlowInfo,
  globalNodeMap,
}) => {
  debug(globalNodeMap)
  let restrictRelation: Map<string, any> = new Map()
  const {
    globalEdgeIndexMap,
    globalNodeIndexMap,
    controlFlowInfos,
  } = globalControlFlowInfo
    .map(
      controlFlowInfo => ({
        ...controlFlowInfo,
        ...multiInstanceActivities(globalNodeMap)(controlFlowInfo) ||
        callActivities(globalNodeMap)(controlFlowInfo) ||
          intermediateCatchEvents(globalNodeMap)(controlFlowInfo) ||
          startEvents(globalNodeMap)(controlFlowInfo)
          
      })
    )
    .map(
      controlFlowInfo => ({
        ...controlFlowInfo,
        ...boundaryEventsOnEmbeddedSubProcesses(globalNodeMap)(controlFlowInfo),
      })
    )
    .map(
      controlFlowInfo => ({
        ...controlFlowInfo,
        ...!controlFlowInfo.isEmbedded &&
          boundaryEventsEdgeList(globalNodeMap)(controlFlowInfo),
      })
    )
    .map(
      controlFlowInfo => ({
        ...controlFlowInfo,
        ...!controlFlowInfo.isEmbedded &&
          (
            boundaryEventsNonInterrupting(globalNodeMap)(controlFlowInfo) ||
              boundaryEvents(globalNodeMap)(controlFlowInfo)
          ),
      })
    )
    .map(
      controlFlowInfo => ({
        ...controlFlowInfo,
        ...!controlFlowInfo.isEmbedded &&
          subProcessEvents(globalNodeMap)(controlFlowInfo),
      })
    )
    .map(
      controlFlowInfo => ({
        ...controlFlowInfo,
        ...!controlFlowInfo.isEmbedded &&
          divideNodeList(globalNodeMap)(controlFlowInfo),
      })
    )
    .reduce(
      (
        acc,
        controlFlowInfo,
      ) => ({
        globalEdgeIndexMap: controlFlowInfo
          .edgeList
          .reduce(
            (acc, node) =>
              acc.set(node, [...acc.keys()].length + 1),
            acc.globalEdgeIndexMap
          ),
        globalNodeIndexMap: controlFlowInfo
          .nodeList
          .filter(
            ({
              isEmbedded,
            }) =>
              !isEmbedded
          )
          .reduce(
            (acc, node) =>
              acc.set(node, [...acc.keys()].length + 1),
            acc.globalNodeIndexMap
          ),
        controlFlowInfos: [
          ...acc.controlFlowInfos,
          controlFlowInfo,
        ]
      }),
      {
        globalNodeIndexMap: new Map(),
        globalEdgeIndexMap: new Map(),
        controlFlowInfos: [],
      }
    )
  debug({ globalNodeIndexMap, globalEdgeIndexMap })
          
  return controlFlowInfos
    .map(
      controlFlowInfo => ({
        ...controlFlowInfo,
        ...!controlFlowInfo.isEmbedded &&
          nodeIndexMap({
            globalNodeIndexMap,
            globalNodeMap
          })(controlFlowInfo)
      })
    )
    .map(
      controlFlowInfo => ({
        ...controlFlowInfo,
        ...!controlFlowInfo.isEmbedded &&
          externalBundles(
            globalNodeMap
          )(controlFlowInfo)
      })
    )
    .map(
      // this is a bit horrid!!!!
      controlFlowInfo => {
        if (!controlFlowInfo.isEmbedded) {
          debug('external', controlFlowInfo.externalBundles) 
          controlFlowInfo.nodeList.forEach(
            (nodeId: string, index: number) => {
              let node = globalNodeMap[nodeId]
              if (node.documentation && node.documentation[0].text && node.documentation[0].text.length > 0) {
                if (!is(node, 'bpmn:CallActivity')) {
                  // mutates it's parameter!
                  extractParameters(node.documentation[0].text, node.id, controlFlowInfo)
                }
              }
            }
          )
        }
        return controlFlowInfo
      }
    )
    .map(
      controlFlowInfo => ({
        ...controlFlowInfo,
        ...!controlFlowInfo.isEmbedded &&
          edgeIndexMap(
            globalEdgeIndexMap,
          )(controlFlowInfo)
      })
    )
    .map(
      controlFlowInfo => ({
        ...controlFlowInfo,
        ...!controlFlowInfo.isEmbedded &&
          userTaskList(
            globalNodeMap,
          )(controlFlowInfo)
      })
    )
    .map(
      controlFlowInfo => ({
        ...controlFlowInfo,
        ...controlFlowInfo.isEmbedded &&
          isEmbedded({
            globalNodeIndexMap,
            globalEdgeIndexMap
          })(controlFlowInfo)
      })
    )
    .map(
      (controlFlowInfo, index, globalControlFlowInfo) => ({
        controlFlowInfo,
        ...!controlFlowInfo.isEmbedded &&
          generate({
            globalNodeMap,
            globalControlFlowInfo,
            globalNodeIndexMap,
          })({
            controlFlowInfo
          }),
      })
    )
}
