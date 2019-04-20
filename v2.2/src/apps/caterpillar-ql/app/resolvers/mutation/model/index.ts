import _debug from 'debug'

import registryContract from '../../util/registry-contract'
import parseModel from './parse-model'
import sources from './sources'
import compile from '../../util/compile'
import registerModel from './deployment/register-model'

const debug = _debug('caterpillarql:model')

export default async ({
  bpmn,
  registry,
  web3,
}): Promise<object> => {
  const contract = await registryContract({
    address: registry,
    web3,
  })

  // nasty!!!
  const model = {
    bpmn,
  }
  await parseModel(model)
  const output = compile({
    ...sources,
    [model.id]: {
      content: model.solidity,
    }
  })
  if (!output.contracts || Object.keys(output.contracts).length === 0) {
    debug('COMPILATION ERROR IN SMART CONTRACTS');
    debug(output.errors);
    throw new Error('COMPILATION ERROR IN SMART CONTRACTS')
  }
  // this does nothing
  /*Object.keys(output.contracts).forEach(key => {
    let bytecode = '0x' + output.contracts[key].bytecode;
    var gasEstimate = web3.eth.estimateGas({data: bytecode});
    // console.log(".............................................");
    // console.log("Contract Name: " + key.split(':')[1]);
    // console.log("Gas Estimation: " + gasEstimate);
  });*/
  return registerModel(web3, contract, model, output.contracts);
}