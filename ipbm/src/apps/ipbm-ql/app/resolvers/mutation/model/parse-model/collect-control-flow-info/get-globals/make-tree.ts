import is from '../../is'

const makeTree = proc => ({
  proc,
  flowEdges: proc
    .flowElements
    .filter(e => is(e, "bpmn:SequenceFlow")),
  flowNodes: proc
    .flowElements
    .filter(e => is(e, "bpmn:FlowNode")),
  subProcesses: proc
    .flowElements
    .filter(e => is(e, "bpmn:SubProcess"))
    .map(makeTree),
})

export default makeTree
