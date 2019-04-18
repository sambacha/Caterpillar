import instanceState from './instance-state'

export default (web3): object => ({
  instanceState: ({ address, registryContract, bpmnModel }) =>
    instanceState({ web3, registryContract, bpmnModel })(address),
  resources: (parent, { role }) =>
    console.log({ role }) ||
      [role],
})