import { registry } from '../repo'

export default async ({
  web3,
  address,
}): Promise<any> => {
  const [{ abi }] = await registry
    .find({ address })
  if (abi) {
    const c =  new web3.eth.Contract(JSON.parse(abi), address)
    c.transactionConfirmationBlocks = 1
    return c
  }
}