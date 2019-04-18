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
  policies: async (): Promise<any[]> =>
    policy.find(),
  processes: async (): Promise<any[]> =>
    process.find(),
  registries: async (): Promise<any[]> =>
    registry.find(),
  roleTasks: async (): Promise<any[]> =>
    roleTask.find(),
})