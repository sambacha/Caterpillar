import {
  registry,
  roleTask,
  policy,
  process
} from '../repo'

export default (web3): object => ({
  accounts: async (): Promise<string[]> =>
    web3.eth.personal.getAccounts().then(
      (accounts): string[] =>
        accounts,
    ),
  policies: async (_, { _id }): Promise<any[]> =>
    policy.find({..._id && { _id }}),
  processes: async (_, { _id }): Promise<any[]> =>
    process.find({..._id && { _id }}),
  registries: async (_, { _id }): Promise<any[]> =>
    registry.find({..._id && { _id }}),
  roleTasks: async (_, { _id }): Promise<any[]> =>
    roleTask.find({..._id && { _id }}),
})