import addRegistry from './add-registry'
import addModel from './add-model'

export default (web3): object => ({
  addRegistry: async (): Promise<any> =>
    addRegistry({ web3 }),
  addModel: async (
    _,
    {
      bpmn,
      registry,
    },
  ):Promise<any> =>
      addModel({
        bpmn,
        registry,
        web3,
      }),
})