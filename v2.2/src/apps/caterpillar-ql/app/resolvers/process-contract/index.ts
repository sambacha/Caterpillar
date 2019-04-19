import instanceState from './instance-state'
import resources from './resources'

export default (web3): object => ({
  instanceState: ({ address, registryContract, bpmnModel }) =>
    instanceState({ web3, registryContract, bpmnModel })(address),
  resources: ({ address, registryContract }, { role }) =>
    resources({ web3, registryContract })(address, role),

})