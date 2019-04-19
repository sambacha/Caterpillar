import fs from 'fs'
import solc from 'solc'
import _debug from 'debug'

import StatusError from '../Status-Error'
import { registry } from '../repo'
import compile from '../util/compile'

import abstractFactory from '../../abstract/AbstractFactory.sol'
import processRegistry from '../../abstract/ProcessRegistry.sol' 

const debug = _debug('caterpillarql:add-registry')
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
    // how many blocks we wait for before result
    procContract.transactionConfirmationBlocks = 1;
    let gasUsed
    debug(output.contracts.ProcessRegistry.ProcessRegistry)
    const accounts = await web3.eth.personal.getAccounts()
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
          { gasUsed: g }: any,
        ): void => {
          gasUsed = g
        },
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