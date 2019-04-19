"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _debug2 = _interopRequireDefault(require("debug"));

var _bpmnModdle = _interopRequireDefault(require("bpmn-moddle"));

var ejs = _interopRequireWildcard(require("ejs"));

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var _definitions = require("./definitions");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/* babel-plugin-inline-import '../../../templates/bpmn2sol.ejs' */
var bpmn2solEJS = "\nimport \"AbstractFactory\";\nimport \"AbstractProcess\";\nimport \"AbstractRegistry\";\n<% if(oracleTaskMap.size > 0) { -%>\ncontract Oracle_Wrapper {\n<% oracleTaskMap.forEach((oracleKey, nodeId, map) => { -%>\n    function <%= getOracleFunction(nodeId) %> (<%= typeParameters(nodeId, true, false) %>, function (uint<%= typeParameters(nodeId, false, true) %>) external returns(bool)) external returns(uint);\n<% }) -%>\n}\n<% } -%>\n\ncontract <%= nodeName(processId()) %>_Factory is AbstractFactory {\n    function newInstance(address parent, address processRegistry) public returns(address) {\n        <%= nodeName(processId()) %>_Contract newContract = new <%= nodeName(processId()) %>_Contract(parent, worklist, processRegistry);\n        return address(newContract);\n    }\n\n    function startInstanceExecution(address processAddress) public {\n        <%= nodeName(processId()) %>_Contract(processAddress).startExecution();\n    }\n}\n\n<% var contracts2Call = getContracts2Call();\n   var subprocessToKill = getPossibleKillSubprocess();\n   var eventsToCatch = getCatchingEvents(processId());\n   var eventTypes = allEventTypes(); -%>\n\ncontract <%= nodeName(processId()) %>_Contract is AbstractProcess {\n\n    uint public marking = uint(<%= subprocessStartMarking(processId()) %>);\n    uint public startedActivities = 0;\n<% if(contracts2Call.length > 0) { -%>\n    address[] private subInstanceAddresses;\n    mapping(uint => uint) private subInstanceStartedIndexes;\n<% } -%>\n\n<% /* --------- Solidity events to throw when an end message event is thrown  ---------------------------- */ -%>\n<% var messages = getThrowingMessages();\n   if(messages.length > 0) {\n    messages.forEach(nodeId => { -%>\n    // <%= nodeName(nodeId) %>\n    event <%= nodeId %>_Mesage(bytes32 messageText);\n<% })} -%>\n\n<% /* --------- Fields for interacting with external resources by means of callbacks (Oracle)  --------------- */ -%>\n<% if(oracleInfo.size > 0) { -%>\n    mapping(uint => address) oracleAddresses;\n<% } -%>\n    // Process Variables\n    <%= globalDeclarations() -%>\n\n    constructor(address _parent, address _worklist, address _processRegistry) public AbstractProcess(_parent, _worklist, _processRegistry) {\n<% oracleTaskMap.forEach((oracleKey, nodeId, map) => { -%>\n        oracleAddresses[<%= flowNodeIndex(nodeId) %>] = <%= oracleInfo.get(oracleKey).address %>;\n<% }) -%>\n<% if(getCountExternalTasks() > 0) { -%>\n        for (uint i = 0; i < <%= getCountExternalTasks() %>; i++)\n            requestedID.push(0);\n<% } -%>\n    }\n\n    function startExecution() public {\n        require(marking == uint(<%= subprocessStartMarking(processId()) %>) && startedActivities == 0);\n        step(uint(<%= subprocessStartMarking(processId()) %>), 0);\n    }\n\n<% /* --------------------------------- Event Handling ---------------------------------- */ -%>\n    function handleEvent(bytes32 code, bytes32 eventType, uint _instanceIndex, bool isInstanceCompleted) public {\n<% if(contracts2Call.length > 0 ) { -%>\n        (uint256 tmpMarking, uint256 tmpStartedActivities)  = (marking, startedActivities);\n        uint maskIndex = uint(1) << _instanceIndex;\n        uint sourceChild = 0;\n<%   var first = true;\n       contracts2Call.forEach(nodeId => {\n          var inFirst = true;\n          var node = nodeMap.get(nodeId); -%>\n<% if(first) { first = false; -%>        if <% } else { -%>        else if <% }-%>(subInstanceStartedIndexes[<%= nodeRealIndex(nodeId) %>] & uint(maskIndex) != 0) {\n            if(isInstanceCompleted)\n                subInstanceStartedIndexes[<%= nodeRealIndex(nodeId) %>] &= uint(~maskIndex);\n<% if(is(node, 'bpmn:BoundaryEvent')) { -%>\n<% var terminateCandidates = getTerminateCandidates(processId());\n     if(terminateCandidates.length > 0 ) {\n       terminateCandidates.forEach(bEvtId => {\n         var evtParentId = nodeMap.get(bEvtId).$parent.id;\n         if (inFirst && evtParentId === node.$parent.id) {\n            inFirst = false; -%>\n            if(eventType == \"Terminate\") {\n  <%     if(evtParentId === processId()) { -%>\n                killProcess();\n                propagateEvent('Default', 'Default', 0, 0, <%= flowNodeIndex(nodeId) %>);\n  <%     } else { -%>\n                (tmpMarking, tmpStartedActivities) = killProcess(uint(<%= flowNodeIndex(evtParentId) %>), tmpMarking, tmpStartedActivities);\n                step(tmpMarking | uint(<%= postMarking(evtParentId) %>), tmpStartedActivities);\n  <%     } -%>\n            }\n  <% } }) } -%>\n<% } -%>\n<% if(inFirst) { inFirst = false; -%>            if <% } else { -%>            else if <% }-%>(eventType == \"Default\") {\n<% if (node.loopCharacteristics && node.loopCharacteristics.$type === 'bpmn:MultiInstanceLoopCharacteristics') { -%>\n<%   if (node.loopCharacteristics.isSequential) { -%>\n                if(++_instanceIndex < subInstanceAddresses.length && subInstanceAddresses[_instanceIndex] == 0) {\n                    AbstractProcess child_<%= flowNodeIndex(nodeId) %> = AbstractProcess(AbstractRegistry(processRegistry).newInstanceFor(uint(<%= nodeRealIndex(nodeId) %>), address(this)));\n                    subInstanceStartedIndexes[<%= nodeRealIndex(nodeId) %>] |= (uint(1) << _instanceIndex);\n                    subInstanceAddresses[_instanceIndex] = child_<%= flowNodeIndex(nodeId) %>;\n                    child_<%= flowNodeIndex(nodeId) %>.setInstanceIndex(_instanceIndex);\n                }\n                else {\n                    step(tmpMarking | uint(<%= postMarking(nodeId) %>), tmpStartedActivities & uint(~<%= flowNodeIndex(nodeId) %>));\n                }\n<%  } else { -%>\n                if (subInstanceStartedIndexes[<%= nodeRealIndex(nodeId) %>] == 0)\n                    step(tmpMarking | uint(<%= postMarking(nodeId) %>), tmpStartedActivities & uint(~<%= flowNodeIndex(nodeId) %>));\n<% }} else if(!is(node, 'bpmn:BoundaryEvent') && !node.triggeredByEvent) { -%>\n                step(tmpMarking | uint(<%= postMarking(nodeId) %>), tmpStartedActivities & uint(~<%= flowNodeIndex(nodeId) %>));\n<% } else { -%>\n                tmpStartedActivities &= uint(~<%= flowNodeIndex(nodeId) %>);\n                (marking, startedActivities) = (tmpMarking, tmpStartedActivities);\n                if(tmpMarking | tmpStartedActivities == 0)\n                    propagateEvent(\"<%= nodeName(nodeId) %>\", \"Default\", tmpMarking, tmpStartedActivities, uint(<%= flowNodeIndex(nodeId) %>));\n<% } -%>\n            }\n<% if(eventsToCatch.length > 0) { -%>\n            else\n                sourceChild |= uint(<%= flowNodeIndex(nodeId) %>);\n<% } -%>\n        }\n<% }) -%>\n<% first = true;\n   eventsToCatch.forEach(evtId => {\n   var nodeEvt = nodeMap.get(evtId);\n   var evtType = eventType(evtId); -%>\n<% if (evtType === 'Error' || evtType === 'Escalation') {\n          var candidateSubprocMask = getProcessCandidatesMaskFrom(evtId, evtType, nodeName(evtId), contracts2Call, eventsToCatch); -%>\n<% if(first) { first = false; -%>        if <% } else { -%>        else if <% }-%>(eventType == \"<%= evtType %>\" && code == \"<%= nodeName(evtId) %>\" && sourceChild & uint(<%= candidateSubprocMask %>) != 0) {\n<%    if(isInterrupting(evtId)) {\n        if(nodeEvt.$parent.triggeredByEvent) {\n          var startingKill = nodeEvt.$parent.$parent.id === processId() ? 0 : flowNodeIndex(nodeEvt.$parent.$parent.id); -%>\n            (tmpMarking, tmpStartedActivities) = killProcess(uint(<%= startingKill %>), tmpMarking, tmpStartedActivities);\n            step(tmpMarking | uint(<%= subprocessStartMarking(nodeEvt.$parent.id) %>), tmpStartedActivities | uint(<%= flowNodeIndex(nodeEvt.$parent.id) %>));\n<%            } else { -%>\n            (tmpMarking, tmpStartedActivities) = killProcess(uint(<%= flowNodeIndex(nodeEvt.attachedToRef.id) %>), tmpMarking, tmpStartedActivities);\n            step(tmpMarking | uint(<%= postMarking(evtId) %>), tmpStartedActivities);\n<%            } -%>\n<%          } else {  -%>\n            createNewSubprocessInstance(<%= nodeRealIndex(evtId) %>);\n<% if (nodeEvt.attachedToRef) {\n      let nodeId = nodeEvt.attachedToRef.id;\n      let node = nodeMap.get(nodeId);\n      if (node.loopCharacteristics && node.loopCharacteristics.$type === 'bpmn:MultiInstanceLoopCharacteristics') {\n        if (node.loopCharacteristics.isSequential) { -%>\n            if(++_instanceIndex < subInstanceAddresses.length && subInstanceAddresses[_instanceIndex] == 0) {\n                AbstractProcess child_<%= flowNodeIndex(nodeId) %> = AbstractProcess(AbstractRegistry(processRegistry).newInstanceFor(uint(<%= nodeRealIndex(nodeId) %>), address(this)));\n                subInstanceStartedIndexes[<%= nodeRealIndex(nodeId) %>] |= (uint(1) << _instanceIndex);\n                subInstanceAddresses[_instanceIndex] = child_<%= flowNodeIndex(nodeId) %>;\n                child_<%= flowNodeIndex(nodeId) %>.setInstanceIndex(_instanceIndex);\n                step(tmpMarking, tmpStartedActivities | uint(<%= flowNodeIndex(evtId) %>));\n            }\n            else {\n                step(tmpMarking | uint(<%= postMarking(nodeId) %>), tmpStartedActivities & uint(~<%= flowNodeIndex(nodeId) %>) | uint(<%= flowNodeIndex(evtId) %>));\n            }\n<%      } else { -%>\n            if (subInstanceStartedIndexes[<%= nodeRealIndex(nodeId) %>] == 0)\n                step(tmpMarking | uint(<%= postMarking(nodeId) %>), tmpStartedActivities & uint(~<%= flowNodeIndex(nodeId) %>) | uint(<%= flowNodeIndex(evtId) %>));\n<% }} else if(!is(node, 'bpmn:BoundaryEvent') && !node.triggeredByEvent) { -%>\n            step(tmpMarking | uint(<%= postMarking(nodeId) %>), tmpStartedActivities & uint(~<%= flowNodeIndex(nodeId) %>) | uint(<%= flowNodeIndex(evtId) %>));\n<% } -%>\n<% } else { -%>\n            step(tmpMarking, tmpStartedActivities | uint(<%= flowNodeIndex(evtId) %>));\n<%   }      } -%>\n            }\n<%  } -%>\n<% }); -%>\n        else {\n            (tmpMarking, tmpStartedActivities) = propagateEvent(code, eventType, tmpMarking, tmpStartedActivities, sourceChild);\n            step(tmpMarking, tmpStartedActivities);\n        }\n<% } else { -%>\n        // Process without calls to external contracts.\n        // No events to catch !!!\n<% } -%>\n    }\n\n<% /* --------------------------------- Kill Childrens & Broadcast ------------------------------ */ -%>\n    function killProcess() public {\n        (marking, startedActivities) = killProcess(0, marking, startedActivities);\n    }\n\n    function killProcess(uint processElementIndex, uint tmpMarking, uint tmpStartedActivities) internal returns(uint, uint) {\n<% if(contracts2Call.length == 0) {         /* Case No External contract call in the contract */ -%>\n        if(processElementIndex == 0)\n            tmpMarking = tmpStartedActivities = 0;\n<% if(subprocessToKill.length > 0) { -%>\n<%     subprocessToKill.forEach(subprocId => { -%>\n        else if(processElementIndex & uint(<%= flowNodeIndex(subprocId) %>) != 0) {\n            tmpMarking &= uint(~<%=subprocessFullMarking(subprocId)%>);\n            tmpStartedActivities &= uint(~<%= subprocessNodeFullMarking(subprocId) %>);\n        }\n<%      }) }\n} else {                                    /* Case External Contract Calls in Main contract */ -%>\n        uint externalContracts2Stop = 0;\n        uint allAddresses2Stop = 0;\n        if(processElementIndex == 0) {\n            tmpMarking = tmpStartedActivities = 0;\n<% var getContracts2CallMask = getContracts2CallMaskFrom(processId(), contracts2Call);\n   if(getContracts2CallMask > 0) { -%>\n            externalContracts2Stop = uint(<%= getContracts2CallMask %>);\n<% } -%>\n        }\n<% subprocessToKill.forEach(subprocId => { -%>\n        else if(processElementIndex & uint(<%= flowNodeIndex(subprocId) %>) != 0) {\n<% if(callActivities.indexOf(subprocId) >= 0) { -%>\n            externalContracts2Stop = uint(<%= flowNodeIndex(subprocId) %>);\n<% } else { -%>\n            tmpMarking &= uint(~<%= subprocessFullMarking(subprocId) %>);\n            tmpStartedActivities &= uint(~<%= subprocessNodeFullMarking(subprocId) %>);\n<%  var contracts2CallMask = getContracts2CallMaskFrom(subprocId, contracts2Call);\n    if (contracts2CallMask !== 0) { -%>\n            externalContracts2Stop = uint(<%= contracts2CallMask %>);\n<% } -%>\n<% } -%>\n        }\n<%  }) -%>\n<% contracts2Call.forEach(subprocId => { -%>\n        if(externalContracts2Stop & uint(<%= flowNodeIndex(subprocId) %>) != 0) {\n            allAddresses2Stop |= subInstanceStartedIndexes[<%= nodeRealIndex(subprocId) %>];\n            subInstanceStartedIndexes[<%= nodeRealIndex(subprocId) %>] = 0;\n        }\n<% }) -%>\n        for(uint j = 0; j < subInstanceAddresses.length; j++)\n            if(allAddresses2Stop & (uint(1) << j) != 0)\n                AbstractProcess(subInstanceAddresses[j]).killProcess();\n<% } -%>\n        return (tmpMarking, tmpStartedActivities);\n    }\n\n    function broadcastSignal() public {\n        (uint256 tmpMarking, uint256 tmpStartedActivities) = broadcastSignal(marking, startedActivities, 0);\n        step(tmpMarking, tmpStartedActivities);\n    }\n\n    function broadcastSignal(uint tmpMarking, uint tmpStartedActivities, uint sourceChild) internal returns(uint, uint) {\n<% eventsToCatch.forEach(nodeId => {\n     if(eventType(nodeId) === 'Signal') {\n       var node = nodeMap.get(nodeId);\n        if(is(node, 'bpmn:IntermediateCatchEvent')) {\n          if (isPartOfDeferredChoice(nodeId)) { -%>\n        if(tmpMarking & uint(<%= deferredChoiceMarking(nodeId) %>) == uint(<%= deferredChoiceMarking(nodeId) %>))\n            tmpMarking = tmpMarking & uint(~<%= deferredChoiceMarking(nodeId) %>) | uint(<%= postMarking(nodeId) %>);\n<%            var deferredNodeMarking = deferredChoiceNodeMarking(nodeId);\n              if(deferredNodeMarking != 0) { -%>\n            tmpStartedActivities &= uint(~<%= deferredNodeMarking %>);\n<%    } -%>\n<%        } else {      -%>\n        if(tmpMarking & uint(<%= preMarking(nodeId) %>) == uint(<%= preMarking(nodeId) %>))\n            tmpMarking = tmpMarking & uint(~<%= preMarking(nodeId) %>) | uint(<%= postMarking(nodeId) %>);\n<%  }} else if(is(node, 'bpmn:StartEvent')) {\n           var parent = nodeMap.get(node.$parent.id);\n           if (parent.triggeredByEvent) {\n              if (isInterrupting(nodeId)) { -%>\n        if(tmpMarking & uint(~<%= subprocessFullMarking(parent.id) %>) != 0 || tmpStartedActivities & uint(~<%= subprocessNodeFullMarking(parent.id) %>) != 0) {\n            (tmpMarking, tmpStartedActivities) = killProcess(0, tmpMarking, tmpStartedActivities);\n            tmpStartedActivities |= uint(<%= flowNodeIndex(parent.id) %>);\n            tmpMarking |= uint(<%= subprocessStartMarking(parent.id) %>);\n        }\n<%            } else { -%>\n        if(tmpMarking & uint(<%= subprocessFullMarking(processId()) %>) != 0 || tmpStartedActivities & uint(~<%= flowNodeIndex(parent.id) %>) != 0) {\n            createNewSubprocessInstance(<%= nodeRealIndex(nodeId) %>);\n            tmpStartedActivities |= <%= flowNodeIndex(nodeId) %>;\n        }\n<%            } -%>\n<%         } else { -%>\n               /* Starting subprocess (not event subprocess) */\n<%         } -%>\n<%      } else if (is(node, 'bpmn:BoundaryEvent')) { -%>\n        if(tmpStartedActivities & uint(<%= flowNodeIndex(node.attachedToRef.id) %>) != 0) {\n<%          if(isInterrupting(nodeId)) { -%>\n            (tmpMarking, tmpStartedActivities) = killProcess(uint(<%= flowNodeIndex(node.attachedToRef.id) %>), tmpMarking, tmpStartedActivities);\n            tmpMarking |= uint(<%= postMarking(nodeId) %>);\n<%          } else { -%>\n            createNewSubprocessInstance(<%= nodeRealIndex(nodeId) %>);\n            tmpStartedActivities |= uint(<%= flowNodeIndex(nodeId) %>);\n<%          } -%>\n        }\n<% } -%>\n<% }}) -%>\n<% if (contracts2Call.length > 0) { -%>\n        uint contracts2Broadcast = 0;\n<%  contracts2Call.forEach(nodeId => { -%>\n        if (tmpStartedActivities & uint(<%= flowNodeIndex(nodeId) %>) != 0)\n            contracts2Broadcast |= subInstanceStartedIndexes[<%= nodeRealIndex(nodeId) %>];\n<%  }) -%>\n        contracts2Broadcast &= uint(~sourceChild);\n        if(contracts2Broadcast != 0)\n            for(uint j = 0; j < subInstanceAddresses.length; j++)\n                if(contracts2Broadcast & (uint(1) << j) != 0)\n                    AbstractProcess(subInstanceAddresses[j]).broadcastSignal();\n<%  }   -%>\n        return (tmpMarking, tmpStartedActivities);\n    }\n\n<% /* --------------------------------- Functions from BPMN elements -------------------------- */ -%>\n<%  nodeList.forEach( nodeId => {\n        let node = nodeMap.get(nodeId),\n            nodePreMarking = preMarking(nodeId),\n            nodePostMarking = postMarking(nodeId);\n    if (is(node, 'bpmn:ServiceTask')) { -%>\n    // <%= nodeName(node.id) %>\n    function <%= nodeName(node.id) %>_callbak (uint reqId<%= concatParameters(name2Ids.get(nodeName[0]), false, true, true) %>) external returns(bool) {\n        require(msg.sender == oracleAddresses[<%= flowNodeIndex(node.id) %>]);\n        uint index = uint(1) << reqId;\n        if(requestedID[<%= nodeRealIndex(node.id) %>] & index == index) {\n            <%= nodeFunctionBody(nodeId) %>\n            requestedID[<%= nodeRealIndex(node.id) %>] &= ~uint(index);\n            step(marking | uint(<%= nodePostMarking %>), startedActivities);\n            return true;\n        }\n        return false ;\n    }\n<% }}); -%>\n\n<%  boundaryMessages = getMessages();\n    groupedIds = getWorkItemsGroupByParameters(false);\n    groupedIds.forEach(idGroup => { -%>\n    function <%= nodeName(idGroup[0]) %>_complete(uint elementIndex<%= concatParameters(idGroup[0], false, true, true) %>) external {\n        (uint256 tmpMarking, uint256 tmpStartedActivities) = (marking, startedActivities);\n<%    idGroup.forEach(nodeId => {\n        var node = nodeMap.get(nodeId); -%>\n        if(elementIndex == uint(<%= nodeRealIndex(nodeId) %>)) {\n            require(msg.sender == worklist && tmpStartedActivities & uint(<%= flowNodeIndex(nodeId) %>) != 0);\n<% if(boundaryMessages.indexOf(nodeId) < 0) {\n     var functionBody = nodeFunctionBody(nodeId);\n     if(functionBody.length > 0) { -%>\n           <%- functionBody %>\n<%   } -%>\n<% if (isPartOfDeferredChoice(nodeId)) {\n          var deferredNodeMarking = deferredChoiceNodeMarking(nodeId);\n          if(deferredNodeMarking != 0) { -%>\n            step(tmpMarking & uint(~<%= deferredChoiceMarking(nodeId) %>) | uint(<%= postMarking(nodeId) %>), tmpStartedActivities & uint(~<%= deferredNodeMarking %>));\n<%        } else { -%>\n            step(tmpMarking & uint(~<%= deferredChoiceMarking(nodeId) %>) | uint(<%= postMarking(nodeId) %>), tmpStartedActivities);\n<%        } -%>\n<% } else { -%>\n            step(tmpMarking | uint(<%= postMarking(nodeId) %>), tmpStartedActivities & uint(~<%= flowNodeIndex(nodeId) %>));\n<% }} else {\n  var parent = nodeMap.get(node.$parent.id);\n  if(parent.triggeredByEvent) { -%>\n<% if (isInterrupting(nodeId)) { -%>\n            killProcess();\n            step(uint(<%= subprocessStartMarking(parent.id) %>), uint(<%= flowNodeIndex(parent.id) %>));\n<% } else { -%>\n            createNewSubprocessInstance(<%= nodeRealIndex(nodeId) %>);\n            step(tmpMarking, tmpStartedActivities | <%= flowNodeIndex(parent.id) %>);\n<%   } -%>\n<% } else {\n    var attachedTo = node.attachedToRef.id;\n    if (isInterrupting(nodeId)) { -%>\n            (tmpMarking, tmpStartedActivities) = killProcess(uint(<%= flowNodeIndex(attachedTo) %>), tmpMarking, tmpStartedActivities);\n            step(tmpMarking | uint(<%= postMarking(nodeId) %>), tmpStartedActivities);\n<%  } else { -%>\n            createNewSubprocessInstance(<%= nodeRealIndex(nodeId) %>);\n            step(tmpMarking, tmpStartedActivities | <%= flowNodeIndex(nodeId) %>);\n<%     }}} -%>\n            return;\n        }\n<% }) -%>\n    }\n<%   }) -%>\n\n<% if(contracts2Call.length > 0) { -%>\n    function createNewSubprocessInstance(uint nodeIndex) private {\n        AbstractProcess child = AbstractProcess(AbstractRegistry(processRegistry).newInstanceFor(nodeIndex, address(this)));\n        uint index = subInstanceAddresses.length;\n        subInstanceAddresses.push(address(child));\n        subInstanceStartedIndexes[nodeIndex] |= (uint(1) << index);\n        child.setInstanceIndex(index);\n    }\n<% } -%>\n\n<% /* ----------------- Step: Method to execute internal activities automatically ------------------ */ -%>\n    function step(uint tmpMarking, uint tmpStartedActivities) internal {\n        while (true) {\n<% nodeList.forEach(nodeId => {\n    var node = nodeMap.get(nodeId);\n    var nodePostMarking = postMarking(nodeId);\n    if(catchingMessages.indexOf(nodeId) < 0) {\n        var nodePreMarking = preMarking(nodeId);\n     if (node.loopCharacteristics && node.loopCharacteristics.$type === 'bpmn:MultiInstanceLoopCharacteristics') { -%>\n            if (tmpMarking & uint(<%= nodePreMarking %>) != 0) {\n<%        if(!is (node, \"bpmn:Task\")) { -%>\n                for(uint i = 0; i < <%= node.loopCharacteristics.loopCardinality ? node.loopCharacteristics.loopCardinality.body : 1 %>; i++) {\n<% if (node.loopCharacteristics.isSequential) { -%>\n                    subInstanceAddresses.push(0);\n<% } else { -%>\n                    createNewSubprocessInstance(<%= nodeRealIndex(nodeId) %>);\n<% } -%>\n                }\n<% if (node.loopCharacteristics.isSequential) { -%>\n                AbstractProcess child_<%= flowNodeIndex(nodeId) %> = AbstractProcess(AbstractRegistry(processRegistry).newInstanceFor(uint(<%= nodeRealIndex(nodeId) %>), address(this)));\n                uint index = subInstanceAddresses.length - <%= node.loopCharacteristics.loopCardinality ? node.loopCharacteristics.loopCardinality.body : 1 %>;\n                subInstanceStartedIndexes[<%= nodeRealIndex(nodeId) %>] |= (uint(1) << index);\n                subInstanceAddresses[index] = child_<%= flowNodeIndex(nodeId) %>;\n                child_<%= flowNodeIndex(nodeId) %>.setInstanceIndex(index);\n<% } -%>\n                tmpMarking &= uint(~<%= nodePreMarking %>);\n                tmpStartedActivities |= <%= flowNodeIndex(nodeId) %>;\n<%      } -%>\n                continue;\n            }\n<% } else if (is(node, 'bpmn:ExclusiveGateway')) { -%>\n            if (tmpMarking & uint(<%= nodePreMarking %>) != 0) {\n                tmpMarking &= uint(~<%= nodePreMarking %>);\n<%          if (node.outgoing && node.outgoing.length > 1) {\n            var i = 0; node.outgoing.forEach( outgoing => { -%>\n<%= i > 0 ? 'else ' : '' %><%if (i < node.outgoing.length - 1){ %>if (<%- getCondition(outgoing) %>)<% } -%>\n                tmpMarking |= uint(<%= flowEdgeIndex(outgoing.id) %>);\n<% i++;}) -%>\n<%          } else { -%>\n                tmpMarking |= uint(<%= postMarking(nodeId) %>);\n<%          } -%>\n                continue;\n            }\n<% } else if(is(node, 'bpmn:ParallelGateway') || is(node,'bpmn:EventBasedGateway')) { -%>\n            if (tmpMarking & uint(<%= nodePreMarking %>) == uint(<%= nodePreMarking %>)) {\n                tmpMarking = tmpMarking & uint(~<%= nodePreMarking %>) | uint(<%= nodePostMarking %>);\n                continue;\n            }\n<% } else if(is(node, 'bpmn:SubProcess') && !node.triggeredByEvent && multiinstanceActivities.indexOf(nodeId) < 0) { -%>\n            if (tmpMarking & uint(<%= nodePreMarking %>) != 0) {\n                tmpStartedActivities |= uint(<%= flowNodeIndex(nodeId) %>);\n                tmpMarking = tmpMarking & uint(~<%= nodePreMarking %>) | uint(<%= subprocessStartMarking(nodeId) %>);\n                continue;\n            }\n<% } else if(is(node, 'bpmn:ReceiveTask')) {\n    if (isPartOfDeferredChoice(nodeId)) { -%>\n            if (tmpStartedActivities & uint(<%= flowNodeIndex(nodeId) %>) == 0 && tmpMarking & uint(<%= deferredChoiceMarking(nodeId) %>) == uint(<%= deferredChoiceMarking(nodeId) %>)) {\n                <%= nodeName(processId()) %>_AbstractWorklist(worklist).<%= nodeName(nodeId) %>_start(<%= nodeRealIndex(nodeId) %><%= concatParameters(nodeId, true, false, true) %>);\n                tmpStartedActivities |= uint(<%= flowNodeIndex(nodeId) %>);\n                continue;\n            }\n<%  } else { -%>\n            if (tmpMarking & uint(<%= nodePreMarking %>) != 0) {\n                <%= nodeName(processId()) %>_AbstractWorklist(worklist).<%= nodeName(nodeId) %>_start(<%= nodeRealIndex(nodeId) %><%= concatParameters(nodeId, true, false, true) %>);\n                tmpMarking &= uint(~<%= nodePreMarking %>);\n                tmpStartedActivities |= uint(<%= flowNodeIndex(node.id) %>);\n                continue;\n            }\n<% }} else if((is(node, 'bpmn:Task'))) { -%>\n            if (tmpMarking & uint(<%= nodePreMarking %>) != 0) {\n<%    if (is(node, 'bpmn:UserTask'))  { -%>\n                <%= nodeName(processId()) %>_AbstractWorklist(worklist).<%= nodeName(nodeId) %>_start(<%= nodeRealIndex(nodeId) %><%= concatParameters(nodeId, true, false, true) %>);\n                tmpMarking &= uint(~<%= nodePreMarking %>);\n                tmpStartedActivities |= uint(<%= flowNodeIndex(node.id) %>);\n<%  } else if(is(node, 'bpmn:ServiceTask')) {\n          var functName = oracleTaskMap.get(nodeId);\n          var localInfo = oracleInfo.get(functName); -%>\n                uint reqId = Oracle_Wrapper(oracleAddresses[<%= flowNodeIndex(nodeId) %>]).<%= localInfo.functionName %>(<%= concatParameters(node.id, true, false, false) %>, this.<%= nodeName(nodeId) %>_callbak);\n                requestedID[<%= nodeRealIndex(node.id) %>] |= uint(1) << reqId;\n                tmpMarking &= uint(~<%= nodePreMarking %>);\n                tmpStartedActivities |= uint(<%= flowNodeIndex(node.id) %>);\n<%  } else if (is(node, 'bpmn:ScriptTask')) {\n         if (node.script) { -%>\n                <%- nodeFunctionBody(nodeId) -%>\n<%       } -%>\n                tmpMarking = tmpMarking & uint(~<%= nodePreMarking %>) | uint(<%= nodePostMarking %>);\n<%  } else { -%>\n                tmpMarking = tmpMarking & uint(~<%= nodePreMarking %>) | uint(<%= nodePostMarking %>);\n<%  } -%>\n                continue;\n            }\n<% } else if(is(node, 'bpmn:EndEvent')) {\n          var evtType = eventType(nodeId); -%>\n            if (tmpMarking & uint(<%= nodePreMarking %>) != 0) {\n<% if(evtType === 'Default' || evtType === 'Message') { -%>\n<% if(evtType === 'Message') { -%>\n                <%= nodeId %>_Mesage('<%= nodeName(nodeId) %>');\n<% } -%>\n                tmpMarking &= uint(~<%= nodePreMarking %>);\n                if (tmpMarking & uint(<%= subprocessFullMarking(node.$parent.id) %>) == 0 && tmpStartedActivities & uint(<%= subprocessNodeMarking(node.$parent.id) %>) == 0) {\n<% if(node.$parent.id === processId() || nodeMap.get(node.$parent.id).triggeredByEvent || (is(nodeMap.get(processId()), 'bpmn:BoundaryEvent') && node.$parent.id === nodeMap.get(processId()).$parent.id)) { -%>\n<% if(nodeMap.get(node.$parent.id).triggeredByEvent) { -%>\n                    tmpStartedActivities &= uint(~<%= flowNodeIndex(node.$parent.id) %>);\n<% } -%>\n                    (tmpMarking, tmpStartedActivities) = propagateEvent(\"<%= nodeName(nodeId) %>\", \"Default\", tmpMarking, tmpStartedActivities, uint(<%= flowNodeIndex(nodeId) %>));\n<% } else { -%>\n                    tmpStartedActivities &= uint(~<%= flowNodeIndex(node.$parent.id) %>);\n                    tmpMarking |= uint(<%= postMarking(node.$parent.id) %>);\n<% } -%>\n                }\n<% } else if (evtType === 'Terminate') { -%>\n<% if(is(nodeMap.get(processId()), 'bpmn:BoundaryEvent') && node.$parent.id === nodeMap.get(processId()).$parent.id) { -%>\n                (tmpMarking, tmpStartedActivities) = propagateEvent(\"<%= nodeName(nodeId) %>\", \"Terminate\", tmpMarking, tmpStartedActivities, uint(<%= flowNodeIndex(nodeId) %>));\n<% } else if(node.$parent.id === processId()) { -%>\n                (tmpMarking, tmpStartedActivities) = killProcess(0, tmpMarking, tmpStartedActivities);\n                (tmpMarking, tmpStartedActivities) = propagateEvent(\"<%= nodeName(nodeId) %>\", \"Default\", tmpMarking, tmpStartedActivities, uint(<%= flowNodeIndex(nodeId) %>));\n<% } else { -%>\n                (tmpMarking, tmpStartedActivities) = killProcess(uint(<%= flowNodeIndex(node.$parent.id) %>), tmpMarking, tmpStartedActivities);\n                tmpMarking |= uint(<%= postMarking(node.$parent.id) %>);\n                tmpStartedActivities &= uint(~<%= flowNodeIndex(node.$parent.id) %>);\n<% } -%>\n<% } else if (evtType === 'Signal') { -%>\n                tmpMarking &= uint(~<%= nodePreMarking %>);\n                (tmpMarking, tmpStartedActivities) = propagateEvent(\"<%= nodeName(nodeId) %>\", \"Signal\", tmpMarking, tmpStartedActivities, uint(<%= flowNodeIndex(nodeId) %>));\n<% } else if (evtType === 'Error' || evtType === 'Escalation') {\n        var localEvents2Catch = getCatchingEventsFrom(node.$parent.id, evtType, nodeName(nodeId));\n        if(localEvents2Catch.length == 0) { -%>\n                (tmpMarking, tmpStartedActivities) = propagateEvent(\"<%= nodeName(nodeId) %>\", \"<%= evtType %>\", tmpMarking & uint(~<%= nodePreMarking %>), tmpStartedActivities, uint(<%= flowNodeIndex(nodeId) %>));\n<%      } else {\n        localEvents2Catch.forEach(evtId => {\n            var nodeEvt = nodeMap.get(evtId);\n            if(isInterrupting(evtId)) {\n              if(nodeEvt.$parent.triggeredByEvent) {\n                 var startingKill = nodeEvt.$parent.$parent.id === processId() ? 0 : flowNodeIndex(nodeEvt.$parent.$parent.id); -%>\n                (tmpMarking, tmpStartedActivities) = killProcess(uint(<%= startingKill %>), tmpMarking & uint(~<%= nodePreMarking %>), tmpStartedActivities);\n                tmpMarking |= uint(<%= subprocessStartMarking(nodeEvt.$parent.id) %>);\n                tmpStartedActivities |= uint(<%= flowNodeIndex(nodeEvt.$parent.id) %>);\n<%            } else { -%>\n                (tmpMarking, tmpStartedActivities) = killProcess(uint(<%= flowNodeIndex(nodeEvt.attachedToRef.id) %>), tmpMarking & uint(~<%= nodePreMarking %>), tmpStartedActivities);\n                tmpMarking |= uint(<%= postMarking(evtId) %>);\n<%            } -%>\n<%          } else {  -%>\n                tmpMarking &= uint(~<%= nodePreMarking %>);\n                createNewSubprocessInstance(<%= nodeRealIndex(evtId) %>);\n                tmpStartedActivities |= uint(<%= flowNodeIndex(evtId) %>);\n<%          } }) -%>\n<%   } } -%>\n                continue;\n            }\n<% } else if(is(node, 'bpmn:IntermediateThrowEvent')) {\n       var evtType = eventType(nodeId); -%>\n            if (tmpMarking & uint(<%= nodePreMarking %>) != 0) {\n<% if(evtType === 'Default') { -%>\n                tmpMarking = tmpMarking & uint(~<%= nodePreMarking %>) | uint(<%= nodePostMarking %>);\n<% } else {\n    if (isPartOfDeferredChoice(nodeId)) { -%>\n                tmpMarking = tmpMarking & uint(~<%= deferredChoiceMarking(nodeId) %>) | uint(<%= nodePostMarking %>);\n<%    var deferredNodeMarking = deferredChoiceNodeMarking(nodeId);\n      if(deferredNodeMarking != 0) { -%>\n              tmpStartedActivities &= uint(~<%= deferredNodeMarking %>);\n<%    } -%>\n<%  } else { -%>\n                tmpMarking = tmpMarking & uint(~<%= nodePreMarking %>) | uint(<%= nodePostMarking %>);\n<%  }  if (evtType === 'Signal') { -%>\n                (tmpMarking, tmpStartedActivities) = propagateEvent(\"<%= nodeName(nodeId) %>\", \"Signal\", tmpMarking, tmpStartedActivities, uint(<%= flowNodeIndex(nodeId) %>));\n<%  } else if(evtType === 'Message') { -%>\n                <%= nodeId %>_Mesage('<%= nodeName(nodeId) %>');\n<%  } else if(evtType === 'Escalation') {\n          var localEvents2Catch = getCatchingEventsFrom(node.$parent.id, evtType, nodeName(nodeId));\n          if(localEvents2Catch.length == 0) { -%>\n                (tmpMarking, tmpStartedActivities) = propagateEvent(\"<%= nodeName(nodeId) %>\", \"<%= evtType %>\", tmpMarking & uint(~<%= nodePreMarking %>), tmpStartedActivities, uint(<%= flowNodeIndex(nodeId) %>));\n  <%      } else {\n          localEvents2Catch.forEach(evtId => {\n              var nodeEvt = nodeMap.get(evtId);\n              if(isInterrupting(evtId)) {\n                if(nodeEvt.$parent.triggeredByEvent) {\n                   var startingKill = nodeEvt.$parent.$parent.id === processId() ? 0 : flowNodeIndex(nodeEvt.$parent.$parent.id); -%>\n                (tmpMarking, tmpStartedActivities) = killProcess(uint(<%= startingKill %>), tmpMarking & uint(~<%= nodePreMarking %>), tmpStartedActivities);\n                tmpMarking |= uint(<%= subprocessStartMarking(nodeEvt.$parent.id) %>);\n                tmpStartedActivities |= uint(<%= flowNodeIndex(nodeEvt.$parent.id) %>);\n  <%            } else { -%>\n                (tmpMarking, tmpStartedActivities) = killProcess(uint(<%= flowNodeIndex(nodeEvt.attachedToRef.id) %>), tmpMarking & uint(~<%= nodePreMarking %>), tmpStartedActivities);\n                tmpMarking |= uint(<%= postMarking(evtId) %>);\n  <%            } -%>\n  <%          } else {  -%>\n                tmpMarking &= uint(~<%= nodePreMarking %>);\n                createNewSubprocessInstance(<%= nodeRealIndex(evtId) %>);\n  <% if(nodeEvt.$parent.triggeredByEvent) { -%>\n                tmpStartedActivities |= uint(<%= flowNodeIndex(nodeEvt.$parent.id) %>);\n  <% } else { -%>\n                tmpStartedActivities |= uint(<%= flowNodeIndex(evtId) %>);\n  <% }         } }) -%>\n  <%   } -%>\n<% }} -%>\n                continue;\n            }\n<% } else if (callActivities.indexOf(nodeId) >= 0) { -%>\n            if (tmpMarking & uint(<%= nodePreMarking %>) != 0) {\n                createNewSubprocessInstance(<%= nodeRealIndex(nodeId) %>);\n                tmpMarking &= uint(~<%= nodePreMarking %>);\n                tmpStartedActivities |= uint(<%= flowNodeIndex(nodeId) %>);\n                continue;\n            }\n<% }} else {\n  if(isBoundaryEvent(nodeId)) {\n    var attachedTo = node.attachedToRef.id; -%>\n            if (tmpStartedActivities & uint(<%= flowNodeIndex(attachedTo) %>) != 0 && tmpStartedActivities & uint(<%= flowNodeIndex(nodeId) %>) == 0) {\n                <%= nodeName(processId()) %>_AbstractWorklist(worklist).<%= nodeName(nodeId) %>_start(<%= nodeRealIndex(nodeId) %><%= concatParameters(nodeId, true, false, true) %>);\n                tmpStartedActivities |= uint(<%= flowNodeIndex(nodeId) %>);\n                continue;\n            }\n            if (tmpStartedActivities & uint(<%= flowNodeIndex(attachedTo) %>) == 0 && tmpStartedActivities & uint(<%= flowNodeIndex(nodeId) %>) != 0) {\n                tmpStartedActivities &= uint(~<%= flowNodeIndex(nodeId) %>);\n                continue;\n            }\n  <% } -%>\n<% }}); -%>\n            break;\n        }\n        if(marking != 0 || startedActivities != 0) {\n            marking = tmpMarking;\n            startedActivities = tmpStartedActivities;\n        }\n    }\n\n    function getWorklistAddress() external view returns(address) {\n        return worklist;\n    }\n\n    function getInstanceIndex() external view returns(uint) {\n        return instanceIndex;\n    }\n\n<% /* ------------- Methods to obtain information about multiple contract instances running ------------------ */ -%>\n<% if (callActivities.length > 0 || multiinstanceActivities.length > 0 || nonInterruptingEvents.length > 0) { -%>\n    function allInstanceAddresses() external view returns(address [] memory) {\n        return subInstanceAddresses;\n    }\n\n    function startedInstanceIndexFor(uint instanceNode) external view returns(uint) {\n        return subInstanceStartedIndexes[instanceNode];\n    }\n\n<% } -%>\n}\n";

/* babel-plugin-inline-import '../../../templates/workList2sol.ejs' */
var workList2solEJS = "pragma solidity ^0.5.6;\n\nimport \"AbstractWorklist\";\n\ncontract <%= nodeName(processId()) %>_AbstractWorklist {\n\n  <%  groupedIds = getWorkItemsGroupByParameters(true);\n      groupedIds.forEach(idGroup => {\n          var nodeId = idGroup[0]; -%>\n    function <%= nodeName(nodeId) %>_start(uint<%= getParameterType(nodeId, true, true, true) %>) external;\n  <% }) -%>\n\n  <%  groupedIds = getWorkItemsGroupByParameters(false);\n      groupedIds.forEach(idGroup => {\n          var nodeId = idGroup[0]; -%>\n    function <%= nodeName(nodeId) %>_complete(uint<%= getParameterType(nodeId, false, true, true) %>) external;\n  <% }) -%>\n\n}\n\ncontract <%= nodeName(processId()) %>_Worklist is AbstractWorklist {\n\n    // Events with the information to include in the Log when a workitem is registered\n<%  groupedIds = getWorkItemsGroupByParameters(true);\n    groupedIds.forEach(idGroup => { -%>\n    event <%= nodeName(idGroup[0]) %>_Requested(uint<%= getParameterType(idGroup[0], true, true, true) %>);\n<% }) -%>\n\n<%  groupedIds = getWorkItemsGroupByParameters(true);\n    groupedIds.forEach(idGroup => {\n        var nodeId = idGroup[0]; -%>\n    function <%= nodeName(nodeId) %>_start(uint elementIndex<%= getParameters(nodeId, true, true, true) %>) external {\n        workitems.push(Workitem(elementIndex, msg.sender));\n        emit <%= nodeName(nodeId) %>_Requested(workitems.length - 1<%= getParameters(nodeId, true, false, true) %>);\n    }\n<% }) -%>\n\n<%  groupedIds = getWorkItemsGroupByParameters(false);\n    groupedIds.forEach(idGroup => {\n        var nodeId = idGroup[0]; -%>\n    function <%= nodeName(nodeId) %>(uint workitemId<%= getParameters(nodeId, false, true, true) %>) external {\n        require(workitemId < workitems.length && workitems[workitemId].processInstanceAddr != address(0) && \n        canPerform(msg.sender, workitems[workitemId].processInstanceAddr, workitems[workitemId].elementIndex));\n        <%= nodeName(processId()) %>_AbstractWorklist(workitems[workitemId].processInstanceAddr).<%= nodeName(nodeId) %>_complete(workitems[workitemId].elementIndex<%= getParameters(nodeId, false, false, true) %>);\n        workitems[workitemId].processInstanceAddr = address(0);\n    }\n<% }) -%>\n\n}\n";
var debug = (0, _debug2["default"])('caterpillarql:parse-model');
var bpmn2solTemplate = ejs.compile(bpmn2solEJS);
var workList2solTemplate = ejs.compile(workList2solEJS);
var moddle = new _bpmnModdle["default"]();

var parseBpmn = function parseBpmn(bpmnDoc) {
  return new Promise(function (resolve, reject) {
    moddle.fromXML(bpmnDoc, function (err, definitions) {
      if (!err) resolve(definitions);else reject(err);
    });
  });
};

var is = function is(element, type) {
  return element.$instanceOf(type);
};

var _collectControlFlowInfo;

_collectControlFlowInfo = function collectControlFlowInfo(proc, globalNodeMap, globalControlFlowInfo) {
  var nodeList = [];
  var edgeList = [];
  var boundaryEvents = [];
  var nonBlockingBoundaryEvents = [];
  var controlFlowInfo;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = proc.flowElements.filter(function (e) {
      return is(e, "bpmn:FlowNode");
    })[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var node = _step.value;

      if (is(node, "bpmn:BoundaryEvent")) {
        boundaryEvents.push(node.id);
        if (node.cancelActivity == false) nonBlockingBoundaryEvents.push(node.id);
      } else {
        nodeList.push(node.id);
      }

      globalNodeMap.set(node.id, node);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var sources = _toConsumableArray(nodeList);

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = proc.flowElements.filter(function (e) {
      return is(e, "bpmn:SequenceFlow");
    })[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var flowEdge = _step2.value;

      if (sources.indexOf(flowEdge.targetRef.id) > -1) {
        sources.splice(sources.indexOf(flowEdge.targetRef.id), 1);
      }

      edgeList.push(flowEdge.id);
    } // Let us remove all source elements from the node list

  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
        _iterator2["return"]();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  nodeList = nodeList.filter(function (node) {
    return sources.indexOf(node) < 0;
  });

  if (nonBlockingBoundaryEvents.length > 0) {
    var dfs = function dfs(sources) {
      var open = _toConsumableArray(sources);

      var nodeList = [];
      var edgeList = [];

      while (open.length > 0) {
        var currId = open.pop();
        var curr = globalNodeMap.get(currId);
        nodeList.push(currId);

        if (curr.outgoing && curr.outgoing.length > 0) {
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = curr.outgoing[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var succEdge = _step3.value;
              var succ = succEdge.targetRef;
              edgeList.push(succEdge.id);
              if (open.indexOf(succ.id) < 0 && nodeList.indexOf(succ.id) < 0) open.push(succ.id);
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
                _iterator3["return"]();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }
        }
      }

      return [nodeList, edgeList];
    };

    var _dfs = dfs(sources),
        _dfs2 = _slicedToArray(_dfs, 2),
        mainPathNodeList = _dfs2[0],
        mainPathEdgeList = _dfs2[1];

    var localBoundary = [];
    boundaryEvents.forEach(function (evtId) {
      if (nonBlockingBoundaryEvents.indexOf(evtId) < 0) localBoundary.push(evtId);
    });

    if (localBoundary.length > 0) {
      var _dfs3 = dfs(localBoundary),
          _dfs4 = _slicedToArray(_dfs3, 2),
          boundaryNodePath = _dfs4[0],
          boundaryEdgePath = _dfs4[1];

      boundaryNodePath = boundaryNodePath.filter(function (node) {
        return localBoundary.indexOf(node) < 0;
      });
      mainPathNodeList = mainPathNodeList.concat(boundaryNodePath);
      mainPathEdgeList = mainPathEdgeList.concat(boundaryEdgePath);
    } // Let us remove all source elements from the node list


    mainPathNodeList = mainPathNodeList.filter(function (node) {
      return sources.indexOf(node) < 0;
    });
    controlFlowInfo = new _definitions.ControlFlowInfo(proc, mainPathNodeList, mainPathEdgeList, sources, boundaryEvents);
    globalControlFlowInfo.push(controlFlowInfo);

    var _loop = function _loop() {
      var eventId = _nonBlockingBoundaryE[_i2];
      var event = globalNodeMap.get(eventId);

      if (!mainPathNodeList.find(function (e) {
        return event.attachedToRef.id === e;
      })) {
        throw new Error("ERROR: Found non-interrupting event which is not attached to a subprocess in the main process path");
      }

      var _dfs5 = dfs([eventId]),
          _dfs6 = _slicedToArray(_dfs5, 2),
          localNodeList = _dfs6[0],
          localEdgeList = _dfs6[1];

      if (mainPathNodeList.filter(function (nodeId) {
        return localNodeList.indexOf(nodeId) >= 0;
      }).length > 0) throw new Error("ERROR: Non-interrupting event outgoing path is not synchronized and merges with main process path"); // Let us remove all source elements from the node list

      localNodeList = localNodeList.filter(function (node) {
        return sources.indexOf(node) < 0;
      });
      var childControlFlowInfo = new _definitions.ControlFlowInfo(event, localNodeList, localEdgeList, [eventId], []);
      childControlFlowInfo.parent = proc;
      globalControlFlowInfo.push(childControlFlowInfo);
    };

    for (var _i2 = 0, _nonBlockingBoundaryE = nonBlockingBoundaryEvents; _i2 < _nonBlockingBoundaryE.length; _i2++) {
      _loop();
    }
  } else {
    controlFlowInfo = new _definitions.ControlFlowInfo(proc, nodeList, edgeList, sources, boundaryEvents);
    globalControlFlowInfo.push(controlFlowInfo);
  }

  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = proc.flowElements.filter(function (e) {
      return is(e, "bpmn:SubProcess");
    })[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var subprocess = _step4.value;

      var subprocessControlFlowInfo = _collectControlFlowInfo(subprocess, globalNodeMap, globalControlFlowInfo);

      subprocessControlFlowInfo.parent = proc;

      if (!(subprocess.loopCharacteristics && subprocess.loopCharacteristics.$type === "bpmn:MultiInstanceLoopCharacteristics")) {
        // Subprocess is embedded ... then copy all nodes and edges to the parent process
        subprocessControlFlowInfo.isEmbedded = true;
        controlFlowInfo.nodeList = controlFlowInfo.nodeList.concat(subprocessControlFlowInfo.nodeList);
        controlFlowInfo.edgeList = controlFlowInfo.edgeList.concat(subprocessControlFlowInfo.edgeList);
        controlFlowInfo.boundaryEvents = controlFlowInfo.boundaryEvents.concat(subprocessControlFlowInfo.boundaryEvents);
      }
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
        _iterator4["return"]();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }

  if (proc.documentation) {
    controlFlowInfo.globalParameters = proc.documentation[0].text;
  }

  return controlFlowInfo;
};

var restrictRelation = new Map();

var extractParameters = function extractParameters(cad, nodeId, controlFlowInfo) {
  // Extracting Roles from UserTasks functionBody
  var arr = cad.split('@');

  if (arr.length >= 3) {
    if (controlFlowInfo != null) controlFlowInfo.taskRoleMap.set(nodeId, arr[1].trim());
    if (arr[2].length > 1) cad = arr[2];else return undefined;
  } // Extracting Information of Oracle from Service Tasks (if aplicable)


  var oracle_Data = "";

  for (var j = 0, first = false; j < cad.length; j++) {
    if (cad.charAt(j) === "(") {
      if (!first) first = true;else {
        cad = cad.substr(j);
        break;
      }
    }

    if (cad.charAt(j) === ":") {
      oracle_Data = "";
      break;
    }

    oracle_Data += cad.charAt(j);
  } // Processing Information of function parameters (both service and user tasks)


  cad = cad.replace("(", " ").replace(")", " ").trim();
  cad = cad.replace("(", " ").replace(")", " ").trim();
  var firstSplit = cad.split(":");

  if (firstSplit.length > 2) {
    var aux = '';

    for (var i = 1; i < firstSplit.length; i++) {
      aux += firstSplit[i];
    }

    firstSplit = [firstSplit[0], aux];
  }

  var secondSplit = firstSplit[firstSplit.length - 1].trim().split("->");
  var resMap = new Map();
  var inputOutput = [firstSplit[0].trim(), secondSplit[0].trim()];
  var parameterType = ["input", "output"];
  resMap.set("body", [secondSplit[secondSplit.length - 1].trim()]);

  var _loop2 = function _loop2(_i3) {
    var temp = inputOutput[_i3].split(",");

    var res = [];
    temp.forEach(function (subCad) {
      var aux = subCad.trim().split(" ");

      if (aux[0].trim().length > 0) {
        res.push(aux[0].trim());
        res.push(aux[aux.length - 1].trim());
      }
    });
    resMap.set(parameterType[_i3], res);
  };

  for (var _i3 = 0; _i3 < inputOutput.length; _i3++) {
    _loop2(_i3);
  } // Updating Information of Oracle in controlFlowInfo


  if (controlFlowInfo != null) {
    var inParameters = [];
    var outParameters = [];
    var toIterate = resMap.get('input');

    for (var _i4 = 0; _i4 < toIterate.length; _i4 += 2) {
      inParameters.push(new _definitions.ParameterInfo(toIterate[_i4], toIterate[_i4 + 1]));
    }

    toIterate = resMap.get('output');
    var parameters = new Map();
    parameters.set('input', inParameters);
    parameters.set('output', outParameters);

    for (var _i5 = 0; _i5 < toIterate.length; _i5 += 2) {
      outParameters.push(new _definitions.ParameterInfo(toIterate[_i5], toIterate[_i5 + 1]));
    }

    if (oracle_Data.length > 0) {
      oracle_Data = oracle_Data.trim().replace(" ", "_");
      oracle_Data = oracle_Data.replace("(", " ").replace(").", " ").trim();
      var splitResult = oracle_Data.split(" ");

      if (!controlFlowInfo.oracleInfo.has(splitResult[0])) {
        controlFlowInfo.oracleInfo.set(splitResult[0], new _definitions.OracleInfo(splitResult[0]));
      }

      controlFlowInfo.oracleTaskMap.set(nodeId, splitResult[0]);
      var localOracle = controlFlowInfo.oracleInfo.get(splitResult[0]);
      localOracle.address = splitResult[1];
      localOracle.functionName = splitResult[2];
      localOracle.functionParameters = parameters.get('input');
    } else controlFlowInfo.localParameters.set(nodeId, parameters);
  }

  return resMap;
};

var getNodeName = function getNodeName(node) {
  return node.name ? node.name.replace(/\s+/g, "_") : node.id;
};

var parseModel = function parseModel(modelInfo) {
  return new Promise(function (resolve, reject) {
    parseBpmn(modelInfo.bpmn).then(function (definitions) {
      debug('parsed model', definitions);
      modelInfo.solidity = "pragma solidity ^0.5.6;\n";
      modelInfo.controlFlowInfoMap = new Map(); // Sanity checks

      if (!definitions.diagrams || definitions.diagrams.length == 0) throw new Error("ERROR: No diagram found in BPMN file");
      var proc = definitions.diagrams[0].plane.bpmnElement;
      modelInfo.name = proc.name ? proc.name.replace(/\s+/g, "_") : proc.id;
      modelInfo.id = proc.id;

      if (proc.$type !== "bpmn:Process") {
        if (proc.$type === "bpmn:Collaboration") {
          for (var i = 0; i < definitions.rootElements.length; i++) {
            if (definitions.rootElements[i].$type === "bpmn:Process") {
              proc = definitions.rootElements[i];
              modelInfo.name = proc.name ? proc.name.replace(/\s+/g, "_") : proc.id;
              modelInfo.id = proc.id;
              break;
            }
          }
        } else {
          throw new Error("ERROR: No root process model found");
        }
      } // BPMN to Solidity parsing


      var globalNodeMap = new Map(),
          globalNodeIndexMap = new Map(),
          globalEdgeIndexMap = new Map(),
          globalControlFlowInfo = []; ////////////////////////////////////////////////////////////

      globalNodeMap.set(proc.id, proc);

      var mainControlFlowInfo = _collectControlFlowInfo(proc, globalNodeMap, globalControlFlowInfo);

      var globalControlFlowInfoMap = new Map();
      globalControlFlowInfo.forEach(function (controlFlowInfo) {
        return globalControlFlowInfoMap.set(controlFlowInfo.self.id, controlFlowInfo);
      }); // Event sub-processes appear in the source list, and not in the nodeList
      // In addition, all the elements of a non interrupting subprocess event appears embedded on its parent process

      var _loop3 = function _loop3() {
        var controlFlowInfo = _globalControlFlowInf[_i6];
        var indexesToRemove = [];
        controlFlowInfo.sources.forEach(function (nodeId) {
          if (globalNodeMap.get(nodeId).triggeredByEvent) {
            controlFlowInfo.nodeList.push(nodeId);
            indexesToRemove.push(controlFlowInfo.sources.indexOf(nodeId));
            var nodeInfo = globalControlFlowInfoMap.get(nodeId);
            if (!globalNodeMap.get(nodeInfo.sources[0]).isInterrupting) nodeInfo.nodeList.forEach(function (childId) {
              var index = controlFlowInfo.nodeList.indexOf(childId);
              if (index >= 0) controlFlowInfo.nodeList.splice(index, 1);
            });
          }
        });
        indexesToRemove.sort(function (ind1, ind2) {
          return ind2 - ind1;
        });
        indexesToRemove.forEach(function (index) {
          controlFlowInfo.sources.splice(index, 1);
        });

        if (is(globalNodeMap.get(controlFlowInfo.self.id), "bpmn:SubProcess") && controlFlowInfo.self.triggeredByEvent && globalNodeMap.get(controlFlowInfo.sources[0]).isInterrupting == false) {
          controlFlowInfo.isEmbedded = false;
        }
      };

      for (var _i6 = 0, _globalControlFlowInf = globalControlFlowInfo; _i6 < _globalControlFlowInf.length; _i6++) {
        _loop3();
      }

      var hasExternalCall = function hasExternalCall(nodeId) {
        var node = globalNodeMap.get(nodeId);
        return is(node, "bpmn:ServiceTask");
      };

      modelInfo.globalNodeMap = globalNodeMap;

      var _loop4 = function _loop4() {
        var controlFlowInfo = _globalControlFlowInf2[_i7];

        if (!controlFlowInfo.isEmbedded) {
          var multiinstanceActivities = [],
              callActivities = [],
              nonInterruptingEvents = [],
              catchingMessages = [];
          controlFlowInfo.nodeList.map(function (nodeId) {
            return globalNodeMap.get(nodeId);
          }).forEach(function (e) {
            if ((is(e, "bpmn:Task") || is(e, "bpmn:SubProcess")) && e.loopCharacteristics && e.loopCharacteristics.$type === "bpmn:MultiInstanceLoopCharacteristics") {
              controlFlowInfo.multiinstanceActivities.set(e.id, getNodeName(e));
              multiinstanceActivities.push(e.id);
            } else if (is(e, "bpmn:CallActivity")) {
              controlFlowInfo.callActivities.set(e.id, getNodeName(e));
              callActivities.push(e.id);
            } else if (is(e, "bpmn:IntermediateCatchEvent") && is(e.eventDefinitions[0], "bpmn:MessageEventDefinition")) catchingMessages.push(e.id);else if (is(e, "bpmn:StartEvent") && is(e.eventDefinitions[0], "bpmn:MessageEventDefinition")) catchingMessages.push(e.id);
          }); // It is also necessary to add boundary events of embedded sub-processes

          controlFlowInfo.sources.forEach(function (nodeId) {
            var start = globalNodeMap.get(nodeId);

            if (start.eventDefinitions && start.eventDefinitions[0] && is(start.eventDefinitions[0], "bpmn:MessageEventDefinition") && controlFlowInfo.nodeList.indexOf(nodeId) < 0) {
              controlFlowInfo.nodeList.push(nodeId);
              if (catchingMessages.indexOf(nodeId) < 0) catchingMessages.push(nodeId);
            }
          });
          controlFlowInfo.boundaryEvents.forEach(function (nodeId) {
            var node = globalNodeMap.get(nodeId);

            if (node.outgoing) {
              var _iteratorNormalCompletion5 = true;
              var _didIteratorError5 = false;
              var _iteratorError5 = undefined;

              try {
                for (var _iterator5 = node.outgoing[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                  var outgoing = _step5.value;
                  controlFlowInfo.edgeList.push(outgoing.id);
                }
              } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
                    _iterator5["return"]();
                  }
                } finally {
                  if (_didIteratorError5) {
                    throw _iteratorError5;
                  }
                }
              }
            }

            if (!node.cancelActivity) {
              controlFlowInfo.nonInterruptingEvents.set(node.id, getNodeName(node));
              nonInterruptingEvents.push(node.id);
              controlFlowInfo.nodeList.push(nodeId); // Eager reinsertion

              if (node.eventDefinitions[0] && is(node.eventDefinitions[0], 'bpmn:MessageEventDefinition')) {
                if (catchingMessages.indexOf(nodeId) < 0) catchingMessages.push(nodeId);
              }
            } else if (node.eventDefinitions && is(node.eventDefinitions[0], "bpmn:MessageEventDefinition")) {
              if (controlFlowInfo.nodeList.indexOf(nodeId) < 0) controlFlowInfo.nodeList.push(nodeId);
              if (catchingMessages.indexOf(nodeId) < 0) catchingMessages.push(nodeId);
            }
          });
          globalNodeMap.forEach(function (node) {
            if (is(node, "bpmn:SubProcess") && node.triggeredByEvent && controlFlowInfo.nodeList.indexOf(node.id)) {
              var _iteratorNormalCompletion6 = true;
              var _didIteratorError6 = false;
              var _iteratorError6 = undefined;

              try {
                for (var _iterator6 = node.flowElements.filter(function (e) {
                  return is(e, "bpmn:FlowNode") && is(e, "bpmn:StartEvent");
                })[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                  var start = _step6.value;

                  if (start.isInterrupting == false) {
                    var parent = globalNodeMap.get(start.$parent.id);
                    controlFlowInfo.nonInterruptingEvents.set(start.id, getNodeName(parent));
                    nonInterruptingEvents.push(start.id);
                    controlFlowInfo.nodeList.push(start.id);

                    if (start.eventDefinitions[0] && is(start.eventDefinitions[0], "bpmn:MessageEventDefinition")) {
                      if (catchingMessages.indexOf(start.id) < 0) catchingMessages.push(start.id);
                    }
                  }

                  if (controlFlowInfo.boundaryEvents.indexOf(start.id) < 0) {
                    controlFlowInfo.boundaryEvents.push(start.id);
                    if (controlFlowInfo.nodeList.indexOf(start.$parent.id) < 0) controlFlowInfo.nodeList.push(start.$parent.id);
                  }

                  if (start.eventDefinitions[0] && is(start.eventDefinitions[0], "bpmn:MessageEventDefinition")) {
                    if (controlFlowInfo.nodeList.indexOf(start.id) < 0) controlFlowInfo.nodeList.push(start.id);
                    if (catchingMessages.indexOf(start.id) < 0) catchingMessages.push(start.id);
                  }

                  if (start.outgoing) {
                    var _iteratorNormalCompletion7 = true;
                    var _didIteratorError7 = false;
                    var _iteratorError7 = undefined;

                    try {
                      for (var _iterator7 = start.outgoing[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                        var outgoing = _step7.value;
                        controlFlowInfo.edgeList.push(outgoing.id);
                      }
                    } catch (err) {
                      _didIteratorError7 = true;
                      _iteratorError7 = err;
                    } finally {
                      try {
                        if (!_iteratorNormalCompletion7 && _iterator7["return"] != null) {
                          _iterator7["return"]();
                        }
                      } finally {
                        if (_didIteratorError7) {
                          throw _iteratorError7;
                        }
                      }
                    }
                  }
                }
              } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
                    _iterator6["return"]();
                  }
                } finally {
                  if (_didIteratorError6) {
                    throw _iteratorError6;
                  }
                }
              }
            }
          });
          var part1 = [];
          var part2 = [];
          controlFlowInfo.nodeList.forEach(function (nodeId) {
            if (hasExternalCall(nodeId)) part1.push(nodeId);else part2.push(nodeId);
          });
          controlFlowInfo.nodeList = part1.concat(part2);
          controlFlowInfo.nodeList.forEach(function (nodeId, index) {
            var node = globalNodeMap.get(nodeId);
            controlFlowInfo.nodeIndexMap.set(nodeId, index + 1);
            globalNodeIndexMap.set(nodeId, index + 1);
            controlFlowInfo.nodeNameMap.set(nodeId, getNodeName(globalNodeMap.get(nodeId)));

            if (node.documentation && node.documentation[0].text && node.documentation[0].text.length > 0) {
              if (is(node, 'bpmn:CallActivity')) controlFlowInfo.externalBundles.set(nodeId, node.documentation[0].text);else extractParameters(node.documentation[0].text, node.id, controlFlowInfo);
            }
          });
          controlFlowInfo.edgeList.forEach(function (edgeId, index) {
            controlFlowInfo.edgeIndexMap.set(edgeId, index + 1);
            globalEdgeIndexMap.set(edgeId, index + 1);
          });
          controlFlowInfo.catchingMessages = catchingMessages; // ControlFlow Perspective: Generation of Smart Contracts

          var codeGenerationInfo = {
            nodeList: controlFlowInfo.nodeList,
            nodeMap: globalNodeMap,
            catchingMessages: controlFlowInfo.catchingMessages,
            multiinstanceActivities: multiinstanceActivities,
            callActivities: callActivities,
            nonInterruptingEvents: nonInterruptingEvents,
            oracleInfo: controlFlowInfo.oracleInfo,
            oracleTaskMap: controlFlowInfo.oracleTaskMap,
            processId: function processId() {
              return controlFlowInfo.self.id;
            },
            nodeName: function nodeName(nodeId) {
              return getNodeName(globalNodeMap.get(nodeId));
            },
            eventType: function eventType(nodeId) {
              var node = globalNodeMap.get(nodeId);

              if (node.eventDefinitions && node.eventDefinitions[0]) {
                var cad = node.eventDefinitions[0].$type;
                return cad.substring(5, cad.length - 15);
              }

              return "Default";
            },
            allEventTypes: function allEventTypes() {
              var taken = [];
              globalNodeMap.forEach(function (node) {
                if (node.eventDefinitions && node.eventDefinitions[0] && !is(node.eventDefinitions[0], "bpmn:TerminateEventDefinition") && !is(node.eventDefinitions[0], "bpmn:MessageEventDefinition")) {
                  var cad = node.eventDefinitions[0].$type;
                  if (taken.indexOf(cad.substring(5, cad.length - 15)) < 0) taken.push(cad.substring(5, cad.length - 15));
                }
              });
              return taken;
            },
            getMessages: function getMessages() {
              var taken = [];
              var candidates = controlFlowInfo.boundaryEvents;
              controlFlowInfo.nodeList.forEach(function (nodeId) {
                if (is(globalNodeMap.get(nodeId), "bpmn:SubProcess")) {
                  var subP = globalControlFlowInfoMap.get(nodeId);
                  candidates = candidates.concat(subP.boundaryEvents);
                  subP.sources.forEach(function (id) {
                    if (!is(globalNodeMap.get(id), "bpmn:Subprocess") && candidates.indexOf(id) < 0) candidates.push(id);
                  });
                }
              });
              candidates.forEach(function (evtId) {
                var evt = globalNodeMap.get(evtId);
                if (evt.eventDefinitions && evt.eventDefinitions[0] && is(evt.eventDefinitions[0], "bpmn:MessageEventDefinition")) taken.push(evtId);
              });
              return taken;
            },
            getThrowingMessages: function getThrowingMessages() {
              var res = [];
              controlFlowInfo.nodeList.forEach(function (nodeId) {
                var node = globalNodeMap.get(nodeId);
                if ((is(node, "bpmn:EndEvent") || is(node, "bpmn:IntermediateThrowEvent")) && node.eventDefinitions && node.eventDefinitions[0] && is(node.eventDefinitions[0], "bpmn:MessageEventDefinition")) res.push(nodeId);
              });
              return res;
            },
            getThrowingEvents: function getThrowingEvents(subprocId, evType) {
              var res = [];
              globalNodeMap.forEach(function (node) {
                if (node.eventDefinitions && node.eventDefinitions[0]) {
                  var cad = node.eventDefinitions[0].$type;

                  if (cad.substring(5, cad.length - 15) === evType) {
                    if ((is(node, "bpmn:EndEvent") || is(node, "bpmn:IntermediateThrowEvent")) && (node.$parent.id === subprocId || controlFlowInfo.nodeList.indexOf(node.id) >= 0)) {
                      res.push(node.id);
                    }
                  }
                }
              });
              return res;
            },
            getCatchingEvents: function getCatchingEvents(subprocId) {
              var res = [];
              globalNodeMap.forEach(function (node) {
                if (node.eventDefinitions && node.eventDefinitions[0]) {
                  if (is(node, "bpmn:StartEvent")) {
                    var parent = globalNodeMap.get(node.$parent.id);
                    if (parent.triggeredByEvent && parent.$parent.id === subprocId) res.unshift(node.id);else if (!parent.triggeredByEvent && (parent.id === subprocId || controlFlowInfo.nodeList.indexOf(parent.id) > -1)) res.push(node.id);
                  } else if (is(node, "bpmn:BoundaryEvent") || is(node, "bpmn:IntermediateCatchEvent")) {
                    if (node.$parent.id === subprocId || controlFlowInfo.nodeList.indexOf(node.$parent.id) > -1) res.push(node.id);
                  }
                }
              });
              return res;
            },
            getTerminateCandidates: function getTerminateCandidates(subprocId) {
              var res = [];
              globalNodeMap.forEach(function (node) {
                if (node.eventDefinitions && node.eventDefinitions[0]) {
                  if (is(node, "bpmn:BoundaryEvent") && node.cancelActivity == false) {
                    if (globalControlFlowInfoMap.has(node.id)) {
                      var localC = globalControlFlowInfoMap.get(node.id);
                      localC.nodeList.forEach(function (elemId) {
                        var elem = globalNodeMap.get(elemId);
                        if (elem.eventDefinitions && is(elem.eventDefinitions[0], "bpmn:TerminateEventDefinition") && elem.$parent.id === node.$parent.id) res.push(node.id);
                      });
                    } else {
                      debug('Missing Non Interrupting event');
                    }
                  }
                }
              });
              return res;
            },
            getProcessCandidatesMaskFrom: function getProcessCandidatesMaskFrom(evtId, evtType, evtCode, sourceProcesses, allEvents) {
              var eventList = [];
              var bitarray = [];
              allEvents.forEach(function (nodeId) {
                var cad = globalNodeMap.get(nodeId).eventDefinitions[0].$type;
                if (evtType === cad.substring(5, cad.length - 15) && evtCode === getNodeName(globalNodeMap.get(nodeId))) eventList.push(nodeId);
              });
              sourceProcesses.forEach(function (procId) {
                var parent = globalNodeMap.get(procId);
                var previousParent = parent;
                var res = [];
                var eventFound = false;

                while (!eventFound && res.length == 0 && parent.$parent && controlFlowInfo.self.id !== parent.id) {
                  parent = globalNodeMap.get(parent.$parent.id);
                  eventList.forEach(function (nodeId) {
                    var node = globalNodeMap.get(nodeId);

                    if (!eventFound && is(node, "bpmn:BoundaryEvent") && node.attachedToRef.id === previousParent.id) {
                      eventFound = node.cancelActivity != false;
                      if (eventFound) res = [nodeId];else res.push(nodeId);
                    }
                  });

                  if (res.length == 0) {
                    eventList.forEach(function (nodeId) {
                      var node = globalNodeMap.get(nodeId);

                      if (!eventFound && is(node, "bpmn:StartEvent") && node.$parent.triggeredByEvent && node.$parent.$parent.id === parent.id) {
                        eventFound = node.isInterrupting != false;
                        if (eventFound) res = [nodeId];else res.push(nodeId);
                      }
                    });
                  }

                  previousParent = parent;
                }

                if (res.indexOf(evtId)) bitarray[globalNodeIndexMap.get(procId)] = 1;
              });
              var result = "0b";

              for (var _i8 = bitarray.length - 1; _i8 >= 0; _i8--) {
                result += bitarray[_i8] ? "1" : "0";
              }

              return result === "0b" ? 0 : new _bignumber["default"](result).toFixed();
            },
            getCatchingEventsFrom: function getCatchingEventsFrom(procId, evtType, evtCode) {
              // Escalation and Error catching events.
              // No intermediate events in normal flow allowed
              var res = [];
              var parent = globalNodeMap.get(procId);
              var eventFound = false;
              var candidates = controlFlowInfo.boundaryEvents.concat(controlFlowInfo.nodeList);
              var eventList = [];
              candidates.forEach(function (nodeId) {
                var node = globalNodeMap.get(nodeId);

                if (node.eventDefinitions) {
                  var cad = node.eventDefinitions[0].$type;
                  var type = cad.substring(5, cad.length - 15);

                  if (type === evtType && evtCode === getNodeName(globalNodeMap.get(nodeId)) && eventList.indexOf(nodeId) < 0) {
                    eventList.push(nodeId);
                  }
                }
              });

              if (!parent.triggeredByEvent) {
                eventList.forEach(function (nodeId) {
                  var node = globalNodeMap.get(nodeId);

                  if (!eventFound && is(node, "bpmn:StartEvent") && node.$parent.triggeredByEvent && node.$parent.$parent.id === parent.id) {
                    eventFound = node.isInterrupting != false;
                    if (eventFound) res = [nodeId];else res.push(nodeId);
                  }
                });
              }

              if (controlFlowInfo.self.id === procId || res.length > 0) {
                return res;
              } else {
                var _ret = function () {
                  if (parent.triggeredByEvent) parent = globalNodeMap.get(parent.$parent.id);
                  var previousParent = parent;

                  while (!eventFound && res.length == 0 && parent.$parent && controlFlowInfo.self.id !== parent.id) {
                    parent = globalNodeMap.get(parent.$parent.id);
                    eventList.forEach(function (nodeId) {
                      var node = globalNodeMap.get(nodeId);

                      if (!eventFound && is(node, "bpmn:BoundaryEvent") && node.attachedToRef.id === previousParent.id) {
                        eventFound = node.cancelActivity != false;
                        if (eventFound) res = [nodeId];else res.push(nodeId);
                      }
                    });

                    if (res.length == 0) {
                      eventList.forEach(function (nodeId) {
                        var node = globalNodeMap.get(nodeId);

                        if (!eventFound && is(node, "bpmn:StartEvent") && node.$parent.triggeredByEvent && node.$parent.$parent.id === parent.id) {
                          eventFound = node.isInterrupting != false;
                          if (eventFound) res = [nodeId];else res.push(nodeId);
                        }
                      });
                    }

                    previousParent = parent;
                  }

                  return {
                    v: res
                  };
                }();

                if (_typeof(_ret) === "object") return _ret.v;
              }
            },
            getWorkItemsGroupByParameters: function getWorkItemsGroupByParameters(isInput) {
              var name2Ids = new Map();
              controlFlowInfo.nodeList.forEach(function (nodeId) {
                var node = globalNodeMap.get(nodeId);

                if (is(node, 'bpmn:UserTask') || is(node, 'bpmn:ReceiveTask') || catchingMessages.indexOf(nodeId) >= 0) {
                  var params = "";

                  if (node.documentation && node.documentation[0].text && node.documentation[0].text.length > 0 && extractParameters(node.documentation[0].text, nodeId, null) !== undefined) {
                    var localParams = isInput ? extractParameters(node.documentation[0].text, nodeId, null).get("input") : extractParameters(node.documentation[0].text, nodeId, null).get("output");

                    if (localParams.length > 0) {
                      params = localParams[0];

                      for (var _i9 = 2; _i9 < localParams.length; _i9 += 2) {
                        params += localParams[_i9];
                      }
                    }
                  }

                  var name = getNodeName(globalNodeMap.get(nodeId)) + params;

                  if (!name2Ids.has(name)) {
                    name2Ids.set(name, []);
                  }

                  name2Ids.get(name).push(nodeId);
                }
              });
              return name2Ids;
            },
            getContracts2Call: function getContracts2Call() {
              var res = callActivities.concat(multiinstanceActivities);
              nonInterruptingEvents.forEach(function (evtId) {
                var node = globalNodeMap.get(evtId);
                res.push(is(node, "bpmn:StartEvent") ? node.$parent.id : evtId);
              });
              return res;
            },
            getContracts2CallFrom: function getContracts2CallFrom(subprocId, candidates) {
              var res = [subprocId];

              if (!controlFlowInfo.callActivities.has(subprocId)) {
                candidates.forEach(function (nodeId) {
                  var node = globalNodeMap.get(nodeId);

                  while (node.$parent) {
                    if (node.$parent.id === subprocId) {
                      res.push(nodeId);
                      break;
                    }

                    node = node.$parent;
                  }
                });
              }

              return res;
            },
            getContracts2CallMaskFrom: function getContracts2CallMaskFrom(subprocId, candidates) {
              var bitarray = [];
              candidates.forEach(function (nodeId) {
                var node = globalNodeMap.get(nodeId);

                while (node.$parent) {
                  if (node.$parent.id === subprocId) {
                    bitarray[globalNodeIndexMap.get(nodeId)] = 1;
                    break;
                  }

                  node = node.$parent;
                }
              });
              var result = "0b";

              for (var _i10 = bitarray.length - 1; _i10 >= 0; _i10--) {
                result += bitarray[_i10] ? "1" : "0";
              }

              return result === "0b" ? 0 : new _bignumber["default"](result).toFixed();
            },
            getContracts2CallArray: function getContracts2CallArray(subprocId, candidates) {
              var res = '[uint(' + globalNodeIndexMap.get(candidates[0]) + ')';

              for (var _i11 = 1; _i11 < candidates.length; _i11++) {
                res += ', uint(' + globalNodeIndexMap.get(candidates[_i11]) + ')';
              }

              return res + ']';
            },
            getPossibleKillSubprocess: function getPossibleKillSubprocess() {
              var res = [];
              controlFlowInfo.boundaryEvents.forEach(function (nodeId) {
                var node = globalNodeMap.get(nodeId);

                if (node.$parent.triggeredByEvent && node.$parent.$parent.id !== controlFlowInfo.self.id) {
                  if (node.isInterrupting != false && res.indexOf(node.$parent.$parent.id) < 0) res.push(node.$parent.$parent.id);
                } else if (node.attachedToRef) {
                  var attachedTo = node.attachedToRef.id;

                  if (node.cancelActivity != false && res.indexOf(attachedTo) < 0) {
                    res.push(attachedTo);
                  }
                }
              });
              globalNodeMap.forEach(function (node) {
                if (node.eventDefinitions && node.eventDefinitions[0]) {
                  if (is(node, "bpmn:BoundaryEvent") && node.cancelActivity == false) {
                    if (globalControlFlowInfoMap.has(node.id)) {
                      var localC = globalControlFlowInfoMap.get(node.id);
                      localC.nodeList.forEach(function (elemId) {
                        var elem = globalNodeMap.get(elemId);

                        if (elem.eventDefinitions && is(elem.eventDefinitions[0], "bpmn:TerminateEventDefinition") && elem.$parent.id === node.$parent.id && controlFlowInfo.nodeList.indexOf(node.$parent.id) >= 0 && res.indexOf(node.$parent.id) < 0 && node.$parent.id != controlFlowInfo.self.id) {
                          res.push(node.$parent.id);
                        }
                      });
                    }
                  }
                }
              });
              controlFlowInfo.nodeList.forEach(function (nodeId) {
                var node = globalNodeMap.get(nodeId);

                if (node.eventDefinitions && is(node.eventDefinitions[0], "bpmn:TerminateEventDefinition")) {
                  if (res.indexOf(node.$parent.id) < 0 && node.$parent.id != controlFlowInfo.self.id && !is(globalNodeMap.get(controlFlowInfo.self.id), "bpmn:BoundaryEvent")) {
                    debug('I am here 2');
                    res.push(node.$parent.id);
                  }
                }
              });
              return res;
            },
            getCountExternalTasks: function getCountExternalTasks() {
              var res = 0;
              controlFlowInfo.nodeList.forEach(function (nodeId) {
                if (hasExternalCall(nodeId)) res++;
              });
              return res;
            },
            getStartedMessages: function getStartedMessages(processId) {
              var res = [];
              controlFlowInfo.nodeList.forEach(function (nodeId) {
                var node = globalNodeMap.get(nodeId);
                if (is(node, "bpmn:StartEvent") && node.$parent.id === processId && node.eventDefinitions && is(node.eventDefinitions[0], "bpmn:MessageEventDefinition") && globalNodeMap.get(node.$parent.id).triggeredByEvent) res.push(nodeId);
              });
              return res;
            },
            getParent: function getParent(nodeId) {
              // Retrieves the id of the parent
              var node = globalNodeMap.get(nodeId);
              if (is(node, "bpmn:StartEvent") && node.$parent && globalNodeMap.get(node.$parent.id).triggeredByEvent) return globalNodeMap.get(node.$parent.id).$parent.id;
              if (is(node, "bpmn:BoundaryEvent") && node.cancelActivity) return node.attachedToRef.id;
              return node.$parent ? node.$parent.id : nodeId;
            },
            getContractName: function getContractName(nodeId) {
              // Retrieves the contract name related to the node.
              var node = globalNodeMap.get(nodeId);
              if (is(node, "bpmn:StartEvent") && node.$parent && globalNodeMap.get(node.$parent.id).triggeredByEvent) return node.$parent.id;
              if (is(node, "bpmn:BoundaryEvent")) return node.id;
              return controlFlowInfo.self.id;
            },
            getAllChildren: function getAllChildren(subprocId, direct) {
              var taken = direct ? [] : [subprocId];
              controlFlowInfo.nodeList.map(function (nodeId) {
                return globalNodeMap.get(nodeId);
              }).forEach(function (e) {
                if (is(e, "bpmn:SubProcess") || callActivities.indexOf(e.id) >= 0 || nonInterruptingEvents.indexOf(e.id) >= 0 && !is(e, "bpmn:StartEvent")) if ((direct && subprocId !== e.id && e.$parent.id === subprocId || !direct) && taken.indexOf(e.id) < 0) taken.push(e.id);
              });
              return taken;
            },
            isStartingContractEvent: function isStartingContractEvent(eventId, processId) {
              var evt = globalNodeMap.get(eventId);

              if (is(evt, "bpmn:StartEvent")) {
                if (globalNodeMap.get(evt.$parent.id).triggeredByEvent) return evt.$parent.id !== processId;
                if (is(evt.eventDefinitions[0], "bpmn:MessageEventDefinition")) return true;
              } else if (is(evt, "bpmn:BoundaryEvent")) {
                return eventId !== processId;
              } else if (is(evt, "bpmn:IntermediateCatchEvent") && is(evt.eventDefinitions[0], "bpmn:MessageEventDefinition")) return true;

              return false;
            },
            isInterrupting: function isInterrupting(eventId) {
              // True if an event is interrupting
              var node = globalNodeMap.get(eventId);
              if (node.eventDefinitions && is(node.eventDefinitions[0], "bpmn:ErrorEventDefinition")) return true;
              if (is(node, "bpmn:StartEvent") && node.$parent && globalNodeMap.get(node.$parent.id).triggeredByEvent) return node.isInterrupting != false;
              if (is(node, "bpmn:BoundaryEvent")) return node.cancelActivity != false;
              return false;
            },
            isEmbeddedSubprocess: function isEmbeddedSubprocess(subprocessId) {
              return globalControlFlowInfoMap.get(subprocessId).isEmbedded;
            },
            isBoundaryEvent: function isBoundaryEvent(evtId) {
              return controlFlowInfo.boundaryEvents.indexOf(evtId) >= 0;
            },
            preMarking: function preMarking(nodeId) {
              var node = globalNodeMap.get(nodeId);
              var bitarray = [];

              if (node.incoming) {
                var _iteratorNormalCompletion8 = true;
                var _didIteratorError8 = false;
                var _iteratorError8 = undefined;

                try {
                  for (var _iterator8 = node.incoming[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                    var incoming = _step8.value;
                    bitarray[controlFlowInfo.edgeIndexMap.get(incoming.id)] = 1;
                  }
                } catch (err) {
                  _didIteratorError8 = true;
                  _iteratorError8 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion8 && _iterator8["return"] != null) {
                      _iterator8["return"]();
                    }
                  } finally {
                    if (_didIteratorError8) {
                      throw _iteratorError8;
                    }
                  }
                }
              } else bitarray[0] = 1;

              var result = "0b";

              for (var _i12 = bitarray.length - 1; _i12 >= 0; _i12--) {
                result += bitarray[_i12] ? "1" : "0";
              }

              return new _bignumber["default"](result).toFixed();
            },
            postMarking: function postMarking(nodeId) {
              var node = globalNodeMap.get(nodeId);
              var bitarray = [];
              var result = "0b";

              if (node.outgoing) {
                var _iteratorNormalCompletion9 = true;
                var _didIteratorError9 = false;
                var _iteratorError9 = undefined;

                try {
                  for (var _iterator9 = node.outgoing[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                    var outgoing = _step9.value;
                    bitarray[controlFlowInfo.edgeIndexMap.get(outgoing.id)] = 1;
                  }
                } catch (err) {
                  _didIteratorError9 = true;
                  _iteratorError9 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion9 && _iterator9["return"] != null) {
                      _iterator9["return"]();
                    }
                  } finally {
                    if (_didIteratorError9) {
                      throw _iteratorError9;
                    }
                  }
                }
              } else result = "0";

              for (var _i13 = bitarray.length - 1; _i13 >= 0; _i13--) {
                result += bitarray[_i13] ? "1" : "0";
              }

              return new _bignumber["default"](result).toFixed();
            },
            subprocessNodeMarking: function subprocessNodeMarking(subprocessId) {
              var bitarray = [];
              globalNodeMap.forEach(function (node) {
                if (node.$parent && node.$parent.id === subprocessId) {
                  if (is(node, "bpmn:Task") || is(node, 'bpmn:SubProcess')) bitarray[globalNodeIndexMap.get(node.id)] = 1;else if (!globalNodeMap.get(subprocessId).triggeredByEvent && node.eventDefinitions && node.eventDefinitions[0] && is(node.eventDefinitions[0], "bpmn:MessageEventDefinition")) bitarray[globalNodeIndexMap.get(node.id)] = 1;
                }
              });
              var result = bitarray.length > 0 ? "0b" : 0;

              for (var _i14 = bitarray.length - 1; _i14 >= 0; _i14--) {
                result += bitarray[_i14] ? "1" : "0";
              }

              return new _bignumber["default"](result).toFixed();
            },
            subprocessNodeFullMarking: function subprocessNodeFullMarking(subprocId) {
              var children = [subprocId];
              var bitarray = [];
              controlFlowInfo.nodeList.forEach(function (nodeId) {
                var node = globalNodeMap.get(nodeId);

                if (is(node, "bpmn:SubProcess") || callActivities.indexOf(node.id) >= 0 || nonInterruptingEvents.indexOf(node.id) >= 0 && !is(node, "bpmn:StartEvent")) {
                  while (node.$parent) {
                    if (node.$parent.id === subprocId) {
                      if (multiinstanceActivities.indexOf(nodeId) >= 0 || callActivities.indexOf(node.id) >= 0 || nonInterruptingEvents.indexOf(node.id) >= 0) {
                        bitarray[globalNodeIndexMap.get(nodeId)] = 1;
                      } else if (children.indexOf(nodeId) < 0) {
                        children.push(nodeId);
                      }

                      break;
                    }

                    node = node.$parent;
                  }
                }
              });
              var result = "0b";
              if (globalNodeIndexMap.get(subprocId)) bitarray[globalNodeIndexMap.get(subprocId)] = 1;
              controlFlowInfo.nodeList.map(function (nodeId) {
                return globalNodeMap.get(nodeId);
              }).forEach(function (node) {
                if (node.$parent && children.indexOf(node.$parent.id) >= 0) {
                  bitarray[globalNodeIndexMap.get(node.id)] = 1;
                }
              });
              catchingMessages.map(function (evtId) {
                return globalNodeMap.get(evtId);
              }).forEach(function (evt) {
                if (evt.attachedToRef && children.indexOf(evt.attachedToRef) >= 0) {
                  bitarray[globalNodeIndexMap.get(evt.id)] = 1;
                }
              });

              for (var _i15 = bitarray.length - 1; _i15 >= 0; _i15--) {
                result += bitarray[_i15] ? "1" : "0";
              }

              return result === '0b' ? new _bignumber["default"](0) : new _bignumber["default"](result).toFixed();
            },
            subprocessStartMarking: function subprocessStartMarking(subprocessId) {
              var toSearch = globalNodeMap.get(subprocessId);
              var bitarray = [];
              var result = "0b";

              if (is(toSearch, "bpmn:BoundaryEvent")) {
                var _iteratorNormalCompletion10 = true;
                var _didIteratorError10 = false;
                var _iteratorError10 = undefined;

                try {
                  for (var _iterator10 = toSearch.outgoing[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                    var outgoing = _step10.value;
                    bitarray[controlFlowInfo.edgeIndexMap.get(outgoing.id)] = 1;
                  }
                } catch (err) {
                  _didIteratorError10 = true;
                  _iteratorError10 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion10 && _iterator10["return"] != null) {
                      _iterator10["return"]();
                    }
                  } finally {
                    if (_didIteratorError10) {
                      throw _iteratorError10;
                    }
                  }
                }
              } else {
                var _iteratorNormalCompletion11 = true;
                var _didIteratorError11 = false;
                var _iteratorError11 = undefined;

                try {
                  for (var _iterator11 = toSearch.flowElements.filter(function (e) {
                    return is(e, "bpmn:FlowNode") && is(e, "bpmn:StartEvent");
                  })[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                    var node = _step11.value;
                    if (node.$parent.id === subprocessId) if (!globalNodeMap.get(node.$parent.id).triggeredByEvent && node.eventDefinitions && node.eventDefinitions[0] && is(node.eventDefinitions[0], "bpmn:MessageEventDefinition")) bitarray[0] = 1;else if (node.outgoing) {
                      var _iteratorNormalCompletion12 = true;
                      var _didIteratorError12 = false;
                      var _iteratorError12 = undefined;

                      try {
                        for (var _iterator12 = node.outgoing[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                          var _outgoing = _step12.value;
                          bitarray[controlFlowInfo.edgeIndexMap.get(_outgoing.id)] = 1;
                        }
                      } catch (err) {
                        _didIteratorError12 = true;
                        _iteratorError12 = err;
                      } finally {
                        try {
                          if (!_iteratorNormalCompletion12 && _iterator12["return"] != null) {
                            _iterator12["return"]();
                          }
                        } finally {
                          if (_didIteratorError12) {
                            throw _iteratorError12;
                          }
                        }
                      }
                    }
                  }
                } catch (err) {
                  _didIteratorError11 = true;
                  _iteratorError11 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion11 && _iterator11["return"] != null) {
                      _iterator11["return"]();
                    }
                  } finally {
                    if (_didIteratorError11) {
                      throw _iteratorError11;
                    }
                  }
                }
              }

              for (var _i16 = bitarray.length - 1; _i16 >= 0; _i16--) {
                result += bitarray[_i16] ? "1" : "0";
              }

              return new _bignumber["default"](result).toFixed();
            },
            getAllAncestorsMask: function getAllAncestorsMask(subprocId) {
              var bitarray = [];
              var result = "0b";
              var node = globalNodeMap.get(subprocId);

              while (node.$parent) {
                bitarray[controlFlowInfo.nodeIndexMap.get(node.id)] = 1;
                node = node.$parent;
              }

              for (var _i17 = bitarray.length - 1; _i17 >= 0; _i17--) {
                result += bitarray[_i17] ? "1" : "0";
              }

              return new _bignumber["default"](result).toFixed();
            },
            subprocessMarking: function subprocessMarking(subprocessId) {
              var bitarray = [];
              var result = "0b";
              var localInfo = globalControlFlowInfoMap.get(subprocessId);
              var edgeList = [];
              localInfo.nodeList.forEach(function (nodeId) {
                var node = globalNodeMap.get(nodeId);

                if (node.$parent && node.$parent.id === subprocessId && node.incoming) {
                  var _iteratorNormalCompletion13 = true;
                  var _didIteratorError13 = false;
                  var _iteratorError13 = undefined;

                  try {
                    for (var _iterator13 = node.incoming[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
                      var incoming = _step13.value;
                      edgeList.push(incoming.id);
                    }
                  } catch (err) {
                    _didIteratorError13 = true;
                    _iteratorError13 = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion13 && _iterator13["return"] != null) {
                        _iterator13["return"]();
                      }
                    } finally {
                      if (_didIteratorError13) {
                        throw _iteratorError13;
                      }
                    }
                  }
                }
              });
              edgeList.forEach(function (edgeId) {
                bitarray[controlFlowInfo.edgeIndexMap.get(edgeId)] = 1;
              });

              for (var _i18 = bitarray.length - 1; _i18 >= 0; _i18--) {
                result += bitarray[_i18] ? "1" : "0";
              }

              return new _bignumber["default"](result).toFixed();
            },
            subprocessFullMarking: function subprocessFullMarking(subprocId) {
              var bitarray = [];
              var result = "0b";
              var children = [subprocId];
              controlFlowInfo.nodeList.forEach(function (nodeId) {
                var node = globalNodeMap.get(nodeId);

                if (is(node, "bpmn:SubProcess") && multiinstanceActivities.indexOf(nodeId) < 0) {
                  while (node.$parent) {
                    if (node.$parent.id === subprocId) {
                      if (children.indexOf(nodeId) < 0) children.push(nodeId);
                      break;
                    }

                    node = node.$parent;
                  }
                }
              });
              children.forEach(function (subprocessId) {
                var localInfo = globalControlFlowInfoMap.get(subprocessId);
                localInfo.edgeList.forEach(function (edgeId) {
                  bitarray[controlFlowInfo.edgeIndexMap.get(edgeId)] = 1;
                });
              });

              for (var _i19 = bitarray.length - 1; _i19 >= 0; _i19--) {
                result += bitarray[_i19] ? "1" : "0";
              }

              return new _bignumber["default"](result).toFixed();
            },
            flowEdgeIndex: function flowEdgeIndex(flowEdgeId) {
              var bitarray = [];
              bitarray[controlFlowInfo.edgeIndexMap.get(flowEdgeId)] = 1;
              var result = "0b";

              for (var _i20 = bitarray.length - 1; _i20 >= 0; _i20--) {
                result += bitarray[_i20] ? "1" : "0";
              }

              return new _bignumber["default"](result).toFixed();
            },
            flowNodeIndex: function flowNodeIndex(flowNodeId) {
              var bitarray = [];
              bitarray[globalNodeIndexMap.get(flowNodeId)] = 1;
              var result = "0b";

              for (var _i21 = bitarray.length - 1; _i21 >= 0; _i21--) {
                result += bitarray[_i21] ? "1" : "0";
              }

              return new _bignumber["default"](result).toFixed();
            },
            nodeRealIndex: function nodeRealIndex(nodeId) {
              return globalNodeIndexMap.get(nodeId);
            },
            isPartOfDeferredChoice: function isPartOfDeferredChoice(eventId) {
              var event = globalNodeMap.get(eventId);

              if (event.incoming) {
                var node = event.incoming[0].sourceRef;
                return is(node, "bpmn:EventBasedGateway");
              }

              return false;
            },
            getDeferredChoiceElements: function getDeferredChoiceElements(nodeId) {
              var event = globalNodeMap.get(nodeId);
              var res = [];

              if (event.incoming) {
                var node = event.incoming[0].sourceRef;

                if (is(node, "bpmn:EventBasedGateway")) {
                  var _iteratorNormalCompletion14 = true;
                  var _didIteratorError14 = false;
                  var _iteratorError14 = undefined;

                  try {
                    for (var _iterator14 = node.outgoing[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
                      var outgoing = _step14.value;
                      if (outgoing.targetRef.id !== nodeId) res.push(outgoing.targetRef.id);
                    }
                  } catch (err) {
                    _didIteratorError14 = true;
                    _iteratorError14 = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion14 && _iterator14["return"] != null) {
                        _iterator14["return"]();
                      }
                    } finally {
                      if (_didIteratorError14) {
                        throw _iteratorError14;
                      }
                    }
                  }
                }
              }

              return res;
            },
            deferredChoiceNodeMarking: function deferredChoiceNodeMarking(nodeId) {
              var event = globalNodeMap.get(nodeId);
              var bitarray = [];

              if (event.incoming) {
                var node = event.incoming[0].sourceRef;

                if (is(node, "bpmn:EventBasedGateway")) {
                  var _iteratorNormalCompletion15 = true;
                  var _didIteratorError15 = false;
                  var _iteratorError15 = undefined;

                  try {
                    for (var _iterator15 = node.outgoing[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
                      var outgoing = _step15.value;
                      bitarray[controlFlowInfo.nodeIndexMap.get(outgoing.targetRef.id)] = 1;
                    }
                  } catch (err) {
                    _didIteratorError15 = true;
                    _iteratorError15 = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion15 && _iterator15["return"] != null) {
                        _iterator15["return"]();
                      }
                    } finally {
                      if (_didIteratorError15) {
                        throw _iteratorError15;
                      }
                    }
                  }
                }
              }

              var result = "0";

              for (var _i22 = bitarray.length - 1; _i22 >= 0; _i22--) {
                result += bitarray[_i22] ? "1" : "0";
              }

              return new _bignumber["default"](result).toFixed();
            },
            deferredChoiceMarking: function deferredChoiceMarking(eventId) {
              var event = globalNodeMap.get(eventId);
              var node = event.incoming[0].sourceRef;
              var bitarray = [];
              var result = "0b";

              if (node.outgoing) {
                var _iteratorNormalCompletion16 = true;
                var _didIteratorError16 = false;
                var _iteratorError16 = undefined;

                try {
                  for (var _iterator16 = node.outgoing[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
                    var outgoing = _step16.value;
                    bitarray[controlFlowInfo.edgeIndexMap.get(outgoing.id)] = 1;
                  }
                } catch (err) {
                  _didIteratorError16 = true;
                  _iteratorError16 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion16 && _iterator16["return"] != null) {
                      _iterator16["return"]();
                    }
                  } finally {
                    if (_didIteratorError16) {
                      throw _iteratorError16;
                    }
                  }
                }
              } else result = "0";

              for (var _i23 = bitarray.length - 1; _i23 >= 0; _i23--) {
                result += bitarray[_i23] ? "1" : "0";
              }

              return new _bignumber["default"](result).toFixed();
            },
            globalDeclarations: function globalDeclarations() {
              if (controlFlowInfo.globalParameters.length > 0) return controlFlowInfo.globalParameters;else return "";
            },
            getOracleFunction: function getOracleFunction(nodeId) {
              if (controlFlowInfo.oracleTaskMap.has(nodeId)) return controlFlowInfo.oracleInfo.get(controlFlowInfo.oracleTaskMap.get(nodeId)).functionName;
              return "";
            },
            nodeParameters: function nodeParameters(nodeId) {
              var node = globalNodeMap.get(nodeId);

              if (node.documentation && node.documentation[0].text && node.documentation[0].text.length > 0) {
                var resDict = extractParameters(node.documentation[0].text, nodeId, null);
                return resDict !== undefined ? resDict.get("input").length > 0 || resDict.get("output").length > 0 : false;
              }

              return false;
            },
            typeParameters: function typeParameters(nodeId, isInput, hasPreviousParameter) {
              var node = globalNodeMap.get(nodeId);
              var res = "";

              if (node.documentation && node.documentation[0].text && node.documentation[0].text.length > 0 && extractParameters(node.documentation[0].text, nodeId, null) !== undefined) {
                var localParams = isInput ? extractParameters(node.documentation[0].text, nodeId, null).get("input") : extractParameters(node.documentation[0].text, nodeId, null).get("output");

                if (localParams.length > 0) {
                  res = localParams[0];

                  for (var _i24 = 2; _i24 < localParams.length; _i24 += 2) {
                    res += ", " + localParams[_i24];
                  }
                }
              }

              return hasPreviousParameter && res.length > 0 ? ", " + res : res;
            },
            concatParameters: function concatParameters(nodeId, isInput, hasType, hasPreviousParameter) {
              var node = globalNodeMap.get(nodeId);
              var res = "";

              if (node.documentation && node.documentation[0].text && node.documentation[0].text.length > 0 && extractParameters(node.documentation[0].text, nodeId, null) !== undefined) {
                var localParams = isInput ? extractParameters(node.documentation[0].text, nodeId, null).get("input") : extractParameters(node.documentation[0].text, nodeId, null).get("output");

                if (localParams.length > 0) {
                  res = hasType ? localParams[0] + " " + localParams[1] : localParams[1];

                  for (var _i25 = 2; _i25 < localParams.length; _i25 += 2) {
                    res += "," + (hasType ? localParams[_i25] + " " + localParams[_i25 + 1] : localParams[_i25 + 1]);
                  }
                }
              }

              return hasPreviousParameter && res.length > 0 ? ", " + res : res;
            },
            nodeFunctionBody: function nodeFunctionBody(nodeId) {
              var node = globalNodeMap.get(nodeId);

              if (node.script) {
                return node.script.split("->");
              } else if (node.documentation && node.documentation[0].text && node.documentation[0].text.length > 0 && extractParameters(node.documentation[0].text, nodeId, null) !== undefined) {
                return extractParameters(node.documentation[0].text, nodeId, null).get("body");
              } else return "";
            },
            getCondition: function getCondition(flowEdge) {
              return flowEdge.conditionExpression ? flowEdge.conditionExpression.body : flowEdge.name ? flowEdge.name : flowEdge.id;
            },
            is: is
          };
          var localSolidity = bpmn2solTemplate(codeGenerationInfo); // Code for using the WorkList template

          var userTaskList = [];
          var parameterInfo = new Map();
          controlFlowInfo.nodeList.forEach(function (nodeId) {
            var node = globalNodeMap.get(nodeId);

            if (is(node, 'bpmn:UserTask') || is(node, 'bpmn:ReceiveTask')) {
              userTaskList.push(nodeId);

              if (controlFlowInfo.localParameters.has(nodeId) && (controlFlowInfo.localParameters.get(nodeId).get('input').length > 0 || controlFlowInfo.localParameters.get(nodeId).get('output').length > 0)) {
                parameterInfo.set(nodeId, controlFlowInfo.localParameters.get(nodeId));
              }
            }
          });
          if (controlFlowInfo.catchingMessages.length > 0) userTaskList = userTaskList.concat(controlFlowInfo.catchingMessages); // WorkList: Smart Contract Generation

          var workListGenerationInfo = {
            nodeList: userTaskList,
            restrictRelation: restrictRelation,
            parameterInfo: parameterInfo,
            nodeIndex: globalNodeIndexMap,
            nodeMap: globalNodeMap,
            processId: function processId() {
              return controlFlowInfo.self.id;
            },
            nodeName: function nodeName(nodeId) {
              return getNodeName(globalNodeMap.get(nodeId));
            },
            getParameterType: function getParameterType(nodeId, isInput, isType, hasPrevious) {
              var res = "";

              if (parameterInfo.get(nodeId)) {
                var localParams = isInput ? parameterInfo.get(nodeId).get("input") : parameterInfo.get(nodeId).get("output");

                if (localParams && localParams.length > 0) {
                  res = isType ? localParams[0].type : localParams[0].name;

                  for (var _i26 = 1; _i26 < localParams.length; _i26++) {
                    res += isType ? ", " + localParams[_i26].type : ", " + localParams[_i26].name;
                  }
                }
              }

              return res.length > 0 && hasPrevious ? ", " + res : res;
            },
            getParameters: function getParameters(nodeId, isInput, hasType, hasPrevious) {
              var res = "";

              if (parameterInfo.get(nodeId)) {
                var localParams = isInput ? parameterInfo.get(nodeId).get("input") : parameterInfo.get(nodeId).get("output");

                if (localParams && localParams.length > 0) {
                  res = hasType ? localParams[0].type + " " + localParams[0].name : localParams[0].name;

                  for (var _i27 = 1; _i27 < localParams.length; _i27++) {
                    res += hasType ? ", " + localParams[_i27].type + " " + localParams[_i27].name : ", " + localParams[_i27].name;
                  }
                }
              }

              return res.length > 0 && hasPrevious ? ", " + res : res;
            },
            getWorkItemsGroupByParameters: function getWorkItemsGroupByParameters(isInput) {
              var name2Ids = new Map();
              controlFlowInfo.nodeList.forEach(function (nodeId) {
                var node = globalNodeMap.get(nodeId);

                if (is(node, 'bpmn:UserTask') || is(node, 'bpmn:ReceiveTask') || catchingMessages.indexOf(nodeId) >= 0) {
                  var params = "";

                  if (node.documentation && node.documentation[0].text && node.documentation[0].text.length > 0 && extractParameters(node.documentation[0].text, nodeId, null) !== undefined) {
                    var localParams = isInput ? extractParameters(node.documentation[0].text, nodeId, null).get("input") : extractParameters(node.documentation[0].text, nodeId, null).get("output");

                    if (localParams.length > 0) {
                      params = localParams[0];

                      for (var _i28 = 2; _i28 < localParams.length; _i28 += 2) {
                        params += localParams[_i28];
                      }
                    }
                  }

                  var name = getNodeName(globalNodeMap.get(nodeId)) + params;

                  if (!name2Ids.has(name)) {
                    name2Ids.set(name, []);
                  }

                  name2Ids.get(name).push(nodeId);
                }
              });
              return name2Ids;
            },
            is: is
          };
          modelInfo.solidity += localSolidity;

          if (userTaskList.length > 0) {
            modelInfo.solidity += workList2solTemplate(workListGenerationInfo);
          }

          modelInfo.controlFlowInfoMap.set(controlFlowInfo.self.id, controlFlowInfo);
        } else {
          controlFlowInfo.nodeList.forEach(function (nodeId) {
            return controlFlowInfo.nodeIndexMap.set(nodeId, globalNodeIndexMap.get(nodeId));
          });
          controlFlowInfo.edgeList.forEach(function (edgeId) {
            return controlFlowInfo.edgeIndexMap.set(edgeId, globalEdgeIndexMap.get(edgeId));
          });
        }
      };

      for (var _i7 = 0, _globalControlFlowInf2 = globalControlFlowInfo; _i7 < _globalControlFlowInf2.length; _i7++) {
        _loop4();
      } //////////////////////////////////////////////////////////////////////////////////


      modelInfo.entryContractName = modelInfo.name + ":" + (proc.name ? proc.name.replace(/\s+/g, "_") : proc.id) + "_Contract";
      resolve();
    })["catch"](function (err) {
      throw new Error(err);
      reject();
    });
  });
};

var _default = parseModel;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2FwcC9yZXNvbHZlcnMvbXV0YXRpb24vYWRkLW1vZGVsL3BhcnNlLW1vZGVsLnRzIl0sIm5hbWVzIjpbImRlYnVnIiwiYnBtbjJzb2xUZW1wbGF0ZSIsImVqcyIsImNvbXBpbGUiLCJicG1uMnNvbEVKUyIsIndvcmtMaXN0MnNvbFRlbXBsYXRlIiwid29ya0xpc3Qyc29sRUpTIiwibW9kZGxlIiwiQnBtbk1vZGRsZSIsInBhcnNlQnBtbiIsImJwbW5Eb2MiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImZyb21YTUwiLCJlcnIiLCJkZWZpbml0aW9ucyIsImlzIiwiZWxlbWVudCIsInR5cGUiLCIkaW5zdGFuY2VPZiIsImNvbGxlY3RDb250cm9sRmxvd0luZm8iLCJwcm9jIiwiZ2xvYmFsTm9kZU1hcCIsImdsb2JhbENvbnRyb2xGbG93SW5mbyIsIm5vZGVMaXN0IiwiZWRnZUxpc3QiLCJib3VuZGFyeUV2ZW50cyIsIm5vbkJsb2NraW5nQm91bmRhcnlFdmVudHMiLCJjb250cm9sRmxvd0luZm8iLCJmbG93RWxlbWVudHMiLCJmaWx0ZXIiLCJlIiwibm9kZSIsInB1c2giLCJpZCIsImNhbmNlbEFjdGl2aXR5Iiwic2V0Iiwic291cmNlcyIsImZsb3dFZGdlIiwiaW5kZXhPZiIsInRhcmdldFJlZiIsInNwbGljZSIsImxlbmd0aCIsImRmcyIsIm9wZW4iLCJjdXJySWQiLCJwb3AiLCJjdXJyIiwiZ2V0Iiwib3V0Z29pbmciLCJzdWNjRWRnZSIsInN1Y2MiLCJtYWluUGF0aE5vZGVMaXN0IiwibWFpblBhdGhFZGdlTGlzdCIsImxvY2FsQm91bmRhcnkiLCJmb3JFYWNoIiwiZXZ0SWQiLCJib3VuZGFyeU5vZGVQYXRoIiwiYm91bmRhcnlFZGdlUGF0aCIsImNvbmNhdCIsIkNvbnRyb2xGbG93SW5mbyIsImV2ZW50SWQiLCJldmVudCIsImZpbmQiLCJhdHRhY2hlZFRvUmVmIiwiRXJyb3IiLCJsb2NhbE5vZGVMaXN0IiwibG9jYWxFZGdlTGlzdCIsIm5vZGVJZCIsImNoaWxkQ29udHJvbEZsb3dJbmZvIiwicGFyZW50Iiwic3VicHJvY2VzcyIsInN1YnByb2Nlc3NDb250cm9sRmxvd0luZm8iLCJsb29wQ2hhcmFjdGVyaXN0aWNzIiwiJHR5cGUiLCJpc0VtYmVkZGVkIiwiZG9jdW1lbnRhdGlvbiIsImdsb2JhbFBhcmFtZXRlcnMiLCJ0ZXh0IiwicmVzdHJpY3RSZWxhdGlvbiIsIk1hcCIsImV4dHJhY3RQYXJhbWV0ZXJzIiwiY2FkIiwiYXJyIiwic3BsaXQiLCJ0YXNrUm9sZU1hcCIsInRyaW0iLCJ1bmRlZmluZWQiLCJvcmFjbGVfRGF0YSIsImoiLCJmaXJzdCIsImNoYXJBdCIsInN1YnN0ciIsInJlcGxhY2UiLCJmaXJzdFNwbGl0IiwiYXV4IiwiaSIsInNlY29uZFNwbGl0IiwicmVzTWFwIiwiaW5wdXRPdXRwdXQiLCJwYXJhbWV0ZXJUeXBlIiwidGVtcCIsInJlcyIsInN1YkNhZCIsImluUGFyYW1ldGVycyIsIm91dFBhcmFtZXRlcnMiLCJ0b0l0ZXJhdGUiLCJQYXJhbWV0ZXJJbmZvIiwicGFyYW1ldGVycyIsInNwbGl0UmVzdWx0Iiwib3JhY2xlSW5mbyIsImhhcyIsIk9yYWNsZUluZm8iLCJvcmFjbGVUYXNrTWFwIiwibG9jYWxPcmFjbGUiLCJhZGRyZXNzIiwiZnVuY3Rpb25OYW1lIiwiZnVuY3Rpb25QYXJhbWV0ZXJzIiwibG9jYWxQYXJhbWV0ZXJzIiwiZ2V0Tm9kZU5hbWUiLCJuYW1lIiwicGFyc2VNb2RlbCIsIm1vZGVsSW5mbyIsImJwbW4iLCJ0aGVuIiwic29saWRpdHkiLCJjb250cm9sRmxvd0luZm9NYXAiLCJkaWFncmFtcyIsInBsYW5lIiwiYnBtbkVsZW1lbnQiLCJyb290RWxlbWVudHMiLCJnbG9iYWxOb2RlSW5kZXhNYXAiLCJnbG9iYWxFZGdlSW5kZXhNYXAiLCJtYWluQ29udHJvbEZsb3dJbmZvIiwiZ2xvYmFsQ29udHJvbEZsb3dJbmZvTWFwIiwic2VsZiIsImluZGV4ZXNUb1JlbW92ZSIsInRyaWdnZXJlZEJ5RXZlbnQiLCJub2RlSW5mbyIsImlzSW50ZXJydXB0aW5nIiwiY2hpbGRJZCIsImluZGV4Iiwic29ydCIsImluZDEiLCJpbmQyIiwiaGFzRXh0ZXJuYWxDYWxsIiwibXVsdGlpbnN0YW5jZUFjdGl2aXRpZXMiLCJjYWxsQWN0aXZpdGllcyIsIm5vbkludGVycnVwdGluZ0V2ZW50cyIsImNhdGNoaW5nTWVzc2FnZXMiLCJtYXAiLCJldmVudERlZmluaXRpb25zIiwic3RhcnQiLCIkcGFyZW50IiwicGFydDEiLCJwYXJ0MiIsIm5vZGVJbmRleE1hcCIsIm5vZGVOYW1lTWFwIiwiZXh0ZXJuYWxCdW5kbGVzIiwiZWRnZUlkIiwiZWRnZUluZGV4TWFwIiwiY29kZUdlbmVyYXRpb25JbmZvIiwibm9kZU1hcCIsInByb2Nlc3NJZCIsIm5vZGVOYW1lIiwiZXZlbnRUeXBlIiwic3Vic3RyaW5nIiwiYWxsRXZlbnRUeXBlcyIsInRha2VuIiwiZ2V0TWVzc2FnZXMiLCJjYW5kaWRhdGVzIiwic3ViUCIsImV2dCIsImdldFRocm93aW5nTWVzc2FnZXMiLCJnZXRUaHJvd2luZ0V2ZW50cyIsInN1YnByb2NJZCIsImV2VHlwZSIsImdldENhdGNoaW5nRXZlbnRzIiwidW5zaGlmdCIsImdldFRlcm1pbmF0ZUNhbmRpZGF0ZXMiLCJsb2NhbEMiLCJlbGVtSWQiLCJlbGVtIiwiZ2V0UHJvY2Vzc0NhbmRpZGF0ZXNNYXNrRnJvbSIsImV2dFR5cGUiLCJldnRDb2RlIiwic291cmNlUHJvY2Vzc2VzIiwiYWxsRXZlbnRzIiwiZXZlbnRMaXN0IiwiYml0YXJyYXkiLCJwcm9jSWQiLCJwcmV2aW91c1BhcmVudCIsImV2ZW50Rm91bmQiLCJyZXN1bHQiLCJCaWdOdW1iZXIiLCJ0b0ZpeGVkIiwiZ2V0Q2F0Y2hpbmdFdmVudHNGcm9tIiwiZ2V0V29ya0l0ZW1zR3JvdXBCeVBhcmFtZXRlcnMiLCJpc0lucHV0IiwibmFtZTJJZHMiLCJwYXJhbXMiLCJsb2NhbFBhcmFtcyIsImdldENvbnRyYWN0czJDYWxsIiwiZ2V0Q29udHJhY3RzMkNhbGxGcm9tIiwiZ2V0Q29udHJhY3RzMkNhbGxNYXNrRnJvbSIsImdldENvbnRyYWN0czJDYWxsQXJyYXkiLCJnZXRQb3NzaWJsZUtpbGxTdWJwcm9jZXNzIiwiYXR0YWNoZWRUbyIsImdldENvdW50RXh0ZXJuYWxUYXNrcyIsImdldFN0YXJ0ZWRNZXNzYWdlcyIsImdldFBhcmVudCIsImdldENvbnRyYWN0TmFtZSIsImdldEFsbENoaWxkcmVuIiwiZGlyZWN0IiwiaXNTdGFydGluZ0NvbnRyYWN0RXZlbnQiLCJpc0VtYmVkZGVkU3VicHJvY2VzcyIsInN1YnByb2Nlc3NJZCIsImlzQm91bmRhcnlFdmVudCIsInByZU1hcmtpbmciLCJpbmNvbWluZyIsInBvc3RNYXJraW5nIiwic3VicHJvY2Vzc05vZGVNYXJraW5nIiwic3VicHJvY2Vzc05vZGVGdWxsTWFya2luZyIsImNoaWxkcmVuIiwic3VicHJvY2Vzc1N0YXJ0TWFya2luZyIsInRvU2VhcmNoIiwiZ2V0QWxsQW5jZXN0b3JzTWFzayIsInN1YnByb2Nlc3NNYXJraW5nIiwibG9jYWxJbmZvIiwic3VicHJvY2Vzc0Z1bGxNYXJraW5nIiwiZmxvd0VkZ2VJbmRleCIsImZsb3dFZGdlSWQiLCJmbG93Tm9kZUluZGV4IiwiZmxvd05vZGVJZCIsIm5vZGVSZWFsSW5kZXgiLCJpc1BhcnRPZkRlZmVycmVkQ2hvaWNlIiwic291cmNlUmVmIiwiZ2V0RGVmZXJyZWRDaG9pY2VFbGVtZW50cyIsImRlZmVycmVkQ2hvaWNlTm9kZU1hcmtpbmciLCJkZWZlcnJlZENob2ljZU1hcmtpbmciLCJnbG9iYWxEZWNsYXJhdGlvbnMiLCJnZXRPcmFjbGVGdW5jdGlvbiIsIm5vZGVQYXJhbWV0ZXJzIiwicmVzRGljdCIsInR5cGVQYXJhbWV0ZXJzIiwiaGFzUHJldmlvdXNQYXJhbWV0ZXIiLCJjb25jYXRQYXJhbWV0ZXJzIiwiaGFzVHlwZSIsIm5vZGVGdW5jdGlvbkJvZHkiLCJzY3JpcHQiLCJnZXRDb25kaXRpb24iLCJjb25kaXRpb25FeHByZXNzaW9uIiwiYm9keSIsImxvY2FsU29saWRpdHkiLCJ1c2VyVGFza0xpc3QiLCJwYXJhbWV0ZXJJbmZvIiwid29ya0xpc3RHZW5lcmF0aW9uSW5mbyIsIm5vZGVJbmRleCIsImdldFBhcmFtZXRlclR5cGUiLCJpc1R5cGUiLCJoYXNQcmV2aW91cyIsImdldFBhcmFtZXRlcnMiLCJlbnRyeUNvbnRyYWN0TmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUdBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVNBLElBQU1BLEtBQUssR0FBRyx3QkFBTywyQkFBUCxDQUFkO0FBRUEsSUFBTUMsZ0JBQWdCLEdBQUdDLEdBQUcsQ0FBQ0MsT0FBSixDQUFZQyxXQUFaLENBQXpCO0FBRUEsSUFBTUMsb0JBQW9CLEdBQUdILEdBQUcsQ0FBQ0MsT0FBSixDQUFZRyxlQUFaLENBQTdCO0FBRUEsSUFBSUMsTUFBTSxHQUFHLElBQUlDLHNCQUFKLEVBQWI7O0FBQ0EsSUFBSUMsU0FBUyxHQUFHLFNBQVpBLFNBQVksQ0FBQUMsT0FBTyxFQUFJO0FBQ3ZCLFNBQU8sSUFBSUMsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUNwQ04sSUFBQUEsTUFBTSxDQUFDTyxPQUFQLENBQWVKLE9BQWYsRUFBd0IsVUFBQ0ssR0FBRCxFQUFNQyxXQUFOLEVBQXNCO0FBQzFDLFVBQUksQ0FBQ0QsR0FBTCxFQUFVSCxPQUFPLENBQUNJLFdBQUQsQ0FBUCxDQUFWLEtBQ0tILE1BQU0sQ0FBQ0UsR0FBRCxDQUFOO0FBQ1IsS0FIRDtBQUlILEdBTE0sQ0FBUDtBQU1ILENBUEQ7O0FBU0EsSUFBSUUsRUFBRSxHQUFHLFNBQUxBLEVBQUssQ0FBQ0MsT0FBRCxFQUFVQyxJQUFWO0FBQUEsU0FBbUJELE9BQU8sQ0FBQ0UsV0FBUixDQUFvQkQsSUFBcEIsQ0FBbkI7QUFBQSxDQUFUOztBQUNBLElBQUlFLHVCQUFKOztBQUNBQSx1QkFBc0IsR0FBRyxnQ0FBQ0MsSUFBRCxFQUNDQyxhQURELEVBRUNDLHFCQUZELEVBRW9FO0FBQ3pGLE1BQUlDLFFBQXVCLEdBQUcsRUFBOUI7QUFDQSxNQUFJQyxRQUF1QixHQUFHLEVBQTlCO0FBQ0EsTUFBSUMsY0FBNkIsR0FBRyxFQUFwQztBQUNBLE1BQUlDLHlCQUF3QyxHQUFHLEVBQS9DO0FBQ0EsTUFBSUMsZUFBSjtBQUx5RjtBQUFBO0FBQUE7O0FBQUE7QUFPekYseUJBQWlCUCxJQUFJLENBQUNRLFlBQUwsQ0FBa0JDLE1BQWxCLENBQXlCLFVBQUFDLENBQUM7QUFBQSxhQUFJZixFQUFFLENBQUNlLENBQUQsRUFBSSxlQUFKLENBQU47QUFBQSxLQUExQixDQUFqQiw4SEFBd0U7QUFBQSxVQUEvREMsSUFBK0Q7O0FBQ3BFLFVBQUloQixFQUFFLENBQUNnQixJQUFELEVBQU8sb0JBQVAsQ0FBTixFQUFvQztBQUNoQ04sUUFBQUEsY0FBYyxDQUFDTyxJQUFmLENBQW9CRCxJQUFJLENBQUNFLEVBQXpCO0FBQ0EsWUFBSUYsSUFBSSxDQUFDRyxjQUFMLElBQXVCLEtBQTNCLEVBQWtDUix5QkFBeUIsQ0FBQ00sSUFBMUIsQ0FBK0JELElBQUksQ0FBQ0UsRUFBcEM7QUFDckMsT0FIRCxNQUdPO0FBQ0hWLFFBQUFBLFFBQVEsQ0FBQ1MsSUFBVCxDQUFjRCxJQUFJLENBQUNFLEVBQW5CO0FBQ0g7O0FBQ0RaLE1BQUFBLGFBQWEsQ0FBQ2MsR0FBZCxDQUFrQkosSUFBSSxDQUFDRSxFQUF2QixFQUEyQkYsSUFBM0I7QUFDSDtBQWZ3RjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQWlCekYsTUFBSUssT0FBTyxzQkFBT2IsUUFBUCxDQUFYOztBQWpCeUY7QUFBQTtBQUFBOztBQUFBO0FBbUJ6RiwwQkFBcUJILElBQUksQ0FBQ1EsWUFBTCxDQUFrQkMsTUFBbEIsQ0FBeUIsVUFBQUMsQ0FBQztBQUFBLGFBQzNDZixFQUFFLENBQUNlLENBQUQsRUFBSSxtQkFBSixDQUR5QztBQUFBLEtBQTFCLENBQXJCLG1JQUVHO0FBQUEsVUFGTU8sUUFFTjs7QUFDQyxVQUFJRCxPQUFPLENBQUNFLE9BQVIsQ0FBZ0JELFFBQVEsQ0FBQ0UsU0FBVCxDQUFtQk4sRUFBbkMsSUFBeUMsQ0FBQyxDQUE5QyxFQUFpRDtBQUM3Q0csUUFBQUEsT0FBTyxDQUFDSSxNQUFSLENBQWVKLE9BQU8sQ0FBQ0UsT0FBUixDQUFnQkQsUUFBUSxDQUFDRSxTQUFULENBQW1CTixFQUFuQyxDQUFmLEVBQXVELENBQXZEO0FBQ0g7O0FBQ0RULE1BQUFBLFFBQVEsQ0FBQ1EsSUFBVCxDQUFjSyxRQUFRLENBQUNKLEVBQXZCO0FBQ0gsS0ExQndGLENBNEJ6Rjs7QUE1QnlGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBNkJ6RlYsRUFBQUEsUUFBUSxHQUFHQSxRQUFRLENBQUNNLE1BQVQsQ0FBZ0IsVUFBQ0UsSUFBRDtBQUFBLFdBQWtCSyxPQUFPLENBQUNFLE9BQVIsQ0FBZ0JQLElBQWhCLElBQXdCLENBQTFDO0FBQUEsR0FBaEIsQ0FBWDs7QUFFQSxNQUFJTCx5QkFBeUIsQ0FBQ2UsTUFBMUIsR0FBbUMsQ0FBdkMsRUFBMEM7QUFDdEMsUUFBSUMsR0FBRyxHQUFHLFNBQU5BLEdBQU0sQ0FBQ04sT0FBRCxFQUF1QjtBQUM3QixVQUFJTyxJQUFJLHNCQUFPUCxPQUFQLENBQVI7O0FBQ0EsVUFBSWIsUUFBdUIsR0FBRyxFQUE5QjtBQUNBLFVBQUlDLFFBQXVCLEdBQUcsRUFBOUI7O0FBQ0EsYUFBT21CLElBQUksQ0FBQ0YsTUFBTCxHQUFjLENBQXJCLEVBQXdCO0FBQ3BCLFlBQUlHLE1BQU0sR0FBR0QsSUFBSSxDQUFDRSxHQUFMLEVBQWI7QUFDQSxZQUFJQyxJQUFJLEdBQUd6QixhQUFhLENBQUMwQixHQUFkLENBQWtCSCxNQUFsQixDQUFYO0FBQ0FyQixRQUFBQSxRQUFRLENBQUNTLElBQVQsQ0FBY1ksTUFBZDs7QUFDQSxZQUFJRSxJQUFJLENBQUNFLFFBQUwsSUFBaUJGLElBQUksQ0FBQ0UsUUFBTCxDQUFjUCxNQUFkLEdBQXVCLENBQTVDO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQ0ksa0NBQXFCSyxJQUFJLENBQUNFLFFBQTFCLG1JQUFvQztBQUFBLGtCQUEzQkMsUUFBMkI7QUFDaEMsa0JBQUlDLElBQUksR0FBR0QsUUFBUSxDQUFDVixTQUFwQjtBQUNBZixjQUFBQSxRQUFRLENBQUNRLElBQVQsQ0FBY2lCLFFBQVEsQ0FBQ2hCLEVBQXZCO0FBQ0Esa0JBQUlVLElBQUksQ0FBQ0wsT0FBTCxDQUFhWSxJQUFJLENBQUNqQixFQUFsQixJQUF3QixDQUF4QixJQUE2QlYsUUFBUSxDQUFDZSxPQUFULENBQWlCWSxJQUFJLENBQUNqQixFQUF0QixJQUE0QixDQUE3RCxFQUNJVSxJQUFJLENBQUNYLElBQUwsQ0FBVWtCLElBQUksQ0FBQ2pCLEVBQWY7QUFDUDtBQU5MO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU9IOztBQUNELGFBQU8sQ0FBQ1YsUUFBRCxFQUFXQyxRQUFYLENBQVA7QUFDSCxLQWpCRDs7QUFEc0MsZUFtQktrQixHQUFHLENBQUNOLE9BQUQsQ0FuQlI7QUFBQTtBQUFBLFFBbUJqQ2UsZ0JBbkJpQztBQUFBLFFBbUJmQyxnQkFuQmU7O0FBb0J0QyxRQUFJQyxhQUFhLEdBQUcsRUFBcEI7QUFDQTVCLElBQUFBLGNBQWMsQ0FBQzZCLE9BQWYsQ0FBdUIsVUFBQUMsS0FBSyxFQUFJO0FBQzVCLFVBQUk3Qix5QkFBeUIsQ0FBQ1ksT0FBMUIsQ0FBa0NpQixLQUFsQyxJQUEyQyxDQUEvQyxFQUNJRixhQUFhLENBQUNyQixJQUFkLENBQW1CdUIsS0FBbkI7QUFDUCxLQUhEOztBQUlBLFFBQUlGLGFBQWEsQ0FBQ1osTUFBZCxHQUF1QixDQUEzQixFQUE4QjtBQUFBLGtCQUNpQkMsR0FBRyxDQUFDVyxhQUFELENBRHBCO0FBQUE7QUFBQSxVQUNyQkcsZ0JBRHFCO0FBQUEsVUFDSEMsZ0JBREc7O0FBRTFCRCxNQUFBQSxnQkFBZ0IsR0FBR0EsZ0JBQWdCLENBQUMzQixNQUFqQixDQUNmLFVBQUNFLElBQUQ7QUFBQSxlQUFrQnNCLGFBQWEsQ0FBQ2YsT0FBZCxDQUFzQlAsSUFBdEIsSUFBOEIsQ0FBaEQ7QUFBQSxPQURlLENBQW5CO0FBR0FvQixNQUFBQSxnQkFBZ0IsR0FBR0EsZ0JBQWdCLENBQUNPLE1BQWpCLENBQXdCRixnQkFBeEIsQ0FBbkI7QUFDQUosTUFBQUEsZ0JBQWdCLEdBQUdBLGdCQUFnQixDQUFDTSxNQUFqQixDQUF3QkQsZ0JBQXhCLENBQW5CO0FBQ0gsS0FoQ3FDLENBa0N0Qzs7O0FBQ0FOLElBQUFBLGdCQUFnQixHQUFHQSxnQkFBZ0IsQ0FBQ3RCLE1BQWpCLENBQXdCLFVBQUNFLElBQUQ7QUFBQSxhQUFrQkssT0FBTyxDQUFDRSxPQUFSLENBQWdCUCxJQUFoQixJQUF3QixDQUExQztBQUFBLEtBQXhCLENBQW5CO0FBRUFKLElBQUFBLGVBQWUsR0FBRyxJQUFJZ0MsNEJBQUosQ0FDZHZDLElBRGMsRUFFZCtCLGdCQUZjLEVBR2RDLGdCQUhjLEVBSWRoQixPQUpjLEVBS2RYLGNBTGMsQ0FBbEI7QUFPQUgsSUFBQUEscUJBQXFCLENBQUNVLElBQXRCLENBQTJCTCxlQUEzQjs7QUE1Q3NDO0FBNkNqQyxVQUFJaUMsT0FBTyw2QkFBWDtBQUNELFVBQUlDLEtBQUssR0FBR3hDLGFBQWEsQ0FBQzBCLEdBQWQsQ0FBa0JhLE9BQWxCLENBQVo7O0FBQ0EsVUFBSSxDQUFDVCxnQkFBZ0IsQ0FBQ1csSUFBakIsQ0FBc0IsVUFBQ2hDLENBQUQ7QUFBQSxlQUFlK0IsS0FBSyxDQUFDRSxhQUFOLENBQW9COUIsRUFBcEIsS0FBMkJILENBQTFDO0FBQUEsT0FBdEIsQ0FBTCxFQUF5RTtBQUNyRSxjQUFNLElBQUlrQyxLQUFKLENBQ0Ysb0dBREUsQ0FBTjtBQUdIOztBQW5EaUMsa0JBcURHdEIsR0FBRyxDQUFDLENBQUNrQixPQUFELENBQUQsQ0FyRE47QUFBQTtBQUFBLFVBcUQ3QkssYUFyRDZCO0FBQUEsVUFxRGRDLGFBckRjOztBQXNEbEMsVUFDSWYsZ0JBQWdCLENBQUN0QixNQUFqQixDQUNJLFVBQUNzQyxNQUFEO0FBQUEsZUFBb0JGLGFBQWEsQ0FBQzNCLE9BQWQsQ0FBc0I2QixNQUF0QixLQUFpQyxDQUFyRDtBQUFBLE9BREosRUFFRTFCLE1BRkYsR0FFVyxDQUhmLEVBS0ksTUFBTSxJQUFJdUIsS0FBSixDQUNGLG1HQURFLENBQU4sQ0EzRDhCLENBK0RsQzs7QUFDQUMsTUFBQUEsYUFBYSxHQUFHQSxhQUFhLENBQUNwQyxNQUFkLENBQXFCLFVBQUNFLElBQUQ7QUFBQSxlQUFrQkssT0FBTyxDQUFDRSxPQUFSLENBQWdCUCxJQUFoQixJQUF3QixDQUExQztBQUFBLE9BQXJCLENBQWhCO0FBRUEsVUFBSXFDLG9CQUFvQixHQUFHLElBQUlULDRCQUFKLENBQ3ZCRSxLQUR1QixFQUV2QkksYUFGdUIsRUFHdkJDLGFBSHVCLEVBSXZCLENBQUNOLE9BQUQsQ0FKdUIsRUFLdkIsRUFMdUIsQ0FBM0I7QUFPQVEsTUFBQUEsb0JBQW9CLENBQUNDLE1BQXJCLEdBQThCakQsSUFBOUI7QUFDQUUsTUFBQUEscUJBQXFCLENBQUNVLElBQXRCLENBQTJCb0Msb0JBQTNCO0FBMUVrQzs7QUE2Q3RDLDhDQUFvQjFDLHlCQUFwQiw2Q0FBK0M7QUFBQTtBQThCOUM7QUFDSixHQTVFRCxNQTRFTztBQUNIQyxJQUFBQSxlQUFlLEdBQUcsSUFBSWdDLDRCQUFKLENBQ2R2QyxJQURjLEVBRWRHLFFBRmMsRUFHZEMsUUFIYyxFQUlkWSxPQUpjLEVBS2RYLGNBTGMsQ0FBbEI7QUFPQUgsSUFBQUEscUJBQXFCLENBQUNVLElBQXRCLENBQTJCTCxlQUEzQjtBQUNIOztBQXBId0Y7QUFBQTtBQUFBOztBQUFBO0FBc0h6RiwwQkFBdUJQLElBQUksQ0FBQ1EsWUFBTCxDQUFrQkMsTUFBbEIsQ0FBeUIsVUFBQUMsQ0FBQztBQUFBLGFBQUlmLEVBQUUsQ0FBQ2UsQ0FBRCxFQUFJLGlCQUFKLENBQU47QUFBQSxLQUExQixDQUF2QixtSUFBZ0Y7QUFBQSxVQUF2RXdDLFVBQXVFOztBQUM1RSxVQUFJQyx5QkFBeUIsR0FBR3BELHVCQUFzQixDQUFDbUQsVUFBRCxFQUFhakQsYUFBYixFQUE0QkMscUJBQTVCLENBQXREOztBQUNBaUQsTUFBQUEseUJBQXlCLENBQUNGLE1BQTFCLEdBQW1DakQsSUFBbkM7O0FBRUEsVUFBSSxFQUFFa0QsVUFBVSxDQUFDRSxtQkFBWCxJQUFrQ0YsVUFBVSxDQUFDRSxtQkFBWCxDQUErQkMsS0FBL0IsS0FBeUMsdUNBQTdFLENBQUosRUFBMkg7QUFDdkg7QUFDQUYsUUFBQUEseUJBQXlCLENBQUNHLFVBQTFCLEdBQXVDLElBQXZDO0FBRUEvQyxRQUFBQSxlQUFlLENBQUNKLFFBQWhCLEdBQTJCSSxlQUFlLENBQUNKLFFBQWhCLENBQXlCbUMsTUFBekIsQ0FBZ0NhLHlCQUF5QixDQUFDaEQsUUFBMUQsQ0FBM0I7QUFDQUksUUFBQUEsZUFBZSxDQUFDSCxRQUFoQixHQUEyQkcsZUFBZSxDQUFDSCxRQUFoQixDQUF5QmtDLE1BQXpCLENBQWdDYSx5QkFBeUIsQ0FBQy9DLFFBQTFELENBQTNCO0FBQ0FHLFFBQUFBLGVBQWUsQ0FBQ0YsY0FBaEIsR0FBaUNFLGVBQWUsQ0FBQ0YsY0FBaEIsQ0FBK0JpQyxNQUEvQixDQUFzQ2EseUJBQXlCLENBQUM5QyxjQUFoRSxDQUFqQztBQUNIO0FBQ0o7QUFsSXdGO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBbUl6RixNQUFJTCxJQUFJLENBQUN1RCxhQUFULEVBQXdCO0FBQ3BCaEQsSUFBQUEsZUFBZSxDQUFDaUQsZ0JBQWhCLEdBQW1DeEQsSUFBSSxDQUFDdUQsYUFBTCxDQUFtQixDQUFuQixFQUFzQkUsSUFBekQ7QUFDSDs7QUFDRCxTQUFPbEQsZUFBUDtBQUNILENBeklEOztBQTJJQSxJQUFJbUQsZ0JBQWtDLEdBQUcsSUFBSUMsR0FBSixFQUF6Qzs7QUFJQSxJQUFJQyxpQkFBaUIsR0FBRyxTQUFwQkEsaUJBQW9CLENBQUNDLEdBQUQsRUFBTWQsTUFBTixFQUFjeEMsZUFBZCxFQUFrQztBQUNsRDtBQUVKLE1BQUl1RCxHQUFHLEdBQUdELEdBQUcsQ0FBQ0UsS0FBSixDQUFVLEdBQVYsQ0FBVjs7QUFDQSxNQUFHRCxHQUFHLENBQUN6QyxNQUFKLElBQWMsQ0FBakIsRUFBb0I7QUFDaEIsUUFBR2QsZUFBZSxJQUFJLElBQXRCLEVBQ0lBLGVBQWUsQ0FBQ3lELFdBQWhCLENBQTRCakQsR0FBNUIsQ0FBZ0NnQyxNQUFoQyxFQUF3Q2UsR0FBRyxDQUFDLENBQUQsQ0FBSCxDQUFPRyxJQUFQLEVBQXhDO0FBQ0osUUFBR0gsR0FBRyxDQUFDLENBQUQsQ0FBSCxDQUFPekMsTUFBUCxHQUFnQixDQUFuQixFQUNJd0MsR0FBRyxHQUFHQyxHQUFHLENBQUMsQ0FBRCxDQUFULENBREosS0FHSSxPQUFPSSxTQUFQO0FBQ1AsR0FYcUQsQ0FhdEQ7OztBQUNBLE1BQUlDLFdBQVcsR0FBRyxFQUFsQjs7QUFDQSxPQUFLLElBQUlDLENBQUMsR0FBRyxDQUFSLEVBQVdDLEtBQUssR0FBRyxLQUF4QixFQUErQkQsQ0FBQyxHQUFHUCxHQUFHLENBQUN4QyxNQUF2QyxFQUErQytDLENBQUMsRUFBaEQsRUFBb0Q7QUFDaEQsUUFBSVAsR0FBRyxDQUFDUyxNQUFKLENBQVdGLENBQVgsTUFBa0IsR0FBdEIsRUFBMkI7QUFDdkIsVUFBSSxDQUFDQyxLQUFMLEVBQVlBLEtBQUssR0FBRyxJQUFSLENBQVosS0FDSztBQUNEUixRQUFBQSxHQUFHLEdBQUdBLEdBQUcsQ0FBQ1UsTUFBSixDQUFXSCxDQUFYLENBQU47QUFDQTtBQUNIO0FBQ0o7O0FBQ0QsUUFBSVAsR0FBRyxDQUFDUyxNQUFKLENBQVdGLENBQVgsTUFBa0IsR0FBdEIsRUFBMkI7QUFDdkJELE1BQUFBLFdBQVcsR0FBRyxFQUFkO0FBQ0E7QUFDSDs7QUFDREEsSUFBQUEsV0FBVyxJQUFJTixHQUFHLENBQUNTLE1BQUosQ0FBV0YsQ0FBWCxDQUFmO0FBQ0gsR0E1QnFELENBOEJ0RDs7O0FBQ0FQLEVBQUFBLEdBQUcsR0FBR0EsR0FBRyxDQUNKVyxPQURDLENBQ08sR0FEUCxFQUNZLEdBRFosRUFFREEsT0FGQyxDQUVPLEdBRlAsRUFFWSxHQUZaLEVBR0RQLElBSEMsRUFBTjtBQUlBSixFQUFBQSxHQUFHLEdBQUdBLEdBQUcsQ0FDSlcsT0FEQyxDQUNPLEdBRFAsRUFDWSxHQURaLEVBRURBLE9BRkMsQ0FFTyxHQUZQLEVBRVksR0FGWixFQUdEUCxJQUhDLEVBQU47QUFLQSxNQUFJUSxVQUFVLEdBQUdaLEdBQUcsQ0FBQ0UsS0FBSixDQUFVLEdBQVYsQ0FBakI7O0FBQ0EsTUFBSVUsVUFBVSxDQUFDcEQsTUFBWCxHQUFvQixDQUF4QixFQUEyQjtBQUN2QixRQUFJcUQsR0FBRyxHQUFHLEVBQVY7O0FBQ0EsU0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHRixVQUFVLENBQUNwRCxNQUEvQixFQUF1Q3NELENBQUMsRUFBeEM7QUFBNENELE1BQUFBLEdBQUcsSUFBSUQsVUFBVSxDQUFDRSxDQUFELENBQWpCO0FBQTVDOztBQUNBRixJQUFBQSxVQUFVLEdBQUcsQ0FBQ0EsVUFBVSxDQUFDLENBQUQsQ0FBWCxFQUFnQkMsR0FBaEIsQ0FBYjtBQUNIOztBQUNELE1BQUlFLFdBQVcsR0FBR0gsVUFBVSxDQUFDQSxVQUFVLENBQUNwRCxNQUFYLEdBQW9CLENBQXJCLENBQVYsQ0FBa0M0QyxJQUFsQyxHQUF5Q0YsS0FBekMsQ0FBK0MsSUFBL0MsQ0FBbEI7QUFDQSxNQUFJYyxNQUFrQyxHQUFHLElBQUlsQixHQUFKLEVBQXpDO0FBRUEsTUFBSW1CLFdBQVcsR0FBRyxDQUFDTCxVQUFVLENBQUMsQ0FBRCxDQUFWLENBQWNSLElBQWQsRUFBRCxFQUF1QlcsV0FBVyxDQUFDLENBQUQsQ0FBWCxDQUFlWCxJQUFmLEVBQXZCLENBQWxCO0FBQ0EsTUFBSWMsYUFBYSxHQUFHLENBQUMsT0FBRCxFQUFVLFFBQVYsQ0FBcEI7QUFDQUYsRUFBQUEsTUFBTSxDQUFDOUQsR0FBUCxDQUFXLE1BQVgsRUFBbUIsQ0FBQzZELFdBQVcsQ0FBQ0EsV0FBVyxDQUFDdkQsTUFBWixHQUFxQixDQUF0QixDQUFYLENBQW9DNEMsSUFBcEMsRUFBRCxDQUFuQjs7QUFuRHNELCtCQXFEN0NVLEdBckQ2QztBQXNEbEQsUUFBSUssSUFBSSxHQUFHRixXQUFXLENBQUNILEdBQUQsQ0FBWCxDQUFlWixLQUFmLENBQXFCLEdBQXJCLENBQVg7O0FBQ0EsUUFBSWtCLEdBQUcsR0FBRyxFQUFWO0FBQ0FELElBQUFBLElBQUksQ0FBQzlDLE9BQUwsQ0FBYSxVQUFBZ0QsTUFBTSxFQUFJO0FBQ25CLFVBQUlSLEdBQUcsR0FBR1EsTUFBTSxDQUFDakIsSUFBUCxHQUFjRixLQUFkLENBQW9CLEdBQXBCLENBQVY7O0FBQ0EsVUFBSVcsR0FBRyxDQUFDLENBQUQsQ0FBSCxDQUFPVCxJQUFQLEdBQWM1QyxNQUFkLEdBQXVCLENBQTNCLEVBQThCO0FBQzFCNEQsUUFBQUEsR0FBRyxDQUFDckUsSUFBSixDQUFTOEQsR0FBRyxDQUFDLENBQUQsQ0FBSCxDQUFPVCxJQUFQLEVBQVQ7QUFDQWdCLFFBQUFBLEdBQUcsQ0FBQ3JFLElBQUosQ0FBUzhELEdBQUcsQ0FBQ0EsR0FBRyxDQUFDckQsTUFBSixHQUFhLENBQWQsQ0FBSCxDQUFvQjRDLElBQXBCLEVBQVQ7QUFDSDtBQUNKLEtBTkQ7QUFPQVksSUFBQUEsTUFBTSxDQUFDOUQsR0FBUCxDQUFXZ0UsYUFBYSxDQUFDSixHQUFELENBQXhCLEVBQTZCTSxHQUE3QjtBQS9Ea0Q7O0FBcUR0RCxPQUFLLElBQUlOLEdBQUMsR0FBRyxDQUFiLEVBQWdCQSxHQUFDLEdBQUdHLFdBQVcsQ0FBQ3pELE1BQWhDLEVBQXdDc0QsR0FBQyxFQUF6QyxFQUE2QztBQUFBLFdBQXBDQSxHQUFvQztBQVc1QyxHQWhFcUQsQ0FpRXREOzs7QUFDQSxNQUFJcEUsZUFBZSxJQUFJLElBQXZCLEVBQTZCO0FBQ3pCLFFBQUk0RSxZQUFrQyxHQUFHLEVBQXpDO0FBQ0EsUUFBSUMsYUFBbUMsR0FBRyxFQUExQztBQUNBLFFBQUlDLFNBQVMsR0FBR1IsTUFBTSxDQUFDbEQsR0FBUCxDQUFXLE9BQVgsQ0FBaEI7O0FBQ0EsU0FBSyxJQUFJZ0QsR0FBQyxHQUFHLENBQWIsRUFBZ0JBLEdBQUMsR0FBR1UsU0FBUyxDQUFDaEUsTUFBOUIsRUFBc0NzRCxHQUFDLElBQUksQ0FBM0M7QUFDSVEsTUFBQUEsWUFBWSxDQUFDdkUsSUFBYixDQUFrQixJQUFJMEUsMEJBQUosQ0FBa0JELFNBQVMsQ0FBQ1YsR0FBRCxDQUEzQixFQUFnQ1UsU0FBUyxDQUFDVixHQUFDLEdBQUcsQ0FBTCxDQUF6QyxDQUFsQjtBQURKOztBQUVBVSxJQUFBQSxTQUFTLEdBQUdSLE1BQU0sQ0FBQ2xELEdBQVAsQ0FBVyxRQUFYLENBQVo7QUFDQSxRQUFJNEQsVUFBNkMsR0FBRyxJQUFJNUIsR0FBSixFQUFwRDtBQUNBNEIsSUFBQUEsVUFBVSxDQUFDeEUsR0FBWCxDQUFlLE9BQWYsRUFBd0JvRSxZQUF4QjtBQUNBSSxJQUFBQSxVQUFVLENBQUN4RSxHQUFYLENBQWUsUUFBZixFQUF5QnFFLGFBQXpCOztBQUNBLFNBQUssSUFBSVQsR0FBQyxHQUFHLENBQWIsRUFBZ0JBLEdBQUMsR0FBR1UsU0FBUyxDQUFDaEUsTUFBOUIsRUFBc0NzRCxHQUFDLElBQUksQ0FBM0M7QUFDSVMsTUFBQUEsYUFBYSxDQUFDeEUsSUFBZCxDQUFtQixJQUFJMEUsMEJBQUosQ0FBa0JELFNBQVMsQ0FBQ1YsR0FBRCxDQUEzQixFQUFnQ1UsU0FBUyxDQUFDVixHQUFDLEdBQUcsQ0FBTCxDQUF6QyxDQUFuQjtBQURKOztBQUVBLFFBQUlSLFdBQVcsQ0FBQzlDLE1BQVosR0FBcUIsQ0FBekIsRUFBNEI7QUFDeEI4QyxNQUFBQSxXQUFXLEdBQUdBLFdBQVcsQ0FBQ0YsSUFBWixHQUFtQk8sT0FBbkIsQ0FBMkIsR0FBM0IsRUFBZ0MsR0FBaEMsQ0FBZDtBQUNBTCxNQUFBQSxXQUFXLEdBQUdBLFdBQVcsQ0FDcEJLLE9BRFMsQ0FDRCxHQURDLEVBQ0ksR0FESixFQUVUQSxPQUZTLENBRUQsSUFGQyxFQUVLLEdBRkwsRUFHVFAsSUFIUyxFQUFkO0FBSUEsVUFBSXVCLFdBQVcsR0FBR3JCLFdBQVcsQ0FBQ0osS0FBWixDQUFrQixHQUFsQixDQUFsQjs7QUFDQSxVQUFJLENBQUN4RCxlQUFlLENBQUNrRixVQUFoQixDQUEyQkMsR0FBM0IsQ0FBK0JGLFdBQVcsQ0FBQyxDQUFELENBQTFDLENBQUwsRUFBcUQ7QUFDakRqRixRQUFBQSxlQUFlLENBQUNrRixVQUFoQixDQUEyQjFFLEdBQTNCLENBQ0l5RSxXQUFXLENBQUMsQ0FBRCxDQURmLEVBRUksSUFBSUcsdUJBQUosQ0FBZUgsV0FBVyxDQUFDLENBQUQsQ0FBMUIsQ0FGSjtBQUlIOztBQUNEakYsTUFBQUEsZUFBZSxDQUFDcUYsYUFBaEIsQ0FBOEI3RSxHQUE5QixDQUFrQ2dDLE1BQWxDLEVBQTBDeUMsV0FBVyxDQUFDLENBQUQsQ0FBckQ7QUFDQSxVQUFJSyxXQUFXLEdBQUd0RixlQUFlLENBQUNrRixVQUFoQixDQUEyQjlELEdBQTNCLENBQStCNkQsV0FBVyxDQUFDLENBQUQsQ0FBMUMsQ0FBbEI7QUFDQUssTUFBQUEsV0FBVyxDQUFDQyxPQUFaLEdBQXNCTixXQUFXLENBQUMsQ0FBRCxDQUFqQztBQUNBSyxNQUFBQSxXQUFXLENBQUNFLFlBQVosR0FBMkJQLFdBQVcsQ0FBQyxDQUFELENBQXRDO0FBQ0FLLE1BQUFBLFdBQVcsQ0FBQ0csa0JBQVosR0FBaUNULFVBQVUsQ0FBQzVELEdBQVgsQ0FBZSxPQUFmLENBQWpDO0FBQ0gsS0FsQkQsTUFrQk9wQixlQUFlLENBQUMwRixlQUFoQixDQUFnQ2xGLEdBQWhDLENBQW9DZ0MsTUFBcEMsRUFBNEN3QyxVQUE1QztBQUNWOztBQUNELFNBQU9WLE1BQVA7QUFDSCxDQW5HRDs7QUFxR0EsSUFBSXFCLFdBQVcsR0FBRyxTQUFkQSxXQUFjLENBQUN2RixJQUFEO0FBQUEsU0FDZEEsSUFBSSxDQUFDd0YsSUFBTCxHQUFZeEYsSUFBSSxDQUFDd0YsSUFBTCxDQUFVM0IsT0FBVixDQUFrQixNQUFsQixFQUEwQixHQUExQixDQUFaLEdBQTZDN0QsSUFBSSxDQUFDRSxFQURwQztBQUFBLENBQWxCOztBQUdBLElBQUl1RixVQUFVLEdBQUcsU0FBYkEsVUFBYSxDQUFDQyxTQUFELEVBQTBCO0FBQ3ZDLFNBQU8sSUFBSWhILE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDcENKLElBQUFBLFNBQVMsQ0FBQ2tILFNBQVMsQ0FBQ0MsSUFBWCxDQUFULENBQ0tDLElBREwsQ0FDVSxVQUFDN0csV0FBRCxFQUFzQjtBQUN4QmhCLE1BQUFBLEtBQUssQ0FBQyxjQUFELEVBQWlCZ0IsV0FBakIsQ0FBTDtBQUNBMkcsTUFBQUEsU0FBUyxDQUFDRyxRQUFWLEdBQXFCLDJCQUFyQjtBQUNBSCxNQUFBQSxTQUFTLENBQUNJLGtCQUFWLEdBQStCLElBQUk5QyxHQUFKLEVBQS9CLENBSHdCLENBS3hCOztBQUNBLFVBQUksQ0FBQ2pFLFdBQVcsQ0FBQ2dILFFBQWIsSUFBeUJoSCxXQUFXLENBQUNnSCxRQUFaLENBQXFCckYsTUFBckIsSUFBK0IsQ0FBNUQsRUFDSSxNQUFNLElBQUl1QixLQUFKLENBQVUsc0NBQVYsQ0FBTjtBQUNKLFVBQUk1QyxJQUFJLEdBQUdOLFdBQVcsQ0FBQ2dILFFBQVosQ0FBcUIsQ0FBckIsRUFBd0JDLEtBQXhCLENBQThCQyxXQUF6QztBQUNBUCxNQUFBQSxTQUFTLENBQUNGLElBQVYsR0FBaUJuRyxJQUFJLENBQUNtRyxJQUFMLEdBQVluRyxJQUFJLENBQUNtRyxJQUFMLENBQVUzQixPQUFWLENBQWtCLE1BQWxCLEVBQTBCLEdBQTFCLENBQVosR0FBNkN4RSxJQUFJLENBQUNhLEVBQW5FO0FBQ0F3RixNQUFBQSxTQUFTLENBQUN4RixFQUFWLEdBQWViLElBQUksQ0FBQ2EsRUFBcEI7O0FBQ0EsVUFBSWIsSUFBSSxDQUFDcUQsS0FBTCxLQUFlLGNBQW5CLEVBQW1DO0FBQy9CLFlBQUlyRCxJQUFJLENBQUNxRCxLQUFMLEtBQWUsb0JBQW5CLEVBQXlDO0FBQ3JDLGVBQUssSUFBSXNCLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdqRixXQUFXLENBQUNtSCxZQUFaLENBQXlCeEYsTUFBN0MsRUFBcURzRCxDQUFDLEVBQXREO0FBQ0ksZ0JBQUlqRixXQUFXLENBQUNtSCxZQUFaLENBQXlCbEMsQ0FBekIsRUFBNEJ0QixLQUE1QixLQUFzQyxjQUExQyxFQUEwRDtBQUN0RHJELGNBQUFBLElBQUksR0FBR04sV0FBVyxDQUFDbUgsWUFBWixDQUF5QmxDLENBQXpCLENBQVA7QUFDQTBCLGNBQUFBLFNBQVMsQ0FBQ0YsSUFBVixHQUFpQm5HLElBQUksQ0FBQ21HLElBQUwsR0FBWW5HLElBQUksQ0FBQ21HLElBQUwsQ0FBVTNCLE9BQVYsQ0FBa0IsTUFBbEIsRUFBMEIsR0FBMUIsQ0FBWixHQUE2Q3hFLElBQUksQ0FBQ2EsRUFBbkU7QUFDQXdGLGNBQUFBLFNBQVMsQ0FBQ3hGLEVBQVYsR0FBZWIsSUFBSSxDQUFDYSxFQUFwQjtBQUNBO0FBQ0g7QUFOTDtBQU9ILFNBUkQsTUFRTztBQUNILGdCQUFNLElBQUkrQixLQUFKLENBQVUsb0NBQVYsQ0FBTjtBQUNIO0FBQ0osT0F2QnVCLENBeUJ4Qjs7O0FBRUEsVUFBSTNDLGFBQStCLEdBQUcsSUFBSTBELEdBQUosRUFBdEM7QUFBQSxVQUNJbUQsa0JBQXVDLEdBQUcsSUFBSW5ELEdBQUosRUFEOUM7QUFBQSxVQUVJb0Qsa0JBQXVDLEdBQUcsSUFBSXBELEdBQUosRUFGOUM7QUFBQSxVQUdJekQscUJBQTZDLEdBQUcsRUFIcEQsQ0EzQndCLENBZ0N4Qjs7QUFFQUQsTUFBQUEsYUFBYSxDQUFDYyxHQUFkLENBQWtCZixJQUFJLENBQUNhLEVBQXZCLEVBQTJCYixJQUEzQjs7QUFDQSxVQUFJZ0gsbUJBQW1CLEdBQUdqSCx1QkFBc0IsQ0FBQ0MsSUFBRCxFQUFPQyxhQUFQLEVBQXNCQyxxQkFBdEIsQ0FBaEQ7O0FBQ0EsVUFBSStHLHdCQUFzRCxHQUFHLElBQUl0RCxHQUFKLEVBQTdEO0FBQ0F6RCxNQUFBQSxxQkFBcUIsQ0FBQ2dDLE9BQXRCLENBQThCLFVBQUEzQixlQUFlO0FBQUEsZUFDekMwRyx3QkFBd0IsQ0FBQ2xHLEdBQXpCLENBQTZCUixlQUFlLENBQUMyRyxJQUFoQixDQUFxQnJHLEVBQWxELEVBQXNETixlQUF0RCxDQUR5QztBQUFBLE9BQTdDLEVBckN3QixDQXlDeEI7QUFDQTs7QUExQ3dCO0FBMkNuQixZQUFJQSxlQUFlLDZCQUFuQjtBQUNELFlBQUk0RyxlQUFlLEdBQUcsRUFBdEI7QUFDQTVHLFFBQUFBLGVBQWUsQ0FBQ1MsT0FBaEIsQ0FBd0JrQixPQUF4QixDQUFnQyxVQUFBYSxNQUFNLEVBQUk7QUFDdEMsY0FBSTlDLGFBQWEsQ0FBQzBCLEdBQWQsQ0FBa0JvQixNQUFsQixFQUEwQnFFLGdCQUE5QixFQUFnRDtBQUM1QzdHLFlBQUFBLGVBQWUsQ0FBQ0osUUFBaEIsQ0FBeUJTLElBQXpCLENBQThCbUMsTUFBOUI7QUFDQW9FLFlBQUFBLGVBQWUsQ0FBQ3ZHLElBQWhCLENBQXFCTCxlQUFlLENBQUNTLE9BQWhCLENBQXdCRSxPQUF4QixDQUFnQzZCLE1BQWhDLENBQXJCO0FBQ0EsZ0JBQUlzRSxRQUFRLEdBQUdKLHdCQUF3QixDQUFDdEYsR0FBekIsQ0FBNkJvQixNQUE3QixDQUFmO0FBQ0EsZ0JBQUksQ0FBQzlDLGFBQWEsQ0FBQzBCLEdBQWQsQ0FBa0IwRixRQUFRLENBQUNyRyxPQUFULENBQWlCLENBQWpCLENBQWxCLEVBQXVDc0csY0FBNUMsRUFDSUQsUUFBUSxDQUFDbEgsUUFBVCxDQUFrQitCLE9BQWxCLENBQTBCLFVBQUFxRixPQUFPLEVBQUk7QUFDakMsa0JBQUlDLEtBQUssR0FBR2pILGVBQWUsQ0FBQ0osUUFBaEIsQ0FBeUJlLE9BQXpCLENBQWlDcUcsT0FBakMsQ0FBWjtBQUNBLGtCQUFJQyxLQUFLLElBQUksQ0FBYixFQUFnQmpILGVBQWUsQ0FBQ0osUUFBaEIsQ0FBeUJpQixNQUF6QixDQUFnQ29HLEtBQWhDLEVBQXVDLENBQXZDO0FBQ25CLGFBSEQ7QUFJUDtBQUNKLFNBWEQ7QUFZQUwsUUFBQUEsZUFBZSxDQUFDTSxJQUFoQixDQUFxQixVQUFDQyxJQUFELEVBQU9DLElBQVAsRUFBZ0I7QUFDakMsaUJBQU9BLElBQUksR0FBR0QsSUFBZDtBQUNILFNBRkQ7QUFHQVAsUUFBQUEsZUFBZSxDQUFDakYsT0FBaEIsQ0FBd0IsVUFBQXNGLEtBQUssRUFBSTtBQUM3QmpILFVBQUFBLGVBQWUsQ0FBQ1MsT0FBaEIsQ0FBd0JJLE1BQXhCLENBQStCb0csS0FBL0IsRUFBc0MsQ0FBdEM7QUFDSCxTQUZEOztBQUdBLFlBQUk3SCxFQUFFLENBQUNNLGFBQWEsQ0FBQzBCLEdBQWQsQ0FBa0JwQixlQUFlLENBQUMyRyxJQUFoQixDQUFxQnJHLEVBQXZDLENBQUQsRUFBNkMsaUJBQTdDLENBQUYsSUFDQU4sZUFBZSxDQUFDMkcsSUFBaEIsQ0FBcUJFLGdCQURyQixJQUVBbkgsYUFBYSxDQUFDMEIsR0FBZCxDQUFrQnBCLGVBQWUsQ0FBQ1MsT0FBaEIsQ0FBd0IsQ0FBeEIsQ0FBbEIsRUFBOENzRyxjQUE5QyxJQUFnRSxLQUZwRSxFQUUyRTtBQUN2RS9HLFVBQUFBLGVBQWUsQ0FBQytDLFVBQWhCLEdBQTZCLEtBQTdCO0FBQ0g7QUFuRW1COztBQTJDeEIsZ0RBQTRCcEQscUJBQTVCLDZDQUFtRDtBQUFBO0FBeUJsRDs7QUFFRCxVQUFJMEgsZUFBZSxHQUFHLFNBQWxCQSxlQUFrQixDQUFBN0UsTUFBTSxFQUFJO0FBQzVCLFlBQUlwQyxJQUFJLEdBQUdWLGFBQWEsQ0FBQzBCLEdBQWQsQ0FBa0JvQixNQUFsQixDQUFYO0FBQ0EsZUFBT3BELEVBQUUsQ0FBQ2dCLElBQUQsRUFBTyxrQkFBUCxDQUFUO0FBQ0gsT0FIRDs7QUFLQTBGLE1BQUFBLFNBQVMsQ0FBQ3BHLGFBQVYsR0FBMEJBLGFBQTFCOztBQTNFd0I7QUE2RW5CLFlBQUlNLGVBQWUsOEJBQW5COztBQUNELFlBQUksQ0FBQ0EsZUFBZSxDQUFDK0MsVUFBckIsRUFBaUM7QUFDN0IsY0FBSXVFLHVCQUF1QixHQUFHLEVBQTlCO0FBQUEsY0FDSUMsY0FBYyxHQUFHLEVBRHJCO0FBQUEsY0FFSUMscUJBQXFCLEdBQUcsRUFGNUI7QUFBQSxjQUdJQyxnQkFBZ0IsR0FBRyxFQUh2QjtBQUtBekgsVUFBQUEsZUFBZSxDQUFDSixRQUFoQixDQUNLOEgsR0FETCxDQUNTLFVBQUFsRixNQUFNO0FBQUEsbUJBQUk5QyxhQUFhLENBQUMwQixHQUFkLENBQWtCb0IsTUFBbEIsQ0FBSjtBQUFBLFdBRGYsRUFFS2IsT0FGTCxDQUVhLFVBQUF4QixDQUFDLEVBQUk7QUFDVixnQkFBSSxDQUFDZixFQUFFLENBQUNlLENBQUQsRUFBSSxXQUFKLENBQUYsSUFBc0JmLEVBQUUsQ0FBQ2UsQ0FBRCxFQUFJLGlCQUFKLENBQXpCLEtBQW9EQSxDQUFDLENBQUMwQyxtQkFBdEQsSUFDQTFDLENBQUMsQ0FBQzBDLG1CQUFGLENBQXNCQyxLQUF0QixLQUFnQyx1Q0FEcEMsRUFDNkU7QUFDekU5QyxjQUFBQSxlQUFlLENBQUNzSCx1QkFBaEIsQ0FBd0M5RyxHQUF4QyxDQUE0Q0wsQ0FBQyxDQUFDRyxFQUE5QyxFQUFrRHFGLFdBQVcsQ0FBQ3hGLENBQUQsQ0FBN0Q7QUFDQW1ILGNBQUFBLHVCQUF1QixDQUFDakgsSUFBeEIsQ0FBNkJGLENBQUMsQ0FBQ0csRUFBL0I7QUFDSCxhQUpELE1BSU8sSUFBSWxCLEVBQUUsQ0FBQ2UsQ0FBRCxFQUFJLG1CQUFKLENBQU4sRUFBZ0M7QUFDbkNILGNBQUFBLGVBQWUsQ0FBQ3VILGNBQWhCLENBQStCL0csR0FBL0IsQ0FBbUNMLENBQUMsQ0FBQ0csRUFBckMsRUFBeUNxRixXQUFXLENBQUN4RixDQUFELENBQXBEO0FBQ0FvSCxjQUFBQSxjQUFjLENBQUNsSCxJQUFmLENBQW9CRixDQUFDLENBQUNHLEVBQXRCO0FBQ0gsYUFITSxNQUdBLElBQUlsQixFQUFFLENBQUNlLENBQUQsRUFBSSw2QkFBSixDQUFGLElBQXdDZixFQUFFLENBQUNlLENBQUMsQ0FBQ3dILGdCQUFGLENBQW1CLENBQW5CLENBQUQsRUFBd0IsNkJBQXhCLENBQTlDLEVBQ0hGLGdCQUFnQixDQUFDcEgsSUFBakIsQ0FBc0JGLENBQUMsQ0FBQ0csRUFBeEIsRUFERyxLQUVGLElBQUlsQixFQUFFLENBQUNlLENBQUQsRUFBSSxpQkFBSixDQUFGLElBQTRCZixFQUFFLENBQUNlLENBQUMsQ0FBQ3dILGdCQUFGLENBQW1CLENBQW5CLENBQUQsRUFBd0IsNkJBQXhCLENBQWxDLEVBQ0RGLGdCQUFnQixDQUFDcEgsSUFBakIsQ0FBc0JGLENBQUMsQ0FBQ0csRUFBeEI7QUFDUCxXQWRMLEVBTjZCLENBc0I3Qjs7QUFFQU4sVUFBQUEsZUFBZSxDQUFDUyxPQUFoQixDQUF3QmtCLE9BQXhCLENBQWdDLFVBQUFhLE1BQU0sRUFBSTtBQUN0QyxnQkFBSW9GLEtBQUssR0FBR2xJLGFBQWEsQ0FBQzBCLEdBQWQsQ0FBa0JvQixNQUFsQixDQUFaOztBQUNBLGdCQUFJb0YsS0FBSyxDQUFDRCxnQkFBTixJQUEwQkMsS0FBSyxDQUFDRCxnQkFBTixDQUF1QixDQUF2QixDQUExQixJQUF1RHZJLEVBQUUsQ0FBQ3dJLEtBQUssQ0FBQ0QsZ0JBQU4sQ0FBdUIsQ0FBdkIsQ0FBRCxFQUE0Qiw2QkFBNUIsQ0FBekQsSUFDQTNILGVBQWUsQ0FBQ0osUUFBaEIsQ0FBeUJlLE9BQXpCLENBQWlDNkIsTUFBakMsSUFBMkMsQ0FEL0MsRUFDa0Q7QUFDOUN4QyxjQUFBQSxlQUFlLENBQUNKLFFBQWhCLENBQXlCUyxJQUF6QixDQUE4Qm1DLE1BQTlCO0FBQ0Esa0JBQUlpRixnQkFBZ0IsQ0FBQzlHLE9BQWpCLENBQXlCNkIsTUFBekIsSUFBbUMsQ0FBdkMsRUFDSWlGLGdCQUFnQixDQUFDcEgsSUFBakIsQ0FBc0JtQyxNQUF0QjtBQUNQO0FBQ0osV0FSRDtBQVVBeEMsVUFBQUEsZUFBZSxDQUFDRixjQUFoQixDQUErQjZCLE9BQS9CLENBQXVDLFVBQUFhLE1BQU0sRUFBSTtBQUM3QyxnQkFBSXBDLElBQUksR0FBR1YsYUFBYSxDQUFDMEIsR0FBZCxDQUFrQm9CLE1BQWxCLENBQVg7O0FBQ0EsZ0JBQUlwQyxJQUFJLENBQUNpQixRQUFUO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQ0ksc0NBQXFCakIsSUFBSSxDQUFDaUIsUUFBMUI7QUFBQSxzQkFBU0EsUUFBVDtBQUNJckIsa0JBQUFBLGVBQWUsQ0FBQ0gsUUFBaEIsQ0FBeUJRLElBQXpCLENBQThCZ0IsUUFBUSxDQUFDZixFQUF2QztBQURKO0FBREo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUdBLGdCQUFJLENBQUNGLElBQUksQ0FBQ0csY0FBVixFQUEwQjtBQUN0QlAsY0FBQUEsZUFBZSxDQUFDd0gscUJBQWhCLENBQXNDaEgsR0FBdEMsQ0FBMENKLElBQUksQ0FBQ0UsRUFBL0MsRUFBbURxRixXQUFXLENBQUN2RixJQUFELENBQTlEO0FBQ0FvSCxjQUFBQSxxQkFBcUIsQ0FBQ25ILElBQXRCLENBQTJCRCxJQUFJLENBQUNFLEVBQWhDO0FBQ0FOLGNBQUFBLGVBQWUsQ0FBQ0osUUFBaEIsQ0FBeUJTLElBQXpCLENBQThCbUMsTUFBOUIsRUFIc0IsQ0FHaUI7O0FBQ3ZDLGtCQUFJcEMsSUFBSSxDQUFDdUgsZ0JBQUwsQ0FBc0IsQ0FBdEIsS0FBNEJ2SSxFQUFFLENBQUNnQixJQUFJLENBQUN1SCxnQkFBTCxDQUFzQixDQUF0QixDQUFELEVBQTJCLDZCQUEzQixDQUFsQyxFQUE2RjtBQUN6RixvQkFBSUYsZ0JBQWdCLENBQUM5RyxPQUFqQixDQUF5QjZCLE1BQXpCLElBQW1DLENBQXZDLEVBQ0lpRixnQkFBZ0IsQ0FBQ3BILElBQWpCLENBQXNCbUMsTUFBdEI7QUFDUDtBQUNKLGFBUkQsTUFRTyxJQUFJcEMsSUFBSSxDQUFDdUgsZ0JBQUwsSUFBeUJ2SSxFQUFFLENBQUNnQixJQUFJLENBQUN1SCxnQkFBTCxDQUFzQixDQUF0QixDQUFELEVBQTJCLDZCQUEzQixDQUEvQixFQUEwRjtBQUM3RixrQkFBSTNILGVBQWUsQ0FBQ0osUUFBaEIsQ0FBeUJlLE9BQXpCLENBQWlDNkIsTUFBakMsSUFBMkMsQ0FBL0MsRUFDSXhDLGVBQWUsQ0FBQ0osUUFBaEIsQ0FBeUJTLElBQXpCLENBQThCbUMsTUFBOUI7QUFDSixrQkFBSWlGLGdCQUFnQixDQUFDOUcsT0FBakIsQ0FBeUI2QixNQUF6QixJQUFtQyxDQUF2QyxFQUNJaUYsZ0JBQWdCLENBQUNwSCxJQUFqQixDQUFzQm1DLE1BQXRCO0FBQ1A7QUFDSixXQW5CRDtBQXFCQTlDLFVBQUFBLGFBQWEsQ0FBQ2lDLE9BQWQsQ0FBc0IsVUFBQXZCLElBQUksRUFBSTtBQUMxQixnQkFBSWhCLEVBQUUsQ0FBQ2dCLElBQUQsRUFBTyxpQkFBUCxDQUFGLElBQStCQSxJQUFJLENBQUN5RyxnQkFBcEMsSUFBd0Q3RyxlQUFlLENBQUNKLFFBQWhCLENBQXlCZSxPQUF6QixDQUFpQ1AsSUFBSSxDQUFDRSxFQUF0QyxDQUE1RCxFQUF1RztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUNuRyxzQ0FBa0JGLElBQUksQ0FBQ0gsWUFBTCxDQUFrQkMsTUFBbEIsQ0FBeUIsVUFBQUMsQ0FBQztBQUFBLHlCQUFJZixFQUFFLENBQUNlLENBQUQsRUFBSSxlQUFKLENBQUYsSUFBMEJmLEVBQUUsQ0FBQ2UsQ0FBRCxFQUFJLGlCQUFKLENBQWhDO0FBQUEsaUJBQTFCLENBQWxCLG1JQUFxRztBQUFBLHNCQUE1RnlILEtBQTRGOztBQUNqRyxzQkFBSUEsS0FBSyxDQUFDYixjQUFOLElBQXdCLEtBQTVCLEVBQW1DO0FBQy9CLHdCQUFJckUsTUFBTSxHQUFHaEQsYUFBYSxDQUFDMEIsR0FBZCxDQUFrQndHLEtBQUssQ0FBQ0MsT0FBTixDQUFjdkgsRUFBaEMsQ0FBYjtBQUNBTixvQkFBQUEsZUFBZSxDQUFDd0gscUJBQWhCLENBQXNDaEgsR0FBdEMsQ0FBMENvSCxLQUFLLENBQUN0SCxFQUFoRCxFQUFvRHFGLFdBQVcsQ0FBQ2pELE1BQUQsQ0FBL0Q7QUFDQThFLG9CQUFBQSxxQkFBcUIsQ0FBQ25ILElBQXRCLENBQTJCdUgsS0FBSyxDQUFDdEgsRUFBakM7QUFDQU4sb0JBQUFBLGVBQWUsQ0FBQ0osUUFBaEIsQ0FBeUJTLElBQXpCLENBQThCdUgsS0FBSyxDQUFDdEgsRUFBcEM7O0FBQ0Esd0JBQUlzSCxLQUFLLENBQUNELGdCQUFOLENBQXVCLENBQXZCLEtBQTZCdkksRUFBRSxDQUFDd0ksS0FBSyxDQUFDRCxnQkFBTixDQUF1QixDQUF2QixDQUFELEVBQTRCLDZCQUE1QixDQUFuQyxFQUErRjtBQUMzRiwwQkFBSUYsZ0JBQWdCLENBQUM5RyxPQUFqQixDQUF5QmlILEtBQUssQ0FBQ3RILEVBQS9CLElBQXFDLENBQXpDLEVBQ0ltSCxnQkFBZ0IsQ0FBQ3BILElBQWpCLENBQXNCdUgsS0FBSyxDQUFDdEgsRUFBNUI7QUFDUDtBQUNKOztBQUNELHNCQUFJTixlQUFlLENBQUNGLGNBQWhCLENBQStCYSxPQUEvQixDQUF1Q2lILEtBQUssQ0FBQ3RILEVBQTdDLElBQW1ELENBQXZELEVBQTBEO0FBQ3RETixvQkFBQUEsZUFBZSxDQUFDRixjQUFoQixDQUErQk8sSUFBL0IsQ0FBb0N1SCxLQUFLLENBQUN0SCxFQUExQztBQUNBLHdCQUFJTixlQUFlLENBQUNKLFFBQWhCLENBQXlCZSxPQUF6QixDQUFpQ2lILEtBQUssQ0FBQ0MsT0FBTixDQUFjdkgsRUFBL0MsSUFBcUQsQ0FBekQsRUFDSU4sZUFBZSxDQUFDSixRQUFoQixDQUF5QlMsSUFBekIsQ0FBOEJ1SCxLQUFLLENBQUNDLE9BQU4sQ0FBY3ZILEVBQTVDO0FBQ1A7O0FBQ0Qsc0JBQUlzSCxLQUFLLENBQUNELGdCQUFOLENBQXVCLENBQXZCLEtBQTZCdkksRUFBRSxDQUFDd0ksS0FBSyxDQUFDRCxnQkFBTixDQUF1QixDQUF2QixDQUFELEVBQTRCLDZCQUE1QixDQUFuQyxFQUErRjtBQUMzRix3QkFBSTNILGVBQWUsQ0FBQ0osUUFBaEIsQ0FBeUJlLE9BQXpCLENBQWlDaUgsS0FBSyxDQUFDdEgsRUFBdkMsSUFBNkMsQ0FBakQsRUFDSU4sZUFBZSxDQUFDSixRQUFoQixDQUF5QlMsSUFBekIsQ0FBOEJ1SCxLQUFLLENBQUN0SCxFQUFwQztBQUNKLHdCQUFJbUgsZ0JBQWdCLENBQUM5RyxPQUFqQixDQUF5QmlILEtBQUssQ0FBQ3RILEVBQS9CLElBQXFDLENBQXpDLEVBQ0ltSCxnQkFBZ0IsQ0FBQ3BILElBQWpCLENBQXNCdUgsS0FBSyxDQUFDdEgsRUFBNUI7QUFDUDs7QUFDRCxzQkFBSXNILEtBQUssQ0FBQ3ZHLFFBQVY7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFDSSw0Q0FBcUJ1RyxLQUFLLENBQUN2RyxRQUEzQjtBQUFBLDRCQUFTQSxRQUFUO0FBQ0lyQix3QkFBQUEsZUFBZSxDQUFDSCxRQUFoQixDQUF5QlEsSUFBekIsQ0FBOEJnQixRQUFRLENBQUNmLEVBQXZDO0FBREo7QUFESjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHSDtBQTFCa0c7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQTJCdEc7QUFDSixXQTdCRDtBQStCQSxjQUFJd0gsS0FBb0IsR0FBRyxFQUEzQjtBQUNBLGNBQUlDLEtBQW9CLEdBQUcsRUFBM0I7QUFDQS9ILFVBQUFBLGVBQWUsQ0FBQ0osUUFBaEIsQ0FBeUIrQixPQUF6QixDQUFpQyxVQUFBYSxNQUFNLEVBQUk7QUFDdkMsZ0JBQUk2RSxlQUFlLENBQUM3RSxNQUFELENBQW5CLEVBQTZCc0YsS0FBSyxDQUFDekgsSUFBTixDQUFXbUMsTUFBWCxFQUE3QixLQUNLdUYsS0FBSyxDQUFDMUgsSUFBTixDQUFXbUMsTUFBWDtBQUNSLFdBSEQ7QUFJQXhDLFVBQUFBLGVBQWUsQ0FBQ0osUUFBaEIsR0FBMkJrSSxLQUFLLENBQUMvRixNQUFOLENBQWFnRyxLQUFiLENBQTNCO0FBQ0EvSCxVQUFBQSxlQUFlLENBQUNKLFFBQWhCLENBQXlCK0IsT0FBekIsQ0FDSSxVQUFDYSxNQUFELEVBQWlCeUUsS0FBakIsRUFBbUM7QUFDL0IsZ0JBQUk3RyxJQUFJLEdBQUdWLGFBQWEsQ0FBQzBCLEdBQWQsQ0FBa0JvQixNQUFsQixDQUFYO0FBQ0F4QyxZQUFBQSxlQUFlLENBQUNnSSxZQUFoQixDQUE2QnhILEdBQTdCLENBQWlDZ0MsTUFBakMsRUFBeUN5RSxLQUFLLEdBQUcsQ0FBakQ7QUFDQVYsWUFBQUEsa0JBQWtCLENBQUMvRixHQUFuQixDQUF1QmdDLE1BQXZCLEVBQStCeUUsS0FBSyxHQUFHLENBQXZDO0FBQ0FqSCxZQUFBQSxlQUFlLENBQUNpSSxXQUFoQixDQUE0QnpILEdBQTVCLENBQWdDZ0MsTUFBaEMsRUFBd0NtRCxXQUFXLENBQUNqRyxhQUFhLENBQUMwQixHQUFkLENBQWtCb0IsTUFBbEIsQ0FBRCxDQUFuRDs7QUFDQSxnQkFBSXBDLElBQUksQ0FBQzRDLGFBQUwsSUFBc0I1QyxJQUFJLENBQUM0QyxhQUFMLENBQW1CLENBQW5CLEVBQXNCRSxJQUE1QyxJQUFvRDlDLElBQUksQ0FBQzRDLGFBQUwsQ0FBbUIsQ0FBbkIsRUFBc0JFLElBQXRCLENBQTJCcEMsTUFBM0IsR0FBb0MsQ0FBNUYsRUFBK0Y7QUFDM0Ysa0JBQUkxQixFQUFFLENBQUNnQixJQUFELEVBQU8sbUJBQVAsQ0FBTixFQUNJSixlQUFlLENBQUNrSSxlQUFoQixDQUFnQzFILEdBQWhDLENBQW9DZ0MsTUFBcEMsRUFBNENwQyxJQUFJLENBQUM0QyxhQUFMLENBQW1CLENBQW5CLEVBQXNCRSxJQUFsRSxFQURKLEtBR0lHLGlCQUFpQixDQUFDakQsSUFBSSxDQUFDNEMsYUFBTCxDQUFtQixDQUFuQixFQUFzQkUsSUFBdkIsRUFBNkI5QyxJQUFJLENBQUNFLEVBQWxDLEVBQXNDTixlQUF0QyxDQUFqQjtBQUNQO0FBQ0osV0FaTDtBQWNBQSxVQUFBQSxlQUFlLENBQUNILFFBQWhCLENBQXlCOEIsT0FBekIsQ0FDSSxVQUFDd0csTUFBRCxFQUFpQmxCLEtBQWpCLEVBQW1DO0FBQy9CakgsWUFBQUEsZUFBZSxDQUFDb0ksWUFBaEIsQ0FBNkI1SCxHQUE3QixDQUFpQzJILE1BQWpDLEVBQXlDbEIsS0FBSyxHQUFHLENBQWpEO0FBQ0FULFlBQUFBLGtCQUFrQixDQUFDaEcsR0FBbkIsQ0FBdUIySCxNQUF2QixFQUErQmxCLEtBQUssR0FBRyxDQUF2QztBQUNILFdBSkw7QUFNQWpILFVBQUFBLGVBQWUsQ0FBQ3lILGdCQUFoQixHQUFtQ0EsZ0JBQW5DLENBakg2QixDQW1IN0I7O0FBQ0EsY0FBSVksa0JBQWtCLEdBQUc7QUFDckJ6SSxZQUFBQSxRQUFRLEVBQUVJLGVBQWUsQ0FBQ0osUUFETDtBQUVyQjBJLFlBQUFBLE9BQU8sRUFBRTVJLGFBRlk7QUFHckIrSCxZQUFBQSxnQkFBZ0IsRUFBRXpILGVBQWUsQ0FBQ3lILGdCQUhiO0FBSXJCSCxZQUFBQSx1QkFBdUIsRUFBRUEsdUJBSko7QUFLckJDLFlBQUFBLGNBQWMsRUFBRUEsY0FMSztBQU1yQkMsWUFBQUEscUJBQXFCLEVBQUVBLHFCQU5GO0FBT3JCdEMsWUFBQUEsVUFBVSxFQUFFbEYsZUFBZSxDQUFDa0YsVUFQUDtBQVFyQkcsWUFBQUEsYUFBYSxFQUFFckYsZUFBZSxDQUFDcUYsYUFSVjtBQVNyQmtELFlBQUFBLFNBQVMsRUFBRTtBQUFBLHFCQUFNdkksZUFBZSxDQUFDMkcsSUFBaEIsQ0FBcUJyRyxFQUEzQjtBQUFBLGFBVFU7QUFVckJrSSxZQUFBQSxRQUFRLEVBQUUsa0JBQUFoRyxNQUFNO0FBQUEscUJBQUltRCxXQUFXLENBQUNqRyxhQUFhLENBQUMwQixHQUFkLENBQWtCb0IsTUFBbEIsQ0FBRCxDQUFmO0FBQUEsYUFWSztBQVdyQmlHLFlBQUFBLFNBQVMsRUFBRSxtQkFBQWpHLE1BQU0sRUFBSTtBQUNqQixrQkFBSXBDLElBQUksR0FBR1YsYUFBYSxDQUFDMEIsR0FBZCxDQUFrQm9CLE1BQWxCLENBQVg7O0FBQ0Esa0JBQUlwQyxJQUFJLENBQUN1SCxnQkFBTCxJQUF5QnZILElBQUksQ0FBQ3VILGdCQUFMLENBQXNCLENBQXRCLENBQTdCLEVBQXVEO0FBQ25ELG9CQUFJckUsR0FBRyxHQUFHbEQsSUFBSSxDQUFDdUgsZ0JBQUwsQ0FBc0IsQ0FBdEIsRUFBeUI3RSxLQUFuQztBQUNBLHVCQUFPUSxHQUFHLENBQUNvRixTQUFKLENBQWMsQ0FBZCxFQUFpQnBGLEdBQUcsQ0FBQ3hDLE1BQUosR0FBYSxFQUE5QixDQUFQO0FBQ0g7O0FBQ0QscUJBQU8sU0FBUDtBQUNILGFBbEJvQjtBQW1CckI2SCxZQUFBQSxhQUFhLEVBQUUseUJBQU07QUFDakIsa0JBQUlDLEtBQUssR0FBRyxFQUFaO0FBQ0FsSixjQUFBQSxhQUFhLENBQUNpQyxPQUFkLENBQXNCLFVBQUF2QixJQUFJLEVBQUk7QUFDMUIsb0JBQUlBLElBQUksQ0FBQ3VILGdCQUFMLElBQXlCdkgsSUFBSSxDQUFDdUgsZ0JBQUwsQ0FBc0IsQ0FBdEIsQ0FBekIsSUFBcUQsQ0FBQ3ZJLEVBQUUsQ0FBQ2dCLElBQUksQ0FBQ3VILGdCQUFMLENBQXNCLENBQXRCLENBQUQsRUFBMkIsK0JBQTNCLENBQXhELElBQXVILENBQUN2SSxFQUFFLENBQUNnQixJQUFJLENBQUN1SCxnQkFBTCxDQUFzQixDQUF0QixDQUFELEVBQTJCLDZCQUEzQixDQUE5SCxFQUF5TDtBQUNyTCxzQkFBSXJFLEdBQUcsR0FBR2xELElBQUksQ0FBQ3VILGdCQUFMLENBQXNCLENBQXRCLEVBQXlCN0UsS0FBbkM7QUFDQSxzQkFBSThGLEtBQUssQ0FBQ2pJLE9BQU4sQ0FBYzJDLEdBQUcsQ0FBQ29GLFNBQUosQ0FBYyxDQUFkLEVBQWlCcEYsR0FBRyxDQUFDeEMsTUFBSixHQUFhLEVBQTlCLENBQWQsSUFBbUQsQ0FBdkQsRUFDSThILEtBQUssQ0FBQ3ZJLElBQU4sQ0FBV2lELEdBQUcsQ0FBQ29GLFNBQUosQ0FBYyxDQUFkLEVBQWlCcEYsR0FBRyxDQUFDeEMsTUFBSixHQUFhLEVBQTlCLENBQVg7QUFDUDtBQUNKLGVBTkQ7QUFPQSxxQkFBTzhILEtBQVA7QUFDSCxhQTdCb0I7QUE4QnJCQyxZQUFBQSxXQUFXLEVBQUUsdUJBQU07QUFDZixrQkFBSUQsS0FBSyxHQUFHLEVBQVo7QUFDQSxrQkFBSUUsVUFBVSxHQUFHOUksZUFBZSxDQUFDRixjQUFqQztBQUNBRSxjQUFBQSxlQUFlLENBQUNKLFFBQWhCLENBQXlCK0IsT0FBekIsQ0FBaUMsVUFBQWEsTUFBTSxFQUFJO0FBQ3ZDLG9CQUFJcEQsRUFBRSxDQUFDTSxhQUFhLENBQUMwQixHQUFkLENBQWtCb0IsTUFBbEIsQ0FBRCxFQUE0QixpQkFBNUIsQ0FBTixFQUFzRDtBQUNsRCxzQkFBSXVHLElBQUksR0FBR3JDLHdCQUF3QixDQUFDdEYsR0FBekIsQ0FBNkJvQixNQUE3QixDQUFYO0FBQ0FzRyxrQkFBQUEsVUFBVSxHQUFHQSxVQUFVLENBQUMvRyxNQUFYLENBQWtCZ0gsSUFBSSxDQUFDakosY0FBdkIsQ0FBYjtBQUNBaUosa0JBQUFBLElBQUksQ0FBQ3RJLE9BQUwsQ0FBYWtCLE9BQWIsQ0FBcUIsVUFBQXJCLEVBQUUsRUFBSTtBQUN2Qix3QkFBSSxDQUFDbEIsRUFBRSxDQUFDTSxhQUFhLENBQUMwQixHQUFkLENBQWtCZCxFQUFsQixDQUFELEVBQXdCLGlCQUF4QixDQUFILElBQWlEd0ksVUFBVSxDQUFDbkksT0FBWCxDQUFtQkwsRUFBbkIsSUFBeUIsQ0FBOUUsRUFDSXdJLFVBQVUsQ0FBQ3pJLElBQVgsQ0FBZ0JDLEVBQWhCO0FBQ1AsbUJBSEQ7QUFJSDtBQUNKLGVBVEQ7QUFVQXdJLGNBQUFBLFVBQVUsQ0FBQ25ILE9BQVgsQ0FBbUIsVUFBQUMsS0FBSyxFQUFJO0FBQ3hCLG9CQUFJb0gsR0FBRyxHQUFHdEosYUFBYSxDQUFDMEIsR0FBZCxDQUFrQlEsS0FBbEIsQ0FBVjtBQUNBLG9CQUFJb0gsR0FBRyxDQUFDckIsZ0JBQUosSUFBd0JxQixHQUFHLENBQUNyQixnQkFBSixDQUFxQixDQUFyQixDQUF4QixJQUFtRHZJLEVBQUUsQ0FBQzRKLEdBQUcsQ0FBQ3JCLGdCQUFKLENBQXFCLENBQXJCLENBQUQsRUFBMEIsNkJBQTFCLENBQXpELEVBQ0lpQixLQUFLLENBQUN2SSxJQUFOLENBQVd1QixLQUFYO0FBQ1AsZUFKRDtBQUtBLHFCQUFPZ0gsS0FBUDtBQUNILGFBakRvQjtBQWtEckJLLFlBQUFBLG1CQUFtQixFQUFFLCtCQUFNO0FBQ3ZCLGtCQUFJdkUsR0FBRyxHQUFHLEVBQVY7QUFDQTFFLGNBQUFBLGVBQWUsQ0FBQ0osUUFBaEIsQ0FBeUIrQixPQUF6QixDQUFpQyxVQUFBYSxNQUFNLEVBQUk7QUFDdkMsb0JBQUlwQyxJQUFJLEdBQUdWLGFBQWEsQ0FBQzBCLEdBQWQsQ0FBa0JvQixNQUFsQixDQUFYO0FBQ0Esb0JBQUksQ0FBQ3BELEVBQUUsQ0FBQ2dCLElBQUQsRUFBTyxlQUFQLENBQUYsSUFBNkJoQixFQUFFLENBQUNnQixJQUFELEVBQU8sNkJBQVAsQ0FBaEMsS0FDQUEsSUFBSSxDQUFDdUgsZ0JBREwsSUFDeUJ2SCxJQUFJLENBQUN1SCxnQkFBTCxDQUFzQixDQUF0QixDQUR6QixJQUNxRHZJLEVBQUUsQ0FBQ2dCLElBQUksQ0FBQ3VILGdCQUFMLENBQXNCLENBQXRCLENBQUQsRUFBMkIsNkJBQTNCLENBRDNELEVBRUlqRCxHQUFHLENBQUNyRSxJQUFKLENBQVNtQyxNQUFUO0FBQ1AsZUFMRDtBQU1BLHFCQUFPa0MsR0FBUDtBQUNILGFBM0RvQjtBQTREckJ3RSxZQUFBQSxpQkFBaUIsRUFBRSwyQkFBQ0MsU0FBRCxFQUFZQyxNQUFaLEVBQXVCO0FBQ3RDLGtCQUFJMUUsR0FBRyxHQUFHLEVBQVY7QUFDQWhGLGNBQUFBLGFBQWEsQ0FBQ2lDLE9BQWQsQ0FBc0IsVUFBQXZCLElBQUksRUFBSTtBQUMxQixvQkFBSUEsSUFBSSxDQUFDdUgsZ0JBQUwsSUFBeUJ2SCxJQUFJLENBQUN1SCxnQkFBTCxDQUFzQixDQUF0QixDQUE3QixFQUF1RDtBQUNuRCxzQkFBSXJFLEdBQUcsR0FBR2xELElBQUksQ0FBQ3VILGdCQUFMLENBQXNCLENBQXRCLEVBQXlCN0UsS0FBbkM7O0FBQ0Esc0JBQUlRLEdBQUcsQ0FBQ29GLFNBQUosQ0FBYyxDQUFkLEVBQWlCcEYsR0FBRyxDQUFDeEMsTUFBSixHQUFhLEVBQTlCLE1BQXNDc0ksTUFBMUMsRUFBa0Q7QUFDOUMsd0JBQUksQ0FBQ2hLLEVBQUUsQ0FBQ2dCLElBQUQsRUFBTyxlQUFQLENBQUYsSUFBNkJoQixFQUFFLENBQUNnQixJQUFELEVBQU8sNkJBQVAsQ0FBaEMsTUFDQ0EsSUFBSSxDQUFDeUgsT0FBTCxDQUFhdkgsRUFBYixLQUFvQjZJLFNBQXBCLElBQWlDbkosZUFBZSxDQUFDSixRQUFoQixDQUF5QmUsT0FBekIsQ0FBaUNQLElBQUksQ0FBQ0UsRUFBdEMsS0FBNkMsQ0FEL0UsQ0FBSixFQUN1RjtBQUNuRm9FLHNCQUFBQSxHQUFHLENBQUNyRSxJQUFKLENBQVNELElBQUksQ0FBQ0UsRUFBZDtBQUNIO0FBQ0o7QUFDSjtBQUNKLGVBVkQ7QUFXQSxxQkFBT29FLEdBQVA7QUFDSCxhQTFFb0I7QUEyRXJCMkUsWUFBQUEsaUJBQWlCLEVBQUUsMkJBQUNGLFNBQUQsRUFBZTtBQUM5QixrQkFBSXpFLEdBQUcsR0FBRyxFQUFWO0FBQ0FoRixjQUFBQSxhQUFhLENBQUNpQyxPQUFkLENBQXNCLFVBQUF2QixJQUFJLEVBQUk7QUFDMUIsb0JBQUlBLElBQUksQ0FBQ3VILGdCQUFMLElBQXlCdkgsSUFBSSxDQUFDdUgsZ0JBQUwsQ0FBc0IsQ0FBdEIsQ0FBN0IsRUFBdUQ7QUFDbkQsc0JBQUl2SSxFQUFFLENBQUNnQixJQUFELEVBQU8saUJBQVAsQ0FBTixFQUFpQztBQUM3Qix3QkFBSXNDLE1BQU0sR0FBR2hELGFBQWEsQ0FBQzBCLEdBQWQsQ0FBa0JoQixJQUFJLENBQUN5SCxPQUFMLENBQWF2SCxFQUEvQixDQUFiO0FBQ0Esd0JBQUlvQyxNQUFNLENBQUNtRSxnQkFBUCxJQUEyQm5FLE1BQU0sQ0FBQ21GLE9BQVAsQ0FBZXZILEVBQWYsS0FBc0I2SSxTQUFyRCxFQUNJekUsR0FBRyxDQUFDNEUsT0FBSixDQUFZbEosSUFBSSxDQUFDRSxFQUFqQixFQURKLEtBRUssSUFBSSxDQUFDb0MsTUFBTSxDQUFDbUUsZ0JBQVIsS0FBNkJuRSxNQUFNLENBQUNwQyxFQUFQLEtBQWM2SSxTQUFkLElBQTJCbkosZUFBZSxDQUFDSixRQUFoQixDQUF5QmUsT0FBekIsQ0FBaUMrQixNQUFNLENBQUNwQyxFQUF4QyxJQUE4QyxDQUFDLENBQXZHLENBQUosRUFDRG9FLEdBQUcsQ0FBQ3JFLElBQUosQ0FBU0QsSUFBSSxDQUFDRSxFQUFkO0FBQ1AsbUJBTkQsTUFNTyxJQUFJbEIsRUFBRSxDQUFDZ0IsSUFBRCxFQUFPLG9CQUFQLENBQUYsSUFBa0NoQixFQUFFLENBQUNnQixJQUFELEVBQU8sNkJBQVAsQ0FBeEMsRUFBK0U7QUFDbEYsd0JBQUlBLElBQUksQ0FBQ3lILE9BQUwsQ0FBYXZILEVBQWIsS0FBb0I2SSxTQUFwQixJQUFpQ25KLGVBQWUsQ0FBQ0osUUFBaEIsQ0FBeUJlLE9BQXpCLENBQWlDUCxJQUFJLENBQUN5SCxPQUFMLENBQWF2SCxFQUE5QyxJQUFvRCxDQUFDLENBQTFGLEVBQ0lvRSxHQUFHLENBQUNyRSxJQUFKLENBQVNELElBQUksQ0FBQ0UsRUFBZDtBQUNQO0FBQ0o7QUFDSixlQWJEO0FBY0EscUJBQU9vRSxHQUFQO0FBQ0gsYUE1Rm9CO0FBNkZyQjZFLFlBQUFBLHNCQUFzQixFQUFFLGdDQUFDSixTQUFELEVBQWU7QUFDckMsa0JBQUl6RSxHQUFHLEdBQUcsRUFBVjtBQUNBaEYsY0FBQUEsYUFBYSxDQUFDaUMsT0FBZCxDQUFzQixVQUFBdkIsSUFBSSxFQUFJO0FBQzFCLG9CQUFJQSxJQUFJLENBQUN1SCxnQkFBTCxJQUF5QnZILElBQUksQ0FBQ3VILGdCQUFMLENBQXNCLENBQXRCLENBQTdCLEVBQXVEO0FBQ25ELHNCQUFJdkksRUFBRSxDQUFDZ0IsSUFBRCxFQUFPLG9CQUFQLENBQUYsSUFBa0NBLElBQUksQ0FBQ0csY0FBTCxJQUF1QixLQUE3RCxFQUFvRTtBQUNqRSx3QkFBR21HLHdCQUF3QixDQUFDdkIsR0FBekIsQ0FBNkIvRSxJQUFJLENBQUNFLEVBQWxDLENBQUgsRUFBMEM7QUFDeEMsMEJBQUlrSixNQUFNLEdBQUc5Qyx3QkFBd0IsQ0FBQ3RGLEdBQXpCLENBQTZCaEIsSUFBSSxDQUFDRSxFQUFsQyxDQUFiO0FBQ0FrSixzQkFBQUEsTUFBTSxDQUFDNUosUUFBUCxDQUFnQitCLE9BQWhCLENBQXdCLFVBQUE4SCxNQUFNLEVBQUk7QUFDL0IsNEJBQUlDLElBQUksR0FBR2hLLGFBQWEsQ0FBQzBCLEdBQWQsQ0FBa0JxSSxNQUFsQixDQUFYO0FBQ0EsNEJBQUdDLElBQUksQ0FBQy9CLGdCQUFMLElBQXlCdkksRUFBRSxDQUFDc0ssSUFBSSxDQUFDL0IsZ0JBQUwsQ0FBc0IsQ0FBdEIsQ0FBRCxFQUEyQiwrQkFBM0IsQ0FBM0IsSUFBMEYrQixJQUFJLENBQUM3QixPQUFMLENBQWF2SCxFQUFiLEtBQW9CRixJQUFJLENBQUN5SCxPQUFMLENBQWF2SCxFQUE5SCxFQUNJb0UsR0FBRyxDQUFDckUsSUFBSixDQUFTRCxJQUFJLENBQUNFLEVBQWQ7QUFDTix1QkFKRDtBQU1ELHFCQVJELE1BUU87QUFDTG5DLHNCQUFBQSxLQUFLLENBQUMsZ0NBQUQsQ0FBTDtBQUNEO0FBQ0g7QUFDSjtBQUNKLGVBaEJEO0FBaUJBLHFCQUFPdUcsR0FBUDtBQUNELGFBakhvQjtBQWtIckJpRixZQUFBQSw0QkFBNEIsRUFBRSxzQ0FBQy9ILEtBQUQsRUFBUWdJLE9BQVIsRUFBaUJDLE9BQWpCLEVBQTBCQyxlQUExQixFQUEyQ0MsU0FBM0MsRUFBeUQ7QUFDbkYsa0JBQUlDLFNBQVMsR0FBRyxFQUFoQjtBQUNBLGtCQUFJQyxRQUFRLEdBQUcsRUFBZjtBQUNBRixjQUFBQSxTQUFTLENBQUNwSSxPQUFWLENBQWtCLFVBQUFhLE1BQU0sRUFBSTtBQUN4QixvQkFBSWMsR0FBRyxHQUFHNUQsYUFBYSxDQUFDMEIsR0FBZCxDQUFrQm9CLE1BQWxCLEVBQTBCbUYsZ0JBQTFCLENBQTJDLENBQTNDLEVBQThDN0UsS0FBeEQ7QUFDQSxvQkFBSThHLE9BQU8sS0FBS3RHLEdBQUcsQ0FBQ29GLFNBQUosQ0FBYyxDQUFkLEVBQWlCcEYsR0FBRyxDQUFDeEMsTUFBSixHQUFhLEVBQTlCLENBQVosSUFBaUQrSSxPQUFPLEtBQUtsRSxXQUFXLENBQUNqRyxhQUFhLENBQUMwQixHQUFkLENBQWtCb0IsTUFBbEIsQ0FBRCxDQUE1RSxFQUNJd0gsU0FBUyxDQUFDM0osSUFBVixDQUFlbUMsTUFBZjtBQUNQLGVBSkQ7QUFLQXNILGNBQUFBLGVBQWUsQ0FBQ25JLE9BQWhCLENBQXdCLFVBQUF1SSxNQUFNLEVBQUk7QUFDOUIsb0JBQUl4SCxNQUFNLEdBQUdoRCxhQUFhLENBQUMwQixHQUFkLENBQWtCOEksTUFBbEIsQ0FBYjtBQUNBLG9CQUFJQyxjQUFjLEdBQUd6SCxNQUFyQjtBQUNBLG9CQUFJZ0MsR0FBRyxHQUFHLEVBQVY7QUFDQSxvQkFBSTBGLFVBQVUsR0FBRyxLQUFqQjs7QUFDQSx1QkFBTyxDQUFDQSxVQUFELElBQWUxRixHQUFHLENBQUM1RCxNQUFKLElBQWMsQ0FBN0IsSUFBa0M0QixNQUFNLENBQUNtRixPQUF6QyxJQUFvRDdILGVBQWUsQ0FBQzJHLElBQWhCLENBQXFCckcsRUFBckIsS0FBNEJvQyxNQUFNLENBQUNwQyxFQUE5RixFQUFrRztBQUM5Rm9DLGtCQUFBQSxNQUFNLEdBQUdoRCxhQUFhLENBQUMwQixHQUFkLENBQWtCc0IsTUFBTSxDQUFDbUYsT0FBUCxDQUFldkgsRUFBakMsQ0FBVDtBQUNBMEosa0JBQUFBLFNBQVMsQ0FBQ3JJLE9BQVYsQ0FBa0IsVUFBQWEsTUFBTSxFQUFJO0FBQ3hCLHdCQUFJcEMsSUFBSSxHQUFHVixhQUFhLENBQUMwQixHQUFkLENBQWtCb0IsTUFBbEIsQ0FBWDs7QUFDQSx3QkFBSSxDQUFDNEgsVUFBRCxJQUFlaEwsRUFBRSxDQUFDZ0IsSUFBRCxFQUFPLG9CQUFQLENBQWpCLElBQWlEQSxJQUFJLENBQUNnQyxhQUFMLENBQW1COUIsRUFBbkIsS0FBMEI2SixjQUFjLENBQUM3SixFQUE5RixFQUFrRztBQUM5RjhKLHNCQUFBQSxVQUFVLEdBQUdoSyxJQUFJLENBQUNHLGNBQUwsSUFBdUIsS0FBcEM7QUFDQSwwQkFBSTZKLFVBQUosRUFBZ0IxRixHQUFHLEdBQUcsQ0FBQ2xDLE1BQUQsQ0FBTixDQUFoQixLQUNLa0MsR0FBRyxDQUFDckUsSUFBSixDQUFTbUMsTUFBVDtBQUNSO0FBQ0osbUJBUEQ7O0FBUUEsc0JBQUlrQyxHQUFHLENBQUM1RCxNQUFKLElBQWMsQ0FBbEIsRUFBcUI7QUFDakJrSixvQkFBQUEsU0FBUyxDQUFDckksT0FBVixDQUFrQixVQUFBYSxNQUFNLEVBQUk7QUFDeEIsMEJBQUlwQyxJQUFJLEdBQUdWLGFBQWEsQ0FBQzBCLEdBQWQsQ0FBa0JvQixNQUFsQixDQUFYOztBQUNBLDBCQUFJLENBQUM0SCxVQUFELElBQWVoTCxFQUFFLENBQUNnQixJQUFELEVBQU8saUJBQVAsQ0FBakIsSUFBOENBLElBQUksQ0FBQ3lILE9BQUwsQ0FBYWhCLGdCQUEzRCxJQUErRXpHLElBQUksQ0FBQ3lILE9BQUwsQ0FBYUEsT0FBYixDQUFxQnZILEVBQXJCLEtBQTRCb0MsTUFBTSxDQUFDcEMsRUFBdEgsRUFBMEg7QUFDdEg4Six3QkFBQUEsVUFBVSxHQUFHaEssSUFBSSxDQUFDMkcsY0FBTCxJQUF1QixLQUFwQztBQUNBLDRCQUFJcUQsVUFBSixFQUFnQjFGLEdBQUcsR0FBRyxDQUFDbEMsTUFBRCxDQUFOLENBQWhCLEtBQ0trQyxHQUFHLENBQUNyRSxJQUFKLENBQVNtQyxNQUFUO0FBQ1I7QUFDSixxQkFQRDtBQVFIOztBQUNEMkgsa0JBQUFBLGNBQWMsR0FBR3pILE1BQWpCO0FBQ0g7O0FBQ0Qsb0JBQUlnQyxHQUFHLENBQUMvRCxPQUFKLENBQVlpQixLQUFaLENBQUosRUFDSXFJLFFBQVEsQ0FBQzFELGtCQUFrQixDQUFDbkYsR0FBbkIsQ0FBdUI4SSxNQUF2QixDQUFELENBQVIsR0FBMkMsQ0FBM0M7QUFDUCxlQTdCRDtBQThCQSxrQkFBSUcsTUFBTSxHQUFHLElBQWI7O0FBQ0EsbUJBQUssSUFBSWpHLEdBQUMsR0FBRzZGLFFBQVEsQ0FBQ25KLE1BQVQsR0FBa0IsQ0FBL0IsRUFBa0NzRCxHQUFDLElBQUksQ0FBdkMsRUFBMENBLEdBQUMsRUFBM0M7QUFDSWlHLGdCQUFBQSxNQUFNLElBQUlKLFFBQVEsQ0FBQzdGLEdBQUQsQ0FBUixHQUFjLEdBQWQsR0FBb0IsR0FBOUI7QUFESjs7QUFFQSxxQkFBT2lHLE1BQU0sS0FBSyxJQUFYLEdBQWtCLENBQWxCLEdBQXNCLElBQUlDLHFCQUFKLENBQWNELE1BQWQsRUFBc0JFLE9BQXRCLEVBQTdCO0FBQ0gsYUE1Sm9CO0FBNkpyQkMsWUFBQUEscUJBQXFCLEVBQUUsK0JBQUNOLE1BQUQsRUFBU04sT0FBVCxFQUFrQkMsT0FBbEIsRUFBOEI7QUFDakQ7QUFDQTtBQUNBLGtCQUFJbkYsR0FBRyxHQUFHLEVBQVY7QUFDQSxrQkFBSWhDLE1BQU0sR0FBR2hELGFBQWEsQ0FBQzBCLEdBQWQsQ0FBa0I4SSxNQUFsQixDQUFiO0FBQ0Esa0JBQUlFLFVBQVUsR0FBRyxLQUFqQjtBQUNBLGtCQUFJdEIsVUFBVSxHQUFHOUksZUFBZSxDQUFDRixjQUFoQixDQUErQmlDLE1BQS9CLENBQXNDL0IsZUFBZSxDQUFDSixRQUF0RCxDQUFqQjtBQUNBLGtCQUFJb0ssU0FBUyxHQUFHLEVBQWhCO0FBQ0FsQixjQUFBQSxVQUFVLENBQUNuSCxPQUFYLENBQW1CLFVBQUFhLE1BQU0sRUFBSTtBQUN6QixvQkFBSXBDLElBQUksR0FBR1YsYUFBYSxDQUFDMEIsR0FBZCxDQUFrQm9CLE1BQWxCLENBQVg7O0FBQ0Esb0JBQUlwQyxJQUFJLENBQUN1SCxnQkFBVCxFQUEyQjtBQUN2QixzQkFBSXJFLEdBQUcsR0FBR2xELElBQUksQ0FBQ3VILGdCQUFMLENBQXNCLENBQXRCLEVBQXlCN0UsS0FBbkM7QUFDQSxzQkFBSXhELElBQUksR0FBR2dFLEdBQUcsQ0FBQ29GLFNBQUosQ0FBYyxDQUFkLEVBQWlCcEYsR0FBRyxDQUFDeEMsTUFBSixHQUFhLEVBQTlCLENBQVg7O0FBQ0Esc0JBQUl4QixJQUFJLEtBQUtzSyxPQUFULElBQW9CQyxPQUFPLEtBQUtsRSxXQUFXLENBQUNqRyxhQUFhLENBQUMwQixHQUFkLENBQWtCb0IsTUFBbEIsQ0FBRCxDQUEzQyxJQUEwRXdILFNBQVMsQ0FBQ3JKLE9BQVYsQ0FBa0I2QixNQUFsQixJQUE0QixDQUExRyxFQUE2RztBQUN6R3dILG9CQUFBQSxTQUFTLENBQUMzSixJQUFWLENBQWVtQyxNQUFmO0FBQ0g7QUFDSjtBQUNKLGVBVEQ7O0FBVUEsa0JBQUksQ0FBQ0UsTUFBTSxDQUFDbUUsZ0JBQVosRUFBOEI7QUFDMUJtRCxnQkFBQUEsU0FBUyxDQUFDckksT0FBVixDQUFrQixVQUFBYSxNQUFNLEVBQUk7QUFDeEIsc0JBQUlwQyxJQUFJLEdBQUdWLGFBQWEsQ0FBQzBCLEdBQWQsQ0FBa0JvQixNQUFsQixDQUFYOztBQUNBLHNCQUFJLENBQUM0SCxVQUFELElBQWVoTCxFQUFFLENBQUNnQixJQUFELEVBQU8saUJBQVAsQ0FBakIsSUFBOENBLElBQUksQ0FBQ3lILE9BQUwsQ0FBYWhCLGdCQUEzRCxJQUErRXpHLElBQUksQ0FBQ3lILE9BQUwsQ0FBYUEsT0FBYixDQUFxQnZILEVBQXJCLEtBQTRCb0MsTUFBTSxDQUFDcEMsRUFBdEgsRUFBMEg7QUFDdEg4SixvQkFBQUEsVUFBVSxHQUFHaEssSUFBSSxDQUFDMkcsY0FBTCxJQUF1QixLQUFwQztBQUNBLHdCQUFJcUQsVUFBSixFQUFnQjFGLEdBQUcsR0FBRyxDQUFDbEMsTUFBRCxDQUFOLENBQWhCLEtBQ0trQyxHQUFHLENBQUNyRSxJQUFKLENBQVNtQyxNQUFUO0FBQ1I7QUFDSixpQkFQRDtBQVFIOztBQUNELGtCQUFJeEMsZUFBZSxDQUFDMkcsSUFBaEIsQ0FBcUJyRyxFQUFyQixLQUE0QjRKLE1BQTVCLElBQXNDeEYsR0FBRyxDQUFDNUQsTUFBSixHQUFhLENBQXZELEVBQTBEO0FBQ3RELHVCQUFPNEQsR0FBUDtBQUNILGVBRkQsTUFFTztBQUFBO0FBQ0gsc0JBQUloQyxNQUFNLENBQUNtRSxnQkFBWCxFQUNJbkUsTUFBTSxHQUFHaEQsYUFBYSxDQUFDMEIsR0FBZCxDQUFrQnNCLE1BQU0sQ0FBQ21GLE9BQVAsQ0FBZXZILEVBQWpDLENBQVQ7QUFDSixzQkFBSTZKLGNBQWMsR0FBR3pILE1BQXJCOztBQUNBLHlCQUFPLENBQUMwSCxVQUFELElBQWUxRixHQUFHLENBQUM1RCxNQUFKLElBQWMsQ0FBN0IsSUFBa0M0QixNQUFNLENBQUNtRixPQUF6QyxJQUFvRDdILGVBQWUsQ0FBQzJHLElBQWhCLENBQXFCckcsRUFBckIsS0FBNEJvQyxNQUFNLENBQUNwQyxFQUE5RixFQUFrRztBQUM5Rm9DLG9CQUFBQSxNQUFNLEdBQUdoRCxhQUFhLENBQUMwQixHQUFkLENBQWtCc0IsTUFBTSxDQUFDbUYsT0FBUCxDQUFldkgsRUFBakMsQ0FBVDtBQUNBMEosb0JBQUFBLFNBQVMsQ0FBQ3JJLE9BQVYsQ0FBa0IsVUFBQWEsTUFBTSxFQUFJO0FBQ3hCLDBCQUFJcEMsSUFBSSxHQUFHVixhQUFhLENBQUMwQixHQUFkLENBQWtCb0IsTUFBbEIsQ0FBWDs7QUFDQSwwQkFBSSxDQUFDNEgsVUFBRCxJQUFlaEwsRUFBRSxDQUFDZ0IsSUFBRCxFQUFPLG9CQUFQLENBQWpCLElBQWlEQSxJQUFJLENBQUNnQyxhQUFMLENBQW1COUIsRUFBbkIsS0FBMEI2SixjQUFjLENBQUM3SixFQUE5RixFQUFrRztBQUM5RjhKLHdCQUFBQSxVQUFVLEdBQUdoSyxJQUFJLENBQUNHLGNBQUwsSUFBdUIsS0FBcEM7QUFDQSw0QkFBSTZKLFVBQUosRUFBZ0IxRixHQUFHLEdBQUcsQ0FBQ2xDLE1BQUQsQ0FBTixDQUFoQixLQUNLa0MsR0FBRyxDQUFDckUsSUFBSixDQUFTbUMsTUFBVDtBQUNSO0FBQ0oscUJBUEQ7O0FBUUEsd0JBQUlrQyxHQUFHLENBQUM1RCxNQUFKLElBQWMsQ0FBbEIsRUFBcUI7QUFDakJrSixzQkFBQUEsU0FBUyxDQUFDckksT0FBVixDQUFrQixVQUFBYSxNQUFNLEVBQUk7QUFDeEIsNEJBQUlwQyxJQUFJLEdBQUdWLGFBQWEsQ0FBQzBCLEdBQWQsQ0FBa0JvQixNQUFsQixDQUFYOztBQUNBLDRCQUFJLENBQUM0SCxVQUFELElBQWVoTCxFQUFFLENBQUNnQixJQUFELEVBQU8saUJBQVAsQ0FBakIsSUFBOENBLElBQUksQ0FBQ3lILE9BQUwsQ0FBYWhCLGdCQUEzRCxJQUErRXpHLElBQUksQ0FBQ3lILE9BQUwsQ0FBYUEsT0FBYixDQUFxQnZILEVBQXJCLEtBQTRCb0MsTUFBTSxDQUFDcEMsRUFBdEgsRUFBMEg7QUFDdEg4SiwwQkFBQUEsVUFBVSxHQUFHaEssSUFBSSxDQUFDMkcsY0FBTCxJQUF1QixLQUFwQztBQUNBLDhCQUFJcUQsVUFBSixFQUFnQjFGLEdBQUcsR0FBRyxDQUFDbEMsTUFBRCxDQUFOLENBQWhCLEtBQ0trQyxHQUFHLENBQUNyRSxJQUFKLENBQVNtQyxNQUFUO0FBQ1I7QUFDSix1QkFQRDtBQVFIOztBQUNEMkgsb0JBQUFBLGNBQWMsR0FBR3pILE1BQWpCO0FBQ0g7O0FBQ0Q7QUFBQSx1QkFBT2dDO0FBQVA7QUExQkc7O0FBQUE7QUEyQk47QUFDSixhQXZOb0I7QUF3TnJCK0YsWUFBQUEsNkJBQTZCLEVBQUUsdUNBQUNDLE9BQUQsRUFBYTtBQUN4QyxrQkFBSUMsUUFBK0IsR0FBRyxJQUFJdkgsR0FBSixFQUF0QztBQUNBcEQsY0FBQUEsZUFBZSxDQUFDSixRQUFoQixDQUF5QitCLE9BQXpCLENBQWlDLFVBQUFhLE1BQU0sRUFBSTtBQUN2QyxvQkFBSXBDLElBQUksR0FBR1YsYUFBYSxDQUFDMEIsR0FBZCxDQUFrQm9CLE1BQWxCLENBQVg7O0FBQ0Esb0JBQUlwRCxFQUFFLENBQUNnQixJQUFELEVBQU8sZUFBUCxDQUFGLElBQTZCaEIsRUFBRSxDQUFDZ0IsSUFBRCxFQUFPLGtCQUFQLENBQS9CLElBQTZEcUgsZ0JBQWdCLENBQUM5RyxPQUFqQixDQUF5QjZCLE1BQXpCLEtBQW9DLENBQXJHLEVBQXdHO0FBQ3BHLHNCQUFJb0ksTUFBTSxHQUFHLEVBQWI7O0FBQ0Esc0JBQUl4SyxJQUFJLENBQUM0QyxhQUFMLElBQXNCNUMsSUFBSSxDQUFDNEMsYUFBTCxDQUFtQixDQUFuQixFQUFzQkUsSUFBNUMsSUFBb0Q5QyxJQUFJLENBQUM0QyxhQUFMLENBQW1CLENBQW5CLEVBQXNCRSxJQUF0QixDQUEyQnBDLE1BQTNCLEdBQW9DLENBQXhGLElBQTZGdUMsaUJBQWlCLENBQUNqRCxJQUFJLENBQUM0QyxhQUFMLENBQW1CLENBQW5CLEVBQXNCRSxJQUF2QixFQUE2QlYsTUFBN0IsRUFBcUMsSUFBckMsQ0FBakIsS0FBZ0VtQixTQUFqSyxFQUE0SztBQUN4Syx3QkFBSWtILFdBQVcsR0FBR0gsT0FBTyxHQUNuQnJILGlCQUFpQixDQUFDakQsSUFBSSxDQUFDNEMsYUFBTCxDQUFtQixDQUFuQixFQUFzQkUsSUFBdkIsRUFBNkJWLE1BQTdCLEVBQXFDLElBQXJDLENBQWpCLENBQTREcEIsR0FBNUQsQ0FBZ0UsT0FBaEUsQ0FEbUIsR0FFbkJpQyxpQkFBaUIsQ0FBQ2pELElBQUksQ0FBQzRDLGFBQUwsQ0FBbUIsQ0FBbkIsRUFBc0JFLElBQXZCLEVBQTZCVixNQUE3QixFQUFxQyxJQUFyQyxDQUFqQixDQUE0RHBCLEdBQTVELENBQWdFLFFBQWhFLENBRk47O0FBR0Esd0JBQUl5SixXQUFXLENBQUMvSixNQUFaLEdBQXFCLENBQXpCLEVBQTRCO0FBQ3hCOEosc0JBQUFBLE1BQU0sR0FBR0MsV0FBVyxDQUFDLENBQUQsQ0FBcEI7O0FBQ0EsMkJBQUssSUFBSXpHLEdBQUMsR0FBRyxDQUFiLEVBQWdCQSxHQUFDLEdBQUd5RyxXQUFXLENBQUMvSixNQUFoQyxFQUF3Q3NELEdBQUMsSUFBSSxDQUE3QztBQUFnRHdHLHdCQUFBQSxNQUFNLElBQUlDLFdBQVcsQ0FBQ3pHLEdBQUQsQ0FBckI7QUFBaEQ7QUFDSDtBQUNKOztBQUNELHNCQUFJd0IsSUFBSSxHQUFHRCxXQUFXLENBQUNqRyxhQUFhLENBQUMwQixHQUFkLENBQWtCb0IsTUFBbEIsQ0FBRCxDQUFYLEdBQXlDb0ksTUFBcEQ7O0FBQ0Esc0JBQUksQ0FBQ0QsUUFBUSxDQUFDeEYsR0FBVCxDQUFhUyxJQUFiLENBQUwsRUFBeUI7QUFDckIrRSxvQkFBQUEsUUFBUSxDQUFDbkssR0FBVCxDQUFhb0YsSUFBYixFQUFtQixFQUFuQjtBQUNIOztBQUNEK0Usa0JBQUFBLFFBQVEsQ0FBQ3ZKLEdBQVQsQ0FBYXdFLElBQWIsRUFBbUJ2RixJQUFuQixDQUF3Qm1DLE1BQXhCO0FBQ0g7QUFDSixlQW5CRDtBQW9CQSxxQkFBT21JLFFBQVA7QUFDSCxhQS9Pb0I7QUFnUHJCRyxZQUFBQSxpQkFBaUIsRUFBRSw2QkFBTTtBQUNyQixrQkFBSXBHLEdBQUcsR0FBRzZDLGNBQWMsQ0FBQ3hGLE1BQWYsQ0FBc0J1Rix1QkFBdEIsQ0FBVjtBQUNBRSxjQUFBQSxxQkFBcUIsQ0FBQzdGLE9BQXRCLENBQThCLFVBQUFDLEtBQUssRUFBSTtBQUNuQyxvQkFBSXhCLElBQUksR0FBR1YsYUFBYSxDQUFDMEIsR0FBZCxDQUFrQlEsS0FBbEIsQ0FBWDtBQUNBOEMsZ0JBQUFBLEdBQUcsQ0FBQ3JFLElBQUosQ0FBU2pCLEVBQUUsQ0FBQ2dCLElBQUQsRUFBTyxpQkFBUCxDQUFGLEdBQThCQSxJQUFJLENBQUN5SCxPQUFMLENBQWF2SCxFQUEzQyxHQUFnRHNCLEtBQXpEO0FBQ0gsZUFIRDtBQUlBLHFCQUFPOEMsR0FBUDtBQUNILGFBdlBvQjtBQXdQckJxRyxZQUFBQSxxQkFBcUIsRUFBRSwrQkFBQzVCLFNBQUQsRUFBWUwsVUFBWixFQUEyQjtBQUM5QyxrQkFBSXBFLEdBQUcsR0FBRyxDQUFDeUUsU0FBRCxDQUFWOztBQUNBLGtCQUFJLENBQUNuSixlQUFlLENBQUN1SCxjQUFoQixDQUErQnBDLEdBQS9CLENBQW1DZ0UsU0FBbkMsQ0FBTCxFQUFvRDtBQUNoREwsZ0JBQUFBLFVBQVUsQ0FBQ25ILE9BQVgsQ0FBbUIsVUFBQWEsTUFBTSxFQUFJO0FBQ3pCLHNCQUFJcEMsSUFBSSxHQUFHVixhQUFhLENBQUMwQixHQUFkLENBQWtCb0IsTUFBbEIsQ0FBWDs7QUFDQSx5QkFBT3BDLElBQUksQ0FBQ3lILE9BQVosRUFBcUI7QUFDakIsd0JBQUl6SCxJQUFJLENBQUN5SCxPQUFMLENBQWF2SCxFQUFiLEtBQW9CNkksU0FBeEIsRUFBbUM7QUFDL0J6RSxzQkFBQUEsR0FBRyxDQUFDckUsSUFBSixDQUFTbUMsTUFBVDtBQUNBO0FBQ0g7O0FBQ0RwQyxvQkFBQUEsSUFBSSxHQUFHQSxJQUFJLENBQUN5SCxPQUFaO0FBQ0g7QUFDSixpQkFURDtBQVVIOztBQUNELHFCQUFPbkQsR0FBUDtBQUNILGFBdlFvQjtBQXdRckJzRyxZQUFBQSx5QkFBeUIsRUFBRSxtQ0FBQzdCLFNBQUQsRUFBWUwsVUFBWixFQUEyQjtBQUNsRCxrQkFBSW1CLFFBQVEsR0FBRyxFQUFmO0FBQ0FuQixjQUFBQSxVQUFVLENBQUNuSCxPQUFYLENBQW1CLFVBQUFhLE1BQU0sRUFBSTtBQUN6QixvQkFBSXBDLElBQUksR0FBR1YsYUFBYSxDQUFDMEIsR0FBZCxDQUFrQm9CLE1BQWxCLENBQVg7O0FBQ0EsdUJBQU9wQyxJQUFJLENBQUN5SCxPQUFaLEVBQXFCO0FBQ2pCLHNCQUFJekgsSUFBSSxDQUFDeUgsT0FBTCxDQUFhdkgsRUFBYixLQUFvQjZJLFNBQXhCLEVBQW1DO0FBQy9CYyxvQkFBQUEsUUFBUSxDQUFDMUQsa0JBQWtCLENBQUNuRixHQUFuQixDQUF1Qm9CLE1BQXZCLENBQUQsQ0FBUixHQUEyQyxDQUEzQztBQUNBO0FBQ0g7O0FBQ0RwQyxrQkFBQUEsSUFBSSxHQUFHQSxJQUFJLENBQUN5SCxPQUFaO0FBQ0g7QUFDSixlQVREO0FBVUEsa0JBQUl3QyxNQUFNLEdBQUcsSUFBYjs7QUFDQSxtQkFBSyxJQUFJakcsSUFBQyxHQUFHNkYsUUFBUSxDQUFDbkosTUFBVCxHQUFrQixDQUEvQixFQUFrQ3NELElBQUMsSUFBSSxDQUF2QyxFQUEwQ0EsSUFBQyxFQUEzQztBQUNJaUcsZ0JBQUFBLE1BQU0sSUFBSUosUUFBUSxDQUFDN0YsSUFBRCxDQUFSLEdBQWMsR0FBZCxHQUFvQixHQUE5QjtBQURKOztBQUVBLHFCQUFPaUcsTUFBTSxLQUFLLElBQVgsR0FBa0IsQ0FBbEIsR0FBc0IsSUFBSUMscUJBQUosQ0FBY0QsTUFBZCxFQUFzQkUsT0FBdEIsRUFBN0I7QUFDSCxhQXhSb0I7QUF5UnJCVSxZQUFBQSxzQkFBc0IsRUFBRSxnQ0FBQzlCLFNBQUQsRUFBWUwsVUFBWixFQUEyQjtBQUMvQyxrQkFBSXBFLEdBQUcsR0FBRyxXQUFXNkIsa0JBQWtCLENBQUNuRixHQUFuQixDQUF1QjBILFVBQVUsQ0FBQyxDQUFELENBQWpDLENBQVgsR0FBbUQsR0FBN0Q7O0FBQ0EsbUJBQUssSUFBSTFFLElBQUMsR0FBRyxDQUFiLEVBQWdCQSxJQUFDLEdBQUcwRSxVQUFVLENBQUNoSSxNQUEvQixFQUF1Q3NELElBQUMsRUFBeEM7QUFDSU0sZ0JBQUFBLEdBQUcsSUFBSSxZQUFZNkIsa0JBQWtCLENBQUNuRixHQUFuQixDQUF1QjBILFVBQVUsQ0FBQzFFLElBQUQsQ0FBakMsQ0FBWixHQUFvRCxHQUEzRDtBQURKOztBQUVBLHFCQUFPTSxHQUFHLEdBQUcsR0FBYjtBQUNILGFBOVJvQjtBQStSckJ3RyxZQUFBQSx5QkFBeUIsRUFBRSxxQ0FBTTtBQUM3QixrQkFBSXhHLEdBQUcsR0FBRyxFQUFWO0FBQ0ExRSxjQUFBQSxlQUFlLENBQUNGLGNBQWhCLENBQStCNkIsT0FBL0IsQ0FBdUMsVUFBQWEsTUFBTSxFQUFJO0FBQzdDLG9CQUFJcEMsSUFBSSxHQUFHVixhQUFhLENBQUMwQixHQUFkLENBQWtCb0IsTUFBbEIsQ0FBWDs7QUFDQSxvQkFBSXBDLElBQUksQ0FBQ3lILE9BQUwsQ0FBYWhCLGdCQUFiLElBQWlDekcsSUFBSSxDQUFDeUgsT0FBTCxDQUFhQSxPQUFiLENBQXFCdkgsRUFBckIsS0FBNEJOLGVBQWUsQ0FBQzJHLElBQWhCLENBQXFCckcsRUFBdEYsRUFBMEY7QUFDdEYsc0JBQUlGLElBQUksQ0FBQzJHLGNBQUwsSUFBdUIsS0FBdkIsSUFBZ0NyQyxHQUFHLENBQUMvRCxPQUFKLENBQVlQLElBQUksQ0FBQ3lILE9BQUwsQ0FBYUEsT0FBYixDQUFxQnZILEVBQWpDLElBQXVDLENBQTNFLEVBQ0lvRSxHQUFHLENBQUNyRSxJQUFKLENBQVNELElBQUksQ0FBQ3lILE9BQUwsQ0FBYUEsT0FBYixDQUFxQnZILEVBQTlCO0FBQ1AsaUJBSEQsTUFHTyxJQUFJRixJQUFJLENBQUNnQyxhQUFULEVBQXdCO0FBQzNCLHNCQUFJK0ksVUFBVSxHQUFHL0ssSUFBSSxDQUFDZ0MsYUFBTCxDQUFtQjlCLEVBQXBDOztBQUNBLHNCQUFJRixJQUFJLENBQUNHLGNBQUwsSUFBdUIsS0FBdkIsSUFBZ0NtRSxHQUFHLENBQUMvRCxPQUFKLENBQVl3SyxVQUFaLElBQTBCLENBQTlELEVBQWlFO0FBQzdEekcsb0JBQUFBLEdBQUcsQ0FBQ3JFLElBQUosQ0FBUzhLLFVBQVQ7QUFDSDtBQUNKO0FBQ0osZUFYRDtBQVlBekwsY0FBQUEsYUFBYSxDQUFDaUMsT0FBZCxDQUFzQixVQUFBdkIsSUFBSSxFQUFJO0FBQzFCLG9CQUFJQSxJQUFJLENBQUN1SCxnQkFBTCxJQUF5QnZILElBQUksQ0FBQ3VILGdCQUFMLENBQXNCLENBQXRCLENBQTdCLEVBQXVEO0FBQ25ELHNCQUFJdkksRUFBRSxDQUFDZ0IsSUFBRCxFQUFPLG9CQUFQLENBQUYsSUFBa0NBLElBQUksQ0FBQ0csY0FBTCxJQUF1QixLQUE3RCxFQUFvRTtBQUNqRSx3QkFBR21HLHdCQUF3QixDQUFDdkIsR0FBekIsQ0FBNkIvRSxJQUFJLENBQUNFLEVBQWxDLENBQUgsRUFBMEM7QUFDeEMsMEJBQUlrSixNQUFNLEdBQUc5Qyx3QkFBd0IsQ0FBQ3RGLEdBQXpCLENBQTZCaEIsSUFBSSxDQUFDRSxFQUFsQyxDQUFiO0FBQ0FrSixzQkFBQUEsTUFBTSxDQUFDNUosUUFBUCxDQUFnQitCLE9BQWhCLENBQXdCLFVBQUE4SCxNQUFNLEVBQUk7QUFDL0IsNEJBQUlDLElBQUksR0FBR2hLLGFBQWEsQ0FBQzBCLEdBQWQsQ0FBa0JxSSxNQUFsQixDQUFYOztBQUNBLDRCQUFHQyxJQUFJLENBQUMvQixnQkFBTCxJQUF5QnZJLEVBQUUsQ0FBQ3NLLElBQUksQ0FBQy9CLGdCQUFMLENBQXNCLENBQXRCLENBQUQsRUFBMkIsK0JBQTNCLENBQTNCLElBQTBGK0IsSUFBSSxDQUFDN0IsT0FBTCxDQUFhdkgsRUFBYixLQUFvQkYsSUFBSSxDQUFDeUgsT0FBTCxDQUFhdkgsRUFBM0gsSUFBaUlOLGVBQWUsQ0FBQ0osUUFBaEIsQ0FBeUJlLE9BQXpCLENBQWlDUCxJQUFJLENBQUN5SCxPQUFMLENBQWF2SCxFQUE5QyxLQUFxRCxDQUF0TCxJQUEyTG9FLEdBQUcsQ0FBQy9ELE9BQUosQ0FBWVAsSUFBSSxDQUFDeUgsT0FBTCxDQUFhdkgsRUFBekIsSUFBK0IsQ0FBMU4sSUFBK05GLElBQUksQ0FBQ3lILE9BQUwsQ0FBYXZILEVBQWIsSUFBbUJOLGVBQWUsQ0FBQzJHLElBQWhCLENBQXFCckcsRUFBMVEsRUFBOFE7QUFDMVFvRSwwQkFBQUEsR0FBRyxDQUFDckUsSUFBSixDQUFTRCxJQUFJLENBQUN5SCxPQUFMLENBQWF2SCxFQUF0QjtBQUNIO0FBQ0gsdUJBTEQ7QUFNRDtBQUNIO0FBQ0o7QUFDSixlQWREO0FBZUFOLGNBQUFBLGVBQWUsQ0FBQ0osUUFBaEIsQ0FBeUIrQixPQUF6QixDQUFpQyxVQUFBYSxNQUFNLEVBQUk7QUFDdkMsb0JBQUlwQyxJQUFJLEdBQUdWLGFBQWEsQ0FBQzBCLEdBQWQsQ0FBa0JvQixNQUFsQixDQUFYOztBQUNBLG9CQUFJcEMsSUFBSSxDQUFDdUgsZ0JBQUwsSUFBeUJ2SSxFQUFFLENBQUNnQixJQUFJLENBQUN1SCxnQkFBTCxDQUFzQixDQUF0QixDQUFELEVBQTJCLCtCQUEzQixDQUEvQixFQUE0RjtBQUMxRixzQkFBR2pELEdBQUcsQ0FBQy9ELE9BQUosQ0FBWVAsSUFBSSxDQUFDeUgsT0FBTCxDQUFhdkgsRUFBekIsSUFBK0IsQ0FBL0IsSUFBb0NGLElBQUksQ0FBQ3lILE9BQUwsQ0FBYXZILEVBQWIsSUFBbUJOLGVBQWUsQ0FBQzJHLElBQWhCLENBQXFCckcsRUFBNUUsSUFBa0YsQ0FBQ2xCLEVBQUUsQ0FBQ00sYUFBYSxDQUFDMEIsR0FBZCxDQUFrQnBCLGVBQWUsQ0FBQzJHLElBQWhCLENBQXFCckcsRUFBdkMsQ0FBRCxFQUE2QyxvQkFBN0MsQ0FBeEYsRUFBNEo7QUFDeEpuQyxvQkFBQUEsS0FBSyxDQUFDLGFBQUQsQ0FBTDtBQUNBdUcsb0JBQUFBLEdBQUcsQ0FBQ3JFLElBQUosQ0FBU0QsSUFBSSxDQUFDeUgsT0FBTCxDQUFhdkgsRUFBdEI7QUFDSDtBQUNGO0FBQ0osZUFSRDtBQVNBLHFCQUFPb0UsR0FBUDtBQUNILGFBdFVvQjtBQXVVckIwRyxZQUFBQSxxQkFBcUIsRUFBRSxpQ0FBTTtBQUN6QixrQkFBSTFHLEdBQUcsR0FBRyxDQUFWO0FBQ0ExRSxjQUFBQSxlQUFlLENBQUNKLFFBQWhCLENBQXlCK0IsT0FBekIsQ0FBaUMsVUFBQWEsTUFBTSxFQUFJO0FBQ3ZDLG9CQUFJNkUsZUFBZSxDQUFDN0UsTUFBRCxDQUFuQixFQUE2QmtDLEdBQUc7QUFDbkMsZUFGRDtBQUdBLHFCQUFPQSxHQUFQO0FBQ0gsYUE3VW9CO0FBOFVyQjJHLFlBQUFBLGtCQUFrQixFQUFFLDRCQUFBOUMsU0FBUyxFQUFJO0FBQzdCLGtCQUFJN0QsR0FBRyxHQUFHLEVBQVY7QUFDQTFFLGNBQUFBLGVBQWUsQ0FBQ0osUUFBaEIsQ0FBeUIrQixPQUF6QixDQUFpQyxVQUFBYSxNQUFNLEVBQUk7QUFDdkMsb0JBQUlwQyxJQUFJLEdBQUdWLGFBQWEsQ0FBQzBCLEdBQWQsQ0FBa0JvQixNQUFsQixDQUFYO0FBQ0Esb0JBQUlwRCxFQUFFLENBQUNnQixJQUFELEVBQU8saUJBQVAsQ0FBRixJQUErQkEsSUFBSSxDQUFDeUgsT0FBTCxDQUFhdkgsRUFBYixLQUFvQmlJLFNBQW5ELElBQWdFbkksSUFBSSxDQUFDdUgsZ0JBQXJFLElBQ0d2SSxFQUFFLENBQUNnQixJQUFJLENBQUN1SCxnQkFBTCxDQUFzQixDQUF0QixDQUFELEVBQTJCLDZCQUEzQixDQURMLElBQ2tFakksYUFBYSxDQUFDMEIsR0FBZCxDQUFrQmhCLElBQUksQ0FBQ3lILE9BQUwsQ0FBYXZILEVBQS9CLEVBQW1DdUcsZ0JBRHpHLEVBRUluQyxHQUFHLENBQUNyRSxJQUFKLENBQVNtQyxNQUFUO0FBQ1AsZUFMRDtBQU1BLHFCQUFPa0MsR0FBUDtBQUNILGFBdlZvQjtBQXdWckI0RyxZQUFBQSxTQUFTLEVBQUUsbUJBQUE5SSxNQUFNLEVBQUk7QUFDakI7QUFDQSxrQkFBSXBDLElBQUksR0FBR1YsYUFBYSxDQUFDMEIsR0FBZCxDQUFrQm9CLE1BQWxCLENBQVg7QUFDQSxrQkFBSXBELEVBQUUsQ0FBQ2dCLElBQUQsRUFBTyxpQkFBUCxDQUFGLElBQStCQSxJQUFJLENBQUN5SCxPQUFwQyxJQUErQ25JLGFBQWEsQ0FBQzBCLEdBQWQsQ0FBa0JoQixJQUFJLENBQUN5SCxPQUFMLENBQWF2SCxFQUEvQixFQUFtQ3VHLGdCQUF0RixFQUNJLE9BQU9uSCxhQUFhLENBQUMwQixHQUFkLENBQWtCaEIsSUFBSSxDQUFDeUgsT0FBTCxDQUFhdkgsRUFBL0IsRUFBbUN1SCxPQUFuQyxDQUEyQ3ZILEVBQWxEO0FBQ0osa0JBQUlsQixFQUFFLENBQUNnQixJQUFELEVBQU8sb0JBQVAsQ0FBRixJQUFrQ0EsSUFBSSxDQUFDRyxjQUEzQyxFQUNJLE9BQU9ILElBQUksQ0FBQ2dDLGFBQUwsQ0FBbUI5QixFQUExQjtBQUNKLHFCQUFPRixJQUFJLENBQUN5SCxPQUFMLEdBQWV6SCxJQUFJLENBQUN5SCxPQUFMLENBQWF2SCxFQUE1QixHQUFpQ2tDLE1BQXhDO0FBQ0gsYUFoV29CO0FBaVdyQitJLFlBQUFBLGVBQWUsRUFBRSx5QkFBQS9JLE1BQU0sRUFBSTtBQUN2QjtBQUNBLGtCQUFJcEMsSUFBSSxHQUFHVixhQUFhLENBQUMwQixHQUFkLENBQWtCb0IsTUFBbEIsQ0FBWDtBQUNBLGtCQUFJcEQsRUFBRSxDQUFDZ0IsSUFBRCxFQUFPLGlCQUFQLENBQUYsSUFBK0JBLElBQUksQ0FBQ3lILE9BQXBDLElBQStDbkksYUFBYSxDQUFDMEIsR0FBZCxDQUFrQmhCLElBQUksQ0FBQ3lILE9BQUwsQ0FBYXZILEVBQS9CLEVBQW1DdUcsZ0JBQXRGLEVBQ0ksT0FBT3pHLElBQUksQ0FBQ3lILE9BQUwsQ0FBYXZILEVBQXBCO0FBQ0osa0JBQUlsQixFQUFFLENBQUNnQixJQUFELEVBQU8sb0JBQVAsQ0FBTixFQUFvQyxPQUFPQSxJQUFJLENBQUNFLEVBQVo7QUFDcEMscUJBQU9OLGVBQWUsQ0FBQzJHLElBQWhCLENBQXFCckcsRUFBNUI7QUFDSCxhQXhXb0I7QUF5V3JCa0wsWUFBQUEsY0FBYyxFQUFFLHdCQUFDckMsU0FBRCxFQUFZc0MsTUFBWixFQUF1QjtBQUNuQyxrQkFBSTdDLEtBQUssR0FBRzZDLE1BQU0sR0FBRyxFQUFILEdBQVEsQ0FBQ3RDLFNBQUQsQ0FBMUI7QUFDQW5KLGNBQUFBLGVBQWUsQ0FBQ0osUUFBaEIsQ0FDSzhILEdBREwsQ0FDUyxVQUFBbEYsTUFBTTtBQUFBLHVCQUFJOUMsYUFBYSxDQUFDMEIsR0FBZCxDQUFrQm9CLE1BQWxCLENBQUo7QUFBQSxlQURmLEVBRUtiLE9BRkwsQ0FFYSxVQUFBeEIsQ0FBQyxFQUFJO0FBQ1Ysb0JBQUlmLEVBQUUsQ0FBQ2UsQ0FBRCxFQUFJLGlCQUFKLENBQUYsSUFBNEJvSCxjQUFjLENBQUM1RyxPQUFmLENBQXVCUixDQUFDLENBQUNHLEVBQXpCLEtBQWdDLENBQTVELElBQWtFa0gscUJBQXFCLENBQUM3RyxPQUF0QixDQUE4QlIsQ0FBQyxDQUFDRyxFQUFoQyxLQUF1QyxDQUF2QyxJQUE0QyxDQUFDbEIsRUFBRSxDQUFDZSxDQUFELEVBQUksaUJBQUosQ0FBckgsRUFDSSxJQUFJLENBQUVzTCxNQUFNLElBQUl0QyxTQUFTLEtBQUtoSixDQUFDLENBQUNHLEVBQTFCLElBQWdDSCxDQUFDLENBQUMwSCxPQUFGLENBQVV2SCxFQUFWLEtBQWlCNkksU0FBbEQsSUFBZ0UsQ0FBQ3NDLE1BQWxFLEtBQTZFN0MsS0FBSyxDQUFDakksT0FBTixDQUFjUixDQUFDLENBQUNHLEVBQWhCLElBQXNCLENBQXZHLEVBQ0lzSSxLQUFLLENBQUN2SSxJQUFOLENBQVdGLENBQUMsQ0FBQ0csRUFBYjtBQUNYLGVBTkw7QUFPQSxxQkFBT3NJLEtBQVA7QUFDSCxhQW5Yb0I7QUFvWHJCOEMsWUFBQUEsdUJBQXVCLEVBQUUsaUNBQUN6SixPQUFELEVBQVVzRyxTQUFWLEVBQXdCO0FBQzdDLGtCQUFJUyxHQUFHLEdBQUd0SixhQUFhLENBQUMwQixHQUFkLENBQWtCYSxPQUFsQixDQUFWOztBQUNBLGtCQUFJN0MsRUFBRSxDQUFDNEosR0FBRCxFQUFNLGlCQUFOLENBQU4sRUFBZ0M7QUFDNUIsb0JBQUl0SixhQUFhLENBQUMwQixHQUFkLENBQWtCNEgsR0FBRyxDQUFDbkIsT0FBSixDQUFZdkgsRUFBOUIsRUFBa0N1RyxnQkFBdEMsRUFDSSxPQUFPbUMsR0FBRyxDQUFDbkIsT0FBSixDQUFZdkgsRUFBWixLQUFtQmlJLFNBQTFCO0FBQ0osb0JBQUluSixFQUFFLENBQUM0SixHQUFHLENBQUNyQixnQkFBSixDQUFxQixDQUFyQixDQUFELEVBQTBCLDZCQUExQixDQUFOLEVBQ0ksT0FBTyxJQUFQO0FBQ1AsZUFMRCxNQUtPLElBQUl2SSxFQUFFLENBQUM0SixHQUFELEVBQU0sb0JBQU4sQ0FBTixFQUFtQztBQUN0Qyx1QkFBTy9HLE9BQU8sS0FBS3NHLFNBQW5CO0FBQ0gsZUFGTSxNQUVBLElBQUluSixFQUFFLENBQUM0SixHQUFELEVBQU0sNkJBQU4sQ0FBRixJQUEwQzVKLEVBQUUsQ0FBQzRKLEdBQUcsQ0FBQ3JCLGdCQUFKLENBQXFCLENBQXJCLENBQUQsRUFBMEIsNkJBQTFCLENBQWhELEVBQ0gsT0FBTyxJQUFQOztBQUNKLHFCQUFPLEtBQVA7QUFDSCxhQWhZb0I7QUFpWXJCWixZQUFBQSxjQUFjLEVBQUUsd0JBQUE5RSxPQUFPLEVBQUk7QUFDdkI7QUFDQSxrQkFBSTdCLElBQUksR0FBR1YsYUFBYSxDQUFDMEIsR0FBZCxDQUFrQmEsT0FBbEIsQ0FBWDtBQUNBLGtCQUFJN0IsSUFBSSxDQUFDdUgsZ0JBQUwsSUFBeUJ2SSxFQUFFLENBQUNnQixJQUFJLENBQUN1SCxnQkFBTCxDQUFzQixDQUF0QixDQUFELEVBQTJCLDJCQUEzQixDQUEvQixFQUNJLE9BQU8sSUFBUDtBQUNKLGtCQUFJdkksRUFBRSxDQUFDZ0IsSUFBRCxFQUFPLGlCQUFQLENBQUYsSUFBK0JBLElBQUksQ0FBQ3lILE9BQXBDLElBQStDbkksYUFBYSxDQUFDMEIsR0FBZCxDQUFrQmhCLElBQUksQ0FBQ3lILE9BQUwsQ0FBYXZILEVBQS9CLEVBQW1DdUcsZ0JBQXRGLEVBQ0ksT0FBT3pHLElBQUksQ0FBQzJHLGNBQUwsSUFBdUIsS0FBOUI7QUFDSixrQkFBSTNILEVBQUUsQ0FBQ2dCLElBQUQsRUFBTyxvQkFBUCxDQUFOLEVBQ0ksT0FBT0EsSUFBSSxDQUFDRyxjQUFMLElBQXVCLEtBQTlCO0FBQ0oscUJBQU8sS0FBUDtBQUNILGFBM1lvQjtBQTRZckJvTCxZQUFBQSxvQkFBb0IsRUFBRSw4QkFBQUMsWUFBWSxFQUFJO0FBQ2xDLHFCQUFPbEYsd0JBQXdCLENBQUN0RixHQUF6QixDQUE2QndLLFlBQTdCLEVBQTJDN0ksVUFBbEQ7QUFDSCxhQTlZb0I7QUErWXJCOEksWUFBQUEsZUFBZSxFQUFFLHlCQUFBakssS0FBSyxFQUFJO0FBQ3RCLHFCQUFPNUIsZUFBZSxDQUFDRixjQUFoQixDQUErQmEsT0FBL0IsQ0FBdUNpQixLQUF2QyxLQUFpRCxDQUF4RDtBQUNILGFBalpvQjtBQWtackJrSyxZQUFBQSxVQUFVLEVBQUUsb0JBQUF0SixNQUFNLEVBQUk7QUFDbEIsa0JBQUlwQyxJQUFJLEdBQUdWLGFBQWEsQ0FBQzBCLEdBQWQsQ0FBa0JvQixNQUFsQixDQUFYO0FBQ0Esa0JBQUl5SCxRQUFRLEdBQUcsRUFBZjs7QUFDQSxrQkFBSTdKLElBQUksQ0FBQzJMLFFBQVQ7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFDSSx3Q0FBcUIzTCxJQUFJLENBQUMyTCxRQUExQjtBQUFBLHdCQUFTQSxRQUFUO0FBQ0k5QixvQkFBQUEsUUFBUSxDQUFDakssZUFBZSxDQUFDb0ksWUFBaEIsQ0FBNkJoSCxHQUE3QixDQUFpQzJLLFFBQVEsQ0FBQ3pMLEVBQTFDLENBQUQsQ0FBUixHQUEwRCxDQUExRDtBQURKO0FBREo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHFCQUdLMkosUUFBUSxDQUFDLENBQUQsQ0FBUixHQUFjLENBQWQ7O0FBQ0wsa0JBQUlJLE1BQU0sR0FBRyxJQUFiOztBQUNBLG1CQUFLLElBQUlqRyxJQUFDLEdBQUc2RixRQUFRLENBQUNuSixNQUFULEdBQWtCLENBQS9CLEVBQWtDc0QsSUFBQyxJQUFJLENBQXZDLEVBQTBDQSxJQUFDLEVBQTNDO0FBQ0lpRyxnQkFBQUEsTUFBTSxJQUFJSixRQUFRLENBQUM3RixJQUFELENBQVIsR0FBYyxHQUFkLEdBQW9CLEdBQTlCO0FBREo7O0FBRUEscUJBQU8sSUFBSWtHLHFCQUFKLENBQWNELE1BQWQsRUFBc0JFLE9BQXRCLEVBQVA7QUFDSCxhQTdab0I7QUE4WnJCeUIsWUFBQUEsV0FBVyxFQUFFLHFCQUFBeEosTUFBTSxFQUFJO0FBQ25CLGtCQUFJcEMsSUFBSSxHQUFHVixhQUFhLENBQUMwQixHQUFkLENBQWtCb0IsTUFBbEIsQ0FBWDtBQUNBLGtCQUFJeUgsUUFBUSxHQUFHLEVBQWY7QUFDQSxrQkFBSUksTUFBTSxHQUFHLElBQWI7O0FBQ0Esa0JBQUlqSyxJQUFJLENBQUNpQixRQUFUO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQ0ksd0NBQXFCakIsSUFBSSxDQUFDaUIsUUFBMUIsbUlBQW9DO0FBQUEsd0JBQTNCQSxRQUEyQjtBQUNoQzRJLG9CQUFBQSxRQUFRLENBQUNqSyxlQUFlLENBQUNvSSxZQUFoQixDQUE2QmhILEdBQTdCLENBQWlDQyxRQUFRLENBQUNmLEVBQTFDLENBQUQsQ0FBUixHQUEwRCxDQUExRDtBQUNIO0FBSEw7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHFCQUlLK0osTUFBTSxHQUFHLEdBQVQ7O0FBQ0wsbUJBQUssSUFBSWpHLElBQUMsR0FBRzZGLFFBQVEsQ0FBQ25KLE1BQVQsR0FBa0IsQ0FBL0IsRUFBa0NzRCxJQUFDLElBQUksQ0FBdkMsRUFBMENBLElBQUMsRUFBM0M7QUFDSWlHLGdCQUFBQSxNQUFNLElBQUlKLFFBQVEsQ0FBQzdGLElBQUQsQ0FBUixHQUFjLEdBQWQsR0FBb0IsR0FBOUI7QUFESjs7QUFFQSxxQkFBTyxJQUFJa0cscUJBQUosQ0FBY0QsTUFBZCxFQUFzQkUsT0FBdEIsRUFBUDtBQUNILGFBMWFvQjtBQTJhckIwQixZQUFBQSxxQkFBcUIsRUFBRSwrQkFBQUwsWUFBWSxFQUFJO0FBQ25DLGtCQUFJM0IsUUFBUSxHQUFHLEVBQWY7QUFDQXZLLGNBQUFBLGFBQWEsQ0FBQ2lDLE9BQWQsQ0FBc0IsVUFBQXZCLElBQUksRUFBSTtBQUMxQixvQkFBSUEsSUFBSSxDQUFDeUgsT0FBTCxJQUFnQnpILElBQUksQ0FBQ3lILE9BQUwsQ0FBYXZILEVBQWIsS0FBb0JzTCxZQUF4QyxFQUFzRDtBQUNsRCxzQkFBSXhNLEVBQUUsQ0FBQ2dCLElBQUQsRUFBTyxXQUFQLENBQUYsSUFBeUJoQixFQUFFLENBQUNnQixJQUFELEVBQU8saUJBQVAsQ0FBL0IsRUFDSTZKLFFBQVEsQ0FBQzFELGtCQUFrQixDQUFDbkYsR0FBbkIsQ0FBdUJoQixJQUFJLENBQUNFLEVBQTVCLENBQUQsQ0FBUixHQUE0QyxDQUE1QyxDQURKLEtBRUssSUFBSSxDQUFDWixhQUFhLENBQUMwQixHQUFkLENBQWtCd0ssWUFBbEIsRUFBZ0MvRSxnQkFBakMsSUFBcUR6RyxJQUFJLENBQUN1SCxnQkFBMUQsSUFBOEV2SCxJQUFJLENBQUN1SCxnQkFBTCxDQUFzQixDQUF0QixDQUE5RSxJQUNMdkksRUFBRSxDQUFDZ0IsSUFBSSxDQUFDdUgsZ0JBQUwsQ0FBc0IsQ0FBdEIsQ0FBRCxFQUEyQiw2QkFBM0IsQ0FERCxFQUVEc0MsUUFBUSxDQUFDMUQsa0JBQWtCLENBQUNuRixHQUFuQixDQUF1QmhCLElBQUksQ0FBQ0UsRUFBNUIsQ0FBRCxDQUFSLEdBQTRDLENBQTVDO0FBQ1A7QUFDSixlQVJEO0FBU0Esa0JBQUkrSixNQUFNLEdBQUdKLFFBQVEsQ0FBQ25KLE1BQVQsR0FBa0IsQ0FBbEIsR0FBc0IsSUFBdEIsR0FBNkIsQ0FBMUM7O0FBQ0EsbUJBQUssSUFBSXNELElBQUMsR0FBRzZGLFFBQVEsQ0FBQ25KLE1BQVQsR0FBa0IsQ0FBL0IsRUFBa0NzRCxJQUFDLElBQUksQ0FBdkMsRUFBMENBLElBQUMsRUFBM0M7QUFDSWlHLGdCQUFBQSxNQUFNLElBQUlKLFFBQVEsQ0FBQzdGLElBQUQsQ0FBUixHQUFjLEdBQWQsR0FBb0IsR0FBOUI7QUFESjs7QUFFQSxxQkFBTyxJQUFJa0cscUJBQUosQ0FBY0QsTUFBZCxFQUFzQkUsT0FBdEIsRUFBUDtBQUNILGFBMWJvQjtBQTJickIyQixZQUFBQSx5QkFBeUIsRUFBRSxtQ0FBQS9DLFNBQVMsRUFBSTtBQUNwQyxrQkFBSWdELFFBQVEsR0FBRyxDQUFDaEQsU0FBRCxDQUFmO0FBQ0Esa0JBQUljLFFBQVEsR0FBRyxFQUFmO0FBQ0FqSyxjQUFBQSxlQUFlLENBQUNKLFFBQWhCLENBQXlCK0IsT0FBekIsQ0FBaUMsVUFBQWEsTUFBTSxFQUFJO0FBQ3ZDLG9CQUFJcEMsSUFBSSxHQUFHVixhQUFhLENBQUMwQixHQUFkLENBQWtCb0IsTUFBbEIsQ0FBWDs7QUFDQSxvQkFBSXBELEVBQUUsQ0FBQ2dCLElBQUQsRUFBTyxpQkFBUCxDQUFGLElBQStCbUgsY0FBYyxDQUFDNUcsT0FBZixDQUF1QlAsSUFBSSxDQUFDRSxFQUE1QixLQUFtQyxDQUFsRSxJQUF3RWtILHFCQUFxQixDQUFDN0csT0FBdEIsQ0FBOEJQLElBQUksQ0FBQ0UsRUFBbkMsS0FBMEMsQ0FBMUMsSUFBK0MsQ0FBQ2xCLEVBQUUsQ0FBQ2dCLElBQUQsRUFBTyxpQkFBUCxDQUE5SCxFQUEwSjtBQUN0Six5QkFBT0EsSUFBSSxDQUFDeUgsT0FBWixFQUFxQjtBQUNqQix3QkFBSXpILElBQUksQ0FBQ3lILE9BQUwsQ0FBYXZILEVBQWIsS0FBb0I2SSxTQUF4QixFQUFtQztBQUMvQiwwQkFBSTdCLHVCQUF1QixDQUFDM0csT0FBeEIsQ0FBZ0M2QixNQUFoQyxLQUEyQyxDQUEzQyxJQUFnRCtFLGNBQWMsQ0FBQzVHLE9BQWYsQ0FBdUJQLElBQUksQ0FBQ0UsRUFBNUIsS0FBbUMsQ0FBbkYsSUFBd0ZrSCxxQkFBcUIsQ0FBQzdHLE9BQXRCLENBQThCUCxJQUFJLENBQUNFLEVBQW5DLEtBQTBDLENBQXRJLEVBQXlJO0FBQ3JJMkosd0JBQUFBLFFBQVEsQ0FBQzFELGtCQUFrQixDQUFDbkYsR0FBbkIsQ0FBdUJvQixNQUF2QixDQUFELENBQVIsR0FBMkMsQ0FBM0M7QUFDSCx1QkFGRCxNQUdLLElBQUkySixRQUFRLENBQUN4TCxPQUFULENBQWlCNkIsTUFBakIsSUFBMkIsQ0FBL0IsRUFBa0M7QUFDbkMySix3QkFBQUEsUUFBUSxDQUFDOUwsSUFBVCxDQUFjbUMsTUFBZDtBQUNIOztBQUNEO0FBQ0g7O0FBQ0RwQyxvQkFBQUEsSUFBSSxHQUFHQSxJQUFJLENBQUN5SCxPQUFaO0FBQ0g7QUFDSjtBQUNKLGVBaEJEO0FBaUJBLGtCQUFJd0MsTUFBTSxHQUFHLElBQWI7QUFDQSxrQkFBSTlELGtCQUFrQixDQUFDbkYsR0FBbkIsQ0FBdUIrSCxTQUF2QixDQUFKLEVBQ0ljLFFBQVEsQ0FBQzFELGtCQUFrQixDQUFDbkYsR0FBbkIsQ0FBdUIrSCxTQUF2QixDQUFELENBQVIsR0FBOEMsQ0FBOUM7QUFDSm5KLGNBQUFBLGVBQWUsQ0FBQ0osUUFBaEIsQ0FDSzhILEdBREwsQ0FDUyxVQUFBbEYsTUFBTTtBQUFBLHVCQUFJOUMsYUFBYSxDQUFDMEIsR0FBZCxDQUFrQm9CLE1BQWxCLENBQUo7QUFBQSxlQURmLEVBRUtiLE9BRkwsQ0FFYSxVQUFBdkIsSUFBSSxFQUFJO0FBQ2Isb0JBQUlBLElBQUksQ0FBQ3lILE9BQUwsSUFBZ0JzRSxRQUFRLENBQUN4TCxPQUFULENBQWlCUCxJQUFJLENBQUN5SCxPQUFMLENBQWF2SCxFQUE5QixLQUFxQyxDQUF6RCxFQUE0RDtBQUN4RDJKLGtCQUFBQSxRQUFRLENBQUMxRCxrQkFBa0IsQ0FBQ25GLEdBQW5CLENBQXVCaEIsSUFBSSxDQUFDRSxFQUE1QixDQUFELENBQVIsR0FBNEMsQ0FBNUM7QUFDRDtBQUNOLGVBTkw7QUFPQW1ILGNBQUFBLGdCQUFnQixDQUNYQyxHQURMLENBQ1MsVUFBQTlGLEtBQUs7QUFBQSx1QkFBSWxDLGFBQWEsQ0FBQzBCLEdBQWQsQ0FBa0JRLEtBQWxCLENBQUo7QUFBQSxlQURkLEVBRUtELE9BRkwsQ0FFYSxVQUFBcUgsR0FBRyxFQUFJO0FBQ1osb0JBQUlBLEdBQUcsQ0FBQzVHLGFBQUosSUFBcUIrSixRQUFRLENBQUN4TCxPQUFULENBQWlCcUksR0FBRyxDQUFDNUcsYUFBckIsS0FBdUMsQ0FBaEUsRUFBbUU7QUFDL0Q2SCxrQkFBQUEsUUFBUSxDQUFDMUQsa0JBQWtCLENBQUNuRixHQUFuQixDQUF1QjRILEdBQUcsQ0FBQzFJLEVBQTNCLENBQUQsQ0FBUixHQUEyQyxDQUEzQztBQUNEO0FBQ04sZUFOTDs7QUFPQSxtQkFBSyxJQUFJOEQsSUFBQyxHQUFHNkYsUUFBUSxDQUFDbkosTUFBVCxHQUFrQixDQUEvQixFQUFrQ3NELElBQUMsSUFBSSxDQUF2QyxFQUEwQ0EsSUFBQyxFQUEzQztBQUNJaUcsZ0JBQUFBLE1BQU0sSUFBSUosUUFBUSxDQUFDN0YsSUFBRCxDQUFSLEdBQWMsR0FBZCxHQUFvQixHQUE5QjtBQURKOztBQUVBLHFCQUFPaUcsTUFBTSxLQUFLLElBQVgsR0FBa0IsSUFBSUMscUJBQUosQ0FBYyxDQUFkLENBQWxCLEdBQXFDLElBQUlBLHFCQUFKLENBQWNELE1BQWQsRUFBc0JFLE9BQXRCLEVBQTVDO0FBQ0gsYUFuZW9CO0FBb2VyQjZCLFlBQUFBLHNCQUFzQixFQUFFLGdDQUFBUixZQUFZLEVBQUk7QUFDcEMsa0JBQUlTLFFBQVEsR0FBRzNNLGFBQWEsQ0FBQzBCLEdBQWQsQ0FBa0J3SyxZQUFsQixDQUFmO0FBQ0Esa0JBQUkzQixRQUFRLEdBQUcsRUFBZjtBQUNBLGtCQUFJSSxNQUFNLEdBQUcsSUFBYjs7QUFDQSxrQkFBSWpMLEVBQUUsQ0FBQ2lOLFFBQUQsRUFBVyxvQkFBWCxDQUFOLEVBQXdDO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQ3BDLHlDQUFxQkEsUUFBUSxDQUFDaEwsUUFBOUI7QUFBQSx3QkFBU0EsUUFBVDtBQUNJNEksb0JBQUFBLFFBQVEsQ0FBQ2pLLGVBQWUsQ0FBQ29JLFlBQWhCLENBQTZCaEgsR0FBN0IsQ0FBaUNDLFFBQVEsQ0FBQ2YsRUFBMUMsQ0FBRCxDQUFSLEdBQTBELENBQTFEO0FBREo7QUFEb0M7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUd2QyxlQUhELE1BR087QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFDSCx5Q0FBaUIrTCxRQUFRLENBQUNwTSxZQUFULENBQXNCQyxNQUF0QixDQUNiLFVBQUFDLENBQUM7QUFBQSwyQkFBSWYsRUFBRSxDQUFDZSxDQUFELEVBQUksZUFBSixDQUFGLElBQTBCZixFQUFFLENBQUNlLENBQUQsRUFBSSxpQkFBSixDQUFoQztBQUFBLG1CQURZLENBQWpCLHdJQUVHO0FBQUEsd0JBRk1DLElBRU47QUFDQyx3QkFBSUEsSUFBSSxDQUFDeUgsT0FBTCxDQUFhdkgsRUFBYixLQUFvQnNMLFlBQXhCLEVBQ0ksSUFBSSxDQUFDbE0sYUFBYSxDQUFDMEIsR0FBZCxDQUFrQmhCLElBQUksQ0FBQ3lILE9BQUwsQ0FBYXZILEVBQS9CLEVBQW1DdUcsZ0JBQXBDLElBQ0F6RyxJQUFJLENBQUN1SCxnQkFETCxJQUN5QnZILElBQUksQ0FBQ3VILGdCQUFMLENBQXNCLENBQXRCLENBRHpCLElBRUF2SSxFQUFFLENBQUNnQixJQUFJLENBQUN1SCxnQkFBTCxDQUFzQixDQUF0QixDQUFELEVBQTJCLDZCQUEzQixDQUZOLEVBR0lzQyxRQUFRLENBQUMsQ0FBRCxDQUFSLEdBQWMsQ0FBZCxDQUhKLEtBSUssSUFBSTdKLElBQUksQ0FBQ2lCLFFBQVQ7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFDRCwrQ0FBcUJqQixJQUFJLENBQUNpQixRQUExQjtBQUFBLDhCQUFTQSxTQUFUO0FBQ0k0SSwwQkFBQUEsUUFBUSxDQUFDakssZUFBZSxDQUFDb0ksWUFBaEIsQ0FBNkJoSCxHQUE3QixDQUFpQ0MsU0FBUSxDQUFDZixFQUExQyxDQUFELENBQVIsR0FBMEQsQ0FBMUQ7QUFESjtBQURDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdaO0FBWkU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWFOOztBQUNELG1CQUFLLElBQUk4RCxJQUFDLEdBQUc2RixRQUFRLENBQUNuSixNQUFULEdBQWtCLENBQS9CLEVBQWtDc0QsSUFBQyxJQUFJLENBQXZDLEVBQTBDQSxJQUFDLEVBQTNDO0FBQ0lpRyxnQkFBQUEsTUFBTSxJQUFJSixRQUFRLENBQUM3RixJQUFELENBQVIsR0FBYyxHQUFkLEdBQW9CLEdBQTlCO0FBREo7O0FBRUEscUJBQU8sSUFBSWtHLHFCQUFKLENBQWNELE1BQWQsRUFBc0JFLE9BQXRCLEVBQVA7QUFDSCxhQTVmb0I7QUE2ZnJCK0IsWUFBQUEsbUJBQW1CLEVBQUUsNkJBQUFuRCxTQUFTLEVBQUk7QUFDOUIsa0JBQUljLFFBQVEsR0FBRyxFQUFmO0FBQ0Esa0JBQUlJLE1BQU0sR0FBRyxJQUFiO0FBQ0Esa0JBQUlqSyxJQUFJLEdBQUdWLGFBQWEsQ0FBQzBCLEdBQWQsQ0FBa0IrSCxTQUFsQixDQUFYOztBQUNBLHFCQUFPL0ksSUFBSSxDQUFDeUgsT0FBWixFQUFxQjtBQUNqQm9DLGdCQUFBQSxRQUFRLENBQUNqSyxlQUFlLENBQUNnSSxZQUFoQixDQUE2QjVHLEdBQTdCLENBQWlDaEIsSUFBSSxDQUFDRSxFQUF0QyxDQUFELENBQVIsR0FBc0QsQ0FBdEQ7QUFDQUYsZ0JBQUFBLElBQUksR0FBR0EsSUFBSSxDQUFDeUgsT0FBWjtBQUNIOztBQUNELG1CQUFLLElBQUl6RCxJQUFDLEdBQUc2RixRQUFRLENBQUNuSixNQUFULEdBQWtCLENBQS9CLEVBQWtDc0QsSUFBQyxJQUFJLENBQXZDLEVBQTBDQSxJQUFDLEVBQTNDO0FBQ0lpRyxnQkFBQUEsTUFBTSxJQUFJSixRQUFRLENBQUM3RixJQUFELENBQVIsR0FBYyxHQUFkLEdBQW9CLEdBQTlCO0FBREo7O0FBRUEscUJBQU8sSUFBSWtHLHFCQUFKLENBQWNELE1BQWQsRUFBc0JFLE9BQXRCLEVBQVA7QUFDSCxhQXhnQm9CO0FBeWdCckJnQyxZQUFBQSxpQkFBaUIsRUFBRSwyQkFBQVgsWUFBWSxFQUFJO0FBQy9CLGtCQUFJM0IsUUFBUSxHQUFHLEVBQWY7QUFDQSxrQkFBSUksTUFBTSxHQUFHLElBQWI7QUFDQSxrQkFBSW1DLFNBQVMsR0FBRzlGLHdCQUF3QixDQUFDdEYsR0FBekIsQ0FBNkJ3SyxZQUE3QixDQUFoQjtBQUNBLGtCQUFJL0wsUUFBUSxHQUFHLEVBQWY7QUFDQTJNLGNBQUFBLFNBQVMsQ0FBQzVNLFFBQVYsQ0FBbUIrQixPQUFuQixDQUEyQixVQUFBYSxNQUFNLEVBQUk7QUFDakMsb0JBQUlwQyxJQUFJLEdBQUdWLGFBQWEsQ0FBQzBCLEdBQWQsQ0FBa0JvQixNQUFsQixDQUFYOztBQUNBLG9CQUFJcEMsSUFBSSxDQUFDeUgsT0FBTCxJQUFnQnpILElBQUksQ0FBQ3lILE9BQUwsQ0FBYXZILEVBQWIsS0FBb0JzTCxZQUFwQyxJQUFvRHhMLElBQUksQ0FBQzJMLFFBQTdELEVBQXVFO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQ25FLDJDQUFxQjNMLElBQUksQ0FBQzJMLFFBQTFCLHdJQUFvQztBQUFBLDBCQUEzQkEsUUFBMkI7QUFDaENsTSxzQkFBQUEsUUFBUSxDQUFDUSxJQUFULENBQWMwTCxRQUFRLENBQUN6TCxFQUF2QjtBQUNIO0FBSGtFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFJdEU7QUFDSixlQVBEO0FBUUFULGNBQUFBLFFBQVEsQ0FBQzhCLE9BQVQsQ0FBaUIsVUFBQXdHLE1BQU0sRUFBSTtBQUN2QjhCLGdCQUFBQSxRQUFRLENBQUNqSyxlQUFlLENBQUNvSSxZQUFoQixDQUE2QmhILEdBQTdCLENBQWlDK0csTUFBakMsQ0FBRCxDQUFSLEdBQXFELENBQXJEO0FBQ0gsZUFGRDs7QUFHQSxtQkFBSyxJQUFJL0QsSUFBQyxHQUFHNkYsUUFBUSxDQUFDbkosTUFBVCxHQUFrQixDQUEvQixFQUFrQ3NELElBQUMsSUFBSSxDQUF2QyxFQUEwQ0EsSUFBQyxFQUEzQztBQUNJaUcsZ0JBQUFBLE1BQU0sSUFBSUosUUFBUSxDQUFDN0YsSUFBRCxDQUFSLEdBQWMsR0FBZCxHQUFvQixHQUE5QjtBQURKOztBQUVBLHFCQUFPLElBQUlrRyxxQkFBSixDQUFjRCxNQUFkLEVBQXNCRSxPQUF0QixFQUFQO0FBQ0gsYUE1aEJvQjtBQTZoQnJCa0MsWUFBQUEscUJBQXFCLEVBQUUsK0JBQUF0RCxTQUFTLEVBQUk7QUFDaEMsa0JBQUljLFFBQVEsR0FBRyxFQUFmO0FBQ0Esa0JBQUlJLE1BQU0sR0FBRyxJQUFiO0FBQ0Esa0JBQUk4QixRQUFRLEdBQUcsQ0FBQ2hELFNBQUQsQ0FBZjtBQUNBbkosY0FBQUEsZUFBZSxDQUFDSixRQUFoQixDQUF5QitCLE9BQXpCLENBQWlDLFVBQUFhLE1BQU0sRUFBSTtBQUN2QyxvQkFBSXBDLElBQUksR0FBR1YsYUFBYSxDQUFDMEIsR0FBZCxDQUFrQm9CLE1BQWxCLENBQVg7O0FBQ0Esb0JBQUlwRCxFQUFFLENBQUNnQixJQUFELEVBQU8saUJBQVAsQ0FBRixJQUErQmtILHVCQUF1QixDQUFDM0csT0FBeEIsQ0FBZ0M2QixNQUFoQyxJQUEwQyxDQUE3RSxFQUFnRjtBQUM1RSx5QkFBT3BDLElBQUksQ0FBQ3lILE9BQVosRUFBcUI7QUFDakIsd0JBQUl6SCxJQUFJLENBQUN5SCxPQUFMLENBQWF2SCxFQUFiLEtBQW9CNkksU0FBeEIsRUFBbUM7QUFDL0IsMEJBQUlnRCxRQUFRLENBQUN4TCxPQUFULENBQWlCNkIsTUFBakIsSUFBMkIsQ0FBL0IsRUFDSTJKLFFBQVEsQ0FBQzlMLElBQVQsQ0FBY21DLE1BQWQ7QUFDSjtBQUNIOztBQUNEcEMsb0JBQUFBLElBQUksR0FBR0EsSUFBSSxDQUFDeUgsT0FBWjtBQUNIO0FBQ0o7QUFDSixlQVpEO0FBYUFzRSxjQUFBQSxRQUFRLENBQUN4SyxPQUFULENBQWlCLFVBQUFpSyxZQUFZLEVBQUk7QUFDN0Isb0JBQUlZLFNBQVMsR0FBRzlGLHdCQUF3QixDQUFDdEYsR0FBekIsQ0FBNkJ3SyxZQUE3QixDQUFoQjtBQUNBWSxnQkFBQUEsU0FBUyxDQUFDM00sUUFBVixDQUFtQjhCLE9BQW5CLENBQTJCLFVBQUF3RyxNQUFNLEVBQUk7QUFDakM4QixrQkFBQUEsUUFBUSxDQUFDakssZUFBZSxDQUFDb0ksWUFBaEIsQ0FBNkJoSCxHQUE3QixDQUFpQytHLE1BQWpDLENBQUQsQ0FBUixHQUFxRCxDQUFyRDtBQUNILGlCQUZEO0FBR0gsZUFMRDs7QUFNQSxtQkFBSyxJQUFJL0QsSUFBQyxHQUFHNkYsUUFBUSxDQUFDbkosTUFBVCxHQUFrQixDQUEvQixFQUFrQ3NELElBQUMsSUFBSSxDQUF2QyxFQUEwQ0EsSUFBQyxFQUEzQztBQUNJaUcsZ0JBQUFBLE1BQU0sSUFBSUosUUFBUSxDQUFDN0YsSUFBRCxDQUFSLEdBQWMsR0FBZCxHQUFvQixHQUE5QjtBQURKOztBQUVBLHFCQUFPLElBQUlrRyxxQkFBSixDQUFjRCxNQUFkLEVBQXNCRSxPQUF0QixFQUFQO0FBQ0gsYUF2akJvQjtBQXdqQnJCbUMsWUFBQUEsYUFBYSxFQUFFLHVCQUFBQyxVQUFVLEVBQUk7QUFDekIsa0JBQUkxQyxRQUFRLEdBQUcsRUFBZjtBQUNBQSxjQUFBQSxRQUFRLENBQUNqSyxlQUFlLENBQUNvSSxZQUFoQixDQUE2QmhILEdBQTdCLENBQWlDdUwsVUFBakMsQ0FBRCxDQUFSLEdBQXlELENBQXpEO0FBQ0Esa0JBQUl0QyxNQUFNLEdBQUcsSUFBYjs7QUFDQSxtQkFBSyxJQUFJakcsSUFBQyxHQUFHNkYsUUFBUSxDQUFDbkosTUFBVCxHQUFrQixDQUEvQixFQUFrQ3NELElBQUMsSUFBSSxDQUF2QyxFQUEwQ0EsSUFBQyxFQUEzQztBQUNJaUcsZ0JBQUFBLE1BQU0sSUFBSUosUUFBUSxDQUFDN0YsSUFBRCxDQUFSLEdBQWMsR0FBZCxHQUFvQixHQUE5QjtBQURKOztBQUVBLHFCQUFPLElBQUlrRyxxQkFBSixDQUFjRCxNQUFkLEVBQXNCRSxPQUF0QixFQUFQO0FBQ0gsYUEvakJvQjtBQWdrQnJCcUMsWUFBQUEsYUFBYSxFQUFFLHVCQUFBQyxVQUFVLEVBQUk7QUFDekIsa0JBQUk1QyxRQUFRLEdBQUcsRUFBZjtBQUNBQSxjQUFBQSxRQUFRLENBQUMxRCxrQkFBa0IsQ0FBQ25GLEdBQW5CLENBQXVCeUwsVUFBdkIsQ0FBRCxDQUFSLEdBQStDLENBQS9DO0FBQ0Esa0JBQUl4QyxNQUFNLEdBQUcsSUFBYjs7QUFDQSxtQkFBSyxJQUFJakcsSUFBQyxHQUFHNkYsUUFBUSxDQUFDbkosTUFBVCxHQUFrQixDQUEvQixFQUFrQ3NELElBQUMsSUFBSSxDQUF2QyxFQUEwQ0EsSUFBQyxFQUEzQztBQUNJaUcsZ0JBQUFBLE1BQU0sSUFBSUosUUFBUSxDQUFDN0YsSUFBRCxDQUFSLEdBQWMsR0FBZCxHQUFvQixHQUE5QjtBQURKOztBQUVBLHFCQUFPLElBQUlrRyxxQkFBSixDQUFjRCxNQUFkLEVBQXNCRSxPQUF0QixFQUFQO0FBQ0gsYUF2a0JvQjtBQXdrQnJCdUMsWUFBQUEsYUFBYSxFQUFFLHVCQUFBdEssTUFBTSxFQUFJO0FBQ3JCLHFCQUFPK0Qsa0JBQWtCLENBQUNuRixHQUFuQixDQUF1Qm9CLE1BQXZCLENBQVA7QUFDSCxhQTFrQm9CO0FBMmtCckJ1SyxZQUFBQSxzQkFBc0IsRUFBRSxnQ0FBQTlLLE9BQU8sRUFBSTtBQUMvQixrQkFBSUMsS0FBSyxHQUFHeEMsYUFBYSxDQUFDMEIsR0FBZCxDQUFrQmEsT0FBbEIsQ0FBWjs7QUFDQSxrQkFBSUMsS0FBSyxDQUFDNkosUUFBVixFQUFvQjtBQUNoQixvQkFBSTNMLElBQUksR0FBRzhCLEtBQUssQ0FBQzZKLFFBQU4sQ0FBZSxDQUFmLEVBQWtCaUIsU0FBN0I7QUFDQSx1QkFBTzVOLEVBQUUsQ0FBQ2dCLElBQUQsRUFBTyx3QkFBUCxDQUFUO0FBQ0g7O0FBQ0QscUJBQU8sS0FBUDtBQUNILGFBbGxCb0I7QUFtbEJyQjZNLFlBQUFBLHlCQUF5QixFQUFFLG1DQUFBekssTUFBTSxFQUFJO0FBQ2pDLGtCQUFJTixLQUFLLEdBQUd4QyxhQUFhLENBQUMwQixHQUFkLENBQWtCb0IsTUFBbEIsQ0FBWjtBQUNBLGtCQUFJa0MsR0FBRyxHQUFHLEVBQVY7O0FBQ0Esa0JBQUl4QyxLQUFLLENBQUM2SixRQUFWLEVBQW9CO0FBQ2hCLG9CQUFJM0wsSUFBSSxHQUFHOEIsS0FBSyxDQUFDNkosUUFBTixDQUFlLENBQWYsRUFBa0JpQixTQUE3Qjs7QUFDQSxvQkFBSTVOLEVBQUUsQ0FBQ2dCLElBQUQsRUFBTyx3QkFBUCxDQUFOLEVBQXdDO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQ3BDLDJDQUFxQkEsSUFBSSxDQUFDaUIsUUFBMUIsd0lBQW9DO0FBQUEsMEJBQTNCQSxRQUEyQjtBQUNoQywwQkFBSUEsUUFBUSxDQUFDVCxTQUFULENBQW1CTixFQUFuQixLQUEwQmtDLE1BQTlCLEVBQ0lrQyxHQUFHLENBQUNyRSxJQUFKLENBQVNnQixRQUFRLENBQUNULFNBQVQsQ0FBbUJOLEVBQTVCO0FBQ1A7QUFKbUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUt2QztBQUNKOztBQUNELHFCQUFPb0UsR0FBUDtBQUNILGFBaG1Cb0I7QUFpbUJyQndJLFlBQUFBLHlCQUF5QixFQUFFLG1DQUFBMUssTUFBTSxFQUFJO0FBQ2pDLGtCQUFJTixLQUFLLEdBQUd4QyxhQUFhLENBQUMwQixHQUFkLENBQWtCb0IsTUFBbEIsQ0FBWjtBQUNBLGtCQUFJeUgsUUFBUSxHQUFHLEVBQWY7O0FBQ0Esa0JBQUkvSCxLQUFLLENBQUM2SixRQUFWLEVBQW9CO0FBQ2hCLG9CQUFJM0wsSUFBSSxHQUFHOEIsS0FBSyxDQUFDNkosUUFBTixDQUFlLENBQWYsRUFBa0JpQixTQUE3Qjs7QUFDQSxvQkFBSTVOLEVBQUUsQ0FBQ2dCLElBQUQsRUFBTyx3QkFBUCxDQUFOLEVBQXdDO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQ3BDLDJDQUFxQkEsSUFBSSxDQUFDaUIsUUFBMUIsd0lBQW9DO0FBQUEsMEJBQTNCQSxRQUEyQjtBQUNoQzRJLHNCQUFBQSxRQUFRLENBQUNqSyxlQUFlLENBQUNnSSxZQUFoQixDQUE2QjVHLEdBQTdCLENBQWlDQyxRQUFRLENBQUNULFNBQVQsQ0FBbUJOLEVBQXBELENBQUQsQ0FBUixHQUFvRSxDQUFwRTtBQUNIO0FBSG1DO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFJdkM7QUFDSjs7QUFDRCxrQkFBSStKLE1BQU0sR0FBRyxHQUFiOztBQUNBLG1CQUFLLElBQUlqRyxJQUFDLEdBQUc2RixRQUFRLENBQUNuSixNQUFULEdBQWtCLENBQS9CLEVBQWtDc0QsSUFBQyxJQUFJLENBQXZDLEVBQTBDQSxJQUFDLEVBQTNDO0FBQ0lpRyxnQkFBQUEsTUFBTSxJQUFJSixRQUFRLENBQUM3RixJQUFELENBQVIsR0FBYyxHQUFkLEdBQW9CLEdBQTlCO0FBREo7O0FBRUEscUJBQU8sSUFBSWtHLHFCQUFKLENBQWNELE1BQWQsRUFBc0JFLE9BQXRCLEVBQVA7QUFDSCxhQWhuQm9CO0FBaW5CckI0QyxZQUFBQSxxQkFBcUIsRUFBRSwrQkFBQWxMLE9BQU8sRUFBSTtBQUM5QixrQkFBSUMsS0FBSyxHQUFHeEMsYUFBYSxDQUFDMEIsR0FBZCxDQUFrQmEsT0FBbEIsQ0FBWjtBQUNBLGtCQUFJN0IsSUFBSSxHQUFHOEIsS0FBSyxDQUFDNkosUUFBTixDQUFlLENBQWYsRUFBa0JpQixTQUE3QjtBQUNBLGtCQUFJL0MsUUFBUSxHQUFHLEVBQWY7QUFDQSxrQkFBSUksTUFBTSxHQUFHLElBQWI7O0FBQ0Esa0JBQUlqSyxJQUFJLENBQUNpQixRQUFUO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQ0kseUNBQXFCakIsSUFBSSxDQUFDaUIsUUFBMUIsd0lBQW9DO0FBQUEsd0JBQTNCQSxRQUEyQjtBQUNoQzRJLG9CQUFBQSxRQUFRLENBQUNqSyxlQUFlLENBQUNvSSxZQUFoQixDQUE2QmhILEdBQTdCLENBQWlDQyxRQUFRLENBQUNmLEVBQTFDLENBQUQsQ0FBUixHQUEwRCxDQUExRDtBQUNIO0FBSEw7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHFCQUlLK0osTUFBTSxHQUFHLEdBQVQ7O0FBQ0wsbUJBQUssSUFBSWpHLElBQUMsR0FBRzZGLFFBQVEsQ0FBQ25KLE1BQVQsR0FBa0IsQ0FBL0IsRUFBa0NzRCxJQUFDLElBQUksQ0FBdkMsRUFBMENBLElBQUMsRUFBM0M7QUFDSWlHLGdCQUFBQSxNQUFNLElBQUlKLFFBQVEsQ0FBQzdGLElBQUQsQ0FBUixHQUFjLEdBQWQsR0FBb0IsR0FBOUI7QUFESjs7QUFFQSxxQkFBTyxJQUFJa0cscUJBQUosQ0FBY0QsTUFBZCxFQUFzQkUsT0FBdEIsRUFBUDtBQUNILGFBOW5Cb0I7QUErbkJyQjZDLFlBQUFBLGtCQUFrQixFQUFFLDhCQUFNO0FBQ3RCLGtCQUFJcE4sZUFBZSxDQUFDaUQsZ0JBQWhCLENBQWlDbkMsTUFBakMsR0FBMEMsQ0FBOUMsRUFDSSxPQUFPZCxlQUFlLENBQUNpRCxnQkFBdkIsQ0FESixLQUVLLE9BQU8sRUFBUDtBQUNSLGFBbm9Cb0I7QUFvb0JyQm9LLFlBQUFBLGlCQUFpQixFQUFFLDJCQUFBN0ssTUFBTSxFQUFJO0FBQ3pCLGtCQUFJeEMsZUFBZSxDQUFDcUYsYUFBaEIsQ0FBOEJGLEdBQTlCLENBQWtDM0MsTUFBbEMsQ0FBSixFQUNJLE9BQU94QyxlQUFlLENBQUNrRixVQUFoQixDQUEyQjlELEdBQTNCLENBQ0hwQixlQUFlLENBQUNxRixhQUFoQixDQUE4QmpFLEdBQTlCLENBQWtDb0IsTUFBbEMsQ0FERyxFQUVMZ0QsWUFGRjtBQUdKLHFCQUFPLEVBQVA7QUFDSCxhQTFvQm9CO0FBMm9CckI4SCxZQUFBQSxjQUFjLEVBQUUsd0JBQUE5SyxNQUFNLEVBQUk7QUFDdEIsa0JBQUlwQyxJQUFJLEdBQUdWLGFBQWEsQ0FBQzBCLEdBQWQsQ0FBa0JvQixNQUFsQixDQUFYOztBQUNBLGtCQUFJcEMsSUFBSSxDQUFDNEMsYUFBTCxJQUFzQjVDLElBQUksQ0FBQzRDLGFBQUwsQ0FBbUIsQ0FBbkIsRUFBc0JFLElBQTVDLElBQW9EOUMsSUFBSSxDQUFDNEMsYUFBTCxDQUFtQixDQUFuQixFQUFzQkUsSUFBdEIsQ0FBMkJwQyxNQUEzQixHQUFvQyxDQUE1RixFQUErRjtBQUMzRixvQkFBSXlNLE9BQU8sR0FBR2xLLGlCQUFpQixDQUFDakQsSUFBSSxDQUFDNEMsYUFBTCxDQUFtQixDQUFuQixFQUFzQkUsSUFBdkIsRUFBNkJWLE1BQTdCLEVBQXFDLElBQXJDLENBQS9CO0FBQ0EsdUJBQU8rSyxPQUFPLEtBQUs1SixTQUFaLEdBQXdCNEosT0FBTyxDQUFDbk0sR0FBUixDQUFZLE9BQVosRUFBcUJOLE1BQXJCLEdBQThCLENBQTlCLElBQW1DeU0sT0FBTyxDQUFDbk0sR0FBUixDQUFZLFFBQVosRUFBc0JOLE1BQXRCLEdBQStCLENBQTFGLEdBQThGLEtBQXJHO0FBQ0g7O0FBQ0QscUJBQU8sS0FBUDtBQUNILGFBbHBCb0I7QUFtcEJyQjBNLFlBQUFBLGNBQWMsRUFBRSx3QkFBQ2hMLE1BQUQsRUFBU2tJLE9BQVQsRUFBa0IrQyxvQkFBbEIsRUFBMkM7QUFDdkQsa0JBQUlyTixJQUFJLEdBQUdWLGFBQWEsQ0FBQzBCLEdBQWQsQ0FBa0JvQixNQUFsQixDQUFYO0FBQ0Esa0JBQUlrQyxHQUFHLEdBQUcsRUFBVjs7QUFDQSxrQkFBSXRFLElBQUksQ0FBQzRDLGFBQUwsSUFBc0I1QyxJQUFJLENBQUM0QyxhQUFMLENBQW1CLENBQW5CLEVBQXNCRSxJQUE1QyxJQUFvRDlDLElBQUksQ0FBQzRDLGFBQUwsQ0FBbUIsQ0FBbkIsRUFBc0JFLElBQXRCLENBQTJCcEMsTUFBM0IsR0FBb0MsQ0FBeEYsSUFBNkZ1QyxpQkFBaUIsQ0FBQ2pELElBQUksQ0FBQzRDLGFBQUwsQ0FBbUIsQ0FBbkIsRUFBc0JFLElBQXZCLEVBQTZCVixNQUE3QixFQUFxQyxJQUFyQyxDQUFqQixLQUFnRW1CLFNBQWpLLEVBQTRLO0FBQ3hLLG9CQUFJa0gsV0FBVyxHQUFHSCxPQUFPLEdBQ25CckgsaUJBQWlCLENBQUNqRCxJQUFJLENBQUM0QyxhQUFMLENBQW1CLENBQW5CLEVBQXNCRSxJQUF2QixFQUE2QlYsTUFBN0IsRUFBcUMsSUFBckMsQ0FBakIsQ0FBNERwQixHQUE1RCxDQUFnRSxPQUFoRSxDQURtQixHQUVuQmlDLGlCQUFpQixDQUFDakQsSUFBSSxDQUFDNEMsYUFBTCxDQUFtQixDQUFuQixFQUFzQkUsSUFBdkIsRUFBNkJWLE1BQTdCLEVBQXFDLElBQXJDLENBQWpCLENBQTREcEIsR0FBNUQsQ0FBZ0UsUUFBaEUsQ0FGTjs7QUFHQSxvQkFBSXlKLFdBQVcsQ0FBQy9KLE1BQVosR0FBcUIsQ0FBekIsRUFBNEI7QUFDeEI0RCxrQkFBQUEsR0FBRyxHQUFHbUcsV0FBVyxDQUFDLENBQUQsQ0FBakI7O0FBQ0EsdUJBQUssSUFBSXpHLElBQUMsR0FBRyxDQUFiLEVBQWdCQSxJQUFDLEdBQUd5RyxXQUFXLENBQUMvSixNQUFoQyxFQUF3Q3NELElBQUMsSUFBSSxDQUE3QztBQUNJTSxvQkFBQUEsR0FBRyxJQUFJLE9BQU9tRyxXQUFXLENBQUN6RyxJQUFELENBQXpCO0FBREo7QUFFSDtBQUNKOztBQUNELHFCQUFPcUosb0JBQW9CLElBQUkvSSxHQUFHLENBQUM1RCxNQUFKLEdBQWEsQ0FBckMsR0FDRCxPQUFPNEQsR0FETixHQUVEQSxHQUZOO0FBR0gsYUFucUJvQjtBQW9xQnJCZ0osWUFBQUEsZ0JBQWdCLEVBQUUsMEJBQUNsTCxNQUFELEVBQVNrSSxPQUFULEVBQWtCaUQsT0FBbEIsRUFBMkJGLG9CQUEzQixFQUFvRDtBQUNsRSxrQkFBSXJOLElBQUksR0FBR1YsYUFBYSxDQUFDMEIsR0FBZCxDQUFrQm9CLE1BQWxCLENBQVg7QUFDQSxrQkFBSWtDLEdBQUcsR0FBRyxFQUFWOztBQUNBLGtCQUFJdEUsSUFBSSxDQUFDNEMsYUFBTCxJQUFzQjVDLElBQUksQ0FBQzRDLGFBQUwsQ0FBbUIsQ0FBbkIsRUFBc0JFLElBQTVDLElBQW9EOUMsSUFBSSxDQUFDNEMsYUFBTCxDQUFtQixDQUFuQixFQUFzQkUsSUFBdEIsQ0FBMkJwQyxNQUEzQixHQUFvQyxDQUF4RixJQUE2RnVDLGlCQUFpQixDQUFDakQsSUFBSSxDQUFDNEMsYUFBTCxDQUFtQixDQUFuQixFQUFzQkUsSUFBdkIsRUFBNkJWLE1BQTdCLEVBQXFDLElBQXJDLENBQWpCLEtBQWdFbUIsU0FBakssRUFBNEs7QUFDeEssb0JBQUlrSCxXQUFXLEdBQUdILE9BQU8sR0FDbkJySCxpQkFBaUIsQ0FBQ2pELElBQUksQ0FBQzRDLGFBQUwsQ0FBbUIsQ0FBbkIsRUFBc0JFLElBQXZCLEVBQTZCVixNQUE3QixFQUFxQyxJQUFyQyxDQUFqQixDQUE0RHBCLEdBQTVELENBQWdFLE9BQWhFLENBRG1CLEdBRW5CaUMsaUJBQWlCLENBQUNqRCxJQUFJLENBQUM0QyxhQUFMLENBQW1CLENBQW5CLEVBQXNCRSxJQUF2QixFQUE2QlYsTUFBN0IsRUFBcUMsSUFBckMsQ0FBakIsQ0FBNERwQixHQUE1RCxDQUFnRSxRQUFoRSxDQUZOOztBQUdBLG9CQUFJeUosV0FBVyxDQUFDL0osTUFBWixHQUFxQixDQUF6QixFQUE0QjtBQUN4QjRELGtCQUFBQSxHQUFHLEdBQUdpSixPQUFPLEdBQ1A5QyxXQUFXLENBQUMsQ0FBRCxDQUFYLEdBQWlCLEdBQWpCLEdBQXVCQSxXQUFXLENBQUMsQ0FBRCxDQUQzQixHQUVQQSxXQUFXLENBQUMsQ0FBRCxDQUZqQjs7QUFHQSx1QkFBSyxJQUFJekcsSUFBQyxHQUFHLENBQWIsRUFBZ0JBLElBQUMsR0FBR3lHLFdBQVcsQ0FBQy9KLE1BQWhDLEVBQXdDc0QsSUFBQyxJQUFJLENBQTdDO0FBQ0lNLG9CQUFBQSxHQUFHLElBQUksT0FBT2lKLE9BQU8sR0FDZjlDLFdBQVcsQ0FBQ3pHLElBQUQsQ0FBWCxHQUFpQixHQUFqQixHQUF1QnlHLFdBQVcsQ0FBQ3pHLElBQUMsR0FBRyxDQUFMLENBRG5CLEdBRWZ5RyxXQUFXLENBQUN6RyxJQUFDLEdBQUcsQ0FBTCxDQUZWLENBQVA7QUFESjtBQUlIO0FBQ0o7O0FBQ0QscUJBQU9xSixvQkFBb0IsSUFBSS9JLEdBQUcsQ0FBQzVELE1BQUosR0FBYSxDQUFyQyxHQUF5QyxPQUFPNEQsR0FBaEQsR0FBc0RBLEdBQTdEO0FBQ0gsYUF0ckJvQjtBQXVyQnJCa0osWUFBQUEsZ0JBQWdCLEVBQUUsMEJBQUFwTCxNQUFNLEVBQUk7QUFDeEIsa0JBQUlwQyxJQUFJLEdBQUdWLGFBQWEsQ0FBQzBCLEdBQWQsQ0FBa0JvQixNQUFsQixDQUFYOztBQUNBLGtCQUFJcEMsSUFBSSxDQUFDeU4sTUFBVCxFQUFpQjtBQUNiLHVCQUFPek4sSUFBSSxDQUFDeU4sTUFBTCxDQUFZckssS0FBWixDQUFrQixJQUFsQixDQUFQO0FBQ0gsZUFGRCxNQUVPLElBQUlwRCxJQUFJLENBQUM0QyxhQUFMLElBQXNCNUMsSUFBSSxDQUFDNEMsYUFBTCxDQUFtQixDQUFuQixFQUFzQkUsSUFBNUMsSUFBb0Q5QyxJQUFJLENBQUM0QyxhQUFMLENBQW1CLENBQW5CLEVBQXNCRSxJQUF0QixDQUEyQnBDLE1BQTNCLEdBQW9DLENBQXhGLElBQTZGdUMsaUJBQWlCLENBQUNqRCxJQUFJLENBQUM0QyxhQUFMLENBQW1CLENBQW5CLEVBQXNCRSxJQUF2QixFQUE2QlYsTUFBN0IsRUFBcUMsSUFBckMsQ0FBakIsS0FBZ0VtQixTQUFqSyxFQUE0SztBQUMvSyx1QkFBT04saUJBQWlCLENBQUNqRCxJQUFJLENBQUM0QyxhQUFMLENBQW1CLENBQW5CLEVBQXNCRSxJQUF2QixFQUE2QlYsTUFBN0IsRUFBcUMsSUFBckMsQ0FBakIsQ0FBNERwQixHQUE1RCxDQUFnRSxNQUFoRSxDQUFQO0FBQ0gsZUFGTSxNQUVBLE9BQU8sRUFBUDtBQUNWLGFBOXJCb0I7QUErckJyQjBNLFlBQUFBLFlBQVksRUFBRSxzQkFBQXBOLFFBQVE7QUFBQSxxQkFDbEJBLFFBQVEsQ0FBQ3FOLG1CQUFULEdBQ01yTixRQUFRLENBQUNxTixtQkFBVCxDQUE2QkMsSUFEbkMsR0FFTXROLFFBQVEsQ0FBQ2tGLElBQVQsR0FBZ0JsRixRQUFRLENBQUNrRixJQUF6QixHQUFnQ2xGLFFBQVEsQ0FBQ0osRUFIN0I7QUFBQSxhQS9yQkQ7QUFtc0JyQmxCLFlBQUFBLEVBQUUsRUFBRUE7QUFuc0JpQixXQUF6QjtBQXNzQkEsY0FBSTZPLGFBQWEsR0FBRzdQLGdCQUFnQixDQUFDaUssa0JBQUQsQ0FBcEMsQ0ExekI2QixDQTR6QjdCOztBQUNBLGNBQUk2RixZQUFZLEdBQUcsRUFBbkI7QUFDQSxjQUFJQyxhQUE2RCxHQUFHLElBQUkvSyxHQUFKLEVBQXBFO0FBQ0FwRCxVQUFBQSxlQUFlLENBQUNKLFFBQWhCLENBQXlCK0IsT0FBekIsQ0FBaUMsVUFBQWEsTUFBTSxFQUFJO0FBQ3ZDLGdCQUFJcEMsSUFBSSxHQUFHVixhQUFhLENBQUMwQixHQUFkLENBQWtCb0IsTUFBbEIsQ0FBWDs7QUFDQSxnQkFBSXBELEVBQUUsQ0FBQ2dCLElBQUQsRUFBTyxlQUFQLENBQUYsSUFBNkJoQixFQUFFLENBQUNnQixJQUFELEVBQU8sa0JBQVAsQ0FBbkMsRUFBK0Q7QUFDM0Q4TixjQUFBQSxZQUFZLENBQUM3TixJQUFiLENBQWtCbUMsTUFBbEI7O0FBQ0Esa0JBQUl4QyxlQUFlLENBQUMwRixlQUFoQixDQUFnQ1AsR0FBaEMsQ0FBb0MzQyxNQUFwQyxNQUFnRHhDLGVBQWUsQ0FBQzBGLGVBQWhCLENBQWdDdEUsR0FBaEMsQ0FBb0NvQixNQUFwQyxFQUE0Q3BCLEdBQTVDLENBQWdELE9BQWhELEVBQXlETixNQUF6RCxHQUFrRSxDQUFsRSxJQUF1RWQsZUFBZSxDQUFDMEYsZUFBaEIsQ0FBZ0N0RSxHQUFoQyxDQUFvQ29CLE1BQXBDLEVBQTRDcEIsR0FBNUMsQ0FBZ0QsUUFBaEQsRUFBMEROLE1BQTFELEdBQW1FLENBQTFMLENBQUosRUFBa007QUFDOUxxTixnQkFBQUEsYUFBYSxDQUFDM04sR0FBZCxDQUFrQmdDLE1BQWxCLEVBQTBCeEMsZUFBZSxDQUFDMEYsZUFBaEIsQ0FBZ0N0RSxHQUFoQyxDQUFvQ29CLE1BQXBDLENBQTFCO0FBQ0g7QUFDSjtBQUNKLFdBUkQ7QUFTQSxjQUFJeEMsZUFBZSxDQUFDeUgsZ0JBQWhCLENBQWlDM0csTUFBakMsR0FBMEMsQ0FBOUMsRUFDSW9OLFlBQVksR0FBR0EsWUFBWSxDQUFDbk0sTUFBYixDQUFvQi9CLGVBQWUsQ0FBQ3lILGdCQUFwQyxDQUFmLENBejBCeUIsQ0EyMEI3Qjs7QUFDQSxjQUFJMkcsc0JBQXNCLEdBQUc7QUFDekJ4TyxZQUFBQSxRQUFRLEVBQUVzTyxZQURlO0FBRXpCL0ssWUFBQUEsZ0JBQWdCLEVBQUVBLGdCQUZPO0FBR3pCZ0wsWUFBQUEsYUFBYSxFQUFFQSxhQUhVO0FBSXpCRSxZQUFBQSxTQUFTLEVBQUU5SCxrQkFKYztBQUt6QitCLFlBQUFBLE9BQU8sRUFBRTVJLGFBTGdCO0FBTXpCNkksWUFBQUEsU0FBUyxFQUFFO0FBQUEscUJBQU12SSxlQUFlLENBQUMyRyxJQUFoQixDQUFxQnJHLEVBQTNCO0FBQUEsYUFOYztBQU96QmtJLFlBQUFBLFFBQVEsRUFBRSxrQkFBQWhHLE1BQU0sRUFBSTtBQUNoQixxQkFBT21ELFdBQVcsQ0FBQ2pHLGFBQWEsQ0FBQzBCLEdBQWQsQ0FBa0JvQixNQUFsQixDQUFELENBQWxCO0FBQ0gsYUFUd0I7QUFVekI4TCxZQUFBQSxnQkFBZ0IsRUFBRSwwQkFBQzlMLE1BQUQsRUFBU2tJLE9BQVQsRUFBa0I2RCxNQUFsQixFQUEwQkMsV0FBMUIsRUFBMEM7QUFDeEQsa0JBQUk5SixHQUFHLEdBQUcsRUFBVjs7QUFDQSxrQkFBSXlKLGFBQWEsQ0FBQy9NLEdBQWQsQ0FBa0JvQixNQUFsQixDQUFKLEVBQStCO0FBQzNCLG9CQUFJcUksV0FBVyxHQUFHSCxPQUFPLEdBQ25CeUQsYUFBYSxDQUFDL00sR0FBZCxDQUFrQm9CLE1BQWxCLEVBQTBCcEIsR0FBMUIsQ0FBOEIsT0FBOUIsQ0FEbUIsR0FFbkIrTSxhQUFhLENBQUMvTSxHQUFkLENBQWtCb0IsTUFBbEIsRUFBMEJwQixHQUExQixDQUE4QixRQUE5QixDQUZOOztBQUdBLG9CQUFJeUosV0FBVyxJQUFJQSxXQUFXLENBQUMvSixNQUFaLEdBQXFCLENBQXhDLEVBQTJDO0FBQ3ZDNEQsa0JBQUFBLEdBQUcsR0FBRzZKLE1BQU0sR0FBRzFELFdBQVcsQ0FBQyxDQUFELENBQVgsQ0FBZXZMLElBQWxCLEdBQXlCdUwsV0FBVyxDQUFDLENBQUQsQ0FBWCxDQUFlakYsSUFBcEQ7O0FBQ0EsdUJBQUssSUFBSXhCLElBQUMsR0FBRyxDQUFiLEVBQWdCQSxJQUFDLEdBQUd5RyxXQUFXLENBQUMvSixNQUFoQyxFQUF3Q3NELElBQUMsRUFBekM7QUFDSU0sb0JBQUFBLEdBQUcsSUFBSTZKLE1BQU0sR0FDUCxPQUFPMUQsV0FBVyxDQUFDekcsSUFBRCxDQUFYLENBQWU5RSxJQURmLEdBRVAsT0FBT3VMLFdBQVcsQ0FBQ3pHLElBQUQsQ0FBWCxDQUFld0IsSUFGNUI7QUFESjtBQUlIO0FBQ0o7O0FBQ0QscUJBQU9sQixHQUFHLENBQUM1RCxNQUFKLEdBQWEsQ0FBYixJQUFrQjBOLFdBQWxCLEdBQWdDLE9BQU85SixHQUF2QyxHQUE2Q0EsR0FBcEQ7QUFDSCxhQXpCd0I7QUEwQnpCK0osWUFBQUEsYUFBYSxFQUFFLHVCQUFDak0sTUFBRCxFQUFTa0ksT0FBVCxFQUFrQmlELE9BQWxCLEVBQTJCYSxXQUEzQixFQUEyQztBQUN0RCxrQkFBSTlKLEdBQUcsR0FBRyxFQUFWOztBQUNBLGtCQUFJeUosYUFBYSxDQUFDL00sR0FBZCxDQUFrQm9CLE1BQWxCLENBQUosRUFBK0I7QUFDM0Isb0JBQUlxSSxXQUFXLEdBQUdILE9BQU8sR0FDbkJ5RCxhQUFhLENBQUMvTSxHQUFkLENBQWtCb0IsTUFBbEIsRUFBMEJwQixHQUExQixDQUE4QixPQUE5QixDQURtQixHQUVuQitNLGFBQWEsQ0FBQy9NLEdBQWQsQ0FBa0JvQixNQUFsQixFQUEwQnBCLEdBQTFCLENBQThCLFFBQTlCLENBRk47O0FBR0Esb0JBQUl5SixXQUFXLElBQUlBLFdBQVcsQ0FBQy9KLE1BQVosR0FBcUIsQ0FBeEMsRUFBMkM7QUFDdkM0RCxrQkFBQUEsR0FBRyxHQUFHaUosT0FBTyxHQUNQOUMsV0FBVyxDQUFDLENBQUQsQ0FBWCxDQUFldkwsSUFBZixHQUFzQixHQUF0QixHQUE0QnVMLFdBQVcsQ0FBQyxDQUFELENBQVgsQ0FBZWpGLElBRHBDLEdBRVBpRixXQUFXLENBQUMsQ0FBRCxDQUFYLENBQWVqRixJQUZyQjs7QUFHQSx1QkFBSyxJQUFJeEIsSUFBQyxHQUFHLENBQWIsRUFBZ0JBLElBQUMsR0FBR3lHLFdBQVcsQ0FBQy9KLE1BQWhDLEVBQXdDc0QsSUFBQyxFQUF6QztBQUNJTSxvQkFBQUEsR0FBRyxJQUFJaUosT0FBTyxHQUNSLE9BQU85QyxXQUFXLENBQUN6RyxJQUFELENBQVgsQ0FBZTlFLElBQXRCLEdBQTZCLEdBQTdCLEdBQW1DdUwsV0FBVyxDQUFDekcsSUFBRCxDQUFYLENBQWV3QixJQUQxQyxHQUVSLE9BQU9pRixXQUFXLENBQUN6RyxJQUFELENBQVgsQ0FBZXdCLElBRjVCO0FBREo7QUFJSDtBQUNKOztBQUNELHFCQUFPbEIsR0FBRyxDQUFDNUQsTUFBSixHQUFhLENBQWIsSUFBa0IwTixXQUFsQixHQUFnQyxPQUFPOUosR0FBdkMsR0FBNkNBLEdBQXBEO0FBQ0gsYUEzQ3dCO0FBNEN6QitGLFlBQUFBLDZCQUE2QixFQUFFLHVDQUFDQyxPQUFELEVBQWE7QUFDeEMsa0JBQUlDLFFBQStCLEdBQUcsSUFBSXZILEdBQUosRUFBdEM7QUFDQXBELGNBQUFBLGVBQWUsQ0FBQ0osUUFBaEIsQ0FBeUIrQixPQUF6QixDQUFpQyxVQUFBYSxNQUFNLEVBQUk7QUFDdkMsb0JBQUlwQyxJQUFJLEdBQUdWLGFBQWEsQ0FBQzBCLEdBQWQsQ0FBa0JvQixNQUFsQixDQUFYOztBQUNBLG9CQUFJcEQsRUFBRSxDQUFDZ0IsSUFBRCxFQUFPLGVBQVAsQ0FBRixJQUE2QmhCLEVBQUUsQ0FBQ2dCLElBQUQsRUFBTyxrQkFBUCxDQUEvQixJQUE2RHFILGdCQUFnQixDQUFDOUcsT0FBakIsQ0FBeUI2QixNQUF6QixLQUFvQyxDQUFyRyxFQUF3RztBQUNwRyxzQkFBSW9JLE1BQU0sR0FBRyxFQUFiOztBQUNBLHNCQUFJeEssSUFBSSxDQUFDNEMsYUFBTCxJQUFzQjVDLElBQUksQ0FBQzRDLGFBQUwsQ0FBbUIsQ0FBbkIsRUFBc0JFLElBQTVDLElBQW9EOUMsSUFBSSxDQUFDNEMsYUFBTCxDQUFtQixDQUFuQixFQUFzQkUsSUFBdEIsQ0FBMkJwQyxNQUEzQixHQUFvQyxDQUF4RixJQUE2RnVDLGlCQUFpQixDQUFDakQsSUFBSSxDQUFDNEMsYUFBTCxDQUFtQixDQUFuQixFQUFzQkUsSUFBdkIsRUFBNkJWLE1BQTdCLEVBQXFDLElBQXJDLENBQWpCLEtBQWdFbUIsU0FBakssRUFBNEs7QUFDeEssd0JBQUlrSCxXQUFXLEdBQUdILE9BQU8sR0FDbkJySCxpQkFBaUIsQ0FBQ2pELElBQUksQ0FBQzRDLGFBQUwsQ0FBbUIsQ0FBbkIsRUFBc0JFLElBQXZCLEVBQTZCVixNQUE3QixFQUFxQyxJQUFyQyxDQUFqQixDQUE0RHBCLEdBQTVELENBQWdFLE9BQWhFLENBRG1CLEdBRW5CaUMsaUJBQWlCLENBQUNqRCxJQUFJLENBQUM0QyxhQUFMLENBQW1CLENBQW5CLEVBQXNCRSxJQUF2QixFQUE2QlYsTUFBN0IsRUFBcUMsSUFBckMsQ0FBakIsQ0FBNERwQixHQUE1RCxDQUFnRSxRQUFoRSxDQUZOOztBQUdBLHdCQUFJeUosV0FBVyxDQUFDL0osTUFBWixHQUFxQixDQUF6QixFQUE0QjtBQUN4QjhKLHNCQUFBQSxNQUFNLEdBQUdDLFdBQVcsQ0FBQyxDQUFELENBQXBCOztBQUNBLDJCQUFLLElBQUl6RyxJQUFDLEdBQUcsQ0FBYixFQUFnQkEsSUFBQyxHQUFHeUcsV0FBVyxDQUFDL0osTUFBaEMsRUFBd0NzRCxJQUFDLElBQUksQ0FBN0M7QUFBZ0R3Ryx3QkFBQUEsTUFBTSxJQUFJQyxXQUFXLENBQUN6RyxJQUFELENBQXJCO0FBQWhEO0FBQ0g7QUFDSjs7QUFDRCxzQkFBSXdCLElBQUksR0FBR0QsV0FBVyxDQUFDakcsYUFBYSxDQUFDMEIsR0FBZCxDQUFrQm9CLE1BQWxCLENBQUQsQ0FBWCxHQUF5Q29JLE1BQXBEOztBQUNBLHNCQUFJLENBQUNELFFBQVEsQ0FBQ3hGLEdBQVQsQ0FBYVMsSUFBYixDQUFMLEVBQXlCO0FBQ3JCK0Usb0JBQUFBLFFBQVEsQ0FBQ25LLEdBQVQsQ0FBYW9GLElBQWIsRUFBbUIsRUFBbkI7QUFDSDs7QUFDRCtFLGtCQUFBQSxRQUFRLENBQUN2SixHQUFULENBQWF3RSxJQUFiLEVBQW1CdkYsSUFBbkIsQ0FBd0JtQyxNQUF4QjtBQUNIO0FBQ0osZUFuQkQ7QUFvQkEscUJBQU9tSSxRQUFQO0FBQ0gsYUFuRXdCO0FBb0V6QnZMLFlBQUFBLEVBQUUsRUFBRUE7QUFwRXFCLFdBQTdCO0FBc0VBMEcsVUFBQUEsU0FBUyxDQUFDRyxRQUFWLElBQXNCZ0ksYUFBdEI7O0FBQ0EsY0FBSUMsWUFBWSxDQUFDcE4sTUFBYixHQUFzQixDQUExQixFQUE2QjtBQUN6QmdGLFlBQUFBLFNBQVMsQ0FBQ0csUUFBVixJQUFzQnpILG9CQUFvQixDQUFDNFAsc0JBQUQsQ0FBMUM7QUFDSDs7QUFDRHRJLFVBQUFBLFNBQVMsQ0FBQ0ksa0JBQVYsQ0FBNkIxRixHQUE3QixDQUFpQ1IsZUFBZSxDQUFDMkcsSUFBaEIsQ0FBcUJyRyxFQUF0RCxFQUEwRE4sZUFBMUQ7QUFDSCxTQXY1QkQsTUF1NUJPO0FBQ0hBLFVBQUFBLGVBQWUsQ0FBQ0osUUFBaEIsQ0FBeUIrQixPQUF6QixDQUFpQyxVQUFBYSxNQUFNO0FBQUEsbUJBQ25DeEMsZUFBZSxDQUFDZ0ksWUFBaEIsQ0FBNkJ4SCxHQUE3QixDQUFpQ2dDLE1BQWpDLEVBQXlDK0Qsa0JBQWtCLENBQUNuRixHQUFuQixDQUF1Qm9CLE1BQXZCLENBQXpDLENBRG1DO0FBQUEsV0FBdkM7QUFHQXhDLFVBQUFBLGVBQWUsQ0FBQ0gsUUFBaEIsQ0FBeUI4QixPQUF6QixDQUFpQyxVQUFBd0csTUFBTTtBQUFBLG1CQUNuQ25JLGVBQWUsQ0FBQ29JLFlBQWhCLENBQTZCNUgsR0FBN0IsQ0FBaUMySCxNQUFqQyxFQUF5QzNCLGtCQUFrQixDQUFDcEYsR0FBbkIsQ0FBdUIrRyxNQUF2QixDQUF6QyxDQURtQztBQUFBLFdBQXZDO0FBR0g7QUE1K0JtQjs7QUE2RXhCLGlEQUE0QnhJLHFCQUE1Qiw4Q0FBbUQ7QUFBQTtBQWc2QmxELE9BNytCdUIsQ0ErK0J4Qjs7O0FBRUFtRyxNQUFBQSxTQUFTLENBQUM0SSxpQkFBVixHQUE4QjVJLFNBQVMsQ0FBQ0YsSUFBVixHQUFpQixHQUFqQixJQUF3Qm5HLElBQUksQ0FBQ21HLElBQUwsR0FBWW5HLElBQUksQ0FBQ21HLElBQUwsQ0FBVTNCLE9BQVYsQ0FBa0IsTUFBbEIsRUFBMEIsR0FBMUIsQ0FBWixHQUE2Q3hFLElBQUksQ0FBQ2EsRUFBMUUsSUFBZ0YsV0FBOUc7QUFFQXZCLE1BQUFBLE9BQU87QUFDVixLQXIvQkwsV0FzL0JXLFVBQUFHLEdBQUcsRUFBSTtBQUNWLFlBQU0sSUFBSW1ELEtBQUosQ0FBVW5ELEdBQVYsQ0FBTjtBQUNBRixNQUFBQSxNQUFNO0FBQ1QsS0F6L0JMO0FBMC9CSCxHQTMvQk0sQ0FBUDtBQTQvQkgsQ0E3L0JEOztlQSsvQmU2RyxVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF9kZWJ1ZyBmcm9tICdkZWJ1ZydcbmltcG9ydCBCcG1uTW9kZGxlIGZyb20gXCJicG1uLW1vZGRsZVwiO1xuaW1wb3J0ICogYXMgZnMgZnJvbSBcImZzXCI7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgKiBhcyBlanMgZnJvbSBcImVqc1wiO1xuaW1wb3J0IEJpZ051bWJlciBmcm9tIFwiYmlnbnVtYmVyLmpzXCI7XG5pbXBvcnQge1xuICAgIENvbnRyb2xGbG93SW5mbyxcbiAgICBNb2RlbEluZm8sXG4gICAgUGFyYW1ldGVySW5mbyxcbiAgICBPcmFjbGVJbmZvXG59IGZyb20gXCIuL2RlZmluaXRpb25zXCI7XG5pbXBvcnQgYnBtbjJzb2xFSlMgZnJvbSAnLi4vLi4vLi4vdGVtcGxhdGVzL2JwbW4yc29sLmVqcycgXG5pbXBvcnQgd29ya0xpc3Qyc29sRUpTIGZyb20gJy4uLy4uLy4uL3RlbXBsYXRlcy93b3JrTGlzdDJzb2wuZWpzJyBcblxuY29uc3QgZGVidWcgPSBfZGVidWcoJ2NhdGVycGlsbGFycWw6cGFyc2UtbW9kZWwnKVxuXG5jb25zdCBicG1uMnNvbFRlbXBsYXRlID0gZWpzLmNvbXBpbGUoYnBtbjJzb2xFSlMpO1xuXG5jb25zdCB3b3JrTGlzdDJzb2xUZW1wbGF0ZSA9IGVqcy5jb21waWxlKHdvcmtMaXN0MnNvbEVKUyk7XG5cbmxldCBtb2RkbGUgPSBuZXcgQnBtbk1vZGRsZSgpO1xubGV0IHBhcnNlQnBtbiA9IGJwbW5Eb2MgPT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIG1vZGRsZS5mcm9tWE1MKGJwbW5Eb2MsIChlcnIsIGRlZmluaXRpb25zKSA9PiB7XG4gICAgICAgICAgICBpZiAoIWVycikgcmVzb2x2ZShkZWZpbml0aW9ucyk7XG4gICAgICAgICAgICBlbHNlIHJlamVjdChlcnIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn07XG5cbmxldCBpcyA9IChlbGVtZW50LCB0eXBlKSA9PiBlbGVtZW50LiRpbnN0YW5jZU9mKHR5cGUpO1xubGV0IGNvbGxlY3RDb250cm9sRmxvd0luZm86IChwcm9jOiBhbnksIGdsb2JhbE5vZGVNYXA6IE1hcDxzdHJpbmcsIGFueT4sIGdsb2JhbENvbnRyb2xGbG93SW5mbzogQXJyYXk8Q29udHJvbEZsb3dJbmZvPikgPT4gQ29udHJvbEZsb3dJbmZvO1xuY29sbGVjdENvbnRyb2xGbG93SW5mbyA9IChwcm9jOiBhbnksXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGdsb2JhbE5vZGVNYXA6IE1hcDxzdHJpbmcsIGFueT4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGdsb2JhbENvbnRyb2xGbG93SW5mbzogQXJyYXk8Q29udHJvbEZsb3dJbmZvPik6IENvbnRyb2xGbG93SW5mbyA9PiB7XG4gICAgbGV0IG5vZGVMaXN0OiBBcnJheTxzdHJpbmc+ID0gW107XG4gICAgbGV0IGVkZ2VMaXN0OiBBcnJheTxzdHJpbmc+ID0gW107XG4gICAgbGV0IGJvdW5kYXJ5RXZlbnRzOiBBcnJheTxzdHJpbmc+ID0gW107XG4gICAgbGV0IG5vbkJsb2NraW5nQm91bmRhcnlFdmVudHM6IEFycmF5PHN0cmluZz4gPSBbXTtcbiAgICBsZXQgY29udHJvbEZsb3dJbmZvOiBDb250cm9sRmxvd0luZm87XG5cbiAgICBmb3IgKGxldCBub2RlIG9mIHByb2MuZmxvd0VsZW1lbnRzLmZpbHRlcihlID0+IGlzKGUsIFwiYnBtbjpGbG93Tm9kZVwiKSkpIHtcbiAgICAgICAgaWYgKGlzKG5vZGUsIFwiYnBtbjpCb3VuZGFyeUV2ZW50XCIpKSB7XG4gICAgICAgICAgICBib3VuZGFyeUV2ZW50cy5wdXNoKG5vZGUuaWQpO1xuICAgICAgICAgICAgaWYgKG5vZGUuY2FuY2VsQWN0aXZpdHkgPT0gZmFsc2UpIG5vbkJsb2NraW5nQm91bmRhcnlFdmVudHMucHVzaChub2RlLmlkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vZGVMaXN0LnB1c2gobm9kZS5pZCk7XG4gICAgICAgIH1cbiAgICAgICAgZ2xvYmFsTm9kZU1hcC5zZXQobm9kZS5pZCwgbm9kZSk7XG4gICAgfVxuXG4gICAgbGV0IHNvdXJjZXMgPSBbLi4ubm9kZUxpc3RdO1xuXG4gICAgZm9yIChsZXQgZmxvd0VkZ2Ugb2YgcHJvYy5mbG93RWxlbWVudHMuZmlsdGVyKGUgPT5cbiAgICAgICAgaXMoZSwgXCJicG1uOlNlcXVlbmNlRmxvd1wiKVxuICAgICkpIHtcbiAgICAgICAgaWYgKHNvdXJjZXMuaW5kZXhPZihmbG93RWRnZS50YXJnZXRSZWYuaWQpID4gLTEpIHtcbiAgICAgICAgICAgIHNvdXJjZXMuc3BsaWNlKHNvdXJjZXMuaW5kZXhPZihmbG93RWRnZS50YXJnZXRSZWYuaWQpLCAxKTtcbiAgICAgICAgfVxuICAgICAgICBlZGdlTGlzdC5wdXNoKGZsb3dFZGdlLmlkKTtcbiAgICB9XG5cbiAgICAvLyBMZXQgdXMgcmVtb3ZlIGFsbCBzb3VyY2UgZWxlbWVudHMgZnJvbSB0aGUgbm9kZSBsaXN0XG4gICAgbm9kZUxpc3QgPSBub2RlTGlzdC5maWx0ZXIoKG5vZGU6IHN0cmluZykgPT4gc291cmNlcy5pbmRleE9mKG5vZGUpIDwgMCk7XG5cbiAgICBpZiAobm9uQmxvY2tpbmdCb3VuZGFyeUV2ZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGxldCBkZnMgPSAoc291cmNlczogc3RyaW5nW10pID0+IHtcbiAgICAgICAgICAgIGxldCBvcGVuID0gWy4uLnNvdXJjZXNdO1xuICAgICAgICAgICAgbGV0IG5vZGVMaXN0OiBBcnJheTxzdHJpbmc+ID0gW107XG4gICAgICAgICAgICBsZXQgZWRnZUxpc3Q6IEFycmF5PHN0cmluZz4gPSBbXTtcbiAgICAgICAgICAgIHdoaWxlIChvcGVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBsZXQgY3VycklkID0gb3Blbi5wb3AoKTtcbiAgICAgICAgICAgICAgICBsZXQgY3VyciA9IGdsb2JhbE5vZGVNYXAuZ2V0KGN1cnJJZCk7XG4gICAgICAgICAgICAgICAgbm9kZUxpc3QucHVzaChjdXJySWQpO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyLm91dGdvaW5nICYmIGN1cnIub3V0Z29pbmcubGVuZ3RoID4gMClcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgc3VjY0VkZ2Ugb2YgY3Vyci5vdXRnb2luZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHN1Y2MgPSBzdWNjRWRnZS50YXJnZXRSZWY7XG4gICAgICAgICAgICAgICAgICAgICAgICBlZGdlTGlzdC5wdXNoKHN1Y2NFZGdlLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcGVuLmluZGV4T2Yoc3VjYy5pZCkgPCAwICYmIG5vZGVMaXN0LmluZGV4T2Yoc3VjYy5pZCkgPCAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZW4ucHVzaChzdWNjLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIFtub2RlTGlzdCwgZWRnZUxpc3RdO1xuICAgICAgICB9O1xuICAgICAgICBsZXQgW21haW5QYXRoTm9kZUxpc3QsIG1haW5QYXRoRWRnZUxpc3RdID0gZGZzKHNvdXJjZXMpO1xuICAgICAgICBsZXQgbG9jYWxCb3VuZGFyeSA9IFtdO1xuICAgICAgICBib3VuZGFyeUV2ZW50cy5mb3JFYWNoKGV2dElkID0+IHtcbiAgICAgICAgICAgIGlmIChub25CbG9ja2luZ0JvdW5kYXJ5RXZlbnRzLmluZGV4T2YoZXZ0SWQpIDwgMClcbiAgICAgICAgICAgICAgICBsb2NhbEJvdW5kYXJ5LnB1c2goZXZ0SWQpO1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGxvY2FsQm91bmRhcnkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbGV0IFtib3VuZGFyeU5vZGVQYXRoLCBib3VuZGFyeUVkZ2VQYXRoXSA9IGRmcyhsb2NhbEJvdW5kYXJ5KTtcbiAgICAgICAgICAgIGJvdW5kYXJ5Tm9kZVBhdGggPSBib3VuZGFyeU5vZGVQYXRoLmZpbHRlcihcbiAgICAgICAgICAgICAgICAobm9kZTogc3RyaW5nKSA9PiBsb2NhbEJvdW5kYXJ5LmluZGV4T2Yobm9kZSkgPCAwXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgbWFpblBhdGhOb2RlTGlzdCA9IG1haW5QYXRoTm9kZUxpc3QuY29uY2F0KGJvdW5kYXJ5Tm9kZVBhdGgpO1xuICAgICAgICAgICAgbWFpblBhdGhFZGdlTGlzdCA9IG1haW5QYXRoRWRnZUxpc3QuY29uY2F0KGJvdW5kYXJ5RWRnZVBhdGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTGV0IHVzIHJlbW92ZSBhbGwgc291cmNlIGVsZW1lbnRzIGZyb20gdGhlIG5vZGUgbGlzdFxuICAgICAgICBtYWluUGF0aE5vZGVMaXN0ID0gbWFpblBhdGhOb2RlTGlzdC5maWx0ZXIoKG5vZGU6IHN0cmluZykgPT4gc291cmNlcy5pbmRleE9mKG5vZGUpIDwgMCk7XG5cbiAgICAgICAgY29udHJvbEZsb3dJbmZvID0gbmV3IENvbnRyb2xGbG93SW5mbyhcbiAgICAgICAgICAgIHByb2MsXG4gICAgICAgICAgICBtYWluUGF0aE5vZGVMaXN0LFxuICAgICAgICAgICAgbWFpblBhdGhFZGdlTGlzdCxcbiAgICAgICAgICAgIHNvdXJjZXMsXG4gICAgICAgICAgICBib3VuZGFyeUV2ZW50c1xuICAgICAgICApO1xuICAgICAgICBnbG9iYWxDb250cm9sRmxvd0luZm8ucHVzaChjb250cm9sRmxvd0luZm8pO1xuICAgICAgICBmb3IgKGxldCBldmVudElkIG9mIG5vbkJsb2NraW5nQm91bmRhcnlFdmVudHMpIHtcbiAgICAgICAgICAgIGxldCBldmVudCA9IGdsb2JhbE5vZGVNYXAuZ2V0KGV2ZW50SWQpO1xuICAgICAgICAgICAgaWYgKCFtYWluUGF0aE5vZGVMaXN0LmZpbmQoKGU6IHN0cmluZykgPT4gZXZlbnQuYXR0YWNoZWRUb1JlZi5pZCA9PT0gZSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgIFwiRVJST1I6IEZvdW5kIG5vbi1pbnRlcnJ1cHRpbmcgZXZlbnQgd2hpY2ggaXMgbm90IGF0dGFjaGVkIHRvIGEgc3VicHJvY2VzcyBpbiB0aGUgbWFpbiBwcm9jZXNzIHBhdGhcIlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBbbG9jYWxOb2RlTGlzdCwgbG9jYWxFZGdlTGlzdF0gPSBkZnMoW2V2ZW50SWRdKTtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBtYWluUGF0aE5vZGVMaXN0LmZpbHRlcihcbiAgICAgICAgICAgICAgICAgICAgKG5vZGVJZDogc3RyaW5nKSA9PiBsb2NhbE5vZGVMaXN0LmluZGV4T2Yobm9kZUlkKSA+PSAwXG4gICAgICAgICAgICAgICAgKS5sZW5ndGggPiAwXG4gICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgICAgICBcIkVSUk9SOiBOb24taW50ZXJydXB0aW5nIGV2ZW50IG91dGdvaW5nIHBhdGggaXMgbm90IHN5bmNocm9uaXplZCBhbmQgbWVyZ2VzIHdpdGggbWFpbiBwcm9jZXNzIHBhdGhcIlxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIC8vIExldCB1cyByZW1vdmUgYWxsIHNvdXJjZSBlbGVtZW50cyBmcm9tIHRoZSBub2RlIGxpc3RcbiAgICAgICAgICAgIGxvY2FsTm9kZUxpc3QgPSBsb2NhbE5vZGVMaXN0LmZpbHRlcigobm9kZTogc3RyaW5nKSA9PiBzb3VyY2VzLmluZGV4T2Yobm9kZSkgPCAwKTtcblxuICAgICAgICAgICAgbGV0IGNoaWxkQ29udHJvbEZsb3dJbmZvID0gbmV3IENvbnRyb2xGbG93SW5mbyhcbiAgICAgICAgICAgICAgICBldmVudCxcbiAgICAgICAgICAgICAgICBsb2NhbE5vZGVMaXN0LFxuICAgICAgICAgICAgICAgIGxvY2FsRWRnZUxpc3QsXG4gICAgICAgICAgICAgICAgW2V2ZW50SWRdLFxuICAgICAgICAgICAgICAgIFtdXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgY2hpbGRDb250cm9sRmxvd0luZm8ucGFyZW50ID0gcHJvYztcbiAgICAgICAgICAgIGdsb2JhbENvbnRyb2xGbG93SW5mby5wdXNoKGNoaWxkQ29udHJvbEZsb3dJbmZvKTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnRyb2xGbG93SW5mbyA9IG5ldyBDb250cm9sRmxvd0luZm8oXG4gICAgICAgICAgICBwcm9jLFxuICAgICAgICAgICAgbm9kZUxpc3QsXG4gICAgICAgICAgICBlZGdlTGlzdCxcbiAgICAgICAgICAgIHNvdXJjZXMsXG4gICAgICAgICAgICBib3VuZGFyeUV2ZW50c1xuICAgICAgICApO1xuICAgICAgICBnbG9iYWxDb250cm9sRmxvd0luZm8ucHVzaChjb250cm9sRmxvd0luZm8pO1xuICAgIH1cblxuICAgIGZvciAobGV0IHN1YnByb2Nlc3Mgb2YgcHJvYy5mbG93RWxlbWVudHMuZmlsdGVyKGUgPT4gaXMoZSwgXCJicG1uOlN1YlByb2Nlc3NcIikpKSB7XG4gICAgICAgIGxldCBzdWJwcm9jZXNzQ29udHJvbEZsb3dJbmZvID0gY29sbGVjdENvbnRyb2xGbG93SW5mbyhzdWJwcm9jZXNzLCBnbG9iYWxOb2RlTWFwLCBnbG9iYWxDb250cm9sRmxvd0luZm8pO1xuICAgICAgICBzdWJwcm9jZXNzQ29udHJvbEZsb3dJbmZvLnBhcmVudCA9IHByb2M7XG5cbiAgICAgICAgaWYgKCEoc3VicHJvY2Vzcy5sb29wQ2hhcmFjdGVyaXN0aWNzICYmIHN1YnByb2Nlc3MubG9vcENoYXJhY3RlcmlzdGljcy4kdHlwZSA9PT0gXCJicG1uOk11bHRpSW5zdGFuY2VMb29wQ2hhcmFjdGVyaXN0aWNzXCIpKSB7XG4gICAgICAgICAgICAvLyBTdWJwcm9jZXNzIGlzIGVtYmVkZGVkIC4uLiB0aGVuIGNvcHkgYWxsIG5vZGVzIGFuZCBlZGdlcyB0byB0aGUgcGFyZW50IHByb2Nlc3NcbiAgICAgICAgICAgIHN1YnByb2Nlc3NDb250cm9sRmxvd0luZm8uaXNFbWJlZGRlZCA9IHRydWU7XG5cbiAgICAgICAgICAgIGNvbnRyb2xGbG93SW5mby5ub2RlTGlzdCA9IGNvbnRyb2xGbG93SW5mby5ub2RlTGlzdC5jb25jYXQoc3VicHJvY2Vzc0NvbnRyb2xGbG93SW5mby5ub2RlTGlzdCk7XG4gICAgICAgICAgICBjb250cm9sRmxvd0luZm8uZWRnZUxpc3QgPSBjb250cm9sRmxvd0luZm8uZWRnZUxpc3QuY29uY2F0KHN1YnByb2Nlc3NDb250cm9sRmxvd0luZm8uZWRnZUxpc3QpO1xuICAgICAgICAgICAgY29udHJvbEZsb3dJbmZvLmJvdW5kYXJ5RXZlbnRzID0gY29udHJvbEZsb3dJbmZvLmJvdW5kYXJ5RXZlbnRzLmNvbmNhdChzdWJwcm9jZXNzQ29udHJvbEZsb3dJbmZvLmJvdW5kYXJ5RXZlbnRzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAocHJvYy5kb2N1bWVudGF0aW9uKSB7XG4gICAgICAgIGNvbnRyb2xGbG93SW5mby5nbG9iYWxQYXJhbWV0ZXJzID0gcHJvYy5kb2N1bWVudGF0aW9uWzBdLnRleHQ7XG4gICAgfVxuICAgIHJldHVybiBjb250cm9sRmxvd0luZm87XG59O1xuXG5sZXQgcmVzdHJpY3RSZWxhdGlvbjogTWFwPHN0cmluZywgYW55PiA9IG5ldyBNYXAoKTtcblxuXG5cbmxldCBleHRyYWN0UGFyYW1ldGVycyA9IChjYWQsIG5vZGVJZCwgY29udHJvbEZsb3dJbmZvKSA9PiB7XG4gICAgICAgIC8vIEV4dHJhY3RpbmcgUm9sZXMgZnJvbSBVc2VyVGFza3MgZnVuY3Rpb25Cb2R5XG5cbiAgICBsZXQgYXJyID0gY2FkLnNwbGl0KCdAJyk7XG4gICAgaWYoYXJyLmxlbmd0aCA+PSAzKSB7XG4gICAgICAgIGlmKGNvbnRyb2xGbG93SW5mbyAhPSBudWxsKVxuICAgICAgICAgICAgY29udHJvbEZsb3dJbmZvLnRhc2tSb2xlTWFwLnNldChub2RlSWQsIGFyclsxXS50cmltKCkpO1xuICAgICAgICBpZihhcnJbMl0ubGVuZ3RoID4gMSlcbiAgICAgICAgICAgIGNhZCA9IGFyclsyXTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICAvLyBFeHRyYWN0aW5nIEluZm9ybWF0aW9uIG9mIE9yYWNsZSBmcm9tIFNlcnZpY2UgVGFza3MgKGlmIGFwbGljYWJsZSlcbiAgICBsZXQgb3JhY2xlX0RhdGEgPSBcIlwiO1xuICAgIGZvciAobGV0IGogPSAwLCBmaXJzdCA9IGZhbHNlOyBqIDwgY2FkLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGlmIChjYWQuY2hhckF0KGopID09PSBcIihcIikge1xuICAgICAgICAgICAgaWYgKCFmaXJzdCkgZmlyc3QgPSB0cnVlO1xuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY2FkID0gY2FkLnN1YnN0cihqKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoY2FkLmNoYXJBdChqKSA9PT0gXCI6XCIpIHtcbiAgICAgICAgICAgIG9yYWNsZV9EYXRhID0gXCJcIjtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIG9yYWNsZV9EYXRhICs9IGNhZC5jaGFyQXQoaik7XG4gICAgfVxuXG4gICAgLy8gUHJvY2Vzc2luZyBJbmZvcm1hdGlvbiBvZiBmdW5jdGlvbiBwYXJhbWV0ZXJzIChib3RoIHNlcnZpY2UgYW5kIHVzZXIgdGFza3MpXG4gICAgY2FkID0gY2FkXG4gICAgICAgIC5yZXBsYWNlKFwiKFwiLCBcIiBcIilcbiAgICAgICAgLnJlcGxhY2UoXCIpXCIsIFwiIFwiKVxuICAgICAgICAudHJpbSgpO1xuICAgIGNhZCA9IGNhZFxuICAgICAgICAucmVwbGFjZShcIihcIiwgXCIgXCIpXG4gICAgICAgIC5yZXBsYWNlKFwiKVwiLCBcIiBcIilcbiAgICAgICAgLnRyaW0oKTtcblxuICAgIGxldCBmaXJzdFNwbGl0ID0gY2FkLnNwbGl0KFwiOlwiKTtcbiAgICBpZiAoZmlyc3RTcGxpdC5sZW5ndGggPiAyKSB7XG4gICAgICAgIGxldCBhdXggPSAnJztcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBmaXJzdFNwbGl0Lmxlbmd0aDsgaSsrKSBhdXggKz0gZmlyc3RTcGxpdFtpXTtcbiAgICAgICAgZmlyc3RTcGxpdCA9IFtmaXJzdFNwbGl0WzBdLCBhdXhdO1xuICAgIH1cbiAgICBsZXQgc2Vjb25kU3BsaXQgPSBmaXJzdFNwbGl0W2ZpcnN0U3BsaXQubGVuZ3RoIC0gMV0udHJpbSgpLnNwbGl0KFwiLT5cIik7XG4gICAgbGV0IHJlc01hcDogTWFwPHN0cmluZywgQXJyYXk8c3RyaW5nPj4gPSBuZXcgTWFwKCk7XG5cbiAgICBsZXQgaW5wdXRPdXRwdXQgPSBbZmlyc3RTcGxpdFswXS50cmltKCksIHNlY29uZFNwbGl0WzBdLnRyaW0oKV07XG4gICAgbGV0IHBhcmFtZXRlclR5cGUgPSBbXCJpbnB1dFwiLCBcIm91dHB1dFwiXTtcbiAgICByZXNNYXAuc2V0KFwiYm9keVwiLCBbc2Vjb25kU3BsaXRbc2Vjb25kU3BsaXQubGVuZ3RoIC0gMV0udHJpbSgpXSk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlucHV0T3V0cHV0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCB0ZW1wID0gaW5wdXRPdXRwdXRbaV0uc3BsaXQoXCIsXCIpO1xuICAgICAgICBsZXQgcmVzID0gW107XG4gICAgICAgIHRlbXAuZm9yRWFjaChzdWJDYWQgPT4ge1xuICAgICAgICAgICAgbGV0IGF1eCA9IHN1YkNhZC50cmltKCkuc3BsaXQoXCIgXCIpO1xuICAgICAgICAgICAgaWYgKGF1eFswXS50cmltKCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHJlcy5wdXNoKGF1eFswXS50cmltKCkpO1xuICAgICAgICAgICAgICAgIHJlcy5wdXNoKGF1eFthdXgubGVuZ3RoIC0gMV0udHJpbSgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJlc01hcC5zZXQocGFyYW1ldGVyVHlwZVtpXSwgcmVzKTtcbiAgICB9XG4gICAgLy8gVXBkYXRpbmcgSW5mb3JtYXRpb24gb2YgT3JhY2xlIGluIGNvbnRyb2xGbG93SW5mb1xuICAgIGlmIChjb250cm9sRmxvd0luZm8gIT0gbnVsbCkge1xuICAgICAgICBsZXQgaW5QYXJhbWV0ZXJzOiBBcnJheTxQYXJhbWV0ZXJJbmZvPiA9IFtdO1xuICAgICAgICBsZXQgb3V0UGFyYW1ldGVyczogQXJyYXk8UGFyYW1ldGVySW5mbz4gPSBbXTtcbiAgICAgICAgbGV0IHRvSXRlcmF0ZSA9IHJlc01hcC5nZXQoJ2lucHV0Jyk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG9JdGVyYXRlLmxlbmd0aDsgaSArPSAyKVxuICAgICAgICAgICAgaW5QYXJhbWV0ZXJzLnB1c2gobmV3IFBhcmFtZXRlckluZm8odG9JdGVyYXRlW2ldLCB0b0l0ZXJhdGVbaSArIDFdKSk7XG4gICAgICAgIHRvSXRlcmF0ZSA9IHJlc01hcC5nZXQoJ291dHB1dCcpO1xuICAgICAgICBsZXQgcGFyYW1ldGVyczogTWFwPHN0cmluZywgQXJyYXk8UGFyYW1ldGVySW5mbz4+ID0gbmV3IE1hcCgpO1xuICAgICAgICBwYXJhbWV0ZXJzLnNldCgnaW5wdXQnLCBpblBhcmFtZXRlcnMpO1xuICAgICAgICBwYXJhbWV0ZXJzLnNldCgnb3V0cHV0Jywgb3V0UGFyYW1ldGVycyk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG9JdGVyYXRlLmxlbmd0aDsgaSArPSAyKVxuICAgICAgICAgICAgb3V0UGFyYW1ldGVycy5wdXNoKG5ldyBQYXJhbWV0ZXJJbmZvKHRvSXRlcmF0ZVtpXSwgdG9JdGVyYXRlW2kgKyAxXSkpO1xuICAgICAgICBpZiAob3JhY2xlX0RhdGEubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgb3JhY2xlX0RhdGEgPSBvcmFjbGVfRGF0YS50cmltKCkucmVwbGFjZShcIiBcIiwgXCJfXCIpO1xuICAgICAgICAgICAgb3JhY2xlX0RhdGEgPSBvcmFjbGVfRGF0YVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKFwiKFwiLCBcIiBcIilcbiAgICAgICAgICAgICAgICAucmVwbGFjZShcIikuXCIsIFwiIFwiKVxuICAgICAgICAgICAgICAgIC50cmltKCk7XG4gICAgICAgICAgICBsZXQgc3BsaXRSZXN1bHQgPSBvcmFjbGVfRGF0YS5zcGxpdChcIiBcIik7XG4gICAgICAgICAgICBpZiAoIWNvbnRyb2xGbG93SW5mby5vcmFjbGVJbmZvLmhhcyhzcGxpdFJlc3VsdFswXSkpIHtcbiAgICAgICAgICAgICAgICBjb250cm9sRmxvd0luZm8ub3JhY2xlSW5mby5zZXQoXG4gICAgICAgICAgICAgICAgICAgIHNwbGl0UmVzdWx0WzBdLFxuICAgICAgICAgICAgICAgICAgICBuZXcgT3JhY2xlSW5mbyhzcGxpdFJlc3VsdFswXSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29udHJvbEZsb3dJbmZvLm9yYWNsZVRhc2tNYXAuc2V0KG5vZGVJZCwgc3BsaXRSZXN1bHRbMF0pO1xuICAgICAgICAgICAgbGV0IGxvY2FsT3JhY2xlID0gY29udHJvbEZsb3dJbmZvLm9yYWNsZUluZm8uZ2V0KHNwbGl0UmVzdWx0WzBdKTtcbiAgICAgICAgICAgIGxvY2FsT3JhY2xlLmFkZHJlc3MgPSBzcGxpdFJlc3VsdFsxXTtcbiAgICAgICAgICAgIGxvY2FsT3JhY2xlLmZ1bmN0aW9uTmFtZSA9IHNwbGl0UmVzdWx0WzJdO1xuICAgICAgICAgICAgbG9jYWxPcmFjbGUuZnVuY3Rpb25QYXJhbWV0ZXJzID0gcGFyYW1ldGVycy5nZXQoJ2lucHV0Jyk7XG4gICAgICAgIH0gZWxzZSBjb250cm9sRmxvd0luZm8ubG9jYWxQYXJhbWV0ZXJzLnNldChub2RlSWQsIHBhcmFtZXRlcnMpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzTWFwO1xufTtcblxubGV0IGdldE5vZGVOYW1lID0gKG5vZGU6IGFueSkgPT5cbiAgICBub2RlLm5hbWUgPyBub2RlLm5hbWUucmVwbGFjZSgvXFxzKy9nLCBcIl9cIikgOiBub2RlLmlkO1xuXG5sZXQgcGFyc2VNb2RlbCA9IChtb2RlbEluZm86IE1vZGVsSW5mbykgPT4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHBhcnNlQnBtbihtb2RlbEluZm8uYnBtbilcbiAgICAgICAgICAgIC50aGVuKChkZWZpbml0aW9uczogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgZGVidWcoJ3BhcnNlZCBtb2RlbCcsIGRlZmluaXRpb25zKVxuICAgICAgICAgICAgICAgIG1vZGVsSW5mby5zb2xpZGl0eSA9IFwicHJhZ21hIHNvbGlkaXR5IF4wLjUuNjtcXG5cIjtcbiAgICAgICAgICAgICAgICBtb2RlbEluZm8uY29udHJvbEZsb3dJbmZvTWFwID0gbmV3IE1hcCgpO1xuXG4gICAgICAgICAgICAgICAgLy8gU2FuaXR5IGNoZWNrc1xuICAgICAgICAgICAgICAgIGlmICghZGVmaW5pdGlvbnMuZGlhZ3JhbXMgfHwgZGVmaW5pdGlvbnMuZGlhZ3JhbXMubGVuZ3RoID09IDApXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkVSUk9SOiBObyBkaWFncmFtIGZvdW5kIGluIEJQTU4gZmlsZVwiKTtcbiAgICAgICAgICAgICAgICBsZXQgcHJvYyA9IGRlZmluaXRpb25zLmRpYWdyYW1zWzBdLnBsYW5lLmJwbW5FbGVtZW50O1xuICAgICAgICAgICAgICAgIG1vZGVsSW5mby5uYW1lID0gcHJvYy5uYW1lID8gcHJvYy5uYW1lLnJlcGxhY2UoL1xccysvZywgXCJfXCIpIDogcHJvYy5pZDtcbiAgICAgICAgICAgICAgICBtb2RlbEluZm8uaWQgPSBwcm9jLmlkO1xuICAgICAgICAgICAgICAgIGlmIChwcm9jLiR0eXBlICE9PSBcImJwbW46UHJvY2Vzc1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9jLiR0eXBlID09PSBcImJwbW46Q29sbGFib3JhdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRlZmluaXRpb25zLnJvb3RFbGVtZW50cy5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGVmaW5pdGlvbnMucm9vdEVsZW1lbnRzW2ldLiR0eXBlID09PSBcImJwbW46UHJvY2Vzc1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2MgPSBkZWZpbml0aW9ucy5yb290RWxlbWVudHNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsSW5mby5uYW1lID0gcHJvYy5uYW1lID8gcHJvYy5uYW1lLnJlcGxhY2UoL1xccysvZywgXCJfXCIpIDogcHJvYy5pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWxJbmZvLmlkID0gcHJvYy5pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRVJST1I6IE5vIHJvb3QgcHJvY2VzcyBtb2RlbCBmb3VuZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIEJQTU4gdG8gU29saWRpdHkgcGFyc2luZ1xuXG4gICAgICAgICAgICAgICAgbGV0IGdsb2JhbE5vZGVNYXA6IE1hcDxzdHJpbmcsIGFueT4gPSBuZXcgTWFwKCksXG4gICAgICAgICAgICAgICAgICAgIGdsb2JhbE5vZGVJbmRleE1hcDogTWFwPHN0cmluZywgbnVtYmVyPiA9IG5ldyBNYXAoKSxcbiAgICAgICAgICAgICAgICAgICAgZ2xvYmFsRWRnZUluZGV4TWFwOiBNYXA8c3RyaW5nLCBudW1iZXI+ID0gbmV3IE1hcCgpLFxuICAgICAgICAgICAgICAgICAgICBnbG9iYWxDb250cm9sRmxvd0luZm86IEFycmF5PENvbnRyb2xGbG93SW5mbz4gPSBbXTtcblxuICAgICAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgICAgICAgICAgICAgZ2xvYmFsTm9kZU1hcC5zZXQocHJvYy5pZCwgcHJvYyk7XG4gICAgICAgICAgICAgICAgbGV0IG1haW5Db250cm9sRmxvd0luZm8gPSBjb2xsZWN0Q29udHJvbEZsb3dJbmZvKHByb2MsIGdsb2JhbE5vZGVNYXAsIGdsb2JhbENvbnRyb2xGbG93SW5mbyk7XG4gICAgICAgICAgICAgICAgbGV0IGdsb2JhbENvbnRyb2xGbG93SW5mb01hcDogTWFwPHN0cmluZywgQ29udHJvbEZsb3dJbmZvPiA9IG5ldyBNYXAoKTtcbiAgICAgICAgICAgICAgICBnbG9iYWxDb250cm9sRmxvd0luZm8uZm9yRWFjaChjb250cm9sRmxvd0luZm8gPT5cbiAgICAgICAgICAgICAgICAgICAgZ2xvYmFsQ29udHJvbEZsb3dJbmZvTWFwLnNldChjb250cm9sRmxvd0luZm8uc2VsZi5pZCwgY29udHJvbEZsb3dJbmZvKVxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAvLyBFdmVudCBzdWItcHJvY2Vzc2VzIGFwcGVhciBpbiB0aGUgc291cmNlIGxpc3QsIGFuZCBub3QgaW4gdGhlIG5vZGVMaXN0XG4gICAgICAgICAgICAgICAgLy8gSW4gYWRkaXRpb24sIGFsbCB0aGUgZWxlbWVudHMgb2YgYSBub24gaW50ZXJydXB0aW5nIHN1YnByb2Nlc3MgZXZlbnQgYXBwZWFycyBlbWJlZGRlZCBvbiBpdHMgcGFyZW50IHByb2Nlc3NcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBjb250cm9sRmxvd0luZm8gb2YgZ2xvYmFsQ29udHJvbEZsb3dJbmZvKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBpbmRleGVzVG9SZW1vdmUgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbEZsb3dJbmZvLnNvdXJjZXMuZm9yRWFjaChub2RlSWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdsb2JhbE5vZGVNYXAuZ2V0KG5vZGVJZCkudHJpZ2dlcmVkQnlFdmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xGbG93SW5mby5ub2RlTGlzdC5wdXNoKG5vZGVJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXhlc1RvUmVtb3ZlLnB1c2goY29udHJvbEZsb3dJbmZvLnNvdXJjZXMuaW5kZXhPZihub2RlSWQpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbm9kZUluZm8gPSBnbG9iYWxDb250cm9sRmxvd0luZm9NYXAuZ2V0KG5vZGVJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFnbG9iYWxOb2RlTWFwLmdldChub2RlSW5mby5zb3VyY2VzWzBdKS5pc0ludGVycnVwdGluZylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZUluZm8ubm9kZUxpc3QuZm9yRWFjaChjaGlsZElkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IGNvbnRyb2xGbG93SW5mby5ub2RlTGlzdC5pbmRleE9mKGNoaWxkSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4ID49IDApIGNvbnRyb2xGbG93SW5mby5ub2RlTGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4ZXNUb1JlbW92ZS5zb3J0KChpbmQxLCBpbmQyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5kMiAtIGluZDE7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBpbmRleGVzVG9SZW1vdmUuZm9yRWFjaChpbmRleCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sRmxvd0luZm8uc291cmNlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzKGdsb2JhbE5vZGVNYXAuZ2V0KGNvbnRyb2xGbG93SW5mby5zZWxmLmlkKSwgXCJicG1uOlN1YlByb2Nlc3NcIikgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xGbG93SW5mby5zZWxmLnRyaWdnZXJlZEJ5RXZlbnQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsb2JhbE5vZGVNYXAuZ2V0KGNvbnRyb2xGbG93SW5mby5zb3VyY2VzWzBdKS5pc0ludGVycnVwdGluZyA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbEZsb3dJbmZvLmlzRW1iZWRkZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCBoYXNFeHRlcm5hbENhbGwgPSBub2RlSWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbm9kZSA9IGdsb2JhbE5vZGVNYXAuZ2V0KG5vZGVJZCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpcyhub2RlLCBcImJwbW46U2VydmljZVRhc2tcIik7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIG1vZGVsSW5mby5nbG9iYWxOb2RlTWFwID0gZ2xvYmFsTm9kZU1hcDtcblxuICAgICAgICAgICAgICAgIGZvciAobGV0IGNvbnRyb2xGbG93SW5mbyBvZiBnbG9iYWxDb250cm9sRmxvd0luZm8pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjb250cm9sRmxvd0luZm8uaXNFbWJlZGRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG11bHRpaW5zdGFuY2VBY3Rpdml0aWVzID0gW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbEFjdGl2aXRpZXMgPSBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub25JbnRlcnJ1cHRpbmdFdmVudHMgPSBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRjaGluZ01lc3NhZ2VzID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xGbG93SW5mby5ub2RlTGlzdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAobm9kZUlkID0+IGdsb2JhbE5vZGVNYXAuZ2V0KG5vZGVJZCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZvckVhY2goZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoaXMoZSwgXCJicG1uOlRhc2tcIikgfHwgaXMoZSwgXCJicG1uOlN1YlByb2Nlc3NcIikpICYmIGUubG9vcENoYXJhY3RlcmlzdGljcyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5sb29wQ2hhcmFjdGVyaXN0aWNzLiR0eXBlID09PSBcImJwbW46TXVsdGlJbnN0YW5jZUxvb3BDaGFyYWN0ZXJpc3RpY3NcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbEZsb3dJbmZvLm11bHRpaW5zdGFuY2VBY3Rpdml0aWVzLnNldChlLmlkLCBnZXROb2RlTmFtZShlKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtdWx0aWluc3RhbmNlQWN0aXZpdGllcy5wdXNoKGUuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlzKGUsIFwiYnBtbjpDYWxsQWN0aXZpdHlcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xGbG93SW5mby5jYWxsQWN0aXZpdGllcy5zZXQoZS5pZCwgZ2V0Tm9kZU5hbWUoZSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbEFjdGl2aXRpZXMucHVzaChlLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpcyhlLCBcImJwbW46SW50ZXJtZWRpYXRlQ2F0Y2hFdmVudFwiKSAmJiBpcyhlLmV2ZW50RGVmaW5pdGlvbnNbMF0sIFwiYnBtbjpNZXNzYWdlRXZlbnREZWZpbml0aW9uXCIpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2hpbmdNZXNzYWdlcy5wdXNoKGUuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChpcyhlLCBcImJwbW46U3RhcnRFdmVudFwiKSAmJiBpcyhlLmV2ZW50RGVmaW5pdGlvbnNbMF0sIFwiYnBtbjpNZXNzYWdlRXZlbnREZWZpbml0aW9uXCIpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2hpbmdNZXNzYWdlcy5wdXNoKGUuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJdCBpcyBhbHNvIG5lY2Vzc2FyeSB0byBhZGQgYm91bmRhcnkgZXZlbnRzIG9mIGVtYmVkZGVkIHN1Yi1wcm9jZXNzZXNcblxuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbEZsb3dJbmZvLnNvdXJjZXMuZm9yRWFjaChub2RlSWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdGFydCA9IGdsb2JhbE5vZGVNYXAuZ2V0KG5vZGVJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXJ0LmV2ZW50RGVmaW5pdGlvbnMgJiYgc3RhcnQuZXZlbnREZWZpbml0aW9uc1swXSAmJiBpcyhzdGFydC5ldmVudERlZmluaXRpb25zWzBdLCBcImJwbW46TWVzc2FnZUV2ZW50RGVmaW5pdGlvblwiKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sRmxvd0luZm8ubm9kZUxpc3QuaW5kZXhPZihub2RlSWQpIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sRmxvd0luZm8ubm9kZUxpc3QucHVzaChub2RlSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2F0Y2hpbmdNZXNzYWdlcy5pbmRleE9mKG5vZGVJZCkgPCAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2hpbmdNZXNzYWdlcy5wdXNoKG5vZGVJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xGbG93SW5mby5ib3VuZGFyeUV2ZW50cy5mb3JFYWNoKG5vZGVJZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5vZGUgPSBnbG9iYWxOb2RlTWFwLmdldChub2RlSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub2RlLm91dGdvaW5nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBvdXRnb2luZyBvZiBub2RlLm91dGdvaW5nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbEZsb3dJbmZvLmVkZ2VMaXN0LnB1c2gob3V0Z29pbmcuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghbm9kZS5jYW5jZWxBY3Rpdml0eSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sRmxvd0luZm8ubm9uSW50ZXJydXB0aW5nRXZlbnRzLnNldChub2RlLmlkLCBnZXROb2RlTmFtZShub2RlKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vbkludGVycnVwdGluZ0V2ZW50cy5wdXNoKG5vZGUuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sRmxvd0luZm8ubm9kZUxpc3QucHVzaChub2RlSWQpOyAvLyBFYWdlciByZWluc2VydGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5ldmVudERlZmluaXRpb25zWzBdICYmIGlzKG5vZGUuZXZlbnREZWZpbml0aW9uc1swXSwgJ2JwbW46TWVzc2FnZUV2ZW50RGVmaW5pdGlvbicpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2F0Y2hpbmdNZXNzYWdlcy5pbmRleE9mKG5vZGVJZCkgPCAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoaW5nTWVzc2FnZXMucHVzaChub2RlSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChub2RlLmV2ZW50RGVmaW5pdGlvbnMgJiYgaXMobm9kZS5ldmVudERlZmluaXRpb25zWzBdLCBcImJwbW46TWVzc2FnZUV2ZW50RGVmaW5pdGlvblwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29udHJvbEZsb3dJbmZvLm5vZGVMaXN0LmluZGV4T2Yobm9kZUlkKSA8IDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sRmxvd0luZm8ubm9kZUxpc3QucHVzaChub2RlSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2F0Y2hpbmdNZXNzYWdlcy5pbmRleE9mKG5vZGVJZCkgPCAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2hpbmdNZXNzYWdlcy5wdXNoKG5vZGVJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGdsb2JhbE5vZGVNYXAuZm9yRWFjaChub2RlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXMobm9kZSwgXCJicG1uOlN1YlByb2Nlc3NcIikgJiYgbm9kZS50cmlnZ2VyZWRCeUV2ZW50ICYmIGNvbnRyb2xGbG93SW5mby5ub2RlTGlzdC5pbmRleE9mKG5vZGUuaWQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHN0YXJ0IG9mIG5vZGUuZmxvd0VsZW1lbnRzLmZpbHRlcihlID0+IGlzKGUsIFwiYnBtbjpGbG93Tm9kZVwiKSAmJiBpcyhlLCBcImJwbW46U3RhcnRFdmVudFwiKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGFydC5pc0ludGVycnVwdGluZyA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwYXJlbnQgPSBnbG9iYWxOb2RlTWFwLmdldChzdGFydC4kcGFyZW50LmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sRmxvd0luZm8ubm9uSW50ZXJydXB0aW5nRXZlbnRzLnNldChzdGFydC5pZCwgZ2V0Tm9kZU5hbWUocGFyZW50KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9uSW50ZXJydXB0aW5nRXZlbnRzLnB1c2goc3RhcnQuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xGbG93SW5mby5ub2RlTGlzdC5wdXNoKHN0YXJ0LmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhcnQuZXZlbnREZWZpbml0aW9uc1swXSAmJiBpcyhzdGFydC5ldmVudERlZmluaXRpb25zWzBdLCBcImJwbW46TWVzc2FnZUV2ZW50RGVmaW5pdGlvblwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2F0Y2hpbmdNZXNzYWdlcy5pbmRleE9mKHN0YXJ0LmlkKSA8IDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRjaGluZ01lc3NhZ2VzLnB1c2goc3RhcnQuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb250cm9sRmxvd0luZm8uYm91bmRhcnlFdmVudHMuaW5kZXhPZihzdGFydC5pZCkgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbEZsb3dJbmZvLmJvdW5kYXJ5RXZlbnRzLnB1c2goc3RhcnQuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb250cm9sRmxvd0luZm8ubm9kZUxpc3QuaW5kZXhPZihzdGFydC4kcGFyZW50LmlkKSA8IDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xGbG93SW5mby5ub2RlTGlzdC5wdXNoKHN0YXJ0LiRwYXJlbnQuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXJ0LmV2ZW50RGVmaW5pdGlvbnNbMF0gJiYgaXMoc3RhcnQuZXZlbnREZWZpbml0aW9uc1swXSwgXCJicG1uOk1lc3NhZ2VFdmVudERlZmluaXRpb25cIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29udHJvbEZsb3dJbmZvLm5vZGVMaXN0LmluZGV4T2Yoc3RhcnQuaWQpIDwgMClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbEZsb3dJbmZvLm5vZGVMaXN0LnB1c2goc3RhcnQuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYXRjaGluZ01lc3NhZ2VzLmluZGV4T2Yoc3RhcnQuaWQpIDwgMClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2hpbmdNZXNzYWdlcy5wdXNoKHN0YXJ0LmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGFydC5vdXRnb2luZylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBvdXRnb2luZyBvZiBzdGFydC5vdXRnb2luZylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbEZsb3dJbmZvLmVkZ2VMaXN0LnB1c2gob3V0Z29pbmcuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwYXJ0MTogQXJyYXk8c3RyaW5nPiA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBhcnQyOiBBcnJheTxzdHJpbmc+ID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sRmxvd0luZm8ubm9kZUxpc3QuZm9yRWFjaChub2RlSWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoYXNFeHRlcm5hbENhbGwobm9kZUlkKSkgcGFydDEucHVzaChub2RlSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgcGFydDIucHVzaChub2RlSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sRmxvd0luZm8ubm9kZUxpc3QgPSBwYXJ0MS5jb25jYXQocGFydDIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbEZsb3dJbmZvLm5vZGVMaXN0LmZvckVhY2goXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKG5vZGVJZDogc3RyaW5nLCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBub2RlID0gZ2xvYmFsTm9kZU1hcC5nZXQobm9kZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbEZsb3dJbmZvLm5vZGVJbmRleE1hcC5zZXQobm9kZUlkLCBpbmRleCArIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbG9iYWxOb2RlSW5kZXhNYXAuc2V0KG5vZGVJZCwgaW5kZXggKyAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbEZsb3dJbmZvLm5vZGVOYW1lTWFwLnNldChub2RlSWQsIGdldE5vZGVOYW1lKGdsb2JhbE5vZGVNYXAuZ2V0KG5vZGVJZCkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUuZG9jdW1lbnRhdGlvbiAmJiBub2RlLmRvY3VtZW50YXRpb25bMF0udGV4dCAmJiBub2RlLmRvY3VtZW50YXRpb25bMF0udGV4dC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXMobm9kZSwgJ2JwbW46Q2FsbEFjdGl2aXR5JykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbEZsb3dJbmZvLmV4dGVybmFsQnVuZGxlcy5zZXQobm9kZUlkLCBub2RlLmRvY3VtZW50YXRpb25bMF0udGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0cmFjdFBhcmFtZXRlcnMobm9kZS5kb2N1bWVudGF0aW9uWzBdLnRleHQsIG5vZGUuaWQsIGNvbnRyb2xGbG93SW5mbyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbEZsb3dJbmZvLmVkZ2VMaXN0LmZvckVhY2goXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGVkZ2VJZDogc3RyaW5nLCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xGbG93SW5mby5lZGdlSW5kZXhNYXAuc2V0KGVkZ2VJZCwgaW5kZXggKyAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2xvYmFsRWRnZUluZGV4TWFwLnNldChlZGdlSWQsIGluZGV4ICsgMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xGbG93SW5mby5jYXRjaGluZ01lc3NhZ2VzID0gY2F0Y2hpbmdNZXNzYWdlcztcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ29udHJvbEZsb3cgUGVyc3BlY3RpdmU6IEdlbmVyYXRpb24gb2YgU21hcnQgQ29udHJhY3RzXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY29kZUdlbmVyYXRpb25JbmZvID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVMaXN0OiBjb250cm9sRmxvd0luZm8ubm9kZUxpc3QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZU1hcDogZ2xvYmFsTm9kZU1hcCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRjaGluZ01lc3NhZ2VzOiBjb250cm9sRmxvd0luZm8uY2F0Y2hpbmdNZXNzYWdlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtdWx0aWluc3RhbmNlQWN0aXZpdGllczogbXVsdGlpbnN0YW5jZUFjdGl2aXRpZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbEFjdGl2aXRpZXM6IGNhbGxBY3Rpdml0aWVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vbkludGVycnVwdGluZ0V2ZW50czogbm9uSW50ZXJydXB0aW5nRXZlbnRzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yYWNsZUluZm86IGNvbnRyb2xGbG93SW5mby5vcmFjbGVJbmZvLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yYWNsZVRhc2tNYXA6IGNvbnRyb2xGbG93SW5mby5vcmFjbGVUYXNrTWFwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2Nlc3NJZDogKCkgPT4gY29udHJvbEZsb3dJbmZvLnNlbGYuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZU5hbWU6IG5vZGVJZCA9PiBnZXROb2RlTmFtZShnbG9iYWxOb2RlTWFwLmdldChub2RlSWQpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudFR5cGU6IG5vZGVJZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBub2RlID0gZ2xvYmFsTm9kZU1hcC5nZXQobm9kZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUuZXZlbnREZWZpbml0aW9ucyAmJiBub2RlLmV2ZW50RGVmaW5pdGlvbnNbMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjYWQgPSBub2RlLmV2ZW50RGVmaW5pdGlvbnNbMF0uJHR5cGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FkLnN1YnN0cmluZyg1LCBjYWQubGVuZ3RoIC0gMTUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIkRlZmF1bHRcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbEV2ZW50VHlwZXM6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRha2VuID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsb2JhbE5vZGVNYXAuZm9yRWFjaChub2RlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub2RlLmV2ZW50RGVmaW5pdGlvbnMgJiYgbm9kZS5ldmVudERlZmluaXRpb25zWzBdICYmICFpcyhub2RlLmV2ZW50RGVmaW5pdGlvbnNbMF0sIFwiYnBtbjpUZXJtaW5hdGVFdmVudERlZmluaXRpb25cIikgJiYgIWlzKG5vZGUuZXZlbnREZWZpbml0aW9uc1swXSwgXCJicG1uOk1lc3NhZ2VFdmVudERlZmluaXRpb25cIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2FkID0gbm9kZS5ldmVudERlZmluaXRpb25zWzBdLiR0eXBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YWtlbi5pbmRleE9mKGNhZC5zdWJzdHJpbmcoNSwgY2FkLmxlbmd0aCAtIDE1KSkgPCAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWtlbi5wdXNoKGNhZC5zdWJzdHJpbmcoNSwgY2FkLmxlbmd0aCAtIDE1KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFrZW47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRNZXNzYWdlczogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGFrZW4gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNhbmRpZGF0ZXMgPSBjb250cm9sRmxvd0luZm8uYm91bmRhcnlFdmVudHM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xGbG93SW5mby5ub2RlTGlzdC5mb3JFYWNoKG5vZGVJZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXMoZ2xvYmFsTm9kZU1hcC5nZXQobm9kZUlkKSwgXCJicG1uOlN1YlByb2Nlc3NcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgc3ViUCA9IGdsb2JhbENvbnRyb2xGbG93SW5mb01hcC5nZXQobm9kZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5kaWRhdGVzID0gY2FuZGlkYXRlcy5jb25jYXQoc3ViUC5ib3VuZGFyeUV2ZW50cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3ViUC5zb3VyY2VzLmZvckVhY2goaWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzKGdsb2JhbE5vZGVNYXAuZ2V0KGlkKSwgXCJicG1uOlN1YnByb2Nlc3NcIikgJiYgY2FuZGlkYXRlcy5pbmRleE9mKGlkKSA8IDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5kaWRhdGVzLnB1c2goaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuZGlkYXRlcy5mb3JFYWNoKGV2dElkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBldnQgPSBnbG9iYWxOb2RlTWFwLmdldChldnRJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXZ0LmV2ZW50RGVmaW5pdGlvbnMgJiYgZXZ0LmV2ZW50RGVmaW5pdGlvbnNbMF0gJiYgaXMoZXZ0LmV2ZW50RGVmaW5pdGlvbnNbMF0sIFwiYnBtbjpNZXNzYWdlRXZlbnREZWZpbml0aW9uXCIpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRha2VuLnB1c2goZXZ0SWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRha2VuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0VGhyb3dpbmdNZXNzYWdlczogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xGbG93SW5mby5ub2RlTGlzdC5mb3JFYWNoKG5vZGVJZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbm9kZSA9IGdsb2JhbE5vZGVNYXAuZ2V0KG5vZGVJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGlzKG5vZGUsIFwiYnBtbjpFbmRFdmVudFwiKSB8fCBpcyhub2RlLCBcImJwbW46SW50ZXJtZWRpYXRlVGhyb3dFdmVudFwiKSkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlLmV2ZW50RGVmaW5pdGlvbnMgJiYgbm9kZS5ldmVudERlZmluaXRpb25zWzBdICYmIGlzKG5vZGUuZXZlbnREZWZpbml0aW9uc1swXSwgXCJicG1uOk1lc3NhZ2VFdmVudERlZmluaXRpb25cIikpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnB1c2gobm9kZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRUaHJvd2luZ0V2ZW50czogKHN1YnByb2NJZCwgZXZUeXBlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2xvYmFsTm9kZU1hcC5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUuZXZlbnREZWZpbml0aW9ucyAmJiBub2RlLmV2ZW50RGVmaW5pdGlvbnNbMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2FkID0gbm9kZS5ldmVudERlZmluaXRpb25zWzBdLiR0eXBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWQuc3Vic3RyaW5nKDUsIGNhZC5sZW5ndGggLSAxNSkgPT09IGV2VHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGlzKG5vZGUsIFwiYnBtbjpFbmRFdmVudFwiKSB8fCBpcyhub2RlLCBcImJwbW46SW50ZXJtZWRpYXRlVGhyb3dFdmVudFwiKSkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChub2RlLiRwYXJlbnQuaWQgPT09IHN1YnByb2NJZCB8fCBjb250cm9sRmxvd0luZm8ubm9kZUxpc3QuaW5kZXhPZihub2RlLmlkKSA+PSAwKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnB1c2gobm9kZS5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0Q2F0Y2hpbmdFdmVudHM6IChzdWJwcm9jSWQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbG9iYWxOb2RlTWFwLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5ldmVudERlZmluaXRpb25zICYmIG5vZGUuZXZlbnREZWZpbml0aW9uc1swXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpcyhub2RlLCBcImJwbW46U3RhcnRFdmVudFwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcGFyZW50ID0gZ2xvYmFsTm9kZU1hcC5nZXQobm9kZS4kcGFyZW50LmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmVudC50cmlnZ2VyZWRCeUV2ZW50ICYmIHBhcmVudC4kcGFyZW50LmlkID09PSBzdWJwcm9jSWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMudW5zaGlmdChub2RlLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoIXBhcmVudC50cmlnZ2VyZWRCeUV2ZW50ICYmIChwYXJlbnQuaWQgPT09IHN1YnByb2NJZCB8fCBjb250cm9sRmxvd0luZm8ubm9kZUxpc3QuaW5kZXhPZihwYXJlbnQuaWQpID4gLTEpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnB1c2gobm9kZS5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpcyhub2RlLCBcImJwbW46Qm91bmRhcnlFdmVudFwiKSB8fCBpcyhub2RlLCBcImJwbW46SW50ZXJtZWRpYXRlQ2F0Y2hFdmVudFwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS4kcGFyZW50LmlkID09PSBzdWJwcm9jSWQgfHwgY29udHJvbEZsb3dJbmZvLm5vZGVMaXN0LmluZGV4T2Yobm9kZS4kcGFyZW50LmlkKSA+IC0xKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnB1c2gobm9kZS5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldFRlcm1pbmF0ZUNhbmRpZGF0ZXM6IChzdWJwcm9jSWQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdsb2JhbE5vZGVNYXAuZm9yRWFjaChub2RlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5ldmVudERlZmluaXRpb25zICYmIG5vZGUuZXZlbnREZWZpbml0aW9uc1swXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXMobm9kZSwgXCJicG1uOkJvdW5kYXJ5RXZlbnRcIikgJiYgbm9kZS5jYW5jZWxBY3Rpdml0eSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihnbG9iYWxDb250cm9sRmxvd0luZm9NYXAuaGFzKG5vZGUuaWQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxvY2FsQyA9IGdsb2JhbENvbnRyb2xGbG93SW5mb01hcC5nZXQobm9kZS5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYWxDLm5vZGVMaXN0LmZvckVhY2goZWxlbUlkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZWxlbSA9IGdsb2JhbE5vZGVNYXAuZ2V0KGVsZW1JZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoZWxlbS5ldmVudERlZmluaXRpb25zICYmIGlzKGVsZW0uZXZlbnREZWZpbml0aW9uc1swXSwgXCJicG1uOlRlcm1pbmF0ZUV2ZW50RGVmaW5pdGlvblwiKSAmJiBlbGVtLiRwYXJlbnQuaWQgPT09IG5vZGUuJHBhcmVudC5pZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnB1c2gobm9kZS5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlYnVnKCdNaXNzaW5nIE5vbiBJbnRlcnJ1cHRpbmcgZXZlbnQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0UHJvY2Vzc0NhbmRpZGF0ZXNNYXNrRnJvbTogKGV2dElkLCBldnRUeXBlLCBldnRDb2RlLCBzb3VyY2VQcm9jZXNzZXMsIGFsbEV2ZW50cykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZXZlbnRMaXN0ID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBiaXRhcnJheSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGxFdmVudHMuZm9yRWFjaChub2RlSWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNhZCA9IGdsb2JhbE5vZGVNYXAuZ2V0KG5vZGVJZCkuZXZlbnREZWZpbml0aW9uc1swXS4kdHlwZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChldnRUeXBlID09PSBjYWQuc3Vic3RyaW5nKDUsIGNhZC5sZW5ndGggLSAxNSkgJiYgZXZ0Q29kZSA9PT0gZ2V0Tm9kZU5hbWUoZ2xvYmFsTm9kZU1hcC5nZXQobm9kZUlkKSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRMaXN0LnB1c2gobm9kZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZVByb2Nlc3Nlcy5mb3JFYWNoKHByb2NJZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcGFyZW50ID0gZ2xvYmFsTm9kZU1hcC5nZXQocHJvY0lkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwcmV2aW91c1BhcmVudCA9IHBhcmVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBldmVudEZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAoIWV2ZW50Rm91bmQgJiYgcmVzLmxlbmd0aCA9PSAwICYmIHBhcmVudC4kcGFyZW50ICYmIGNvbnRyb2xGbG93SW5mby5zZWxmLmlkICE9PSBwYXJlbnQuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQgPSBnbG9iYWxOb2RlTWFwLmdldChwYXJlbnQuJHBhcmVudC5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRMaXN0LmZvckVhY2gobm9kZUlkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5vZGUgPSBnbG9iYWxOb2RlTWFwLmdldChub2RlSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWV2ZW50Rm91bmQgJiYgaXMobm9kZSwgXCJicG1uOkJvdW5kYXJ5RXZlbnRcIikgJiYgbm9kZS5hdHRhY2hlZFRvUmVmLmlkID09PSBwcmV2aW91c1BhcmVudC5pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRGb3VuZCA9IG5vZGUuY2FuY2VsQWN0aXZpdHkgIT0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnRGb3VuZCkgcmVzID0gW25vZGVJZF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHJlcy5wdXNoKG5vZGVJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50TGlzdC5mb3JFYWNoKG5vZGVJZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbm9kZSA9IGdsb2JhbE5vZGVNYXAuZ2V0KG5vZGVJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWV2ZW50Rm91bmQgJiYgaXMobm9kZSwgXCJicG1uOlN0YXJ0RXZlbnRcIikgJiYgbm9kZS4kcGFyZW50LnRyaWdnZXJlZEJ5RXZlbnQgJiYgbm9kZS4kcGFyZW50LiRwYXJlbnQuaWQgPT09IHBhcmVudC5pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50Rm91bmQgPSBub2RlLmlzSW50ZXJydXB0aW5nICE9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChldmVudEZvdW5kKSByZXMgPSBbbm9kZUlkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHJlcy5wdXNoKG5vZGVJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXZpb3VzUGFyZW50ID0gcGFyZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy5pbmRleE9mKGV2dElkKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiaXRhcnJheVtnbG9iYWxOb2RlSW5kZXhNYXAuZ2V0KHByb2NJZCldID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXN1bHQgPSBcIjBiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSBiaXRhcnJheS5sZW5ndGggLSAxOyBpID49IDA7IGktLSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBiaXRhcnJheVtpXSA/IFwiMVwiIDogXCIwXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQgPT09IFwiMGJcIiA/IDAgOiBuZXcgQmlnTnVtYmVyKHJlc3VsdCkudG9GaXhlZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0Q2F0Y2hpbmdFdmVudHNGcm9tOiAocHJvY0lkLCBldnRUeXBlLCBldnRDb2RlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEVzY2FsYXRpb24gYW5kIEVycm9yIGNhdGNoaW5nIGV2ZW50cy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTm8gaW50ZXJtZWRpYXRlIGV2ZW50cyBpbiBub3JtYWwgZmxvdyBhbGxvd2VkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHBhcmVudCA9IGdsb2JhbE5vZGVNYXAuZ2V0KHByb2NJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBldmVudEZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjYW5kaWRhdGVzID0gY29udHJvbEZsb3dJbmZvLmJvdW5kYXJ5RXZlbnRzLmNvbmNhdChjb250cm9sRmxvd0luZm8ubm9kZUxpc3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZXZlbnRMaXN0ID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbmRpZGF0ZXMuZm9yRWFjaChub2RlSWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5vZGUgPSBnbG9iYWxOb2RlTWFwLmdldChub2RlSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUuZXZlbnREZWZpbml0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjYWQgPSBub2RlLmV2ZW50RGVmaW5pdGlvbnNbMF0uJHR5cGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHR5cGUgPSBjYWQuc3Vic3RyaW5nKDUsIGNhZC5sZW5ndGggLSAxNSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09IGV2dFR5cGUgJiYgZXZ0Q29kZSA9PT0gZ2V0Tm9kZU5hbWUoZ2xvYmFsTm9kZU1hcC5nZXQobm9kZUlkKSkgJiYgZXZlbnRMaXN0LmluZGV4T2Yobm9kZUlkKSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRMaXN0LnB1c2gobm9kZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXBhcmVudC50cmlnZ2VyZWRCeUV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudExpc3QuZm9yRWFjaChub2RlSWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBub2RlID0gZ2xvYmFsTm9kZU1hcC5nZXQobm9kZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWV2ZW50Rm91bmQgJiYgaXMobm9kZSwgXCJicG1uOlN0YXJ0RXZlbnRcIikgJiYgbm9kZS4kcGFyZW50LnRyaWdnZXJlZEJ5RXZlbnQgJiYgbm9kZS4kcGFyZW50LiRwYXJlbnQuaWQgPT09IHBhcmVudC5pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudEZvdW5kID0gbm9kZS5pc0ludGVycnVwdGluZyAhPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50Rm91bmQpIHJlcyA9IFtub2RlSWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHJlcy5wdXNoKG5vZGVJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRyb2xGbG93SW5mby5zZWxmLmlkID09PSBwcm9jSWQgfHwgcmVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFyZW50LnRyaWdnZXJlZEJ5RXZlbnQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50ID0gZ2xvYmFsTm9kZU1hcC5nZXQocGFyZW50LiRwYXJlbnQuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHByZXZpb3VzUGFyZW50ID0gcGFyZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKCFldmVudEZvdW5kICYmIHJlcy5sZW5ndGggPT0gMCAmJiBwYXJlbnQuJHBhcmVudCAmJiBjb250cm9sRmxvd0luZm8uc2VsZi5pZCAhPT0gcGFyZW50LmlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50ID0gZ2xvYmFsTm9kZU1hcC5nZXQocGFyZW50LiRwYXJlbnQuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50TGlzdC5mb3JFYWNoKG5vZGVJZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBub2RlID0gZ2xvYmFsTm9kZU1hcC5nZXQobm9kZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFldmVudEZvdW5kICYmIGlzKG5vZGUsIFwiYnBtbjpCb3VuZGFyeUV2ZW50XCIpICYmIG5vZGUuYXR0YWNoZWRUb1JlZi5pZCA9PT0gcHJldmlvdXNQYXJlbnQuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50Rm91bmQgPSBub2RlLmNhbmNlbEFjdGl2aXR5ICE9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50Rm91bmQpIHJlcyA9IFtub2RlSWRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSByZXMucHVzaChub2RlSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudExpc3QuZm9yRWFjaChub2RlSWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5vZGUgPSBnbG9iYWxOb2RlTWFwLmdldChub2RlSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFldmVudEZvdW5kICYmIGlzKG5vZGUsIFwiYnBtbjpTdGFydEV2ZW50XCIpICYmIG5vZGUuJHBhcmVudC50cmlnZ2VyZWRCeUV2ZW50ICYmIG5vZGUuJHBhcmVudC4kcGFyZW50LmlkID09PSBwYXJlbnQuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudEZvdW5kID0gbm9kZS5pc0ludGVycnVwdGluZyAhPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnRGb3VuZCkgcmVzID0gW25vZGVJZF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSByZXMucHVzaChub2RlSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2aW91c1BhcmVudCA9IHBhcmVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldFdvcmtJdGVtc0dyb3VwQnlQYXJhbWV0ZXJzOiAoaXNJbnB1dCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmFtZTJJZHM6IE1hcDxzdHJpbmcsIHN0cmluZ1tdPiA9IG5ldyBNYXAoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbEZsb3dJbmZvLm5vZGVMaXN0LmZvckVhY2gobm9kZUlkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBub2RlID0gZ2xvYmFsTm9kZU1hcC5nZXQobm9kZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpcyhub2RlLCAnYnBtbjpVc2VyVGFzaycpIHx8IGlzKG5vZGUsICdicG1uOlJlY2VpdmVUYXNrJykgfHwgY2F0Y2hpbmdNZXNzYWdlcy5pbmRleE9mKG5vZGVJZCkgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwYXJhbXMgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub2RlLmRvY3VtZW50YXRpb24gJiYgbm9kZS5kb2N1bWVudGF0aW9uWzBdLnRleHQgJiYgbm9kZS5kb2N1bWVudGF0aW9uWzBdLnRleHQubGVuZ3RoID4gMCAmJiBleHRyYWN0UGFyYW1ldGVycyhub2RlLmRvY3VtZW50YXRpb25bMF0udGV4dCwgbm9kZUlkLCBudWxsKSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBsb2NhbFBhcmFtcyA9IGlzSW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gZXh0cmFjdFBhcmFtZXRlcnMobm9kZS5kb2N1bWVudGF0aW9uWzBdLnRleHQsIG5vZGVJZCwgbnVsbCkuZ2V0KFwiaW5wdXRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogZXh0cmFjdFBhcmFtZXRlcnMobm9kZS5kb2N1bWVudGF0aW9uWzBdLnRleHQsIG5vZGVJZCwgbnVsbCkuZ2V0KFwib3V0cHV0XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobG9jYWxQYXJhbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zID0gbG9jYWxQYXJhbXNbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMjsgaSA8IGxvY2FsUGFyYW1zLmxlbmd0aDsgaSArPSAyKSBwYXJhbXMgKz0gbG9jYWxQYXJhbXNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBnZXROb2RlTmFtZShnbG9iYWxOb2RlTWFwLmdldChub2RlSWQpKSArIHBhcmFtcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW5hbWUySWRzLmhhcyhuYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lMklkcy5zZXQobmFtZSwgW10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lMklkcy5nZXQobmFtZSkucHVzaChub2RlSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5hbWUySWRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0Q29udHJhY3RzMkNhbGw6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlcyA9IGNhbGxBY3Rpdml0aWVzLmNvbmNhdChtdWx0aWluc3RhbmNlQWN0aXZpdGllcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vbkludGVycnVwdGluZ0V2ZW50cy5mb3JFYWNoKGV2dElkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBub2RlID0gZ2xvYmFsTm9kZU1hcC5nZXQoZXZ0SWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnB1c2goaXMobm9kZSwgXCJicG1uOlN0YXJ0RXZlbnRcIikgPyBub2RlLiRwYXJlbnQuaWQgOiBldnRJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0Q29udHJhY3RzMkNhbGxGcm9tOiAoc3VicHJvY0lkLCBjYW5kaWRhdGVzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXMgPSBbc3VicHJvY0lkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjb250cm9sRmxvd0luZm8uY2FsbEFjdGl2aXRpZXMuaGFzKHN1YnByb2NJZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbmRpZGF0ZXMuZm9yRWFjaChub2RlSWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBub2RlID0gZ2xvYmFsTm9kZU1hcC5nZXQobm9kZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAobm9kZS4kcGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub2RlLiRwYXJlbnQuaWQgPT09IHN1YnByb2NJZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnB1c2gobm9kZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUgPSBub2RlLiRwYXJlbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldENvbnRyYWN0czJDYWxsTWFza0Zyb206IChzdWJwcm9jSWQsIGNhbmRpZGF0ZXMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGJpdGFycmF5ID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbmRpZGF0ZXMuZm9yRWFjaChub2RlSWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5vZGUgPSBnbG9iYWxOb2RlTWFwLmdldChub2RlSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKG5vZGUuJHBhcmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub2RlLiRwYXJlbnQuaWQgPT09IHN1YnByb2NJZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiaXRhcnJheVtnbG9iYWxOb2RlSW5kZXhNYXAuZ2V0KG5vZGVJZCldID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUgPSBub2RlLiRwYXJlbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gXCIwYlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gYml0YXJyYXkubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gYml0YXJyYXlbaV0gPyBcIjFcIiA6IFwiMFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0ID09PSBcIjBiXCIgPyAwIDogbmV3IEJpZ051bWJlcihyZXN1bHQpLnRvRml4ZWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldENvbnRyYWN0czJDYWxsQXJyYXk6IChzdWJwcm9jSWQsIGNhbmRpZGF0ZXMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlcyA9ICdbdWludCgnICsgZ2xvYmFsTm9kZUluZGV4TWFwLmdldChjYW5kaWRhdGVzWzBdKSArICcpJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBjYW5kaWRhdGVzLmxlbmd0aDsgaSsrKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzICs9ICcsIHVpbnQoJyArIGdsb2JhbE5vZGVJbmRleE1hcC5nZXQoY2FuZGlkYXRlc1tpXSkgKyAnKSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXMgKyAnXSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRQb3NzaWJsZUtpbGxTdWJwcm9jZXNzOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbEZsb3dJbmZvLmJvdW5kYXJ5RXZlbnRzLmZvckVhY2gobm9kZUlkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBub2RlID0gZ2xvYmFsTm9kZU1hcC5nZXQobm9kZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub2RlLiRwYXJlbnQudHJpZ2dlcmVkQnlFdmVudCAmJiBub2RlLiRwYXJlbnQuJHBhcmVudC5pZCAhPT0gY29udHJvbEZsb3dJbmZvLnNlbGYuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5pc0ludGVycnVwdGluZyAhPSBmYWxzZSAmJiByZXMuaW5kZXhPZihub2RlLiRwYXJlbnQuJHBhcmVudC5pZCkgPCAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMucHVzaChub2RlLiRwYXJlbnQuJHBhcmVudC5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG5vZGUuYXR0YWNoZWRUb1JlZikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhdHRhY2hlZFRvID0gbm9kZS5hdHRhY2hlZFRvUmVmLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub2RlLmNhbmNlbEFjdGl2aXR5ICE9IGZhbHNlICYmIHJlcy5pbmRleE9mKGF0dGFjaGVkVG8pIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMucHVzaChhdHRhY2hlZFRvKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbG9iYWxOb2RlTWFwLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5ldmVudERlZmluaXRpb25zICYmIG5vZGUuZXZlbnREZWZpbml0aW9uc1swXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpcyhub2RlLCBcImJwbW46Qm91bmRhcnlFdmVudFwiKSAmJiBub2RlLmNhbmNlbEFjdGl2aXR5ID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoZ2xvYmFsQ29udHJvbEZsb3dJbmZvTWFwLmhhcyhub2RlLmlkKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxvY2FsQyA9IGdsb2JhbENvbnRyb2xGbG93SW5mb01hcC5nZXQobm9kZS5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbEMubm9kZUxpc3QuZm9yRWFjaChlbGVtSWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGVsZW0gPSBnbG9iYWxOb2RlTWFwLmdldChlbGVtSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoZWxlbS5ldmVudERlZmluaXRpb25zICYmIGlzKGVsZW0uZXZlbnREZWZpbml0aW9uc1swXSwgXCJicG1uOlRlcm1pbmF0ZUV2ZW50RGVmaW5pdGlvblwiKSAmJiBlbGVtLiRwYXJlbnQuaWQgPT09IG5vZGUuJHBhcmVudC5pZCAmJiBjb250cm9sRmxvd0luZm8ubm9kZUxpc3QuaW5kZXhPZihub2RlLiRwYXJlbnQuaWQpID49IDAgJiYgcmVzLmluZGV4T2Yobm9kZS4kcGFyZW50LmlkKSA8IDAgJiYgbm9kZS4kcGFyZW50LmlkICE9IGNvbnRyb2xGbG93SW5mby5zZWxmLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnB1c2gobm9kZS4kcGFyZW50LmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xGbG93SW5mby5ub2RlTGlzdC5mb3JFYWNoKG5vZGVJZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbm9kZSA9IGdsb2JhbE5vZGVNYXAuZ2V0KG5vZGVJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5ldmVudERlZmluaXRpb25zICYmIGlzKG5vZGUuZXZlbnREZWZpbml0aW9uc1swXSwgXCJicG1uOlRlcm1pbmF0ZUV2ZW50RGVmaW5pdGlvblwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihyZXMuaW5kZXhPZihub2RlLiRwYXJlbnQuaWQpIDwgMCAmJiBub2RlLiRwYXJlbnQuaWQgIT0gY29udHJvbEZsb3dJbmZvLnNlbGYuaWQgJiYgIWlzKGdsb2JhbE5vZGVNYXAuZ2V0KGNvbnRyb2xGbG93SW5mby5zZWxmLmlkKSwgXCJicG1uOkJvdW5kYXJ5RXZlbnRcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlYnVnKCdJIGFtIGhlcmUgMicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnB1c2gobm9kZS4kcGFyZW50LmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldENvdW50RXh0ZXJuYWxUYXNrczogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbEZsb3dJbmZvLm5vZGVMaXN0LmZvckVhY2gobm9kZUlkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoYXNFeHRlcm5hbENhbGwobm9kZUlkKSkgcmVzKys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0U3RhcnRlZE1lc3NhZ2VzOiBwcm9jZXNzSWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xGbG93SW5mby5ub2RlTGlzdC5mb3JFYWNoKG5vZGVJZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbm9kZSA9IGdsb2JhbE5vZGVNYXAuZ2V0KG5vZGVJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXMobm9kZSwgXCJicG1uOlN0YXJ0RXZlbnRcIikgJiYgbm9kZS4kcGFyZW50LmlkID09PSBwcm9jZXNzSWQgJiYgbm9kZS5ldmVudERlZmluaXRpb25zXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJiYgaXMobm9kZS5ldmVudERlZmluaXRpb25zWzBdLCBcImJwbW46TWVzc2FnZUV2ZW50RGVmaW5pdGlvblwiKSAmJiBnbG9iYWxOb2RlTWFwLmdldChub2RlLiRwYXJlbnQuaWQpLnRyaWdnZXJlZEJ5RXZlbnQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnB1c2gobm9kZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRQYXJlbnQ6IG5vZGVJZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJldHJpZXZlcyB0aGUgaWQgb2YgdGhlIHBhcmVudFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbm9kZSA9IGdsb2JhbE5vZGVNYXAuZ2V0KG5vZGVJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpcyhub2RlLCBcImJwbW46U3RhcnRFdmVudFwiKSAmJiBub2RlLiRwYXJlbnQgJiYgZ2xvYmFsTm9kZU1hcC5nZXQobm9kZS4kcGFyZW50LmlkKS50cmlnZ2VyZWRCeUV2ZW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdsb2JhbE5vZGVNYXAuZ2V0KG5vZGUuJHBhcmVudC5pZCkuJHBhcmVudC5pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzKG5vZGUsIFwiYnBtbjpCb3VuZGFyeUV2ZW50XCIpICYmIG5vZGUuY2FuY2VsQWN0aXZpdHkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbm9kZS5hdHRhY2hlZFRvUmVmLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbm9kZS4kcGFyZW50ID8gbm9kZS4kcGFyZW50LmlkIDogbm9kZUlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0Q29udHJhY3ROYW1lOiBub2RlSWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBSZXRyaWV2ZXMgdGhlIGNvbnRyYWN0IG5hbWUgcmVsYXRlZCB0byB0aGUgbm9kZS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5vZGUgPSBnbG9iYWxOb2RlTWFwLmdldChub2RlSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXMobm9kZSwgXCJicG1uOlN0YXJ0RXZlbnRcIikgJiYgbm9kZS4kcGFyZW50ICYmIGdsb2JhbE5vZGVNYXAuZ2V0KG5vZGUuJHBhcmVudC5pZCkudHJpZ2dlcmVkQnlFdmVudClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBub2RlLiRwYXJlbnQuaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpcyhub2RlLCBcImJwbW46Qm91bmRhcnlFdmVudFwiKSkgcmV0dXJuIG5vZGUuaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb250cm9sRmxvd0luZm8uc2VsZi5pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldEFsbENoaWxkcmVuOiAoc3VicHJvY0lkLCBkaXJlY3QpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRha2VuID0gZGlyZWN0ID8gW10gOiBbc3VicHJvY0lkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbEZsb3dJbmZvLm5vZGVMaXN0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKG5vZGVJZCA9PiBnbG9iYWxOb2RlTWFwLmdldChub2RlSWQpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZvckVhY2goZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzKGUsIFwiYnBtbjpTdWJQcm9jZXNzXCIpIHx8IGNhbGxBY3Rpdml0aWVzLmluZGV4T2YoZS5pZCkgPj0gMCB8fCAobm9uSW50ZXJydXB0aW5nRXZlbnRzLmluZGV4T2YoZS5pZCkgPj0gMCAmJiAhaXMoZSwgXCJicG1uOlN0YXJ0RXZlbnRcIikpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKChkaXJlY3QgJiYgc3VicHJvY0lkICE9PSBlLmlkICYmIGUuJHBhcmVudC5pZCA9PT0gc3VicHJvY0lkKSB8fCAhZGlyZWN0KSAmJiB0YWtlbi5pbmRleE9mKGUuaWQpIDwgMClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRha2VuLnB1c2goZS5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRha2VuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNTdGFydGluZ0NvbnRyYWN0RXZlbnQ6IChldmVudElkLCBwcm9jZXNzSWQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGV2dCA9IGdsb2JhbE5vZGVNYXAuZ2V0KGV2ZW50SWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXMoZXZ0LCBcImJwbW46U3RhcnRFdmVudFwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdsb2JhbE5vZGVNYXAuZ2V0KGV2dC4kcGFyZW50LmlkKS50cmlnZ2VyZWRCeUV2ZW50KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBldnQuJHBhcmVudC5pZCAhPT0gcHJvY2Vzc0lkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzKGV2dC5ldmVudERlZmluaXRpb25zWzBdLCBcImJwbW46TWVzc2FnZUV2ZW50RGVmaW5pdGlvblwiKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpcyhldnQsIFwiYnBtbjpCb3VuZGFyeUV2ZW50XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXZlbnRJZCAhPT0gcHJvY2Vzc0lkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlzKGV2dCwgXCJicG1uOkludGVybWVkaWF0ZUNhdGNoRXZlbnRcIikgJiYgaXMoZXZ0LmV2ZW50RGVmaW5pdGlvbnNbMF0sIFwiYnBtbjpNZXNzYWdlRXZlbnREZWZpbml0aW9uXCIpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzSW50ZXJydXB0aW5nOiBldmVudElkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVHJ1ZSBpZiBhbiBldmVudCBpcyBpbnRlcnJ1cHRpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5vZGUgPSBnbG9iYWxOb2RlTWFwLmdldChldmVudElkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUuZXZlbnREZWZpbml0aW9ucyAmJiBpcyhub2RlLmV2ZW50RGVmaW5pdGlvbnNbMF0sIFwiYnBtbjpFcnJvckV2ZW50RGVmaW5pdGlvblwiKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXMobm9kZSwgXCJicG1uOlN0YXJ0RXZlbnRcIikgJiYgbm9kZS4kcGFyZW50ICYmIGdsb2JhbE5vZGVNYXAuZ2V0KG5vZGUuJHBhcmVudC5pZCkudHJpZ2dlcmVkQnlFdmVudClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBub2RlLmlzSW50ZXJydXB0aW5nICE9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXMobm9kZSwgXCJicG1uOkJvdW5kYXJ5RXZlbnRcIikpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbm9kZS5jYW5jZWxBY3Rpdml0eSAhPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNFbWJlZGRlZFN1YnByb2Nlc3M6IHN1YnByb2Nlc3NJZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBnbG9iYWxDb250cm9sRmxvd0luZm9NYXAuZ2V0KHN1YnByb2Nlc3NJZCkuaXNFbWJlZGRlZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQm91bmRhcnlFdmVudDogZXZ0SWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29udHJvbEZsb3dJbmZvLmJvdW5kYXJ5RXZlbnRzLmluZGV4T2YoZXZ0SWQpID49IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVNYXJraW5nOiBub2RlSWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbm9kZSA9IGdsb2JhbE5vZGVNYXAuZ2V0KG5vZGVJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBiaXRhcnJheSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5pbmNvbWluZylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGluY29taW5nIG9mIG5vZGUuaW5jb21pbmcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYml0YXJyYXlbY29udHJvbEZsb3dJbmZvLmVkZ2VJbmRleE1hcC5nZXQoaW5jb21pbmcuaWQpXSA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgYml0YXJyYXlbMF0gPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gXCIwYlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gYml0YXJyYXkubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gYml0YXJyYXlbaV0gPyBcIjFcIiA6IFwiMFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEJpZ051bWJlcihyZXN1bHQpLnRvRml4ZWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc3RNYXJraW5nOiBub2RlSWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbm9kZSA9IGdsb2JhbE5vZGVNYXAuZ2V0KG5vZGVJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBiaXRhcnJheSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gXCIwYlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5vdXRnb2luZylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IG91dGdvaW5nIG9mIG5vZGUub3V0Z29pbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiaXRhcnJheVtjb250cm9sRmxvd0luZm8uZWRnZUluZGV4TWFwLmdldChvdXRnb2luZy5pZCldID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSByZXN1bHQgPSBcIjBcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IGJpdGFycmF5Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9IGJpdGFycmF5W2ldID8gXCIxXCIgOiBcIjBcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBCaWdOdW1iZXIocmVzdWx0KS50b0ZpeGVkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJwcm9jZXNzTm9kZU1hcmtpbmc6IHN1YnByb2Nlc3NJZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBiaXRhcnJheSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbG9iYWxOb2RlTWFwLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS4kcGFyZW50ICYmIG5vZGUuJHBhcmVudC5pZCA9PT0gc3VicHJvY2Vzc0lkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzKG5vZGUsIFwiYnBtbjpUYXNrXCIpIHx8IGlzKG5vZGUsICdicG1uOlN1YlByb2Nlc3MnKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYml0YXJyYXlbZ2xvYmFsTm9kZUluZGV4TWFwLmdldChub2RlLmlkKV0gPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKCFnbG9iYWxOb2RlTWFwLmdldChzdWJwcm9jZXNzSWQpLnRyaWdnZXJlZEJ5RXZlbnQgJiYgbm9kZS5ldmVudERlZmluaXRpb25zICYmIG5vZGUuZXZlbnREZWZpbml0aW9uc1swXSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpcyhub2RlLmV2ZW50RGVmaW5pdGlvbnNbMF0sIFwiYnBtbjpNZXNzYWdlRXZlbnREZWZpbml0aW9uXCIpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiaXRhcnJheVtnbG9iYWxOb2RlSW5kZXhNYXAuZ2V0KG5vZGUuaWQpXSA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gYml0YXJyYXkubGVuZ3RoID4gMCA/IFwiMGJcIiA6IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSBiaXRhcnJheS5sZW5ndGggLSAxOyBpID49IDA7IGktLSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBiaXRhcnJheVtpXSA/IFwiMVwiIDogXCIwXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgQmlnTnVtYmVyKHJlc3VsdCkudG9GaXhlZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VicHJvY2Vzc05vZGVGdWxsTWFya2luZzogc3VicHJvY0lkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNoaWxkcmVuID0gW3N1YnByb2NJZF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBiaXRhcnJheSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sRmxvd0luZm8ubm9kZUxpc3QuZm9yRWFjaChub2RlSWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5vZGUgPSBnbG9iYWxOb2RlTWFwLmdldChub2RlSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzKG5vZGUsIFwiYnBtbjpTdWJQcm9jZXNzXCIpIHx8IGNhbGxBY3Rpdml0aWVzLmluZGV4T2Yobm9kZS5pZCkgPj0gMCB8fCAobm9uSW50ZXJydXB0aW5nRXZlbnRzLmluZGV4T2Yobm9kZS5pZCkgPj0gMCAmJiAhaXMobm9kZSwgXCJicG1uOlN0YXJ0RXZlbnRcIikpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKG5vZGUuJHBhcmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS4kcGFyZW50LmlkID09PSBzdWJwcm9jSWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtdWx0aWluc3RhbmNlQWN0aXZpdGllcy5pbmRleE9mKG5vZGVJZCkgPj0gMCB8fCBjYWxsQWN0aXZpdGllcy5pbmRleE9mKG5vZGUuaWQpID49IDAgfHwgbm9uSW50ZXJydXB0aW5nRXZlbnRzLmluZGV4T2Yobm9kZS5pZCkgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpdGFycmF5W2dsb2JhbE5vZGVJbmRleE1hcC5nZXQobm9kZUlkKV0gPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoY2hpbGRyZW4uaW5kZXhPZihub2RlSWQpIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuLnB1c2gobm9kZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUgPSBub2RlLiRwYXJlbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9IFwiMGJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGdsb2JhbE5vZGVJbmRleE1hcC5nZXQoc3VicHJvY0lkKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpdGFycmF5W2dsb2JhbE5vZGVJbmRleE1hcC5nZXQoc3VicHJvY0lkKV0gPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sRmxvd0luZm8ubm9kZUxpc3RcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAobm9kZUlkID0+IGdsb2JhbE5vZGVNYXAuZ2V0KG5vZGVJZCkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZm9yRWFjaChub2RlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS4kcGFyZW50ICYmIGNoaWxkcmVuLmluZGV4T2Yobm9kZS4kcGFyZW50LmlkKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpdGFycmF5W2dsb2JhbE5vZGVJbmRleE1hcC5nZXQobm9kZS5pZCldID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXRjaGluZ01lc3NhZ2VzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKGV2dElkID0+IGdsb2JhbE5vZGVNYXAuZ2V0KGV2dElkKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5mb3JFYWNoKGV2dCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV2dC5hdHRhY2hlZFRvUmVmICYmIGNoaWxkcmVuLmluZGV4T2YoZXZ0LmF0dGFjaGVkVG9SZWYpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYml0YXJyYXlbZ2xvYmFsTm9kZUluZGV4TWFwLmdldChldnQuaWQpXSA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IGJpdGFycmF5Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9IGJpdGFycmF5W2ldID8gXCIxXCIgOiBcIjBcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdCA9PT0gJzBiJyA/IG5ldyBCaWdOdW1iZXIoMCkgOiBuZXcgQmlnTnVtYmVyKHJlc3VsdCkudG9GaXhlZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VicHJvY2Vzc1N0YXJ0TWFya2luZzogc3VicHJvY2Vzc0lkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRvU2VhcmNoID0gZ2xvYmFsTm9kZU1hcC5nZXQoc3VicHJvY2Vzc0lkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGJpdGFycmF5ID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXN1bHQgPSBcIjBiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpcyh0b1NlYXJjaCwgXCJicG1uOkJvdW5kYXJ5RXZlbnRcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IG91dGdvaW5nIG9mIHRvU2VhcmNoLm91dGdvaW5nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpdGFycmF5W2NvbnRyb2xGbG93SW5mby5lZGdlSW5kZXhNYXAuZ2V0KG91dGdvaW5nLmlkKV0gPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgbm9kZSBvZiB0b1NlYXJjaC5mbG93RWxlbWVudHMuZmlsdGVyKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUgPT4gaXMoZSwgXCJicG1uOkZsb3dOb2RlXCIpICYmIGlzKGUsIFwiYnBtbjpTdGFydEV2ZW50XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUuJHBhcmVudC5pZCA9PT0gc3VicHJvY2Vzc0lkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWdsb2JhbE5vZGVNYXAuZ2V0KG5vZGUuJHBhcmVudC5pZCkudHJpZ2dlcmVkQnlFdmVudCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5ldmVudERlZmluaXRpb25zICYmIG5vZGUuZXZlbnREZWZpbml0aW9uc1swXSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXMobm9kZS5ldmVudERlZmluaXRpb25zWzBdLCBcImJwbW46TWVzc2FnZUV2ZW50RGVmaW5pdGlvblwiKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpdGFycmF5WzBdID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAobm9kZS5vdXRnb2luZylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IG91dGdvaW5nIG9mIG5vZGUub3V0Z29pbmcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYml0YXJyYXlbY29udHJvbEZsb3dJbmZvLmVkZ2VJbmRleE1hcC5nZXQob3V0Z29pbmcuaWQpXSA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IGJpdGFycmF5Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9IGJpdGFycmF5W2ldID8gXCIxXCIgOiBcIjBcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBCaWdOdW1iZXIocmVzdWx0KS50b0ZpeGVkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRBbGxBbmNlc3RvcnNNYXNrOiBzdWJwcm9jSWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgYml0YXJyYXkgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9IFwiMGJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5vZGUgPSBnbG9iYWxOb2RlTWFwLmdldChzdWJwcm9jSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAobm9kZS4kcGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiaXRhcnJheVtjb250cm9sRmxvd0luZm8ubm9kZUluZGV4TWFwLmdldChub2RlLmlkKV0gPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZSA9IG5vZGUuJHBhcmVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gYml0YXJyYXkubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgKz0gYml0YXJyYXlbaV0gPyBcIjFcIiA6IFwiMFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEJpZ051bWJlcihyZXN1bHQpLnRvRml4ZWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YnByb2Nlc3NNYXJraW5nOiBzdWJwcm9jZXNzSWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgYml0YXJyYXkgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9IFwiMGJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxvY2FsSW5mbyA9IGdsb2JhbENvbnRyb2xGbG93SW5mb01hcC5nZXQoc3VicHJvY2Vzc0lkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGVkZ2VMaXN0ID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvY2FsSW5mby5ub2RlTGlzdC5mb3JFYWNoKG5vZGVJZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbm9kZSA9IGdsb2JhbE5vZGVNYXAuZ2V0KG5vZGVJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS4kcGFyZW50ICYmIG5vZGUuJHBhcmVudC5pZCA9PT0gc3VicHJvY2Vzc0lkICYmIG5vZGUuaW5jb21pbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpbmNvbWluZyBvZiBub2RlLmluY29taW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVkZ2VMaXN0LnB1c2goaW5jb21pbmcuaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVkZ2VMaXN0LmZvckVhY2goZWRnZUlkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpdGFycmF5W2NvbnRyb2xGbG93SW5mby5lZGdlSW5kZXhNYXAuZ2V0KGVkZ2VJZCldID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSBiaXRhcnJheS5sZW5ndGggLSAxOyBpID49IDA7IGktLSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBiaXRhcnJheVtpXSA/IFwiMVwiIDogXCIwXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgQmlnTnVtYmVyKHJlc3VsdCkudG9GaXhlZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VicHJvY2Vzc0Z1bGxNYXJraW5nOiBzdWJwcm9jSWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgYml0YXJyYXkgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9IFwiMGJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNoaWxkcmVuID0gW3N1YnByb2NJZF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xGbG93SW5mby5ub2RlTGlzdC5mb3JFYWNoKG5vZGVJZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbm9kZSA9IGdsb2JhbE5vZGVNYXAuZ2V0KG5vZGVJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXMobm9kZSwgXCJicG1uOlN1YlByb2Nlc3NcIikgJiYgbXVsdGlpbnN0YW5jZUFjdGl2aXRpZXMuaW5kZXhPZihub2RlSWQpIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlIChub2RlLiRwYXJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUuJHBhcmVudC5pZCA9PT0gc3VicHJvY0lkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGRyZW4uaW5kZXhPZihub2RlSWQpIDwgMClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbi5wdXNoKG5vZGVJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlID0gbm9kZS4kcGFyZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuLmZvckVhY2goc3VicHJvY2Vzc0lkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBsb2NhbEluZm8gPSBnbG9iYWxDb250cm9sRmxvd0luZm9NYXAuZ2V0KHN1YnByb2Nlc3NJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2NhbEluZm8uZWRnZUxpc3QuZm9yRWFjaChlZGdlSWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpdGFycmF5W2NvbnRyb2xGbG93SW5mby5lZGdlSW5kZXhNYXAuZ2V0KGVkZ2VJZCldID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IGJpdGFycmF5Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9IGJpdGFycmF5W2ldID8gXCIxXCIgOiBcIjBcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBCaWdOdW1iZXIocmVzdWx0KS50b0ZpeGVkKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbG93RWRnZUluZGV4OiBmbG93RWRnZUlkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGJpdGFycmF5ID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpdGFycmF5W2NvbnRyb2xGbG93SW5mby5lZGdlSW5kZXhNYXAuZ2V0KGZsb3dFZGdlSWQpXSA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXN1bHQgPSBcIjBiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSBiaXRhcnJheS5sZW5ndGggLSAxOyBpID49IDA7IGktLSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBiaXRhcnJheVtpXSA/IFwiMVwiIDogXCIwXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgQmlnTnVtYmVyKHJlc3VsdCkudG9GaXhlZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxvd05vZGVJbmRleDogZmxvd05vZGVJZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBiaXRhcnJheSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiaXRhcnJheVtnbG9iYWxOb2RlSW5kZXhNYXAuZ2V0KGZsb3dOb2RlSWQpXSA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXN1bHQgPSBcIjBiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSBiaXRhcnJheS5sZW5ndGggLSAxOyBpID49IDA7IGktLSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBiaXRhcnJheVtpXSA/IFwiMVwiIDogXCIwXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgQmlnTnVtYmVyKHJlc3VsdCkudG9GaXhlZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZVJlYWxJbmRleDogbm9kZUlkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdsb2JhbE5vZGVJbmRleE1hcC5nZXQobm9kZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzUGFydE9mRGVmZXJyZWRDaG9pY2U6IGV2ZW50SWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgZXZlbnQgPSBnbG9iYWxOb2RlTWFwLmdldChldmVudElkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LmluY29taW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbm9kZSA9IGV2ZW50LmluY29taW5nWzBdLnNvdXJjZVJlZjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpcyhub2RlLCBcImJwbW46RXZlbnRCYXNlZEdhdGV3YXlcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0RGVmZXJyZWRDaG9pY2VFbGVtZW50czogbm9kZUlkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGV2ZW50ID0gZ2xvYmFsTm9kZU1hcC5nZXQobm9kZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQuaW5jb21pbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBub2RlID0gZXZlbnQuaW5jb21pbmdbMF0uc291cmNlUmVmO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzKG5vZGUsIFwiYnBtbjpFdmVudEJhc2VkR2F0ZXdheVwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IG91dGdvaW5nIG9mIG5vZGUub3V0Z29pbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG91dGdvaW5nLnRhcmdldFJlZi5pZCAhPT0gbm9kZUlkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnB1c2gob3V0Z29pbmcudGFyZ2V0UmVmLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkQ2hvaWNlTm9kZU1hcmtpbmc6IG5vZGVJZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBldmVudCA9IGdsb2JhbE5vZGVNYXAuZ2V0KG5vZGVJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBiaXRhcnJheSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQuaW5jb21pbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBub2RlID0gZXZlbnQuaW5jb21pbmdbMF0uc291cmNlUmVmO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzKG5vZGUsIFwiYnBtbjpFdmVudEJhc2VkR2F0ZXdheVwiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IG91dGdvaW5nIG9mIG5vZGUub3V0Z29pbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYml0YXJyYXlbY29udHJvbEZsb3dJbmZvLm5vZGVJbmRleE1hcC5nZXQob3V0Z29pbmcudGFyZ2V0UmVmLmlkKV0gPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzdWx0ID0gXCIwXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSBiaXRhcnJheS5sZW5ndGggLSAxOyBpID49IDA7IGktLSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBiaXRhcnJheVtpXSA/IFwiMVwiIDogXCIwXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgQmlnTnVtYmVyKHJlc3VsdCkudG9GaXhlZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWRDaG9pY2VNYXJraW5nOiBldmVudElkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGV2ZW50ID0gZ2xvYmFsTm9kZU1hcC5nZXQoZXZlbnRJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBub2RlID0gZXZlbnQuaW5jb21pbmdbMF0uc291cmNlUmVmO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgYml0YXJyYXkgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3VsdCA9IFwiMGJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUub3V0Z29pbmcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBvdXRnb2luZyBvZiBub2RlLm91dGdvaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYml0YXJyYXlbY29udHJvbEZsb3dJbmZvLmVkZ2VJbmRleE1hcC5nZXQob3V0Z29pbmcuaWQpXSA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgcmVzdWx0ID0gXCIwXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSBiaXRhcnJheS5sZW5ndGggLSAxOyBpID49IDA7IGktLSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBiaXRhcnJheVtpXSA/IFwiMVwiIDogXCIwXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgQmlnTnVtYmVyKHJlc3VsdCkudG9GaXhlZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2xvYmFsRGVjbGFyYXRpb25zOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb250cm9sRmxvd0luZm8uZ2xvYmFsUGFyYW1ldGVycy5sZW5ndGggPiAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRyb2xGbG93SW5mby5nbG9iYWxQYXJhbWV0ZXJzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHJldHVybiBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0T3JhY2xlRnVuY3Rpb246IG5vZGVJZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb250cm9sRmxvd0luZm8ub3JhY2xlVGFza01hcC5oYXMobm9kZUlkKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb250cm9sRmxvd0luZm8ub3JhY2xlSW5mby5nZXQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbEZsb3dJbmZvLm9yYWNsZVRhc2tNYXAuZ2V0KG5vZGVJZClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkuZnVuY3Rpb25OYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVQYXJhbWV0ZXJzOiBub2RlSWQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbm9kZSA9IGdsb2JhbE5vZGVNYXAuZ2V0KG5vZGVJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub2RlLmRvY3VtZW50YXRpb24gJiYgbm9kZS5kb2N1bWVudGF0aW9uWzBdLnRleHQgJiYgbm9kZS5kb2N1bWVudGF0aW9uWzBdLnRleHQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlc0RpY3QgPSBleHRyYWN0UGFyYW1ldGVycyhub2RlLmRvY3VtZW50YXRpb25bMF0udGV4dCwgbm9kZUlkLCBudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNEaWN0ICE9PSB1bmRlZmluZWQgPyByZXNEaWN0LmdldChcImlucHV0XCIpLmxlbmd0aCA+IDAgfHwgcmVzRGljdC5nZXQoXCJvdXRwdXRcIikubGVuZ3RoID4gMCA6IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVQYXJhbWV0ZXJzOiAobm9kZUlkLCBpc0lucHV0LCBoYXNQcmV2aW91c1BhcmFtZXRlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbm9kZSA9IGdsb2JhbE5vZGVNYXAuZ2V0KG5vZGVJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXMgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5kb2N1bWVudGF0aW9uICYmIG5vZGUuZG9jdW1lbnRhdGlvblswXS50ZXh0ICYmIG5vZGUuZG9jdW1lbnRhdGlvblswXS50ZXh0Lmxlbmd0aCA+IDAgJiYgZXh0cmFjdFBhcmFtZXRlcnMobm9kZS5kb2N1bWVudGF0aW9uWzBdLnRleHQsIG5vZGVJZCwgbnVsbCkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxvY2FsUGFyYW1zID0gaXNJbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gZXh0cmFjdFBhcmFtZXRlcnMobm9kZS5kb2N1bWVudGF0aW9uWzBdLnRleHQsIG5vZGVJZCwgbnVsbCkuZ2V0KFwiaW5wdXRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGV4dHJhY3RQYXJhbWV0ZXJzKG5vZGUuZG9jdW1lbnRhdGlvblswXS50ZXh0LCBub2RlSWQsIG51bGwpLmdldChcIm91dHB1dFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsb2NhbFBhcmFtcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzID0gbG9jYWxQYXJhbXNbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDI7IGkgPCBsb2NhbFBhcmFtcy5sZW5ndGg7IGkgKz0gMilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzICs9IFwiLCBcIiArIGxvY2FsUGFyYW1zW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBoYXNQcmV2aW91c1BhcmFtZXRlciAmJiByZXMubGVuZ3RoID4gMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBcIiwgXCIgKyByZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogcmVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uY2F0UGFyYW1ldGVyczogKG5vZGVJZCwgaXNJbnB1dCwgaGFzVHlwZSwgaGFzUHJldmlvdXNQYXJhbWV0ZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5vZGUgPSBnbG9iYWxOb2RlTWFwLmdldChub2RlSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUuZG9jdW1lbnRhdGlvbiAmJiBub2RlLmRvY3VtZW50YXRpb25bMF0udGV4dCAmJiBub2RlLmRvY3VtZW50YXRpb25bMF0udGV4dC5sZW5ndGggPiAwICYmIGV4dHJhY3RQYXJhbWV0ZXJzKG5vZGUuZG9jdW1lbnRhdGlvblswXS50ZXh0LCBub2RlSWQsIG51bGwpICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBsb2NhbFBhcmFtcyA9IGlzSW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGV4dHJhY3RQYXJhbWV0ZXJzKG5vZGUuZG9jdW1lbnRhdGlvblswXS50ZXh0LCBub2RlSWQsIG51bGwpLmdldChcImlucHV0XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBleHRyYWN0UGFyYW1ldGVycyhub2RlLmRvY3VtZW50YXRpb25bMF0udGV4dCwgbm9kZUlkLCBudWxsKS5nZXQoXCJvdXRwdXRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobG9jYWxQYXJhbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcyA9IGhhc1R5cGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBsb2NhbFBhcmFtc1swXSArIFwiIFwiICsgbG9jYWxQYXJhbXNbMV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBsb2NhbFBhcmFtc1sxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMjsgaSA8IGxvY2FsUGFyYW1zLmxlbmd0aDsgaSArPSAyKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMgKz0gXCIsXCIgKyAoaGFzVHlwZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBsb2NhbFBhcmFtc1tpXSArIFwiIFwiICsgbG9jYWxQYXJhbXNbaSArIDFdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGxvY2FsUGFyYW1zW2kgKyAxXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGhhc1ByZXZpb3VzUGFyYW1ldGVyICYmIHJlcy5sZW5ndGggPiAwID8gXCIsIFwiICsgcmVzIDogcmVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9kZUZ1bmN0aW9uQm9keTogbm9kZUlkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5vZGUgPSBnbG9iYWxOb2RlTWFwLmdldChub2RlSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5zY3JpcHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBub2RlLnNjcmlwdC5zcGxpdChcIi0+XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG5vZGUuZG9jdW1lbnRhdGlvbiAmJiBub2RlLmRvY3VtZW50YXRpb25bMF0udGV4dCAmJiBub2RlLmRvY3VtZW50YXRpb25bMF0udGV4dC5sZW5ndGggPiAwICYmIGV4dHJhY3RQYXJhbWV0ZXJzKG5vZGUuZG9jdW1lbnRhdGlvblswXS50ZXh0LCBub2RlSWQsIG51bGwpICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBleHRyYWN0UGFyYW1ldGVycyhub2RlLmRvY3VtZW50YXRpb25bMF0udGV4dCwgbm9kZUlkLCBudWxsKS5nZXQoXCJib2R5XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgcmV0dXJuIFwiXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRDb25kaXRpb246IGZsb3dFZGdlID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsb3dFZGdlLmNvbmRpdGlvbkV4cHJlc3Npb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gZmxvd0VkZ2UuY29uZGl0aW9uRXhwcmVzc2lvbi5ib2R5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGZsb3dFZGdlLm5hbWUgPyBmbG93RWRnZS5uYW1lIDogZmxvd0VkZ2UuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXM6IGlzXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbG9jYWxTb2xpZGl0eSA9IGJwbW4yc29sVGVtcGxhdGUoY29kZUdlbmVyYXRpb25JbmZvKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ29kZSBmb3IgdXNpbmcgdGhlIFdvcmtMaXN0IHRlbXBsYXRlXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdXNlclRhc2tMaXN0ID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcGFyYW1ldGVySW5mbzogTWFwPHN0cmluZywgTWFwPHN0cmluZywgQXJyYXk8UGFyYW1ldGVySW5mbz4+PiA9IG5ldyBNYXAoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xGbG93SW5mby5ub2RlTGlzdC5mb3JFYWNoKG5vZGVJZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5vZGUgPSBnbG9iYWxOb2RlTWFwLmdldChub2RlSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpcyhub2RlLCAnYnBtbjpVc2VyVGFzaycpIHx8IGlzKG5vZGUsICdicG1uOlJlY2VpdmVUYXNrJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlclRhc2tMaXN0LnB1c2gobm9kZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRyb2xGbG93SW5mby5sb2NhbFBhcmFtZXRlcnMuaGFzKG5vZGVJZCkgJiYgKGNvbnRyb2xGbG93SW5mby5sb2NhbFBhcmFtZXRlcnMuZ2V0KG5vZGVJZCkuZ2V0KCdpbnB1dCcpLmxlbmd0aCA+IDAgfHwgY29udHJvbEZsb3dJbmZvLmxvY2FsUGFyYW1ldGVycy5nZXQobm9kZUlkKS5nZXQoJ291dHB1dCcpLmxlbmd0aCA+IDApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJhbWV0ZXJJbmZvLnNldChub2RlSWQsIGNvbnRyb2xGbG93SW5mby5sb2NhbFBhcmFtZXRlcnMuZ2V0KG5vZGVJZCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29udHJvbEZsb3dJbmZvLmNhdGNoaW5nTWVzc2FnZXMubGVuZ3RoID4gMClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyVGFza0xpc3QgPSB1c2VyVGFza0xpc3QuY29uY2F0KGNvbnRyb2xGbG93SW5mby5jYXRjaGluZ01lc3NhZ2VzKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gV29ya0xpc3Q6IFNtYXJ0IENvbnRyYWN0IEdlbmVyYXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB3b3JrTGlzdEdlbmVyYXRpb25JbmZvID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVMaXN0OiB1c2VyVGFza0xpc3QsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdHJpY3RSZWxhdGlvbjogcmVzdHJpY3RSZWxhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJhbWV0ZXJJbmZvOiBwYXJhbWV0ZXJJbmZvLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVJbmRleDogZ2xvYmFsTm9kZUluZGV4TWFwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVNYXA6IGdsb2JhbE5vZGVNYXAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvY2Vzc0lkOiAoKSA9PiBjb250cm9sRmxvd0luZm8uc2VsZi5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub2RlTmFtZTogbm9kZUlkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldE5vZGVOYW1lKGdsb2JhbE5vZGVNYXAuZ2V0KG5vZGVJZCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0UGFyYW1ldGVyVHlwZTogKG5vZGVJZCwgaXNJbnB1dCwgaXNUeXBlLCBoYXNQcmV2aW91cykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmFtZXRlckluZm8uZ2V0KG5vZGVJZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBsb2NhbFBhcmFtcyA9IGlzSW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHBhcmFtZXRlckluZm8uZ2V0KG5vZGVJZCkuZ2V0KFwiaW5wdXRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHBhcmFtZXRlckluZm8uZ2V0KG5vZGVJZCkuZ2V0KFwib3V0cHV0XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxvY2FsUGFyYW1zICYmIGxvY2FsUGFyYW1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMgPSBpc1R5cGUgPyBsb2NhbFBhcmFtc1swXS50eXBlIDogbG9jYWxQYXJhbXNbMF0ubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IGxvY2FsUGFyYW1zLmxlbmd0aDsgaSsrKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMgKz0gaXNUeXBlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IFwiLCBcIiArIGxvY2FsUGFyYW1zW2ldLnR5cGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCIsIFwiICsgbG9jYWxQYXJhbXNbaV0ubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzLmxlbmd0aCA+IDAgJiYgaGFzUHJldmlvdXMgPyBcIiwgXCIgKyByZXMgOiByZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRQYXJhbWV0ZXJzOiAobm9kZUlkLCBpc0lucHV0LCBoYXNUeXBlLCBoYXNQcmV2aW91cykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVzID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmFtZXRlckluZm8uZ2V0KG5vZGVJZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBsb2NhbFBhcmFtcyA9IGlzSW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IHBhcmFtZXRlckluZm8uZ2V0KG5vZGVJZCkuZ2V0KFwiaW5wdXRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHBhcmFtZXRlckluZm8uZ2V0KG5vZGVJZCkuZ2V0KFwib3V0cHV0XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxvY2FsUGFyYW1zICYmIGxvY2FsUGFyYW1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMgPSBoYXNUeXBlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gbG9jYWxQYXJhbXNbMF0udHlwZSArIFwiIFwiICsgbG9jYWxQYXJhbXNbMF0ubmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGxvY2FsUGFyYW1zWzBdLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBsb2NhbFBhcmFtcy5sZW5ndGg7IGkrKylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzICs9IGhhc1R5cGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gXCIsIFwiICsgbG9jYWxQYXJhbXNbaV0udHlwZSArIFwiIFwiICsgbG9jYWxQYXJhbXNbaV0ubmFtZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBcIiwgXCIgKyBsb2NhbFBhcmFtc1tpXS5uYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXMubGVuZ3RoID4gMCAmJiBoYXNQcmV2aW91cyA/IFwiLCBcIiArIHJlcyA6IHJlcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldFdvcmtJdGVtc0dyb3VwQnlQYXJhbWV0ZXJzOiAoaXNJbnB1dCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmFtZTJJZHM6IE1hcDxzdHJpbmcsIHN0cmluZ1tdPiA9IG5ldyBNYXAoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udHJvbEZsb3dJbmZvLm5vZGVMaXN0LmZvckVhY2gobm9kZUlkID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBub2RlID0gZ2xvYmFsTm9kZU1hcC5nZXQobm9kZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpcyhub2RlLCAnYnBtbjpVc2VyVGFzaycpIHx8IGlzKG5vZGUsICdicG1uOlJlY2VpdmVUYXNrJykgfHwgY2F0Y2hpbmdNZXNzYWdlcy5pbmRleE9mKG5vZGVJZCkgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwYXJhbXMgPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub2RlLmRvY3VtZW50YXRpb24gJiYgbm9kZS5kb2N1bWVudGF0aW9uWzBdLnRleHQgJiYgbm9kZS5kb2N1bWVudGF0aW9uWzBdLnRleHQubGVuZ3RoID4gMCAmJiBleHRyYWN0UGFyYW1ldGVycyhub2RlLmRvY3VtZW50YXRpb25bMF0udGV4dCwgbm9kZUlkLCBudWxsKSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBsb2NhbFBhcmFtcyA9IGlzSW5wdXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gZXh0cmFjdFBhcmFtZXRlcnMobm9kZS5kb2N1bWVudGF0aW9uWzBdLnRleHQsIG5vZGVJZCwgbnVsbCkuZ2V0KFwiaW5wdXRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogZXh0cmFjdFBhcmFtZXRlcnMobm9kZS5kb2N1bWVudGF0aW9uWzBdLnRleHQsIG5vZGVJZCwgbnVsbCkuZ2V0KFwib3V0cHV0XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobG9jYWxQYXJhbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyYW1zID0gbG9jYWxQYXJhbXNbMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMjsgaSA8IGxvY2FsUGFyYW1zLmxlbmd0aDsgaSArPSAyKSBwYXJhbXMgKz0gbG9jYWxQYXJhbXNbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5hbWUgPSBnZXROb2RlTmFtZShnbG9iYWxOb2RlTWFwLmdldChub2RlSWQpKSArIHBhcmFtcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW5hbWUySWRzLmhhcyhuYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lMklkcy5zZXQobmFtZSwgW10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lMklkcy5nZXQobmFtZSkucHVzaChub2RlSWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5hbWUySWRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXM6IGlzXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWxJbmZvLnNvbGlkaXR5ICs9IGxvY2FsU29saWRpdHk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodXNlclRhc2tMaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2RlbEluZm8uc29saWRpdHkgKz0gd29ya0xpc3Qyc29sVGVtcGxhdGUod29ya0xpc3RHZW5lcmF0aW9uSW5mbyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RlbEluZm8uY29udHJvbEZsb3dJbmZvTWFwLnNldChjb250cm9sRmxvd0luZm8uc2VsZi5pZCwgY29udHJvbEZsb3dJbmZvKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xGbG93SW5mby5ub2RlTGlzdC5mb3JFYWNoKG5vZGVJZCA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xGbG93SW5mby5ub2RlSW5kZXhNYXAuc2V0KG5vZGVJZCwgZ2xvYmFsTm9kZUluZGV4TWFwLmdldChub2RlSWQpKVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xGbG93SW5mby5lZGdlTGlzdC5mb3JFYWNoKGVkZ2VJZCA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyb2xGbG93SW5mby5lZGdlSW5kZXhNYXAuc2V0KGVkZ2VJZCwgZ2xvYmFsRWRnZUluZGV4TWFwLmdldChlZGdlSWQpKVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgICAgICAgICAgICAgIG1vZGVsSW5mby5lbnRyeUNvbnRyYWN0TmFtZSA9IG1vZGVsSW5mby5uYW1lICsgXCI6XCIgKyAocHJvYy5uYW1lID8gcHJvYy5uYW1lLnJlcGxhY2UoL1xccysvZywgXCJfXCIpIDogcHJvYy5pZCkgKyBcIl9Db250cmFjdFwiO1xuXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIHJlamVjdCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgfSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBwYXJzZU1vZGVsXG4iXX0=