import _debug from 'debug'

import StatusError from '../Status-Error'
import { registrySchema } from '../repo'
import truffleCompile from '../util/truffle-compile'

import abstractFactory from '../../abstract/AbstractFactory.sol'
import processRegistry from '../../abstract/ProcessRegistry.sol' 

const debug = _debug('caterpillarql:registry')
const executionAccount = 0

export default async ({
  web3,
}): Promise<object> => {
  debug('DEPLOYING PROCESS RUNTIME REGISTRY ...');
  try {
    const contracts = await truffleCompile({
      AbstractFactory: abstractFactory,
      ProcessRegistry: processRegistry
    })
    debug({ contracts })
    if (Object.keys(contracts).length === 0) {
      debug('COMPILATION ERROR IN SMART CONTRACTS 2');
      debug('----------------------------------------------------------------------------------------------');
      throw new StatusError('COMPILATION ERROR IN RUNTIME REGISTRY SMART CONTRACTS', 400)
      return;
    }

    debug('PROCESS RUNTIME REGISTRY COMPILED SUCCESSFULLY');
    debug('CREATING RUNTIME REGISTRY INSTANCE ... ');
    const procContract = new web3.eth.Contract(contracts.ProcessRegistry.abi)
    /*
    procContract
      .getPastEvents(
        'allEvents',
        {
          fromBlock: 'latest',
        },
        e => debug('past event', e),
      )*/
    // how many blocks we wait for before result
    procContract.transactionConfirmationBlocks = 1;
    let gasUsed, createdBlockNumber
    const accounts = await web3.eth.personal.getAccounts()
    const contract = await procContract
      .deploy({
        data: contracts.ProcessRegistry.bytecode,
      })
      .send(
        {
          from: accounts[executionAccount],
          gas: 4700000,
        },
        // (error, txHash) => debug('s func', error, txHash),
      )
      .on(
        'receipt',
        (
          { gasUsed: g, blockNumber, ...rest }: any,
        ): void => {
          debug({ rest })
          createdBlockNumber = blockNumber
          gasUsed = g
        },
      )
      
    return registrySchema.create(
      {
        address: contract.address,  
        solidityCode: processRegistry,
        gasUsed,
        abi: JSON.stringify(contracts.ProcessRegistry.abi),
        bytecode: contracts.ProcessRegistry.bytecode,
      }
    )
  } catch (e) {
    debug("Error: ", e);
    debug('----------------------------------------------------------------------------------------------');
    throw new StatusError(e.message, 400)
  }
}