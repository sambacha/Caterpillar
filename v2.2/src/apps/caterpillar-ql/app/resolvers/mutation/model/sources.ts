import abstractFactory from '../../../abstract/AbstractFactory.sol'
import abstractRegistry from '../../../abstract/AbstractRegistry.sol'
import abstractWorklist from '../../../abstract/AbstractWorklist.sol'
import processRegistry from '../../../abstract/ProcessRegistry.sol'
import abstractProcess from '../../../abstract/AbstractProcess.sol'
import bindingAccessControl from '../../../abstract/BindingAccessControl.sol'

export default {
  AbstractFactory: {
    content: abstractFactory,
  },
  AbstractRegistry: {
    content: abstractRegistry,
  },
  AbstractWorklist: {
    content: abstractWorklist,
  },
  ProcessRegistry: {
    content: processRegistry,
  },
  AbstractProcess: {
    content: abstractProcess,
  },
}
