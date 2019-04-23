import { registryContract } from 'caterpillar-lib'
import { registry } from '../repo'

export default async ({
  web3,
  address,
}) =>
  registry
    .find({ address })
    .then(([r]) => r)
    .then(registryContract(web3))