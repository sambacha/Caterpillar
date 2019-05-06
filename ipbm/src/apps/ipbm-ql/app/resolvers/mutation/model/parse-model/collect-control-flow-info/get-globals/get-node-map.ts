import is from '../../is'
import ControlFlowInfo from '../../definitions/Control-Flow-Info'

const getNodeMap = map => ({
  flowNodes,
  subProcesses,
}) => subProcesses
  .reduce(
    (
      acc,
      subProcess,
    ) =>
      getNodeMap(acc)(subProcess),
    flowNodes
      .reduce(
        (
          acc,
          node,
        ) => ({
          ...acc,
          [node.id]: node,
        }),
        map,
      )
  )

export default getNodeMap 
