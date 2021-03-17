import {
  // @ts-ignore
  model,
  Schema,
} from 'mongoose';

export default model<any>(
  'roleTask',
  new Schema({
    address: String,
    solidityCode: String,
    abi: String,
    bytecode: String,
  }),
)