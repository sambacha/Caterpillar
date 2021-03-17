To debug a transaction with truffle.

You need to make sure the **exact** solidity code is in contracts folder.  **Any** differences will result in non matching byte code and your contracts will not be recognised.  Including file names...

Install truffle

    npm i -g truffle

then debug,,

    truffle debug [transaction]