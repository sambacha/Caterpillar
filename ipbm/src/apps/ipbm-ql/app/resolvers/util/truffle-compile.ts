import truffleCompile from 'truffle-compile'

export default solidity =>
  new Promise(
    (resolve, reject) =>
      truffleCompile(
        solidity,
        {
          contracts_directory: 'i do not care',
          compilers: {
            solc: {
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
            }
          }
        },
        (err, result) => err ? reject(err) : resolve(result))
      )