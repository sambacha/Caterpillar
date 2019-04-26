import Web3 from 'web3'
import { RegistryContract } from 'caterpillar-lib'

import instanceState from './instance-state/index'
import resources from './resources'

export default (web3: Web3): object => ({
  instanceState: ({ address, registryContract, bpmnModel }) =>
    instanceState({ web3, registryContract, bpmnModel })(address),
  resources: ({ address, registryContract }, { role }) =>
    resources({ web3, registryContract })(address, role),
  policyId: async (
    {
      address,
      registryContract,
    }: {
      address: string,
      registryContract: RegistryContract,
    }
  ): Promise<string> =>
    registryContract
      .bindingPolicyFor({
        address,
      }),
  runtimePolicyAddress: async (
    {
      address,
      registryContract,
    }: {
      address: string,
      registryContract: RegistryContract,
    }
  ): Promise<string> =>
    registryContract
      .findRuntimePolicy({
        address,
      }),  
})