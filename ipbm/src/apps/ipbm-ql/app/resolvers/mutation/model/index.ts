import _debug from 'debug'

import registryContract from '../../util/registry-contract'
import parseModel from './parse-model'
import sources from './sources'
import truffleCompile from '../../util/truffle-compile'
import registerModel from './deployment/register-model'
import {
  registrySchema
} from '../../repo'
const debug = _debug('caterpillarql:model')

export default async ({
  bpmn,
  registryId,
  web3,
}): Promise<object> => {
  debug('model mutation', registryId)
  const [{ address: registryAddress }] = await registrySchema
    .find({
      _id: registryId,
    })
  debug('found', registryAddress)
  const contract = await registryContract({
    address: registryAddress,
    web3,
  })
  debug('adding model to', registryAddress)
  const model = await parseModel(bpmn)
  debug({
    ...sources,
    [model.id]: model.solidity,
  })
  const contracts = await truffleCompile({
    ...sources,
    [model.id]: model.solidity,
  })  
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
    debug('COMPILATION ERROR IN SMART CONTRACTS')
    throw new Error('COMPILATION ERROR IN SMART CONTRACTS 1')
  }
  // this does nothing
  /*Object.keys(output.contracts).forEach(key => {
    let bytecode = '0x' + output.contracts[key].bytecode
    var gasEstimate = web3.eth.estimateGas({data: bytecode})
    // debug(".............................................")
    // debug("Contract Name: " + key.split(':')[1])
    // debug("Gas Estimation: " + gasEstimate)
  })*/
  return registerModel(
    web3,
    contract,
    model,
    contracts,
    registryId,
  )
}