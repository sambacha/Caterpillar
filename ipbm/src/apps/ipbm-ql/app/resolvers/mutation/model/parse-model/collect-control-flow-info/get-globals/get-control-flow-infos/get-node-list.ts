const nodeList = (globalNodeMap) =>
  (sources: string[]) =>
    sources
      .reduce(
        (acc, source) => [
          ...acc,
          source,
          ...nodeList(globalNodeMap)(
            (globalNodeMap[source].outgoing ||[])
              .map(
                ({
                  targetRef: {
                    id,
                  }
                })=> id
              )
          )
        ],
        []
      )
export default nodeList
