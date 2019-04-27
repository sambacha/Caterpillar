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

const debug = _debug('caterpillarql:mutation:release')

export default async ({
  pcase,
  registry,
  nominator,
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
    .bindingPolicyFor({
      address: pcase,
    })
  const [policy] = await policySchema
      .find({ _id: policyId })
  const roleIndexMap = findRoleMap(policy.indexToRole)
  if (!roleIndexMap.has(nominatorRole)) {
    throw new Error('No nominator role')
  }
  
  if (!roleIndexMap.has(nomineeRole)) {
    throw new Error('No nominee role')
  }
  
  if(!web3.utils.isAddress(nominator)) {
    throw new Error('nominator is not an address')
  }
  
  if(!web3.utils.isAddress(pcase)) {
    throw new Error('pcase is not an address')
  }
  const bundleId = await contract
    .bundleFor({
      instance: pcase,
    })
  
  const accessControlAddress = await contract
    .findRuntimePolicy({
      address: pcase,
    })
    .call()
  
  debug({ accessControlAddress })

  if (accessControlAddress === '0x0000000000000000000000000000000000000000') {
    throw new Error('Process instance not found')
  }

  debug(`${nominatorRole}[${nominator}] is releasing ${nomineeRole}`);
  debug(`Process Case: ${pcase}`);
  
  const released = await createContract(web3)(JSON.parse(policy.accessControlAbi), accessControlAddress)
    .methods
    .release(
      roleIndexMap.get(nominatorRole),
      roleIndexMap.get(nomineeRole),
      nominator,
      pcase,
    )
    .send({
      from: nominator,
      gas: 4700000
    })

  debug({ released })
  return {
    id: bundleId,
    address: pcase
  }
}