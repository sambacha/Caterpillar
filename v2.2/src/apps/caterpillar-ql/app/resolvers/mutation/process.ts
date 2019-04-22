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

const debug = _debug('caterpillarql:mutation:process')

export default async ({
  creator,
  creatorRole,
  modelId,
  registry,
  web3,
}): Promise<object> => {
  if (!web3.utils.isAddress(creator)) {
    throw new Error('Case creator is not a valid address')
  }
  const accounts = await web3.eth.personal.getAccounts()
  const contract = await registryContract({
    address: registry,
    web3,
  })
  const roleTaskId = await contract
    .methods
    .taskRoleMapFromId(
      web3.utils.fromAscii(modelId),
    )
    .call()
    .then(hexToId(web3))
  const [roleTask] = await roleTaskSchema
    .find({ _id: roleTaskId })
  
  const policyId = await contract
    .methods
    .bindingPolicyFromId(
      web3.utils.fromAscii(modelId),
    )
    .call()
    .then(hexToId(web3))
  const [policy] = await policySchema
    .find({
      _id: policyId
    })
  const roleIndexMap = findRoleMap(policy.indexToRole);
  
  if (!roleIndexMap.has(creatorRole)) {
    throw new Error('Case Creator Role NOT found')
  }
  
  const [model] = await processSchema
    .find({
      _id: modelId,
    })
  const accessControlContract = createContract(web3)(JSON.parse(policy.accessControlAbi))
  const created = await accessControlContract
    .deploy({
      arguments: [
        registry,
        policy.address,
        roleTask.address
      ],
      data: "0x" + policy.accessControlBytecode,
    })
    .send({
      from: creator,
      gas: 4700000,
    })
  const instance = await contract
    .methods
    .newBundleInstanceFor(
      web3.utils.fromAscii(model._id.toString()),
      '0x0000000000000000000000000000000000000000',
      created.address,
    )
    .send({
      from: accounts[0],
      gas: 4500000,
    })
  debug({ instance })
  const result = await new Promise(
    (resolve, reject) => {
      const event = contract
    .events
    .NewInstanceCreatedFor({
      fromBlock: instance.blockNumber,
    })
    .on(
      'data',
      e => {
        if (e.transactionHash === instance.transactionHash) {
          event.removeListener('data')
          event.removeListener('error')
          resolve(e)
        }
      },
    )
    .on(
      'error',
      e => {
        event.removeListener('data')
        event.removeListener('error')
        reject(e)
      },
    );
  

    }
  )
  
  const nominated = await created
    .methods
    .nominateCaseCreator(
      roleIndexMap.get(creatorRole),
      creator,
      result.returnValues.processAddress.toString(),
    )
    .send({
      from: creator,
      gas: 4700000,
    })
    
  return {
    id: modelId,
    address: result.returnValues.processAddress,
    name: model.rootProcessName,
    bpmnModel: model.bpmnModel,
    registryContract: contract,
                  
  }
}