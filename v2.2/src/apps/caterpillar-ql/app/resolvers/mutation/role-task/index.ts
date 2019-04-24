import _debug from 'debug'
import compile from '../../util/compile'
import registryContract from '../../util/registry-contract'
import findRoleMap from '../../util/find-role-map'
import {
  roleTask as roleTaskSchema,
  policy as policySchema
} from '../../repo'
import searchRepository from './deployment/search-repository'
import generateRoleTaskIndexes from './deployment/dynamic-binding/validation_code_gen/generate-role-task-indexes'
import generateRoleTaskContract from './deployment/dynamic-binding/validation_code_gen/generate-role-task-contract'
import createContract from '../../util/create-contract'

const debug = _debug('caterpillarql:role-task')

export default async ({
  policyId,
  rootProc,
  registry,
  web3,
}): Promise<object> => {
  const contract = await registryContract({
    address: registry,
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
  const content = generateRoleTaskContract({
    contractName: 'TaskRoleContract',
    processData: generateRoleTaskIndexes(searchResults),
  })

  const output = compile({
    TaskRoleContract: {
      content,
    },
  })

  const procContract = createContract(web3)(output.contracts.TaskRoleContract.TaskRoleContract_Contract.abi);
  
  const accounts = await web3.eth.personal.getAccounts()

  const ret = await procContract
    .deploy({
      data: "0x" + output.contracts.TaskRoleContract.TaskRoleContract_Contract.evm.bytecode.object,                          
    })
    .send({
      from: accounts[0],
      gas: 4700000
    })

  const created = await roleTaskSchema
    .create(
      {
          address: ret.address,
          solidityCode: content,
          abi: JSON.stringify(output.contracts.TaskRoleContract.TaskRoleContract_Contract.abi),
          bytecode: output.contracts.TaskRoleContract.TaskRoleContract_Contract.evm.bytecode.object
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