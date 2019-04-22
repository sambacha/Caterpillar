import _debug from 'debug'
import compile from '../../util/compile'
import registryContract from '../../util/registry-contract'
import { policy as policySchema } from '../../repo'
import {generatePolicy} from './dynamic_binding/validation_code_gen/BindingPolicyGenerator';
import bindingAccessControl from './dynamic_binding/runtime_solidity/BindingAccessControl.sol'

const debug = _debug('caterpillarql:policy')

export default async ({
  model,
  registry,
  web3,
}): Promise<object> => {
  const contract = await registryContract({
    address: registry,
    web3,
  })
  const policy = await generatePolicy(model, 'BindingPolicy');
  debug('=============================================');
  debug("SOLIDITY CODE");
  debug('=============================================');
  debug(policy)
  debug('....................................................................');

  const output = compile({
    BindingPolicy: {
      content: policy.solidity,
    },
    BindingAccessControl: {
      content: bindingAccessControl,
    }
  })
  if (!output.contracts || !Object.keys(output.contracts).length) {
    debug('COMPILATION ERROR IN POLICY CONTRACTS');
    debug(output.errors);
    debug('----------------------------------------------------------------------------------------------');
    throw new Error('COMPILATION ERROR IN POLICY CONTRACTS')
  }
  const procContract = new web3.eth.Contract(output.contracts['BindingPolicy']['BindingPolicy_Contract'].abi);
  procContract.transactionConfirmationBlocks = 1
    
  const accounts = await web3.eth.personal.getAccounts()
  const result = await procContract
    .deploy({
      data: '0x' + output.contracts['BindingPolicy']['BindingPolicy_Contract'].evm.bytecode.object
    })
    .send({
      from: accounts[0],
      gas: 4700000,
    })
  
  let indexToRole = [];
  for (let [role, index] of policy.roleIndexMap) {
      indexToRole[index] = role;
  }
  return policySchema.create(
    {
        address: contract.address,
        model: model,
        solidityCode: policy.solidity,
        abi: JSON.stringify(output.contracts.BindingPolicy.BindingPolicy_Contract.abi),
        bytecode: output.contracts.BindingPolicy.BindingPolicy_Contract.evm.bytecode.object,
        indexToRole,
        accessControlAbi: JSON.stringify(output.contracts.BindingAccessControl.BindingAccessControl.abi),
        accessControlBytecode:output.contracts.BindingAccessControl.BindingAccessControl.evm.bytecode.object,
    },
  )
}