import {
  // @ts-ignore
  model,
  Schema,
} from 'mongoose';

export default model<any>(
  'registry',
  new Schema({
    address: String,
    gasUsed: Schema.Types.Number,
    solidityCode: String,
    abi: String,
    bytecode: String,
  }),
)
