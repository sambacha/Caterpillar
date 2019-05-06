import _debug from 'debug'
import BpmnModdle from "bpmn-moddle"
import {
  ModelInfo,
} from "./definitions"

import parseBpmn from './parse-bpmn'
import collectControlFlowInfo from './collect-control-flow-info'

import nameId from './model-info/name-id'
import setModelInfoSolidity from './set-model-info-solidity'

const debug = _debug('caterpillarql:parse-model')



export default (bpmn: string) =>
  parseBpmn(bpmn)
    .then((definitions: any) => {
      debug('parsed model', definitions)
      if (!definitions.diagrams || definitions.diagrams.length == 0)
        throw new Error("ERROR: No diagram found in BPMN file")
      const proc = definitions
        .diagrams[0]
        .plane
        .bpmnElement

      const modelInfo: ModelInfo = {
        ...nameId({
          definitions,
        }),
        bpmn,
        solidity: 'pragma solidity ^0.5.0;\n',
        controlFlowInfoMap: new Map(),
      }
      
      
      // BPMN to Solidity parsing

      let
        globalNodeIndexMap: Map<string, number> = new Map(),
        globalEdgeIndexMap: Map<string, number> = new Map()

      ////////////////////////////////////////////////////////////
      const {
        globalNodeMap,
        globalControlFlowInfo,
      } = collectControlFlowInfo(proc)

      modelInfo.globalNodeMap = globalNodeMap

      setModelInfoSolidity({
        globalControlFlowInfo,
        globalNodeMap,
        globalNodeIndexMap,
        globalEdgeIndexMap,
        modelInfo,
      })
      //////////////////////////////////////////////////////////////////////////////////
      
      modelInfo.entryContractName = modelInfo.name + ":" + (proc.name ? proc.name.replace(/\s+/g, "_") : proc.id) + "_Contract"
      return modelInfo
  },
)
