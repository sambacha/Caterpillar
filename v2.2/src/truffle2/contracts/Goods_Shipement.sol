pragma solidity ^0.5.0;

import "AbstractFactory";
import "AbstractProcess";
import "AbstractRegistry";

contract Goods_Shipement_Factory is AbstractFactory {
    function newInstance(address parent, address processRegistry) public returns(address) {
        Goods_Shipement_Contract newContract = new Goods_Shipement_Contract(parent, worklist, processRegistry);
        return address(newContract);
    }

    function startInstanceExecution(address processAddress) public {
        Goods_Shipement_Contract(processAddress).startExecution();
    }
}


contract Goods_Shipement_Contract is AbstractProcess {

    uint public marking = uint(2);
    uint public startedActivities = 0;
    address[] private subInstanceAddresses;
    mapping(uint => uint) private subInstanceStartedIndexes;


    // Process Variables
    
    constructor(address _parent, address _worklist, address _processRegistry) public AbstractProcess(_parent, _worklist, _processRegistry) {
    }

    function startExecution() public {
        require(marking == uint(2) && startedActivities == 0);
        step(uint(2), 0);
    }

    function handleEvent(bytes32 code, bytes32 eventType, uint _instanceIndex, bool isInstanceCompleted) public {
        (uint256 tmpMarking, uint256 tmpStartedActivities)  = (marking, startedActivities);
        uint maskIndex = uint(1) << _instanceIndex;
        uint sourceChild = 0;
        if (subInstanceStartedIndexes[3] & uint(maskIndex) != 0) {
            if(isInstanceCompleted)
                subInstanceStartedIndexes[3] &= uint(~maskIndex);
            if (eventType == "Default") {
                if (subInstanceStartedIndexes[3] == 0)
                    step(tmpMarking | uint(8), tmpStartedActivities & uint(~8));
            }
        }
        else {
            (tmpMarking, tmpStartedActivities) = propagateEvent(code, eventType, tmpMarking, tmpStartedActivities, sourceChild);
            step(tmpMarking, tmpStartedActivities);
        }
    }

    function killProcess() public {
        (marking, startedActivities) = killProcess(0, marking, startedActivities);
    }

    function killProcess(uint processElementIndex, uint tmpMarking, uint tmpStartedActivities) internal returns(uint, uint) {
        uint externalContracts2Stop = 0;
        uint allAddresses2Stop = 0;
        if(processElementIndex == 0) {
            tmpMarking = tmpStartedActivities = 0;
            externalContracts2Stop = uint(8);
        }
        if(externalContracts2Stop & uint(8) != 0) {
            allAddresses2Stop |= subInstanceStartedIndexes[3];
            subInstanceStartedIndexes[3] = 0;
        }
        for(uint j = 0; j < subInstanceAddresses.length; j++)
            if(allAddresses2Stop & (uint(1) << j) != 0)
                AbstractProcess(subInstanceAddresses[j]).killProcess();
        return (tmpMarking, tmpStartedActivities);
    }

    function broadcastSignal() public {
        (uint256 tmpMarking, uint256 tmpStartedActivities) = broadcastSignal(marking, startedActivities, 0);
        step(tmpMarking, tmpStartedActivities);
    }

    function broadcastSignal(uint tmpMarking, uint tmpStartedActivities, uint sourceChild) internal returns(uint, uint) {
        uint contracts2Broadcast = 0;
        if (tmpStartedActivities & uint(8) != 0)
            contracts2Broadcast |= subInstanceStartedIndexes[3];
        contracts2Broadcast &= uint(~sourceChild);
        if(contracts2Broadcast != 0)
            for(uint j = 0; j < subInstanceAddresses.length; j++)
                if(contracts2Broadcast & (uint(1) << j) != 0)
                    AbstractProcess(subInstanceAddresses[j]).broadcastSignal();
        return (tmpMarking, tmpStartedActivities);
    }


    function Ship_Goods_complete(uint elementIndex) external {
        (uint256 tmpMarking, uint256 tmpStartedActivities) = (marking, startedActivities);
        if(elementIndex == uint(1)) {
            require(msg.sender == worklist && tmpStartedActivities & uint(2) != 0);
            step(tmpMarking | uint(4), tmpStartedActivities & uint(~2));
            return;
        }
    }
    function Request_Quotes_complete(uint elementIndex) external {
        (uint256 tmpMarking, uint256 tmpStartedActivities) = (marking, startedActivities);
        if(elementIndex == uint(4)) {
            require(msg.sender == worklist && tmpStartedActivities & uint(16) != 0);
            step(tmpMarking | uint(16), tmpStartedActivities & uint(~16));
            return;
        }
    }

    function createNewSubprocessInstance(uint nodeIndex) private {
        AbstractProcess child = AbstractProcess(AbstractRegistry(processRegistry).newInstanceFor(nodeIndex, address(this)));
        uint index = subInstanceAddresses.length;
        subInstanceAddresses.push(address(child));
        subInstanceStartedIndexes[nodeIndex] |= (uint(1) << index);
        child.setInstanceIndex(index);
    }

    function step(uint tmpMarking, uint tmpStartedActivities) internal {
        while (true) {
            if (tmpMarking & uint(8) != 0) {
                Goods_Shipement_AbstractWorklist(worklist).Ship_Goods_start(1);
                tmpMarking &= uint(~8);
                tmpStartedActivities |= uint(2);
                continue;
            }
            if (tmpMarking & uint(4) != 0) {
                tmpMarking &= uint(~4);
                if (tmpMarking & uint(30) == 0 && tmpStartedActivities & uint(26) == 0) {
                    (tmpMarking, tmpStartedActivities) = propagateEvent("Goods_Shipment_Completed", "Default", tmpMarking, tmpStartedActivities, uint(4));
                }
                continue;
            }
            if (tmpMarking & uint(16) != 0) {
                for(uint i = 0; i < 2; i++) {
                    createNewSubprocessInstance(3);
                }
                tmpMarking &= uint(~16);
                tmpStartedActivities |= 8;
                continue;
            }
            if (tmpMarking & uint(2) != 0) {
                Goods_Shipement_AbstractWorklist(worklist).Request_Quotes_start(4);
                tmpMarking &= uint(~2);
                tmpStartedActivities |= uint(16);
                continue;
            }
            break;
        }
        if(marking != 0 || startedActivities != 0) {
            marking = tmpMarking;
            startedActivities = tmpStartedActivities;
        }
    }

    function getWorklistAddress() external view returns(address) {
        return worklist;
    }

    function getInstanceIndex() external view returns(uint) {
        return instanceIndex;
    }

    function allInstanceAddresses() external view returns(address [] memory) {
        return subInstanceAddresses;
    }

    function startedInstanceIndexFor(uint instanceNode) external view returns(uint) {
        return subInstanceStartedIndexes[instanceNode];
    }

}
pragma solidity ^0.5.0;

