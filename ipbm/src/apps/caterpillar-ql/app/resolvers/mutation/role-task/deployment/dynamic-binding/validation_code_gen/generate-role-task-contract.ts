import * as ejs from "ejs"
import procesRole2ArrsolEJS from '../../../../../../templates/processRole2solArray.ejs'

let procesRole2solArrTemplate = ejs.compile(procesRole2ArrsolEJS);

export default ({
  contractName,
  processData
 }) =>
  procesRole2solArrTemplate({
    contractName,
    processData
  })