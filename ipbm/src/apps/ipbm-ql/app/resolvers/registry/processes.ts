import {
  modelSchema
} from '../repo'
import debug from 'debug'
import Web3 from 'web3'

export default async (
  {
    contract,
    address
  } : {
    contract: import('ipbm-lib').RegistryContract,
    address: string
  }): Promise<any[]> => {
  const instances = await contract
    .allInstances()
  if (instances) {
    debug('caterpillarql:processes')({ instances })
    const bundleFors = await Promise.all(
      instances
        .filter(
          i => !address || i === address
        )
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
          }): Promise<object> => modelSchema
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
