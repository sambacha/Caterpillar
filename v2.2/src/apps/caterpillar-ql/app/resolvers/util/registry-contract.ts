import { registryContract } from 'caterpillar-lib'
import { registry } from '../repo'
import hexToId from './hex-to-id'

export default async ({
  web3,
  address,
}) =>
  registry
    .find({ address })
    .then(([r]) => r)
    .then(
      registryContract({
        hexToId: hexToId(web3),
        web3,
      }),
    )