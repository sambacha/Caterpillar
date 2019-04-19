import debug from 'debug'
import { process, registry } from '../repo'
import registryContract from '../util/registry-contract'
import hexToId from '../util/hex-to-id'

export default async ({
  web3,
  registry: address,
}): Promise<any[]> => {
  const contract = await registryContract({
    address,
    web3,
  })
  if (contract) {
    const models: any[] = await process
      .find({ 'bpmnModel': { $ne: 'empty' } })
    
    const children = await Promise.all(
      models
        .map(
          ({ _id }): Promise<string> => {
            debug('caterpillarql:registry.models')('_id',{ _id, is: web3.utils.fromAscii(_id.toString()) })
            return contract
              .methods
              .childrenFor(web3.utils.fromAscii(_id.toString()), 0)
              .call()
              .then(
                (x): string =>
                  x &&
                  hexToId(web3)(x) === _id.toString() &&
                    _id.toString(),
              )
          },
        )
    )
    debug('caterpillarql:registry.models')('filtered-children', { children  })
    return models
      .filter(
        ({
          _id,
        }): boolean => children.includes(_id.toString())
      )
      .map(
        ({
          _id,
          rootProcessName: name,
          bpmnModel: bpmn,
          solidityCode: solidity,
        }): object => ({
          id: _id.toString(),
          name,
          bpmn,
          solidity
        })
      )
  }
}
