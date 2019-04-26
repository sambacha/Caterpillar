import debug from 'debug'
import { process } from '../repo'
import hexToId from '../util/hex-to-id'
import Web3 from 'web3'

export default async (
  {
    web3,
    contract,
    id,
  }: {
    web3: Web3,
    contract: import('caterpillar-lib').RegistryContract,
    id: String,
  },
): Promise<any[]> => {
  if (contract) {
    const models: any[] = await process
      .find(
        {
          bpmnModel: {
            $ne: 'empty',
          },
          ...id && {
            _id: id,
          }
        },
      )
    
    const children = await Promise.all(
      models
        .map(
          ({ _id }): Promise<string> => {
            debug('caterpillarql:registry.models')('_id',{ _id, is: web3.utils.fromAscii(_id.toString()) })
            return contract
              .childrenFor({
                id: web3.utils.fromAscii(_id.toString()),
                index: 0,
              })
              .then(
                (x): string =>
                  x === _id.toString() &&
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
          solidity,
          registryContract: contract
        })
      )
  }
}
