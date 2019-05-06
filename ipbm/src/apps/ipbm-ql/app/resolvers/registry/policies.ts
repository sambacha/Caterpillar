import {
  policySchema
} from '../repo'

export default async ({
  registryId,
  _id,
}): Promise<any[]> =>
  policySchema.find({
    registryId,
    ..._id && { _id },
  })
  