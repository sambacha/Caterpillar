import _debug from 'debug'
import {
  modelSchema
} from '../../repo'
import Web3 from 'web3'
// import { processSchema } from '../../repo'
const debug = _debug('caterpillarql:registry.models')

export default async (
  {
    web3,
    contract,
    registryId,
    modelId,
  }: {
    web3: Web3,
    contract: import('ipbm-lib').RegistryContract,
    registryId: string,
    modelId: string
  },
): Promise<any[]> => {
  debug('looking for ', modelId, registryId)
  if (contract) {
    const models: any[] = await modelSchema
      .find(
        {
          registryId,
          ...modelId && {
            _id: modelId
          },
        },
      )
    debug(models.length)
    
    debug(
      models
    )

    return models
      .map(
        ({
          _id,
          _doc
        }): object => ({
          _id,
          ..._doc,
          registryContract: contract,
          processes: async (
            {
              _id,
              contract

            },
            {
              address,
            },
          ): Promise<any[]> =>
            processSchema
              .find({
                modelId: _id
              }),
        })
      )
  }
}
