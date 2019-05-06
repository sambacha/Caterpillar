import {
  // @ts-ignore
  model,
  Schema,
} from 'mongoose';

export default model<any>(
  'model',
  new Schema({
    registryId: String,
    rootProcessID: String,
    name: String,
    bpmn: String,
    solidity: String,
    abi: String,
    bytecode: String,
    indexToElement: [Schema.Types.Mixed],
    worklistAbi: String,
  }),
)
