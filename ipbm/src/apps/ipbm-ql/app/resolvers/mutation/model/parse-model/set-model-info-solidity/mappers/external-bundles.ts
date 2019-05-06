import getNodeName from '../get-node-name'
import is from '../../is'

export default globalNodeMap => ({
  nodeList,
  externalBundles,
}) => {
  console.log('hre ')
  const nodes = nodeList
    .map(
      nodeId => globalNodeMap[nodeId]
    )
    .filter(
      node =>
        node.documentation &&
          node.documentation[0].text &&
          node.documentation[0].text.length > 0 &&
          is(node, 'bpmn:CallActivity')
    )
    const ret = {
      nodeList,
      externalBundles: nodes
        .reduce(
          (acc, node) =>
            acc.set(node.id, node.documentation[0].text),
          externalBundles,
        ),
    }
    console.log({ ret })
    return ret
  }