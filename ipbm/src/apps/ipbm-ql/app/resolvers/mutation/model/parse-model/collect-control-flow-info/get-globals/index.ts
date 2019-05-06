import makeTree from './make-tree'
import structure from './structure'
import mapIds from './map-ids'
import getControlFlowInfos from './get-control-flow-infos'
import getNodeMap from './get-node-map'

export default proc => {
  const tree = makeTree(proc)
  const globalNodeMap = getNodeMap({
    [proc.id]: proc,
  })(tree)
  
  const globalControlFlowInfo = getControlFlowInfos(
    globalNodeMap
  )(
    mapIds(
      structure(
        tree,
      ),
    ),
  )

  return {
    globalNodeMap,
    globalControlFlowInfo,
  }
}