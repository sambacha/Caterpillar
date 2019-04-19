export default web3 =>
  hex =>
    web3
      .utils
      .toAscii(hex)
      .toString()
      .substr(0, 24)