# IPBM

"Inter Planetary Business Modelling"

**IPBM** is derived from [Caterpillar](https://github.com/orlenyslp/Caterpillar)

*Registries* can be created on an Ethereum Blockchain.  Registries can contain *models*.  Models are sets contracts which are compiled from XML BPMN models.  When executed these contracts operate the logic of the BPMN model.  Models can be combined together with sub models.  Models are associated with *policies* a policy configures how and by whom roles, defined in the model can be allocated and removed as the process progresses.

[IPFS](https://ipfs.io/) **will** serve as the repository for all off chain information - such as the BPMN models and the policy definitions.  It will be possible before running a contract to verify that it's byte code is derived from these models and policies.  At the moment this infoirmation is stored locally with mongodb.

Contract execution on the blockchain can be debugged both in real time and historically by the [truffle debugger](https://truffleframework.com/docs/truffle/getting-started/debugging-your-contracts).

With the required browser extensions modellers and model users will be able to operate the system just using the browser.

**All** the business logic of the BPMN model will be enforced by the ethereum blockchain.

IPBM will allow multiple parties to co operate in pre defined, pre aggreed business processes without having to trust eachother.  There will be no "data silos" so no one will "own" the processes.

Currently there is a node app and a react app communicating through a graph-ql api.  These will be squashed into one app running in the browser with extensions.

Current development is in ipbm folder.
