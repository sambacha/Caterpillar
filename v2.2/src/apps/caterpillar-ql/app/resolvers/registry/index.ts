import processes from './processes'
import models from './models'

export default (web3): object => ({
  processes: async ({ address: registry }): Promise<any[]> =>
    processes({ web3, registry }),
  models: async ({ address: registry }): Promise<any[]> =>
    models({ web3, registry })
})