import "AbstractWorklist";

contract Goods_Shipement_AbstractWorklist {

      function Ship_Goods_start(uint) external;
      function Request_Quotes_start(uint) external;
  
      function Ship_Goods_complete(uint) external;
      function Request_Quotes_complete(uint) external;
  
}

contract Goods_Shipement_worklist is AbstractWorklist {

    // Events with the information to include in the Log when a workitem is registered
    event Ship_Goods_Requested(uint);
    event Request_Quotes_Requested(uint);

    function Ship_Goods_start(uint elementIndex) external {
        workitems.push(Workitem(elementIndex, msg.sender));
        emit Ship_Goods_Requested(workitems.length - 1);
    }
    function Request_Quotes_start(uint elementIndex) external {
        workitems.push(Workitem(elementIndex, msg.sender));
        emit Request_Quotes_Requested(workitems.length - 1);
    }

    function Ship_Goods(uint workitemId) external {

        require(workitemId < workitems.length && workitems[workitemId].processInstanceAddr != address(0) && 
        canPerform(msg.sender, workitems[workitemId].processInstanceAddr, workitems[workitemId].elementIndex));
        
        Goods_Shipement_AbstractWorklist(workitems[workitemId].processInstanceAddr).Ship_Goods_complete(workitems[workitemId].elementIndex);
        workitems[workitemId].processInstanceAddr = address(0);
    }
    function Request_Quotes(uint workitemId) external {

        require(workitemId < workitems.length && workitems[workitemId].processInstanceAddr != address(0) && 
        canPerform(msg.sender, workitems[workitemId].processInstanceAddr, workitems[workitemId].elementIndex));
        
        Goods_Shipement_AbstractWorklist(workitems[workitemId].processInstanceAddr).Request_Quotes_complete(workitems[workitemId].elementIndex);
        workitems[workitemId].processInstanceAddr = address(0);
    }

}

