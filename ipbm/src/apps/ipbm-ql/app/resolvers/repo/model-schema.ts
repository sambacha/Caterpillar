import {
  // @ts-ignore
  model,
  Schema,
} from 'mongoose';
import { settings } from 'cluster';

export default model<any>(
  'model',
  new Schema({
    registryId: String,
    parentId: String,
    rootProcessId: String,
    name: String,
    bpmn: String,
    solidity: String,
    abi: String,
    bytecode: String,
    indexToElement: [Schema.Types.Mixed],
    worklistAbi: String,
  }),
)
