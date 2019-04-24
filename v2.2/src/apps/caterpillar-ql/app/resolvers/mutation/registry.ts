import _debug from 'debug'

import StatusError from '../Status-Error'
import { registry } from '../repo'
import compile from '../util/compile'

import abstractFactory from '../../abstract/AbstractFactory.sol'
import processRegistry from '../../abstract/ProcessRegistry.sol' 

const debug = _debug('caterpillarql:registry')
const executionAccount = 0

export default async ({
  web3,
}): Promise<object> => {
  debug('DEPLOYING PROCESS RUNTIME REGISTRY ...');
  try {
    const output = compile({
      AbstractFactory: {
        content: abstractFactory,
      },
      ProcessRegistry: {
        content: processRegistry,
      },
    });

    if (Object.keys(output.contracts).length === 0) {
      debug('COMPILATION ERROR IN SMART CONTRACTS');
      debug(output.errors);
      debug('----------------------------------------------------------------------------------------------');
      throw new StatusError('COMPILATION ERROR IN RUNTIME REGISTRY SMART CONTRACTS', 400)
      return;
    }

    debug('PROCESS RUNTIME REGISTRY COMPILED SUCCESSFULLY');
    debug('CREATING RUNTIME REGISTRY INSTANCE ... ');
    const procContract = new web3.eth.Contract(output.contracts.ProcessRegistry.ProcessRegistry.interface)
    /*
    procContract
      .getPastEvents(
        'allEvents',
        {
          fromBlock: 'latest',
        },
        e => console.log('past event', e),
      )*/
    // how many blocks we wait for before result
    procContract.transactionConfirmationBlocks = 1;
    let gasUsed, createdBlockNumber
    const accounts = await web3.eth.personal.getAccounts()
    procContract
      .events
      .allEvents(
        {
          fromBlock: 517366,
        },
        (err, e) => console.log('past event', e),
      )
      .on(
        'data',
        console.log
      )
    const contract = await procContract
      .deploy({
        data: "0x" + output.contracts.ProcessRegistry.ProcessRegistry.evm.bytecode.object,
      })
      .send(
        {
          from: accounts[executionAccount],
          gas: 4700000,
        },
        // (error, txHash) => console.log('s func', error, txHash),
      )
      .on(
        'receipt',
        (
          { gasUsed: g, blockNumber }: any,
        ): void => {
          createdBlockNumber = blockNumber
          gasUsed = g
        },
      )
      console.log({ createdBlockNumber })
    contract
      .getPastEvents(
        'allEvents',
        {
          fromBlock: createdBlockNumber - 1,
        },
        (err, e) => console.log('past event', e),
      )
      
    return registry.create(
      {
        address: contract.address,
        solidityCode: processRegistry,
        gasUsed,
        abi: JSON.stringify(output.contracts.ProcessRegistry.ProcessRegistry.abi),
        bytecode: output.contracts.ProcessRegistry.ProcessRegistry.evm.bytecode.object,
      }
    )
  } catch (e) {
    debug("Error: ", e);
    debug('----------------------------------------------------------------------------------------------');
    throw new StatusError(e.message, 400)
  }
}