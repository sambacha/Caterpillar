import _debug from 'debug'
import truffleCompile from '../../util/truffle-compile'
import registryContract from '../../util/registry-contract'
import findRoleMap from '../../util/find-role-map'
import {
  roleTaskSchema,
  policySchema
} from '../../repo'
import searchRepository from './deployment/search-repository'
import generateRoleTaskIndexes from './deployment/dynamic-binding/validation_code_gen/generate-role-task-indexes'
import generateRoleTaskContract from './deployment/dynamic-binding/validation_code_gen/generate-role-task-contract'
import createContract from '../../util/create-contract'

const debug = _debug('caterpillarql:role-task')

export default async ({
  policyId,
  rootProc,
  registryAddress,
  web3,
}): Promise<object> => {
  const contract = await registryContract({
    address: registryAddress,
    web3,
  })
  const [policy] = await policySchema
    .find({
      _id: policyId
    })
  const searchResults = await searchRepository(
    web3,
    contract,
    rootProc,
    policyId,
    findRoleMap(policy.indexToRole)
  )
  const solidityCode = generateRoleTaskContract({
    contractName: 'TaskRoleContract',
    processData: generateRoleTaskIndexes(searchResults),
  })
  const contracts = await truffleCompile({
    TaskRoleContract: solidityCode,
  })

  const procContract = createContract(web3)(contracts.TaskRoleContract_Contract.abi);

  const accounts = await web3.eth.personal.getAccounts()

  const ret = await procContract
    .deploy({
      data: contracts.TaskRoleContract_Contract.bytecode,
    })
    .send({
      from: accounts[0],
      gas: 4700000
    })

  const created = await roleTaskSchema
    .create(
      {
        address: ret.address,
        solidityCode,
        abi: JSON.stringify(contracts.TaskRoleContract_Contract.abi),
        bytecode: contracts.TaskRoleContract_Contract.bytecode
      }
    )
  const related = await contract
    .relateProcessToPolicy({
      bundleId: web3.utils.fromAscii(rootProc),
      policyId: web3.utils.fromAscii(policyId),
      roleTaskId: web3.utils.fromAscii(created._id.toString()),
    })
    ({
      from: accounts[0],
      gas: 4700000
    })

  return created

}