import _debug from 'debug'

import {
  policySchema,
} from '../repo'
import registryContract from '../util/registry-contract'
import hexToId from '../util/hex-to-id'
import findRoleMap from '../util/find-role-map'
import createContract from '../util/create-contract'

const debug = _debug('caterpillarql:mutation:nominate')

export default async ({
  processAddress,
  registryAddress,
  nominator,
  nominatorRole,
  nominee,
  nomineeRole,
  web3,
}): Promise<object> => {
  
  const accounts = await web3.eth.personal.getAccounts()
  const contract = await registryContract({
    address: registryAddress,
    web3,
  })
  const policyId = await contract
    .bindingPolicyFor({
      address: processAddress,
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
  
  if(!web3.utils.isAddress(nominee)) {
    throw new Error('nominee is not an address')
  }
  
  if(!web3.utils.isAddress(processAddress)) {
    throw new Error('processAddress is not an address')
  }
  const bundleId = await contract
    .bundleFor({
      instance: processAddress,
    })

  const accessControlAddress = await contract
    .findRuntimePolicy({
      address: processAddress,
    })
    
  debug({ accessControlAddress })

  if (accessControlAddress === '0x0000000000000000000000000000000000000000') {
    throw new Error('Process instance not found')
  }
  debug(`${nominatorRole}[${nominator}] is nominating ${nomineeRole}[${nominee}]`)
  debug(`Process Case: ${processAddress}`)
  const nominated = await createContract(web3)(JSON.parse(policy.accessControlAbi), accessControlAddress)
    .methods
    .nominate(
      roleIndexMap.get(nominatorRole),
      roleIndexMap.get(nomineeRole),
      nominator,
      nominee,
      processAddress,
    )
    .send({
      from: nominator,
      gas: 4700000
    })

  debug({ nominated })
  return {
    id: bundleId,
    address: processAddress,
    registryContract: contract,
  }
}