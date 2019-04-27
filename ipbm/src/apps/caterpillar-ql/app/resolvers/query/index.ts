import { registryContract } from 'caterpillar-lib'

import {
  registry,
  roleTask,
  process
} from '../repo'

import hexToId from '../util/hex-to-id'

export default (web3): object => ({
  accounts: async (): Promise<string[]> =>
    web3.eth.personal.getAccounts().then(
      (accounts): string[] =>
        accounts,
    ),
  processes: async (_, { _id }): Promise<any[]> =>
    process.find({..._id && { _id }}),
  registries: async (_, { _id }): Promise<any[]> =>
    registry
      .find({..._id && { _id }})
      .then(
        rs => rs
          // ? shouldnt be needed?
          .filter(
            ({ abi }) => abi,
          )
          .map(
            r =>
              ({
                ...r._doc,
                contract: registryContract({
                  hexToId: hexToId(web3),
                  web3,
                })(r),
              }),
          ),
      ),
  roleTasks: async (_, { _id }): Promise<any[]> =>
    roleTask.find({..._id && { _id }}),
})