import { registryContract } from 'ipbm-lib'

import {
  registrySchema,
} from '../repo'

import hexToId from '../util/hex-to-id'

export default (web3): object => ({
  accounts: async (): Promise<string[]> =>
    web3.eth.personal.getAccounts().then(
      (accounts): string[] =>
        accounts,
    ),
  registries: async (_, { _id }): Promise<any[]> =>
    registrySchema
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
})