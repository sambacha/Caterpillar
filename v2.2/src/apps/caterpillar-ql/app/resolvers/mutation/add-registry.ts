import fs from 'fs'
import solc from 'solc'
import debug from 'debug'

import StatusError from '../Status-Error'
import { registry } from '../repo'

const executionAccount = 0

export default async ({
  web3,
}): Promise<object> => {
  console.log('DEPLOYING PROCESS RUNTIME REGISTRY ...');
  try {
    let sources = {
      AbstractFactory: {
        content: fs.readFileSync('./app/abstract/AbstractFactory.sol', 'utf8'),
      },
      ProcessRegistry: {
        content: fs.readFileSync('./app/abstract/ProcessRegistry.sol', 'utf8'),
      },
    };


    console.log('=============================================');
    console.log("SOLIDITY CODE");
    console.log('=============================================');
    // console.log(sources['ProcessRegistry'].content);
    console.log('....................................................................');

    let output = JSON.parse(
      solc.compile(
        JSON.stringify(
          {
            language: 'Solidity',
            sources,
            settings: {
              outputSelection: {
                '*': {
                  '*': ['*']
                }
              }
            }
          },
        ),
      ),
    )

    if (Object.keys(output.contracts).length === 0) {
      console.log('COMPILATION ERROR IN SMART CONTRACTS');
      console.log(output.errors);
      console.log('----------------------------------------------------------------------------------------------');
      throw new StatusError('COMPILATION ERROR IN RUNTIME REGISTRY SMART CONTRACTS', 400)
      return;
    }

    console.log('PROCESS RUNTIME REGISTRY COMPILED SUCCESSFULLY');
    console.log('CREATING RUNTIME REGISTRY INSTANCE ... ');
    // console.log(Object.keys(output.contracts), Object.keys(output.contracts['ProcessRegistry']), output.contracts.ProcessRegistry.ProcessRegistryinterface)
    const ProcContract = new web3.eth.Contract(output.contracts.ProcessRegistry.ProcessRegistry.interface)
    // how many blocks we wait for before result
    ProcContract.transactionConfirmationBlocks = 1;
    let gasUsed
    debug('caterpillarql:registry')(output.contracts.ProcessRegistry.ProcessRegistry)
    const accounts = await web3.eth.personal.getAccounts()
    const contract = await ProcContract
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
        solidityCode: sources['ProcessRegistry'].content,
        gasUsed,
        abi: JSON.stringify(output.contracts.ProcessRegistry.ProcessRegistry.abi),
        bytecode: output.contracts.ProcessRegistry.ProcessRegistry.evm.bytecode.object,
      }
    )
  } catch (e) {
    console.log("Error: ", e);
    console.log('----------------------------------------------------------------------------------------------');
    throw new StatusError(e.message, 400)
  }
}