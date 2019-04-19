import solc from 'solc'

export default sources => JSON.parse(
  solc.compile(
    JSON.stringify(
      {
        language: 'Solidity',
        sources,
        settings: {
          outputSelection: {
            '*': {
              '*': ['*']
            }
          }
        }
      },
    ),
  ),
)
