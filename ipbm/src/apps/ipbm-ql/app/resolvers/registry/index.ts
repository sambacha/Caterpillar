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
      address: registryAddress,
    },
    {
      _id,
    }
  ): Promise<any[]> =>
    policies({
      registryAddress,
      _id,
    }),
  models: async (
    {
      contract,
    },
    {
      id,
    }
  ): Promise<any[]> =>
    models({
      web3,
      contract,
      id,
    }),  
})