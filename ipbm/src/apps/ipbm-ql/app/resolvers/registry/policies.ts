import {
  policy
} from '../repo'

export default async ({ registry, _id }): Promise<any[]> =>
  policy.find({ registry, ..._id && { _id }})
  