import { model, Schema } from 'mongoose';

export const process = model<any>(
  'ProcessRepo',
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
);

export const registry = model<any>(
  'RegistryRepo',
  new Schema({
    address: String,
    gasUsed: Schema.Types.Number,
    solidityCode: String,
    abi: String,
    bytecode: String,
  }),
);

export const policy = model<any>(
  'PolicyRepo',
  new Schema({
    address: String,
    model: String,
    solidityCode: String,
    abi: String,
    bytecode: String,
    indexToRole: [String],
    accessControlAbi: String,
    accessControlBytecode: String,
  }),
);

export const roleTask = model<any>(
  'RoleTaskRepo',
  new Schema({
    address: String,
    solidityCode: String,
    abi: String,
    bytecode: String,
  }),
);