import "AbstractFactory";
import "AbstractProcess";
import "AbstractRegistry";

contract Submit_Quotes_Factory is AbstractFactory {
    function newInstance(address parent, address processRegistry) public returns(address) {
        Submit_Quotes_Contract newContract = new Submit_Quotes_Contract(parent, worklist, processRegistry);
        return address(newContract);
    }

    function startInstanceExecution(address processAddress) public {
        Submit_Quotes_Contract(processAddress).startExecution();
    }
}


contract Submit_Quotes_Contract is AbstractProcess {

    uint public marking = uint(2);
    uint public startedActivities = 0;


    // Process Variables
    
    constructor(address _parent, address _worklist, address _processRegistry) public AbstractProcess(_parent, _worklist, _processRegistry) {
    }

    function startExecution() public {
        require(marking == uint(2) && startedActivities == 0);
        step(uint(2), 0);
    }

    function handleEvent(bytes32 code, bytes32 eventType, uint _instanceIndex, bool isInstanceCompleted) public {
        // Process without calls to external contracts.
        // No events to catch !!!
    }

    function killProcess() public {
        (marking, startedActivities) = killProcess(0, marking, startedActivities);
    }

    function killProcess(uint processElementIndex, uint tmpMarking, uint tmpStartedActivities) internal returns(uint, uint) {
        if(processElementIndex == 0)
            tmpMarking = tmpStartedActivities = 0;
        return (tmpMarking, tmpStartedActivities);
    }

    function broadcastSignal() public {
        (uint256 tmpMarking, uint256 tmpStartedActivities) = broadcastSignal(marking, startedActivities, 0);
        step(tmpMarking, tmpStartedActivities);
    }

    function broadcastSignal(uint tmpMarking, uint tmpStartedActivities, uint sourceChild) internal returns(uint, uint) {
        return (tmpMarking, tmpStartedActivities);
    }


    function Submit_Quotes_complete(uint elementIndex) external {
        (uint256 tmpMarking, uint256 tmpStartedActivities) = (marking, startedActivities);
        if(elementIndex == uint(1)) {
            require(msg.sender == worklist && tmpStartedActivities & uint(2) != 0);
            step(tmpMarking | uint(4), tmpStartedActivities & uint(~2));
            return;
        }
    }


    function step(uint tmpMarking, uint tmpStartedActivities) internal {
        while (true) {
            if (tmpMarking & uint(2) != 0) {
                Submit_Quotes_AbstractWorklist(worklist).Submit_Quotes_start(1);
                tmpMarking &= uint(~2);
                tmpStartedActivities |= uint(2);
                continue;
            }
            if (tmpMarking & uint(4) != 0) {
                tmpMarking &= uint(~4);
                if (tmpMarking & uint(6) == 0 && tmpStartedActivities & uint(2) == 0) {
                    (tmpMarking, tmpStartedActivities) = propagateEvent("e1", "Default", tmpMarking, tmpStartedActivities, uint(4));
                }
                continue;
            }
            break;
        }
        if(marking != 0 || startedActivities != 0) {
            marking = tmpMarking;
            startedActivities = tmpStartedActivities;
        }
    }

    function getWorklistAddress() external view returns(address) {
        return worklist;
    }

    function getInstanceIndex() external view returns(uint) {
        return instanceIndex;
    }

}
pragma solidity ^0.5.0;

import "AbstractWorklist";

contract Submit_Quotes_AbstractWorklist {

      function Submit_Quotes_start(uint) external;
  
      function Submit_Quotes_complete(uint) external;
  
}

contract Submit_Quotes_worklist is AbstractWorklist {

    // Events with the information to include in the Log when a workitem is registered
    event Submit_Quotes_Requested(uint);

    function Submit_Quotes_start(uint elementIndex) external {
        workitems.push(Workitem(elementIndex, msg.sender));
        emit Submit_Quotes_Requested(workitems.length - 1);
    }

    function Submit_Quotes(uint workitemId) external {

        require(workitemId < workitems.length && workitems[workitemId].processInstanceAddr != address(0) && 
        canPerform(msg.sender, workitems[workitemId].processInstanceAddr, workitems[workitemId].elementIndex));
        
        Submit_Quotes_AbstractWorklist(workitems[workitemId].processInstanceAddr).Submit_Quotes_complete(workitems[workitemId].elementIndex);
        workitems[workitemId].processInstanceAddr = address(0);
    }

}
