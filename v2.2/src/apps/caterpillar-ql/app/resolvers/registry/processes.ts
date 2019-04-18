import { process } from '../repo'
import registryContract from '../registry-contract'
import instanceState from '../process-contract/instance-state'
import debug from 'debug'

export default async ({
  web3,
  registry: address,
}): Promise<any[]> => {
  const contract = await registryContract({
    address,
    web3,
  })
  if (contract) {
    const instances = await contract.methods.allInstances.call()
    if (instances) {
      debug('caterpillarql:processes')({ instances })
      const instanceStates = await Promise.all(
        instances
          .map(
            address => instanceState({
              web3,
              registryContract: contract,
            })(address)
          )
      )
      debug('caterpillarql:processes')({ instanceStates })
      const bundleFors = await Promise.all(
        instances
          .map(
            (instance): Promise<object> =>
              contract.methods.bundleFor(instance).call()
                .then(
                  (bundleFor): object => ({
                    instance,
                    bundleFor: web3.utils.toAscii(bundleFor).toString().substr(0, 24),
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
}
