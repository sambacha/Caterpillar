pragma solidity ^0.5.0;

import "AbstractFactory";
import "AbstractProcess";
import "AbstractRegistry";

contract Order_To_Cash_Factory is AbstractFactory {
    function newInstance(address parent, address processRegistry) public returns(address) {
        Order_To_Cash_Contract newContract = new Order_To_Cash_Contract(parent, worklist, processRegistry);
        return address(newContract);
    }

    function startInstanceExecution(address processAddress) public {
        Order_To_Cash_Contract(processAddress).startExecution();
    }
}


contract Order_To_Cash_Contract is AbstractProcess {

    uint public marking = uint(2);
    uint public startedActivities = 0;
    address[] private subInstanceAddresses;
    mapping(uint => uint) private subInstanceStartedIndexes;


    // Process Variables
    bool private poStatus;
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
        if (subInstanceStartedIndexes[5] & uint(maskIndex) != 0) {
            if(isInstanceCompleted)
                subInstanceStartedIndexes[5] &= uint(~maskIndex);
            if (eventType == "Default") {
                step(tmpMarking | uint(64), tmpStartedActivities & uint(~32));
            }
        }
        else if (subInstanceStartedIndexes[6] & uint(maskIndex) != 0) {
            if(isInstanceCompleted)
                subInstanceStartedIndexes[6] &= uint(~maskIndex);
            if (eventType == "Default") {
                step(tmpMarking | uint(128), tmpStartedActivities & uint(~64));
            }
        }
        else if (subInstanceStartedIndexes[8] & uint(maskIndex) != 0) {
            if(isInstanceCompleted)
                subInstanceStartedIndexes[8] &= uint(~maskIndex);
            if (eventType == "Default") {
                step(tmpMarking | uint(2048), tmpStartedActivities & uint(~256));
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
            externalContracts2Stop = uint(352);
        }
        if(externalContracts2Stop & uint(32) != 0) {
            allAddresses2Stop |= subInstanceStartedIndexes[5];
            subInstanceStartedIndexes[5] = 0;
        }
        if(externalContracts2Stop & uint(64) != 0) {
            allAddresses2Stop |= subInstanceStartedIndexes[6];
            subInstanceStartedIndexes[6] = 0;
        }
        if(externalContracts2Stop & uint(256) != 0) {
            allAddresses2Stop |= subInstanceStartedIndexes[8];
            subInstanceStartedIndexes[8] = 0;
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
        if (tmpStartedActivities & uint(32) != 0)
            contracts2Broadcast |= subInstanceStartedIndexes[5];
        if (tmpStartedActivities & uint(64) != 0)
            contracts2Broadcast |= subInstanceStartedIndexes[6];
        if (tmpStartedActivities & uint(256) != 0)
            contracts2Broadcast |= subInstanceStartedIndexes[8];
        contracts2Broadcast &= uint(~sourceChild);
        if(contracts2Broadcast != 0)
            for(uint j = 0; j < subInstanceAddresses.length; j++)
                if(contracts2Broadcast & (uint(1) << j) != 0)
                    AbstractProcess(subInstanceAddresses[j]).broadcastSignal();
        return (tmpMarking, tmpStartedActivities);
    }


    function Submit_PO_complete(uint elementIndex) external {
        (uint256 tmpMarking, uint256 tmpStartedActivities) = (marking, startedActivities);
        if(elementIndex == uint(1)) {
            require(msg.sender == worklist && tmpStartedActivities & uint(2) != 0);
            step(tmpMarking | uint(4), tmpStartedActivities & uint(~2));
            return;
        }
    }
    function Validate_PO_complete(uint elementIndex, bool _poStatus) external {
        (uint256 tmpMarking, uint256 tmpStartedActivities) = (marking, startedActivities);
        if(elementIndex == uint(2)) {
            require(msg.sender == worklist && tmpStartedActivities & uint(4) != 0);
           {poStatus = _poStatus;}
            step(tmpMarking | uint(8), tmpStartedActivities & uint(~4));
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
            if (tmpMarking & uint(2) != 0) {
                Order_To_Cash_AbstractWorklist(worklist).Submit_PO_start(1);
                tmpMarking &= uint(~2);
                tmpStartedActivities |= uint(2);
                continue;
            }
            if (tmpMarking & uint(4) != 0) {
                Order_To_Cash_AbstractWorklist(worklist).Validate_PO_start(2);
                tmpMarking &= uint(~4);
                tmpStartedActivities |= uint(4);
                continue;
            }
            if (tmpMarking & uint(8) != 0) {
                tmpMarking &= uint(~8);
if (!poStatus)                tmpMarking |= uint(16);
else                 tmpMarking |= uint(32);
                continue;
            }
            if (tmpMarking & uint(16) != 0) {
                tmpMarking &= uint(~16);
                if (tmpMarking & uint(4094) == 0 && tmpStartedActivities & uint(6) == 0) {
                    (tmpMarking, tmpStartedActivities) = propagateEvent("PO_Rejected", "Default", tmpMarking, tmpStartedActivities, uint(16));
                }
                continue;
            }
            if (tmpMarking & uint(32) != 0) {
                createNewSubprocessInstance(5);
                tmpMarking &= uint(~32);
                tmpStartedActivities |= uint(32);
                continue;
            }
            if (tmpMarking & uint(256) != 0) {
                createNewSubprocessInstance(6);
                tmpMarking &= uint(~256);
                tmpStartedActivities |= uint(64);
                continue;
            }
            if (tmpMarking & uint(1024) != 0) {
                tmpMarking &= uint(~1024);
                if (tmpMarking & uint(4094) == 0 && tmpStartedActivities & uint(6) == 0) {
                    (tmpMarking, tmpStartedActivities) = propagateEvent("PO_Fulfilled", "Default", tmpMarking, tmpStartedActivities, uint(128));
                }
                continue;
            }
            if (tmpMarking & uint(512) != 0) {
                createNewSubprocessInstance(8);
                tmpMarking &= uint(~512);
                tmpStartedActivities |= uint(256);
                continue;
            }
            if (tmpMarking & uint(64) == uint(64)) {
                tmpMarking = tmpMarking & uint(~64) | uint(768);
                continue;
            }
            if (tmpMarking & uint(2176) == uint(2176)) {
                tmpMarking = tmpMarking & uint(~2176) | uint(1024);
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

contract Order_To_Cash_AbstractWorklist {

      function Submit_PO_start(uint) external;
      function Validate_PO_start(uint) external;
  
      function Submit_PO_complete(uint) external;
      function Validate_PO_complete(uint, bool) external;
  
}

contract Order_To_Cash_worklist is AbstractWorklist {

    // Events with the information to include in the Log when a workitem is registered
    event Submit_PO_Requested(uint);
    event Validate_PO_Requested(uint);

    function Submit_PO_start(uint elementIndex) external {
        workitems.push(Workitem(elementIndex, msg.sender));
        emit Submit_PO_Requested(workitems.length - 1);
    }
    function Validate_PO_start(uint elementIndex) external {
        workitems.push(Workitem(elementIndex, msg.sender));
        emit Validate_PO_Requested(workitems.length - 1);
    }

    function Submit_PO(uint workitemId) external {

        require(workitemId < workitems.length && workitems[workitemId].processInstanceAddr != address(0) && 
        canPerform(msg.sender, workitems[workitemId].processInstanceAddr, workitems[workitemId].elementIndex));
        
        Order_To_Cash_AbstractWorklist(workitems[workitemId].processInstanceAddr).Submit_PO_complete(workitems[workitemId].elementIndex);
        workitems[workitemId].processInstanceAddr = address(0);
    }
    function Validate_PO(uint workitemId, bool _poStatus) external {

        require(workitemId < workitems.length && workitems[workitemId].processInstanceAddr != address(0) && 
        canPerform(msg.sender, workitems[workitemId].processInstanceAddr, workitems[workitemId].elementIndex));
        
        Order_To_Cash_AbstractWorklist(workitems[workitemId].processInstanceAddr).Validate_PO_complete(workitems[workitemId].elementIndex, _poStatus);
        workitems[workitemId].processInstanceAddr = address(0);
    }

}
