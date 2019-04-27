import _debug from 'debug'

import registryContract from '../../util/registry-contract'
import parseModel from './parse-model'
import sources from './sources'
import truffleCompile from '../../util/truffle-compile'
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
  debug('model contracts....')
  debug({
    ...sources,
    [model.id]: model.solidity,
  })
  const contracts = await truffleCompile({
    ...sources,
    [model.id]: model.solidity,
  })
  console.log('-------------------')
  console.log(model.solidity)
  console.log('-------------------')
  
  debug(
    Object.keys(contracts)
      .reduce(
        (
          acc,
          key,
        ) => ({
          ...acc,
          [key]: contracts[key].bytecode.slice(-30),
        }),
        {}
      )
  )


  if (!contracts || Object.keys(contracts).length === 0) {
    debug('COMPILATION ERROR IN SMART CONTRACTS');
    throw new Error('COMPILATION ERROR IN SMART CONTRACTS 1')
  }
  // this does nothing
  /*Object.keys(output.contracts).forEach(key => {
    let bytecode = '0x' + output.contracts[key].bytecode;
    var gasEstimate = web3.eth.estimateGas({data: bytecode});
    // console.log(".............................................");
    // console.log("Contract Name: " + key.split(':')[1]);
    // console.log("Gas Estimation: " + gasEstimate);
  });*/
  return registerModel(
    web3,
    contract,
    model,
    contracts,
  );
}