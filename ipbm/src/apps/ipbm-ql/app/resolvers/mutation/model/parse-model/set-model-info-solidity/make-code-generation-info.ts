import BigNumber from "bignumber.js"
import _debug from 'debug'

import is from '../is'
import extractParameters from './extract-parameters'
import getNodeName from './get-node-name'
import hasExternalCall from './has-external-call'

const debug = _debug('caterpillarql:parse-model.make-code-generation-info')

export default ({
  catchingMessages,
  controlFlowInfo,
  globalNodeMap,
  multiinstanceActivities,
  callActivities,
  nonInterruptingEvents,
  globalControlFlowInfo,
  globalNodeIndexMap,
}) => ({
  nodeList: controlFlowInfo.nodeList,
  nodeMap: globalNodeMap,
  catchingMessages: controlFlowInfo.catchingMessages,
  multiinstanceActivities,
  callActivities,
  nonInterruptingEvents: nonInterruptingEvents,
  oracleInfo: controlFlowInfo.oracleInfo,
  oracleTaskMap: controlFlowInfo.oracleTaskMap,
  processId: () => controlFlowInfo.self.id,
  nodeName: nodeId => getNodeName(globalNodeMap[nodeId]),
  eventType: nodeId => {
    debug('doing event type')
    let node = globalNodeMap[nodeId]
    if (node.eventDefinitions && node.eventDefinitions[0]) {
      let cad = node.eventDefinitions[0].$type
      return cad.substring(5, cad.length - 15)
    }
    return "Default"
  },
  allEventTypes: () => {
    debug('doing all event type')
    
    let taken = []
    Object.keys(globalNodeMap)
      .map(key=> globalNodeMap[key])
      .forEach(node => {
        if (node.eventDefinitions && node.eventDefinitions[0] && !is(node.eventDefinitions[0], "bpmn:TerminateEventDefinition") && !is(node.eventDefinitions[0], "bpmn:MessageEventDefinition")) {
          let cad = node.eventDefinitions[0].$type
          if (taken.indexOf(cad.substring(5, cad.length - 15)) < 0)
            taken.push(cad.substring(5, cad.length - 15))
        }
      })
    return taken
  },
  getMessages: () => {
    debug('doing messages')
    
    let taken = []
    let candidates = controlFlowInfo.boundaryEvents
    controlFlowInfo.nodeList.forEach(nodeId => {
      if (is(globalNodeMap[nodeId], "bpmn:SubProcess")) {
        let subP = globalControlFlowInfo
          .find(
            ({
              self: {
                id,
              }
            }) =>
              id === nodeId
          )
        candidates = candidates.concat(subP.boundaryEvents)
        subP.sources.forEach(id => {
          if (!is(globalNodeMap[id], "bpmn:Subprocess") && candidates.indexOf(id) < 0)
            candidates.push(id)
        })
      }
    })
    candidates.forEach(evtId => {
      let evt = globalNodeMap[evtId]
      if (evt.eventDefinitions && evt.eventDefinitions[0] && is(evt.eventDefinitions[0], "bpmn:MessageEventDefinition"))
        taken.push(evtId)
    })
    return taken
  },
  getThrowingMessages: () => {
    debug('doing get throw')
    let res = []
    controlFlowInfo.nodeList.forEach(nodeId => {
      let node = globalNodeMap[nodeId]
      if ((is(node, "bpmn:EndEvent") || is(node, "bpmn:IntermediateThrowEvent")) &&
        node.eventDefinitions && node.eventDefinitions[0] && is(node.eventDefinitions[0], "bpmn:MessageEventDefinition"))
        res.push(nodeId)
    })
    return res
  },
  getThrowingEvents: (subprocId, evType) => {
    debug('doing get throw e')
    
    let res = []
    Object.keys(globalNodeMap)
      .map(key=> globalNodeMap[key])
      .forEach(node => {
        if (node.eventDefinitions && node.eventDefinitions[0]) {
          let cad = node.eventDefinitions[0].$type
          if (cad.substring(5, cad.length - 15) === evType) {
            if ((is(node, "bpmn:EndEvent") || is(node, "bpmn:IntermediateThrowEvent")) &&
              (node.$parent.id === subprocId || controlFlowInfo.nodeList.indexOf(node.id) >= 0)) {
              res.push(node.id)
            }
          }
        }
      })
    return res
  },
  getCatchingEvents: (subprocId) => {
    debug('doing get catch')
    
    let res = []
    Object.keys(globalNodeMap)
      .map(key=> globalNodeMap[key])
      .forEach(node => {
        if (node.eventDefinitions && node.eventDefinitions[0]) {
          if (is(node, "bpmn:StartEvent")) {
            let parent = globalNodeMap[node.$parent.id]
            if (parent.triggeredByEvent && parent.$parent.id === subprocId)
              res.unshift(node.id)
            else if (!parent.triggeredByEvent && (parent.id === subprocId || controlFlowInfo.nodeList.indexOf(parent.id) > -1))
              res.push(node.id)
          } else if (is(node, "bpmn:BoundaryEvent") || is(node, "bpmn:IntermediateCatchEvent")) {
            if (node.$parent.id === subprocId || controlFlowInfo.nodeList.indexOf(node.$parent.id) > -1)
              res.push(node.id)
          }
        }
      })
    return res
  },
  getTerminateCandidates: (subprocId) => {
    debug('doing get term')
    let res = []
    Object.keys(globalNodeMap)
      .map(key=> globalNodeMap[key])
      .forEach(node => {
        if (node.eventDefinitions && node.eventDefinitions[0]) {
          if (is(node, "bpmn:BoundaryEvent") && node.cancelActivity == false) {
            const localC = globalControlFlowInfo
              .find(
                ({
                  self: {
                    id,
                  }
                }) =>
                  id === node.id
              )
            if (localC) {
              localC.nodeList.forEach(elemId => {
                let elem = globalNodeMap[elemId]
                if (elem.eventDefinitions && is(elem.eventDefinitions[0], "bpmn:TerminateEventDefinition") && elem.$parent.id === node.$parent.id)
                  res.push(node.id)
              })

            } else {
              debug('Missing Non Interrupting event')
            }
          }
        }
      })
    return res
  },
  getProcessCandidatesMaskFrom: (evtId, evtType, evtCode, sourceProcesses, allEvents) => {
    debug('doing get mask')
    
    let eventList = []
    let bitarray = []
    allEvents.forEach(nodeId => {
      let cad = globalNodeMap[nodeId].eventDefinitions[0].$type
      if (evtType === cad.substring(5, cad.length - 15) && evtCode === getNodeName(globalNodeMap[nodeId]))
        eventList.push(nodeId)
    })
    sourceProcesses.forEach(procId => {
      let parent = globalNodeMap[procId]
      let previousParent = parent
      let res = []
      let eventFound = false
      while (!eventFound && res.length == 0 && parent.$parent && controlFlowInfo.self.id !== parent.id) {
        parent = globalNodeMap[parent.$parent.id]
        eventList.forEach(nodeId => {
          let node = globalNodeMap[nodeId]
          if (!eventFound && is(node, "bpmn:BoundaryEvent") && node.attachedToRef.id === previousParent.id) {
            eventFound = node.cancelActivity != false
            if (eventFound) res = [nodeId]
            else res.push(nodeId)
          }
        })
        if (res.length == 0) {
          eventList.forEach(nodeId => {
            let node = globalNodeMap[nodeId]
            if (!eventFound && is(node, "bpmn:StartEvent") && node.$parent.triggeredByEvent && node.$parent.$parent.id === parent.id) {
              eventFound = node.isInterrupting != false
              if (eventFound) res = [nodeId]
              else res.push(nodeId)
            }
          })
        }
        previousParent = parent
      }
      if (res.indexOf(evtId))
        bitarray[globalNodeIndexMap.get(procId)] = 1
    })
    let result = "0b"
    for (let i = bitarray.length - 1; i >= 0; i--)
      result += bitarray[i] ? "1" : "0"
    return result === "0b" ? 0 : new BigNumber(result).toFixed()
  },
  getCatchingEventsFrom: (procId, evtType, evtCode) => {
    debug('doing get catching events from')
    
    // Escalation and Error catching events.
    // No intermediate events in normal flow allowed
    let res = []
    let parent = globalNodeMap[procId]
    let eventFound = false
    let candidates = controlFlowInfo.boundaryEvents.concat(controlFlowInfo.nodeList)
    let eventList = []
    candidates.forEach(nodeId => {
      let node = globalNodeMap[nodeId]
      if (node.eventDefinitions) {
        let cad = node.eventDefinitions[0].$type
        let type = cad.substring(5, cad.length - 15)
        if (type === evtType && evtCode === getNodeName(globalNodeMap[nodeId]) && eventList.indexOf(nodeId) < 0) {
          eventList.push(nodeId)
        }
      }
    })
    if (!parent.triggeredByEvent) {
      eventList.forEach(nodeId => {
        let node = globalNodeMap[nodeId]
        if (!eventFound && is(node, "bpmn:StartEvent") && node.$parent.triggeredByEvent && node.$parent.$parent.id === parent.id) {
          eventFound = node.isInterrupting != false
          if (eventFound) res = [nodeId]
          else res.push(nodeId)
        }
      })
    }
    if (controlFlowInfo.self.id === procId || res.length > 0) {
      return res
    } else {
      if (parent.triggeredByEvent)
        parent = globalNodeMap[parent.$parent.id]
      let previousParent = parent
      while (!eventFound && res.length == 0 && parent.$parent && controlFlowInfo.self.id !== parent.id) {
        parent = globalNodeMap[parent.$parent.id]
        eventList.forEach(nodeId => {
          let node = globalNodeMap[nodeId]
          if (!eventFound && is(node, "bpmn:BoundaryEvent") && node.attachedToRef.id === previousParent.id) {
            eventFound = node.cancelActivity != false
            if (eventFound) res = [nodeId]
            else res.push(nodeId)
          }
        })
        if (res.length == 0) {
          eventList.forEach(nodeId => {
            let node = globalNodeMap[nodeId]
            if (!eventFound && is(node, "bpmn:StartEvent") && node.$parent.triggeredByEvent && node.$parent.$parent.id === parent.id) {
              eventFound = node.isInterrupting != false
              if (eventFound) res = [nodeId]
              else res.push(nodeId)
            }
          })
        }
        previousParent = parent
      }
      return res
    }
  },
  getWorkItemsGroupByParameters: (isInput) => {
    debug('doing get wi')
    
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
  getContracts2Call: () => {
    debug('doing cs 2 call')
    let res = callActivities.concat(multiinstanceActivities)
    nonInterruptingEvents.forEach(evtId => {
      let node = globalNodeMap[evtId]
      res.push(is(node, "bpmn:StartEvent") ? node.$parent.id : evtId)
    })
    return res
  },
  getContracts2CallFrom: (subprocId, candidates) => {
    debug('doing get cs to call from')
    
    let res = [subprocId]
    if (!controlFlowInfo.callActivities.has(subprocId)) {
      candidates.forEach(nodeId => {
        let node = globalNodeMap[nodeId]
        while (node.$parent) {
          if (node.$parent.id === subprocId) {
            res.push(nodeId)
            break
          }
          node = node.$parent
        }
      })
    }
    return res
  },
  getContracts2CallMaskFrom: (subprocId, candidates) => {
    debug('doing get cs to call mask')
    
    let bitarray = []
    candidates.forEach(nodeId => {
      let node = globalNodeMap[nodeId]
      while (node.$parent) {
        if (node.$parent.id === subprocId) {
          bitarray[globalNodeIndexMap.get(nodeId)] = 1
          break
        }
        node = node.$parent
      }
    })
    let result = "0b"
    for (let i = bitarray.length - 1; i >= 0; i--)
      result += bitarray[i] ? "1" : "0"
    return result === "0b" ? 0 : new BigNumber(result).toFixed()
  },
  getContracts2CallArray: (subprocId, candidates) => {
    debug('doing call array')
    
    let res = '[uint(' + globalNodeIndexMap.get(candidates[0]) + ')'
    for (let i = 1; i < candidates.length; i++)
      res += ', uint(' + globalNodeIndexMap.get(candidates[i]) + ')'
    return res + ']'
  },
  getPossibleKillSubprocess: () => {
    let res = []
    controlFlowInfo.boundaryEvents.forEach(nodeId => {
      let node = globalNodeMap[nodeId]
      if (node.$parent.triggeredByEvent && node.$parent.$parent.id !== controlFlowInfo.self.id) {
        if (node.isInterrupting != false && res.indexOf(node.$parent.$parent.id) < 0)
          res.push(node.$parent.$parent.id)
      } else if (node.attachedToRef) {
        let attachedTo = node.attachedToRef.id
        if (node.cancelActivity != false && res.indexOf(attachedTo) < 0) {
          res.push(attachedTo)
        }
      }
    })
    Object.keys(globalNodeMap)
      .map(key=> globalNodeMap[key])
      .forEach(node => {
        if (node.eventDefinitions && node.eventDefinitions[0]) {
          if (is(node, "bpmn:BoundaryEvent") && node.cancelActivity == false) {
            const localC = globalControlFlowInfo
              .find(
                ({
                  self: {
                    id,
                  }
                }) =>
                  id === node.id
              )
            if (localC) {
              localC.nodeList.forEach(elemId => {
                let elem = globalNodeMap[elemId]
                if (elem.eventDefinitions && is(elem.eventDefinitions[0], "bpmn:TerminateEventDefinition") && elem.$parent.id === node.$parent.id && controlFlowInfo.nodeList.indexOf(node.$parent.id) >= 0 && res.indexOf(node.$parent.id) < 0 && node.$parent.id != controlFlowInfo.self.id) {
                  res.push(node.$parent.id)
                }
              })
            }
          }
        }
      })
    controlFlowInfo.nodeList.forEach(nodeId => {
      let node = globalNodeMap[nodeId]
      if (node.eventDefinitions && is(node.eventDefinitions[0], "bpmn:TerminateEventDefinition")) {
        if (res.indexOf(node.$parent.id) < 0 && node.$parent.id != controlFlowInfo.self.id && !is(globalNodeMap[controlFlowInfo.self.id], "bpmn:BoundaryEvent")) {
          res.push(node.$parent.id)
        }
      }
    })
    return res
  },
  getCountExternalTasks: () => {
    let res = 0
    controlFlowInfo.nodeList.forEach(nodeId => {
      if (
        hasExternalCall({
          nodeId,
          globalNodeMap,
        })
      ) res++
    })
    return res
  },
  getStartedMessages: processId => {
    let res = []
    controlFlowInfo.nodeList.forEach(nodeId => {
      let node = globalNodeMap.get(nodeId)
      if (is(node, "bpmn:StartEvent") && node.$parent.id === processId && node.eventDefinitions
        && is(node.eventDefinitions[0], "bpmn:MessageEventDefinition") && globalNodeMap.get(node.$parent.id).triggeredByEvent)
        res.push(nodeId)
    })
    return res
  },
  getParent: nodeId => {
    // Retrieves the id of the parent
    let node = globalNodeMap[nodeId]
    if (is(node, "bpmn:StartEvent") && node.$parent && globalNodeMap[node.$parent.id].triggeredByEvent)
      return globalNodeMap[node.$parent.id].$parent.id
    if (is(node, "bpmn:BoundaryEvent") && node.cancelActivity)
      return node.attachedToRef.id
    return node.$parent ? node.$parent.id : nodeId
  },
  getContractName: nodeId => {
    // Retrieves the contract name related to the node.
    let node = globalNodeMap[nodeId]
    if (is(node, "bpmn:StartEvent") && node.$parent && globalNodeMap[node.$parent.id].triggeredByEvent)
      return node.$parent.id
    if (is(node, "bpmn:BoundaryEvent")) return node.id
    return controlFlowInfo.self.id
  },
  getAllChildren: (subprocId, direct) => {
    let taken = direct ? [] : [subprocId]
    controlFlowInfo.nodeList
      .map(nodeId => globalNodeMap[nodeId])
      .forEach(e => {
        if (is(e, "bpmn:SubProcess") || callActivities.indexOf(e.id) >= 0 || (nonInterruptingEvents.indexOf(e.id) >= 0 && !is(e, "bpmn:StartEvent")))
          if (((direct && subprocId !== e.id && e.$parent.id === subprocId) || !direct) && taken.indexOf(e.id) < 0)
            taken.push(e.id)
      })
    return taken
  },
  isStartingContractEvent: (eventId, processId) => {
    let evt = globalNodeMap[eventId]
    if (is(evt, "bpmn:StartEvent")) {
      if (globalNodeMap[evt.$parent.id].triggeredByEvent)
        return evt.$parent.id !== processId
      if (is(evt.eventDefinitions[0], "bpmn:MessageEventDefinition"))
        return true
    } else if (is(evt, "bpmn:BoundaryEvent")) {
      return eventId !== processId
    } else if (is(evt, "bpmn:IntermediateCatchEvent") && is(evt.eventDefinitions[0], "bpmn:MessageEventDefinition"))
      return true
    return false
  },
  isInterrupting: eventId => {
    // True if an event is interrupting
    let node = globalNodeMap[eventId]
    if (node.eventDefinitions && is(node.eventDefinitions[0], "bpmn:ErrorEventDefinition"))
      return true
    if (is(node, "bpmn:StartEvent") && node.$parent && globalNodeMap[node.$parent.id].triggeredByEvent)
      return node.isInterrupting != false
    if (is(node, "bpmn:BoundaryEvent"))
      return node.cancelActivity != false
    return false
  },
  isEmbeddedSubprocess: subprocessId => {
    return globalControlFlowInfo
      .find(
        ({
          self: {
            id,
          }
        }) =>
          id === subprocessId
      )
      .isEmbedded
  },
  isBoundaryEvent: evtId => {
    return controlFlowInfo.boundaryEvents.indexOf(evtId) >= 0
  },
  preMarking: nodeId => {
    let node = globalNodeMap[nodeId]
    let bitarray = []
    if (node.incoming)
      for (let incoming of node.incoming)
        bitarray[controlFlowInfo.edgeIndexMap.get(incoming.id)] = 1
    else bitarray[0] = 1
    let result = "0b"
    for (let i = bitarray.length - 1; i >= 0; i--)
      result += bitarray[i] ? "1" : "0"
    return new BigNumber(result).toFixed()
  },
  postMarking: nodeId => {
    let node = globalNodeMap[nodeId]
    let bitarray = []
    let result = "0b"
    if (node.outgoing)
      for (let outgoing of node.outgoing) {
        bitarray[controlFlowInfo.edgeIndexMap.get(outgoing.id)] = 1
      }
    else result = "0"
    for (let i = bitarray.length - 1; i >= 0; i--)
      result += bitarray[i] ? "1" : "0"
    return new BigNumber(result).toFixed()
  },
  subprocessNodeMarking: subprocessId => {
    let bitarray = []
    Object.keys(globalNodeMap)
      .map(key=> globalNodeMap[key])
      .forEach(node => {
        if (node.$parent && node.$parent.id === subprocessId) {
          if (is(node, "bpmn:Task") || is(node, 'bpmn:SubProcess'))
            bitarray[globalNodeIndexMap.get(node.id)] = 1
          else if (!globalNodeMap[subprocessId].triggeredByEvent && node.eventDefinitions && node.eventDefinitions[0] &&
            is(node.eventDefinitions[0], "bpmn:MessageEventDefinition"))
            bitarray[globalNodeIndexMap.get(node.id)] = 1
        }
      })
    let result = bitarray.length > 0 ? "0b" : 0
    for (let i = bitarray.length - 1; i >= 0; i--)
      result += bitarray[i] ? "1" : "0"
    return new BigNumber(result).toFixed()
  },
  subprocessNodeFullMarking: subprocId => {
    let children = [subprocId]
    let bitarray = []
    controlFlowInfo.nodeList.forEach(nodeId => {
      let node = globalNodeMap[nodeId]
      if (is(node, "bpmn:SubProcess") || callActivities.indexOf(node.id) >= 0 || (nonInterruptingEvents.indexOf(node.id) >= 0 && !is(node, "bpmn:StartEvent"))) {
        while (node.$parent) {
          if (node.$parent.id === subprocId) {
            if (multiinstanceActivities.indexOf(nodeId) >= 0 || callActivities.indexOf(node.id) >= 0 || nonInterruptingEvents.indexOf(node.id) >= 0) {
              bitarray[globalNodeIndexMap.get(nodeId)] = 1
            }
            else if (children.indexOf(nodeId) < 0) {
              children.push(nodeId)
            }
            break
          }
          node = node.$parent
        }
      }
    })
    let result = "0b"
    if (globalNodeIndexMap.get(subprocId))
      bitarray[globalNodeIndexMap.get(subprocId)] = 1
    controlFlowInfo.nodeList
      .map(nodeId => globalNodeMap[nodeId])
      .forEach(node => {
        if (node.$parent && children.indexOf(node.$parent.id) >= 0) {
          bitarray[globalNodeIndexMap.get(node.id)] = 1
        }
      })
    catchingMessages
      .map(evtId => globalNodeMap[evtId])
      .forEach(evt => {
        if (evt.attachedToRef && children.indexOf(evt.attachedToRef) >= 0) {
          bitarray[globalNodeIndexMap.get(evt.id)] = 1
        }
      })
    for (let i = bitarray.length - 1; i >= 0; i--)
      result += bitarray[i] ? "1" : "0"
    return result === '0b' ? new BigNumber(0) : new BigNumber(result).toFixed()
  },
  subprocessStartMarking: subprocessId => {
    console.log({ subprocessId })
    console.log(controlFlowInfo.edgeIndexMap)
    let toSearch = globalNodeMap[subprocessId]
    let bitarray = []
    let result = "0b"
    if (is(toSearch, "bpmn:BoundaryEvent")) {
      for (let outgoing of toSearch.outgoing) {
        bitarray[controlFlowInfo.edgeIndexMap.get(outgoing.id)] = 1
      }
    } else {
      for (let node of toSearch.flowElements.filter(
        e => is(e, "bpmn:FlowNode") && is(e, "bpmn:StartEvent")
      )) {
        if (node.$parent.id === subprocessId)
          if (!globalNodeMap[node.$parent.id].triggeredByEvent &&
            node.eventDefinitions && node.eventDefinitions[0] &&
            is(node.eventDefinitions[0], "bpmn:MessageEventDefinition"))
            bitarray[0] = 1
          else if (node.outgoing)
            for (let outgoing of node.outgoing)
              bitarray[controlFlowInfo.edgeIndexMap.get(outgoing.id)] = 1
      }
    }
    console.log({ bitarray })
    for (let i = bitarray.length - 1; i >= 0; i--)
      result += bitarray[i] ? "1" : "0"
    console.log({ result })
    return new BigNumber(result).toFixed()
  },
  getAllAncestorsMask: subprocId => {
    let bitarray = []
    let result = "0b"
    let node = globalNodeMap[subprocId]
    while (node.$parent) {
      bitarray[controlFlowInfo.nodeIndexMap.get(node.id)] = 1
      node = node.$parent
    }
    for (let i = bitarray.length - 1; i >= 0; i--)
      result += bitarray[i] ? "1" : "0"
    return new BigNumber(result).toFixed()
  },
  subprocessMarking: subprocessId => {
    let bitarray = []
    let result = "0b"
    let localInfo = globalControlFlowInfo
      .find(
        ({
          self: {
            id,
          }
        }) =>
          id === subprocessId
      )
    let edgeList = []
    localInfo.nodeList.forEach(nodeId => {
      let node = globalNodeMap[nodeId]
      if (node.$parent && node.$parent.id === subprocessId && node.incoming) {
        for (let incoming of node.incoming) {
          edgeList.push(incoming.id)
        }
      }
    })
    edgeList.forEach(edgeId => {
      bitarray[controlFlowInfo.edgeIndexMap.get(edgeId)] = 1
    })
    for (let i = bitarray.length - 1; i >= 0; i--)
      result += bitarray[i] ? "1" : "0"
    return new BigNumber(result).toFixed()
  },
  subprocessFullMarking: subprocId => {
    let bitarray = []
    let result = "0b"
    let children = [subprocId]
    controlFlowInfo.nodeList.forEach(nodeId => {
      let node = globalNodeMap[nodeId]
      if (is(node, "bpmn:SubProcess") && multiinstanceActivities.indexOf(nodeId) < 0) {
        while (node.$parent) {
          if (node.$parent.id === subprocId) {
            if (children.indexOf(nodeId) < 0)
              children.push(nodeId)
            break
          }
          node = node.$parent
        }
      }
    })
    children.forEach(subprocessId => {
      let localInfo = globalControlFlowInfo
        .find(
          ({
            self: {
              id,
            }
          }) =>
            id === subprocessId
        )
    
      localInfo.edgeList.forEach(edgeId => {
        bitarray[controlFlowInfo.edgeIndexMap.get(edgeId)] = 1
      })
    })
    for (let i = bitarray.length - 1; i >= 0; i--)
      result += bitarray[i] ? "1" : "0"
    return new BigNumber(result).toFixed()
  },
  flowEdgeIndex: flowEdgeId => {
    let bitarray = []
    bitarray[controlFlowInfo.edgeIndexMap.get(flowEdgeId)] = 1
    let result = "0b"
    for (let i = bitarray.length - 1; i >= 0; i--)
      result += bitarray[i] ? "1" : "0"
    return new BigNumber(result).toFixed()
  },
  flowNodeIndex: flowNodeId => {
    let bitarray = []
    bitarray[globalNodeIndexMap.get(flowNodeId)] = 1
    let result = "0b"
    for (let i = bitarray.length - 1; i >= 0; i--)
      result += bitarray[i] ? "1" : "0"
    return new BigNumber(result).toFixed()
  },
  nodeRealIndex: nodeId => {
    return globalNodeIndexMap.get(nodeId)
  },
  isPartOfDeferredChoice: eventId => {
    let event = globalNodeMap[eventId]
    if (event.incoming) {
      let node = event.incoming[0].sourceRef
      return is(node, "bpmn:EventBasedGateway")
    }
    return false
  },
  getDeferredChoiceElements: nodeId => {
    let event = globalNodeMap[nodeId]
    let res = []
    if (event.incoming) {
      let node = event.incoming[0].sourceRef
      if (is(node, "bpmn:EventBasedGateway")) {
        for (let outgoing of node.outgoing) {
          if (outgoing.targetRef.id !== nodeId)
            res.push(outgoing.targetRef.id)
        }
      }
    }
    return res
  },
  deferredChoiceNodeMarking: nodeId => {
    let event = globalNodeMap[nodeId]
    let bitarray = []
    if (event.incoming) {
      let node = event.incoming[0].sourceRef
      if (is(node, "bpmn:EventBasedGateway")) {
        for (let outgoing of node.outgoing) {
          bitarray[controlFlowInfo.nodeIndexMap.get(outgoing.targetRef.id)] = 1
        }
      }
    }
    let result = "0"
    for (let i = bitarray.length - 1; i >= 0; i--)
      result += bitarray[i] ? "1" : "0"
    return new BigNumber(result).toFixed()
  },
  deferredChoiceMarking: eventId => {
    let event = globalNodeMap[eventId]
    let node = event.incoming[0].sourceRef
    let bitarray = []
    let result = "0b"
    if (node.outgoing)
      for (let outgoing of node.outgoing) {
        bitarray[controlFlowInfo.edgeIndexMap.get(outgoing.id)] = 1
      }
    else result = "0"
    for (let i = bitarray.length - 1; i >= 0; i--)
      result += bitarray[i] ? "1" : "0"
    return new BigNumber(result).toFixed()
  },
  globalDeclarations: () => {
    if (controlFlowInfo.globalParameters &&
      controlFlowInfo.globalParameters.length > 0)
      return controlFlowInfo.globalParameters
    else return ""
  },
  getOracleFunction: nodeId => {
    if (controlFlowInfo.oracleTaskMap.has(nodeId))
      return controlFlowInfo.oracleInfo.get(
        controlFlowInfo.oracleTaskMap.get(nodeId)
      ).functionName
    return ""
  },
  nodeParameters: nodeId => {
    let node = globalNodeMap[nodeId]
    if (node.documentation && node.documentation[0].text && node.documentation[0].text.length > 0) {
      let resDict = extractParameters(node.documentation[0].text, nodeId, null)
      return resDict !== undefined ? resDict.get("input").length > 0 || resDict.get("output").length > 0 : false
    }
    return false
  },
  typeParameters: (nodeId, isInput, hasPreviousParameter) => {
    let node = globalNodeMap[nodeId]
    let res = ""
    if (node.documentation && node.documentation[0].text && node.documentation[0].text.length > 0 && extractParameters(node.documentation[0].text, nodeId, null) !== undefined) {
      let localParams = isInput
        ? extractParameters(node.documentation[0].text, nodeId, null).get("input")
        : extractParameters(node.documentation[0].text, nodeId, null).get("output")
      if (localParams.length > 0) {
        res = localParams[0]
        for (let i = 2; i < localParams.length; i += 2)
          res += ", " + localParams[i]
      }
    }
    return hasPreviousParameter && res.length > 0
      ? ", " + res
      : res
  },
  concatParameters: (nodeId, isInput, hasType, hasPreviousParameter) => {
    let node = globalNodeMap[nodeId]
    let res = ""
    if (node.documentation && node.documentation[0].text && node.documentation[0].text.length > 0 && extractParameters(node.documentation[0].text, nodeId, null) !== undefined) {
      let localParams = isInput
        ? extractParameters(node.documentation[0].text, nodeId, null).get("input")
        : extractParameters(node.documentation[0].text, nodeId, null).get("output")
      if (localParams.length > 0) {
        res = hasType
          ? localParams[0] + " " + localParams[1]
          : localParams[1]
        for (let i = 2; i < localParams.length; i += 2)
          res += "," + (hasType
            ? localParams[i] + " " + localParams[i + 1]
            : localParams[i + 1])
      }
    }
    return hasPreviousParameter && res.length > 0 ? ", " + res : res
  },
  nodeFunctionBody: nodeId => {
    let node = globalNodeMap[nodeId]
    if (node.script) {
      return node.script.split("->")
    } else if (node.documentation && node.documentation[0].text && node.documentation[0].text.length > 0 && extractParameters(node.documentation[0].text, nodeId, null) !== undefined) {
      return extractParameters(node.documentation[0].text, nodeId, null).get("body")
    } else return ""
  },
  getCondition: flowEdge =>
    flowEdge.conditionExpression
      ? flowEdge.conditionExpression.body
      : flowEdge.name ? flowEdge.name : flowEdge.id,
  is: is
})