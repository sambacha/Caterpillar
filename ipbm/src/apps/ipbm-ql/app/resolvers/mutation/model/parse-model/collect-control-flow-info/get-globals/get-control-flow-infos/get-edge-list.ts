const edgeList = (globalNodeMap) =>
  (sources: string[]) =>
    sources
      .reduce(
        (acc, source) => [
          ...acc,
          ...(globalNodeMap[source].outgoing ||[])
            .map(
              ({ 
                id,
              }) => id,
            ),
          ...edgeList(globalNodeMap)(
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
    
export default edgeList
