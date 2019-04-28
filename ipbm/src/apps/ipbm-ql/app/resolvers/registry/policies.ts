import {
  policySchema
} from '../repo'

export default async ({
  registryAddress,
  _id,
}): Promise<any[]> =>
  policySchema.find({
    registryAddress,
    ..._id && { _id },
  })
  