import { registryContract } from 'ipbm-lib'
import { registrySchema } from '../repo'
import hexToId from './hex-to-id'

export default async ({
  web3,
  address,
}) =>
  registrySchema
    .find({ address })
    .then(([r]) => r)
    .then(
      registryContract({
        hexToId: hexToId(web3),
        web3,
      }),
    )