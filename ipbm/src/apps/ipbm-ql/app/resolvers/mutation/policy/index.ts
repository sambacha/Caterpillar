import _debug from 'debug'
import truffleCompile from '../../util/truffle-compile'
import registryContract from '../../util/registry-contract'
import debugContracts from '../../util/debug-contracts'
import { policySchema } from '../../repo'
import generatePolicy from './dynamic_binding/validation_code_gen/generate-policy';
import bindingAccessControl from '../../../abstract/BindingAccessControl.sol'
import {
  registrySchema
} from '../../repo'

const debug = _debug('caterpillarql:policy')

export default async ({
  policyModel,
  registryId,
  web3,
}): Promise<object> => {
  const [{ address: registryAddress }] = await registrySchema
    .find({
      _id: registryId,
    })
  debug('found', registryAddress)
  
  const contract = await registryContract({
    address: registryAddress,
    web3,
  })
  const policy = await generatePolicy(
    policyModel,
    'BindingPolicy',
  );
  debug('=============================================');
  debug("SOLIDITY CODE");
  debug('=============================================');
  debug(policy.solidity)
  debug('....................................................................');
  
  const contracts = await truffleCompile({
    BindingPolicy: policy.solidity,
    BindingAccessControl: bindingAccessControl
  })
  if (!contracts || !Object.keys(contracts).length) {
    debug('COMPILATION ERROR IN POLICY CONTRACTS');
    debug('----------------------------------------------------------------------------------------------');
    throw new Error('COMPILATION ERROR IN POLICY CONTRACTS')
  }
  debugContracts({
    debug,
    contracts,
  })
  const procContract = new web3.eth.Contract(contracts['BindingPolicy_Contract'].abi);
  procContract.transactionConfirmationBlocks = 1

  const accounts = await web3.eth.personal.getAccounts()
  const result = await procContract
    .deploy({
      data: contracts['BindingPolicy_Contract'].bytecode
    })
    .send({
      from: accounts[0],
      gas: 4700000,
    })
  
  let indexToRole = [];
  for (let [role, index] of policy.roleIndexMap) {
      indexToRole[index] = role;
  }
  debug({
    address: result.address,
    registryAddress: contract.address,
    policyModel,
    solidityCode: policy.solidity,
    abi: JSON.stringify(contracts.BindingPolicy_Contract.abi),
    bytecode: contracts.BindingPolicy_Contract.bytecode,
    indexToRole,
    accessControlAbi: JSON.stringify(contracts.BindingAccessControl.abi),
    accessControlBytecode: contracts.BindingAccessControl.bytecode,
})
  return policySchema.create(
    {
        address: result.address,
        registryId,
        policyModel,
        solidityCode: policy.solidity,
        abi: JSON.stringify(contracts.BindingPolicy_Contract.abi),
        bytecode: contracts.BindingPolicy_Contract.bytecode,
        indexToRole,
        accessControlAbi: JSON.stringify(contracts.BindingAccessControl.abi),
        accessControlBytecode: contracts.BindingAccessControl.bytecode,
    },
  )
}