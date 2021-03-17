export default web3 =>
  hex => {
    if (!hex || hex === '0x0000000000000000000000000000000000000000000000000000000000000000') {
      return null
    }
    return web3
      .utils
      .toAscii(hex)
      .toString()
      .substr(0, 24)
  }