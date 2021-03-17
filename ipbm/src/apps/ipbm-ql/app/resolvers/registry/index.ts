import processes from './processes'
import models from './models'
import policies from './policies'

export default (web3): object => ({
  processes: async (
    {
      contract
    },
    {
      address,
    },
  ): Promise<any[]> =>
    processes({
      contract,
      address,
    }),
  policies: async (
    {
      _id: registryId,
    },
    {
      _id,
    }
  ): Promise<any[]> =>
    policies({
      registryId,
      _id,
    }),
  models: async (
    {
      _id,
      contract,
    },
    {
      _id: modelId,
    }
  ): Promise<any[]> =>
    models({
      web3,
      contract,
      registryId: _id,
      modelId,
    }),  
})