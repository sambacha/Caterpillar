import { process } from '../repo'
import debug from 'debug'
import hexToId from '../util/hex-to-id'
import Web3 from 'web3'

export default async (
  {
    web3,
    contract,
  } : {
    web3: Web3,
    contract: import('caterpillar-lib').RegistryContract,
  }): Promise<any[]> => {
  const instances = await contract
    .allInstances()
  if (instances) {
    debug('caterpillarql:processes')({ instances })
    const bundleFors = await Promise.all(
      instances
        .map(
          (instance): Promise<object> =>
            contract
              .bundleFor({ instance })
              .then(
                (bundleFor): object => ({
                  instance,
                  bundleFor,
                }),
              ),
        )
    )
    return Promise.all(
      bundleFors
        .map(
          ({
            bundleFor,
            instance,
          }): Promise<object> => process
            .find({ _id: bundleFor})
            .then(
              ([{
                bpmnModel,
                rootProcessName: name,
              }]): object => ({
                address: instance,
                id: bundleFor,
                bpmnModel,
                registryContract: contract,
                name,
              })
            )
        )
    )
  }
}
