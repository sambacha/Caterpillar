import { compose } from 'ramda'
import hexToId from '../util/hex-to-id'
import { policy } from '../repo'
import findRoleMap from '../util/find-role-map'

const bindings = {
  0: 'UNBOUND',
  1: 'RELEASING',
  2: 'NOMINATED',
  3: 'BOUND'
}

export default ({
  web3,
  registryContract,
}): Function => async (
  contractAddress,
  role,
): Promise<any> => {
  const [{
    indexToRole,
    accessControlAbi,
  }] = await policy.find({
    _id: await registryContract
      .methods
      .bindingPolicyFor(contractAddress).call()
      .then(hexToId(web3))
  })

  const roleIndexMap = findRoleMap(indexToRole);

  const accessControlAddr = await registryContract
    .methods
    .findRuntimePolicy(contractAddress)
    .call()
  if(accessControlAddr.toString() === '0x0000000000000000000000000000000000000000') {
    return []
  }

  const runtimePolicyContract = new web3.eth.Contract(
    JSON.parse(accessControlAbi),
    accessControlAddr,
  )
  runtimePolicyContract.transactionConfirmationBlocks = 1;

  const roles = await Promise.all(
    indexToRole
      .filter(
        r => r,
      )  
      .filter(
        r => r === role || !role,
      )
      .map(
        r =>
          runtimePolicyContract
            .methods
            .roleState(
              roleIndexMap.get(r),
              contractAddress
            )
            .call()
            .then(
              result => ({
                role: r,
                binding: bindings[
                  compose(
                    web3.utils.hexToNumber,
                    web3.utils.toHex
                  )(result)
                ],
              })
            )
      )
  )
  
  if (role && !roles.length) {
    return [{
      role,
      binding: 'UNDEFINED',
    }]
  }
  return roles
}
    
