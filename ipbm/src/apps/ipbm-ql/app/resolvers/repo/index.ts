import {
  // @ts-ignore
  model as mongoModel,
  Schema,
} from 'mongoose';

import modelSchema from './model-schema'
import registrySchema from './registry-schema'
import policySchema from './policy-schema'
import roleTaskSchema from './role-task-schema'

export {
  modelSchema,
  registrySchema,
  policySchema,
  roleTaskSchema,
}
