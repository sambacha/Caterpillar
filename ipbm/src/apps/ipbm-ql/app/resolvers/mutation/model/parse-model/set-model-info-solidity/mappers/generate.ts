export default ({
  globalNodeMap,
  globalControlFlowInfo,
  globalNodeIndexMap,    
}) => ({
  controlFlowInfo,
}) => ({
  controlFlowInfo,
  codeGenerationInfo: {
    catchingMessages: [
      ...controlFlowInfo.catchingMessages.keys(),
    ],
    controlFlowInfo,
    globalNodeMap,
    multiinstanceActivities: [
      ...controlFlowInfo.multiinstanceActivities.keys(),
    ],
    callActivities: [
      ...controlFlowInfo.callActivities.keys(),
    ],
    nonInterruptingEvents: [
      ...controlFlowInfo.nonInterruptingEvents.keys(),
    ],
    globalControlFlowInfo,
    globalNodeIndexMap,
  },
  worklistGenerationInfo: controlFlowInfo.userTaskList.length > 0 &&
    {
      catchingMessages: [
        ...controlFlowInfo.catchingMessages.keys(),
      ],
      controlFlowInfo,
      globalNodeIndexMap,
      globalNodeMap,
      parameterInfo: controlFlowInfo.parameterInfo,
      restrictRelation: new Map(),
      userTaskList: controlFlowInfo.userTaskList,
    },
})