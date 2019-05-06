export default (globalNodeMap: Map<string, any>) =>
  (sources: string[]) => {
    let open = [...sources]
    let nodeList: Array<string> = []
    let edgeList: Array<string> = []
    while (open.length > 0) {
      let currId = open.pop()
      let curr = globalNodeMap.get(currId)
      nodeList.push(currId)
      if (curr.outgoing && curr.outgoing.length > 0)
        for (let succEdge of curr.outgoing) {
          let succ = succEdge.targetRef
          edgeList.push(succEdge.id)
          if (open.indexOf(succ.id) < 0 && nodeList.indexOf(succ.id) < 0)
            open.push(succ.id)
        }
    }
    return [nodeList, edgeList]
  }