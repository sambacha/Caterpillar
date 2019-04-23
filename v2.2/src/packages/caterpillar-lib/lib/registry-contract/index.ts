import Web3 from 'web3'
import createContract from '../create-contract'
import RegistryContract from './interface'
export { 
  RegistryContract,
}
export default ({
  hexToId,
  web3,
}: {
  hexToId: (string) => string,
  web3: Web3,
}) => (
  {
    abi,
    address,
  }: {
    abi: any,
    address: string
  }): RegistryContract => {
  const contract = createContract(web3)(
    JSON.parse(abi),
    address,
  )
  return<RegistryContract> {
    address: contract.address,
    events: contract.events,
    addChildBundleId: ({
      parentBundleId,
      processBundleId,
      nodeIndex
    }) =>
      contract
        .methods
        .addChildBundleId(
          parentBundleId,
          processBundleId,
          nodeIndex
        )
        .send,
    allInstances: () =>
      contract
        .methods
        .allInstances
        .call(),
    bindingPolicyFor: ({
      address,
    }) =>
      contract
        .methods
        .bindingPolicyFor(address)
        .call()
        .then(hexToId),
    bindingPolicyFromId: ({
      procId,
    }) =>
      contract
        .methods
        .bindingPolicyFromId(
          procId,
        )
        .call()
        .then(hexToId),
    bundleFor: ({
      instance,
    }) =>
      contract
        .methods
        .bundleFor(instance)
        .call()
        .then(hexToId),
    childrenFor: ({
      id,
      index = 0,
    }) =>
      contract
        .methods
        .childrenFor(id, index)
        .call()
        .then(hexToId),
    findRuntimePolicy: ({
      address,
    }) =>
      contract
        .methods
        .findRuntimePolicy(address)
        .call(),
    newBundleInstanceFor: ({
      bundleId,
      parent,
      policyOpAddr
    }) =>
      contract
        .methods
        .newBundleInstanceFor(
          bundleId,
          parent,
          policyOpAddr
        )
        .send,
    registerFactory: ({
      bundleId,
      address,
    }) =>
      contract
        .methods
        .registerFactory(
          bundleId,
          address,
        )
        .send,
    registerWorklist: ({
      bundleId,
      address,
    }) =>
      contract
        .methods
        .registerWorklist(
          bundleId,
          address,
        )
        .send,
    taskRoleMapFromId: ({
      procId,
    }) =>
      contract
        .methods
        .taskRoleMapFromId(
          procId,
        )
        .call()
        .then(hexToId),
    worklistBundleFor: ({
      address,
    }) =>
      contract
        .methods
        .worklistBundleFor(
          address,
        )
        .call()
        .then(hexToId),
  }
}
