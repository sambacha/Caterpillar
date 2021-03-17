import {
  // @ts-ignore
  model,
  Schema,
} from 'mongoose';

export default model<any>(
  'policy',
  new Schema({
    address: String,
    registryId: String,
    policyModel: String,
    solidityCode: String,
    abi: String,
    bytecode: String,
    indexToRole: [String],
    accessControlAbi: String,
    accessControlBytecode: String,
  }),
)
