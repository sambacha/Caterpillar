const generate = ({
  procId,
  separateInstances,
  workItems,
}) => {
  const maxTaskIndex = Math.max(...workItems.map(({ taskIndex }) => taskIndex))
  return {
    [procId]: [...Array(maxTaskIndex + 1)].fill('.')
      .map(
        (_, index) => {
          const workItem = workItems.find(({ taskIndex}) => taskIndex === index)
          return workItem && workItem.roleIndex ? workItem.roleIndex : 0
        }
      ),
    ...separateInstances
        .map(generate)
        .reduce(
          (acc, val) => ({
            ...acc,
            ...val,
          }),
          {},
        )
  }
}
export default generate
