import Web3 from 'web3'
import { RegistryContract } from 'ipbm-lib'

export default (web3: Web3) => ({
  policyId: async (
    {
      _id,
      registryContract,
    }: {
      _id: string,
      registryContract: RegistryContract,
    }
  ): Promise<string> =>
    registryContract
      .bindingPolicyFromId({
        procId: web3.utils.fromAscii(_id.toString()),
      }),
  taskRoleId: async (
    {
      _id,
      registryContract,
    }: {
      _id: string,
      registryContract: RegistryContract,
    }
  ): Promise<string> =>
    registryContract
      .taskRoleMapFromId({
        procId: web3.utils.fromAscii(_id.toString()),
      }),
})