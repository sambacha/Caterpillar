export default web3 =>
  (...params) => {
    const contract = new web3.eth.Contract(...params)
    contract.transactionConfirmationBlocks = 1
    return contract
  }