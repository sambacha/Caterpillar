import addRegistry from './add-registry'

export default (web3): object => ({
  addRegistry: async (): Promise<any> =>
    addRegistry({ web3 }),
})