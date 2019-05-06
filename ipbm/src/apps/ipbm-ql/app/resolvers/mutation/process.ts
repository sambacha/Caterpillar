import _debug from 'debug'

import {
  roleTaskSchema,
  policySchema,
  modelSchema
} from '../repo'
import registryContract from '../util/registry-contract'
import findRoleMap from '../util/find-role-map'
import createContract from '../util/create-contract'

const debug = _debug('caterpillarql:mutation:process')

export default async ({
  creator,
  creatorRole,
  modelId,
  registryAddress,
  web3,
}): Promise<object> => {
  if (!web3.utils.isAddress(creator)) {
    throw new Error('Case creator is not a valid address')
  }
  const contract = await registryContract({
    address: registryAddress,
    web3,
  })
  const roleTaskId = await contract
    .taskRoleMapFromId({
      procId: web3.utils.fromAscii(modelId),
    })
  const [roleTask] = await roleTaskSchema
    .find({ _id: roleTaskId })
  
  const policyId = await contract
    .bindingPolicyFromId({
      procId: web3.utils.fromAscii(modelId),
    })
  const [policy] = await policySchema
    .find({
      _id: policyId
    })
  const roleIndexMap = findRoleMap(policy.indexToRole);
  
  if (!roleIndexMap.has(creatorRole)) {
    throw new Error('Case Creator Role NOT found')
  }
  
  const [model] = await modelSchema
    .find({
      _id: modelId,
    })
  const accessControlContract = createContract(web3)(JSON.parse(policy.accessControlAbi))
  const created = await accessControlContract
    .deploy({
      arguments: [
        registryAddress,
        policy.address,
        roleTask.address
      ],
      data: policy.accessControlBytecode,
    })
    .send({
      from: creator,
      gas: 4700000,
    })
  debug('access control contract created', created.address)
  const instance = await contract
    .newBundleInstanceFor({
      bundleId: web3.utils.fromAscii(model._id.toString()),
      parent: '0x0000000000000000000000000000000000000000',
      policyOpAddr: created.address,
    })
    ({
      from: creator, //accounts[0],
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
  debug(
    'got to nominated..',
    creatorRole,
    roleIndexMap.get(creatorRole),
    creator,
    result.returnValues.processAddress.toString()
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
    registryContract: contract                
  }
}