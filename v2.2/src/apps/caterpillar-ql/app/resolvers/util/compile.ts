import solc from 'solc'

export default sources => JSON.parse(
  solc.compile(
    JSON.stringify(
      {
        language: 'Solidity',
        sources,
        settings: {
          "optimizer": {
            "enabled": false,
            "runs": 200
          },
          "evmVersion": "byzantium",      
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
