# IPBM

"Inter Planetary Business Modelling"

![bpmn model](Screenshot%20from%202019-04-27%2012-53-12.png)

IPBM will allow multiple parties to co operate on pre defined, pre agreed business processes without having to trust eachother.  There will be no "data silos" so no one will "own" the processes.

*Registries* can be created on an Ethereum Blockchain.  Registries can contain *models*.  Models are ethereum contracts which are compiled from XML BPMN models.  When executed these contracts operate the logic of the BPMN model.  Models can be combined together with sub models.  Models are associated with *policies* a policy configures how and by whom roles, defined in the model can be allocated and removed as the process progresses.  This allows a party to nominate and endorse other parties for a role.

Off chain information such as the BPMN models and the policy definitions is in mongodb. A plan for it to be on [IPFS](https://ipfs.io/).  It will be possible before running a contract to verify that its byte code is derived from these opff chain models and policies.

Contract execution on the blockchain can be debugged both in real time and historically by the [truffle debugger](https://truffleframework.com/docs/truffle/getting-started/debugging-your-contracts).

With the required browser extensions modellers and model users will be able to operate the system just using the browser.

**All** the business logic of the BPMN model will be enforced by the ethereum blockchain.

Currently there is a node app and a react app communicating through a graph-ql api.  These could be squashed into one app running in the browser with extensions.

Current development is in ipbm folder.

**IPBM** is forked from [Caterpillar](https://github.com/orlenyslp/Caterpillar)

The api is being changed from REST to graphql with subscriptions, the client is now written in reactjs.
