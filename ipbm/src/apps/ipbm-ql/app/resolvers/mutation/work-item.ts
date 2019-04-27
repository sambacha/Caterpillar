import _debug from 'debug'

import {
  roleTask as roleTaskSchema,
  policy as policySchema,
  process as processSchema
} from '../repo'
import registryContract from '../util/registry-contract'
import hexToId from '../util/hex-to-id'
import findRoleMap from '../util/find-role-map'
import createContract from '../util/create-contract'

const debug = _debug('caterpillarql:mutation:work-item')

export default async ({
  id,
  worklist,
  from,
  parameters,
  registry,
  web3,
}): Promise<object> => {
  debug({ worklist })
  if (!web3.utils.isAddress(from)) {
    throw new Error('User is not a valid address')
  }
  const contract = await registryContract({
    address: registry,
    web3,
  })
  const worklistId = await contract
    .worklistBundleFor({
      address: worklist,
    })
  debug({ worklistId })
  const [model] = await processSchema
    .find({
      _id: worklistId,
    })
  
  const worklistInstance = new web3.eth.Contract(JSON.parse(model.worklistAbi), worklist)

  const processAddress = await worklistInstance
    .methods
    .processInstanceFor(parseInt(id))
    .call()

  let nodeIndex = await worklistInstance
    .methods
    .elementIndexFor(id)
    .call()
    debug({ nodeIndex })
    
  const node = model
    .indexToElement[nodeIndex.toNumber()]
  debug('about to fire method', worklist, from, node.name, ...[id, ...parameters])
  const ddd = await worklistInstance
    .methods[node.name](
      ...[id, ...parameters.map(p => true)],
    )
    .send({
      from,
      gas: 4700000,
    })
    .on(
      'receipt',
      (
        receipt: any,
      ): void => {
        debug({ receipt })
      },
    )
  debug({ ddd })
  // to do get the worklist address...
  return {
    address: processAddress,
    id: model.id,
    registryContract: contract
  }           
}