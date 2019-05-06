import Web3 from 'web3'
import mongoose from 'mongoose'
import _debug from 'debug'
import serve from './serve'

const web3 = new Web3('ws://127.0.0.1:8545')

const debug = _debug('caterpillarql:app')


mongoose.Promise = global.Promise

mongoose.connect('mongodb://localhost:27017/caterpillarRepo9')
  .then(
    () => {
      debug('Conectado a MongoDB')
      serve(web3)
    }
  )
  .catch(
    (ex) => {
      debug('Mongo db connection fail', ex)
      global.process.exit(1)
    } 
  )
