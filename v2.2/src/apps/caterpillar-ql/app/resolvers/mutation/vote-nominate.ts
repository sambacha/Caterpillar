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

const debug = _debug('caterpillarql:mutation:vote-nominate')

export default async ({
  isAccepted,
  pcase,
  registry,
  endorser,
  endorserRole,
  nominatorRole,
  nomineeRole,
  web3,
}): Promise<object> => {
  
  const accounts = await web3.eth.personal.getAccounts()
  const contract = await registryContract({
    address: registry,
    web3,
  })
  const policyId = await contract
    .methods
    .bindingPolicyFor(
      pcase,
    )
    .call()
    .then(hexToId(web3))
  const [policy] = await policySchema
      .find({ _id: policyId })
  const roleIndexMap = findRoleMap(policy.indexToRole)
  if (!roleIndexMap.has(nominatorRole)) {
    throw new Error('No nominator role')
  }
  
  if (!roleIndexMap.has(nomineeRole)) {
    throw new Error('No nominee role')
  }
  if (!roleIndexMap.has(endorserRole)) {
    throw new Error('Noendorser role')
  }
  
  if(!web3.utils.isAddress(endorser)) {
    throw new Error('endorser is not an address')
  }
  
  if(!web3.utils.isAddress(pcase)) {
    throw new Error('pcase is not an address')
  }
  const bundleId = await contract
    .methods
    .bundleFor(pcase)
    .call()
    .then(hexToId(web3))
  debug({ bundleId })

  const accessControlAddress = await contract
    .methods
    .findRuntimePolicy(pcase)
    .call()
  
  debug({ accessControlAddress })

  if (accessControlAddress === '0x0000000000000000000000000000000000000000') {
    throw new Error('Process instance not found')
  }
  const voted = await createContract(web3)(JSON.parse(policy.accessControlAbi), accessControlAddress)
    .methods
    .voteN(
      roleIndexMap.get(nominatorRole),
      roleIndexMap.get(nomineeRole),
      roleIndexMap.get(endorserRole),
      endorser,
      pcase,
      isAccepted.toString(),
    )
    .send({
      from: endorser,
      gas: 4700000
    })

  debug({ voted })
  return {
    id: bundleId,
    address: pcase
  }
}