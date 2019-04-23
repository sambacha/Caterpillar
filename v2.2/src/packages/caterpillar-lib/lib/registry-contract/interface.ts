
export default interface RegistryContract {
  address: string,
  events: any,
  addChildBundleId: ({
    parentBundleId,
    processBundleId: string,
    nodeIndex: number
  }) =>
    (any) => Promise<any>,
  allInstances: () =>
    Promise<[string]>,
  bindingPolicyFor: ({
    address: string,
  }) =>
    Promise<string>,
  bindingPolicyFromId: ({
    procId: string,
  }) =>
    Promise<string>,
  bundleFor: ({
    instance: string,
  }) =>
    Promise<string>,
  childrenFor: ({
    id: string,
    index: number,
  }) =>
    Promise<string>,
  findRuntimePolicy: ({
    address: string,
  }) =>
    Promise<string>,
  newBundleInstanceFor: ({
    bundleId,
    parent,
    policyOpAddr
  }) =>
    (any) => Promise<any>,  
  registerFactory: ({
    bundleId,
    address: string,
  }) =>
    (any) => Promise<any>,
  registerWorklist: ({
    bundleId,
    address: string,
  }) =>
    (any) => Promise<any>,
  taskRoleMapFromId: ({
    procId: string,
  }) =>
    Promise<string>,
  worklistBundleFor: ({
    address: string,
  }) =>
    Promise<string>,
}
