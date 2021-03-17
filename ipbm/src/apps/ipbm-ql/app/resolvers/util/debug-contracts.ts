export default ({
  debug,
  contracts,
}) =>
  debug(
    Object.keys(contracts)
      .reduce(
        (
          acc,
          key,
        ) => ({
          ...acc,
          [key]: contracts[key].bytecode.slice(-30),
        }),
        {}
      )
  )
