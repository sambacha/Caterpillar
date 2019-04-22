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
  workList,
  from,
  parameters,
  registry,
  web3,
}): Promise<object> => {
  debug({ workList })
  if (!web3.utils.isAddress(from)) {
    throw new Error('User is not a valid address')
  }
  const contract = await registryContract({
    address: registry,
    web3,
  })
  debug({ contract })
  const workListId = await contract
    .methods
    .worklistBundleFor(
      workList,
    )
    .call()
    .then(hexToId(web3))
  debug({ workListId })
  const [model] = await processSchema
    .find({
      _id: workListId,
    })
  
  const worklistInstance = new web3.eth.Contract(JSON.parse(model.worklistAbi), workList)

  let nodeIndex = await worklistInstance
    .methods
    .elementIndexFor(id)
    .call()
  
    debug({ nodeIndex })
    
  const node = model
    .indexToElement[nodeIndex.toNumber()]
  const ddd = await worklistInstance
    .methods[node.name](
      ...[id, ...parameters],
    )
    .send({
      from,
      gas: 4700000,
    })
  debug({ ddd })
  // to do get the worklist address...
  return {
    id: workListId
  }           
}