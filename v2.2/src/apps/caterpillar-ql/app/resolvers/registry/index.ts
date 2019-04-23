import processes from './processes'
import models from './models'

export default (web3): object => ({
  processes: async ({ address: registry, contract }): Promise<any[]> =>
    processes({ web3, registry, contract }),
  models: async ({ address: registry, contract }): Promise<any[]> =>
    models({ web3, registry, contract })
})