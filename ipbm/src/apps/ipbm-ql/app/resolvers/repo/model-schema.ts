import {
  // @ts-ignore
  model,
  Schema,
} from 'mongoose';

export default model<any>(
  'model',
  new Schema({
    rootProcessID: String,
    rootProcessName: String,
    bpmnModel: String,
    solidityCode: String,
    abi: String,
    bytecode: String,
    indexToElement: [Schema.Types.Mixed],
    worklistAbi: String,
  }),
)
