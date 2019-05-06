import * as ejs from "ejs"
import _debug from 'debug'

import is from '../is'
import getNodeName from './get-node-name'
import hasExternalCall from './has-external-call'
import extractParameters from './extract-parameters'
import makeCodeGenerationInfo from './make-code-generation-info'
import makeWorklistGenerationInfo from './make-worklist-generation-info'
import {
  ParameterInfo,
} from "../definitions"
import bpmn2solEJS from '../../../../../templates/bpmn2sol.ejs'
import worklist2solEJS from '../../../../../templates/worklist2sol.ejs'

import multiInstanceActivities from './mappers/multi-instance-activities'
import callActivities from './mappers/call-activities'

const debug = _debug('caterpillarql:parse-model-do-something-else')

const bpmn2solTemplate = ejs.compile(bpmn2solEJS)
const worklist2solTemplate = ejs.compile(worklist2solEJS)


export default ({
  globalControlFlowInfo,
  globalNodeMap,
  globalNodeIndexMap,
  globalEdgeIndexMap,
  // restrictRelation,
  modelInfo,
}) => {
  const mappedControlFlowInfo = globalControlFlowInfo
    .map(
      controlFlowInfo => {
        if (!controlFlowInfo.isEmbedded) {
          return controlFlowInfo
        }
        return callActivities(globalNodeMap)(
          multiInstanceActivities(globalNodeMap)(controlFlowInfo)
        )
      }
    )
  let restrictRelation: Map<string, any> = new Map()
  for (let controlFlowInfo
      of mappedControlFlowInfo
    ) {
      modelInfo
        .controlFlowInfoMap
        .set(controlFlowInfo.self.id,controlFlowInfo)
    if (!controlFlowInfo.isEmbedded) {
      let multiinstanceActivities = [],
        callActivities = [],
        nonInterruptingEvents = [],
        catchingMessages = []

      controlFlowInfo.nodeList
        .map(nodeId => globalNodeMap[nodeId])
        .forEach(e => {
          if ((is(e, "bpmn:Task") || is(e, "bpmn:SubProcess")) && e.loopCharacteristics &&
              e.loopCharacteristics.$type === "bpmn:MultiInstanceLoopCharacteristics") {
              controlFlowInfo.multiinstanceActivities.set(e.id, getNodeName(e))
              multiinstanceActivities.push(e.id)
          } else if (is(e, "bpmn:CallActivity")) {
              controlFlowInfo.callActivities.set(e.id, getNodeName(e))
              callActivities.push(e.id)
          } else if (is(e, "bpmn:IntermediateCatchEvent") && is(e.eventDefinitions[0], "bpmn:MessageEventDefinition"))
            catchingMessages.push(e.id)
          else if (is(e, "bpmn:StartEvent") && is(e.eventDefinitions[0], "bpmn:MessageEventDefinition"))
            catchingMessages.push(e.id)
        })

      // It is also necessary to add boundary events of embedded sub-processes

      controlFlowInfo.sources.forEach(nodeId => {
        let start = globalNodeMap[nodeId]
        if (start.eventDefinitions && start.eventDefinitions[0] && is(start.eventDefinitions[0], "bpmn:MessageEventDefinition") &&
          controlFlowInfo.nodeList.indexOf(nodeId) < 0) {
          controlFlowInfo.nodeList.push(nodeId)
          if (catchingMessages.indexOf(nodeId) < 0)
            catchingMessages.push(nodeId)
        }
      })

      controlFlowInfo.boundaryEvents.forEach(nodeId => {
        let node = globalNodeMap[nodeId]
        if (node.outgoing)
          for (let outgoing of node.outgoing)
            controlFlowInfo.edgeList.push(outgoing.id)
        if (!node.cancelActivity) {
          controlFlowInfo.nonInterruptingEvents.set(node.id, getNodeName(node))
          nonInterruptingEvents.push(node.id)
          controlFlowInfo.nodeList.push(nodeId) // Eager reinsertion
          if (node.eventDefinitions[0] && is(node.eventDefinitions[0], 'bpmn:MessageEventDefinition')) {
            if (catchingMessages.indexOf(nodeId) < 0)
              catchingMessages.push(nodeId)
          }
        } else if (node.eventDefinitions && is(node.eventDefinitions[0], "bpmn:MessageEventDefinition")) {
          if (controlFlowInfo.nodeList.indexOf(nodeId) < 0)
            controlFlowInfo.nodeList.push(nodeId)
          if (catchingMessages.indexOf(nodeId) < 0)
            catchingMessages.push(nodeId)
        }
      })
      Object.keys(globalNodeMap)
        .map(key => globalNodeMap[key])
        .forEach(node => {
          if (is(node, "bpmn:SubProcess") && node.triggeredByEvent && controlFlowInfo.nodeList.indexOf(node.id)) {
            for (let start of node.flowElements.filter(e => is(e, "bpmn:FlowNode") && is(e, "bpmn:StartEvent"))) {
              if (start.isInterrupting == false) {
                let parent = globalNodeMap[start.$parent.id]
                controlFlowInfo.nonInterruptingEvents.set(start.id, getNodeName(parent))
                nonInterruptingEvents.push(start.id)
                controlFlowInfo.nodeList.push(start.id)
                if (start.eventDefinitions[0] && is(start.eventDefinitions[0], "bpmn:MessageEventDefinition")) {
                  if (catchingMessages.indexOf(start.id) < 0)
                    catchingMessages.push(start.id)
                }
              }
              if (controlFlowInfo.boundaryEvents.indexOf(start.id) < 0) {
                controlFlowInfo.boundaryEvents.push(start.id)
                if (controlFlowInfo.nodeList.indexOf(start.$parent.id) < 0)
                  controlFlowInfo.nodeList.push(start.$parent.id)
              }
              if (start.eventDefinitions[0] && is(start.eventDefinitions[0], "bpmn:MessageEventDefinition")) {
                if (controlFlowInfo.nodeList.indexOf(start.id) < 0)
                  controlFlowInfo.nodeList.push(start.id)
                if (catchingMessages.indexOf(start.id) < 0)
                  catchingMessages.push(start.id)
              }
              if (start.outgoing)
                for (let outgoing of start.outgoing)
                  controlFlowInfo.edgeList.push(outgoing.id)
            }
          }
      })

      let part1: Array<string> = []
      let part2: Array<string> = []
      controlFlowInfo.nodeList.forEach(nodeId => {
        if (
          hasExternalCall({
            nodeId,
            globalNodeMap,
          })
        ) part1.push(nodeId)
        else part2.push(nodeId)
      })
      controlFlowInfo.nodeList = part1.concat(part2)
      controlFlowInfo.nodeList.forEach(
        (nodeId: string, index: number) => {
          let node = globalNodeMap[nodeId]
          controlFlowInfo.nodeIndexMap.set(nodeId, index + 1)
          globalNodeIndexMap.set(nodeId, index + 1)
          controlFlowInfo.nodeNameMap.set(nodeId, getNodeName(globalNodeMap[nodeId]))
          if (node.documentation && node.documentation[0].text && node.documentation[0].text.length > 0) {
            if (is(node, 'bpmn:CallActivity'))
              controlFlowInfo.externalBundles.set(nodeId, node.documentation[0].text)
            else
              extractParameters(node.documentation[0].text, node.id, controlFlowInfo)
          }
        }
      )
      controlFlowInfo.edgeList.forEach(
        (edgeId: string, index: number) => {
          controlFlowInfo.edgeIndexMap.set(edgeId, index + 1)
          globalEdgeIndexMap.set(edgeId, index + 1)
        }
      )
      controlFlowInfo.catchingMessages = catchingMessages

      // ControlFlow Perspective: Generation of Smart Contracts
      debug({ globalNodeIndexMap })
      debug(
        Object.keys(globalNodeMap)
          .reduce(
            (acc, key) => ({
              ...acc,
              [key]: Object.keys(globalNodeMap).indexOf(key),
            }),
            {},
          ),
      )
      let codeGenerationInfo = makeCodeGenerationInfo({
        catchingMessages,
        controlFlowInfo,
        globalNodeMap,
        multiinstanceActivities,
        callActivities,
        nonInterruptingEvents,
        globalControlFlowInfo,
        globalNodeIndexMap,
      })
      let localSolidity = bpmn2solTemplate(codeGenerationInfo)
      // Code for using the worklist template
      let userTaskList = []
      let parameterInfo: Map<string, Map<string, Array<ParameterInfo>>> = new Map()
      controlFlowInfo.nodeList.forEach(nodeId => {
        let node = globalNodeMap[nodeId]
        if (is(node, 'bpmn:UserTask') || is(node, 'bpmn:ReceiveTask')) {
          userTaskList.push(nodeId)
          if (controlFlowInfo.localParameters.has(nodeId) && (controlFlowInfo.localParameters.get(nodeId).get('input').length > 0 || controlFlowInfo.localParameters.get(nodeId).get('output').length > 0)) {
            parameterInfo.set(nodeId, controlFlowInfo.localParameters.get(nodeId))
          }
        }
      })
      if (controlFlowInfo.catchingMessages.length > 0)
        userTaskList = userTaskList.concat(controlFlowInfo.catchingMessages)

      // worklist: Smart Contract Generation
      let worklistGenerationInfo = makeWorklistGenerationInfo({
        catchingMessages,
        controlFlowInfo,
        globalNodeIndexMap,
        globalNodeMap,
        parameterInfo,
        restrictRelation,
        userTaskList,
      })
      modelInfo.solidity += localSolidity
      if (userTaskList.length > 0) {
        modelInfo.solidity += worklist2solTemplate(worklistGenerationInfo)
        debug(JSON.stringify(modelInfo.solidity))
      }
      modelInfo.controlFlowInfoMap.set(controlFlowInfo.self.id, controlFlowInfo)
    } else {
      controlFlowInfo.nodeList.forEach(nodeId =>
        controlFlowInfo.nodeIndexMap.set(nodeId, globalNodeIndexMap.get(nodeId))
      )
      controlFlowInfo.edgeList.forEach(edgeId =>
        controlFlowInfo.edgeIndexMap.set(edgeId, globalEdgeIndexMap.get(edgeId))
      )
    }
  }
}