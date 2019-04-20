import registry from './registry'
import model from './model'
import policy from './policy'

export default (web3): object => ({
  registry: async (): Promise<any> =>
    registry({ web3 }),
    model: async (
      _,
      {
        bpmn,
        registry,
      },
    ):Promise<any> =>
        model({
          bpmn,
          registry,
          web3,
        }),
    policy: async (
        _,
        {
          model,
          registry,
        },
      ):Promise<any> =>
          policy({
            model,
            registry,
            web3,
          }),
})