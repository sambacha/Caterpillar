import _debug from 'debug'
import BpmnModdle from "bpmn-moddle"
import {
  ModelInfo,
} from "./definitions"
import * as ejs from "ejs"

import parseBpmn from './parse-bpmn'
import collectControlFlowInfo from './collect-control-flow-info'

import nameId from './model-info/name-id'
import setModelInfoSolidity from './set-model-info-solidity'
import makeCodeGenerationInfo from './set-model-info-solidity/make-code-generation-info'
import makeWorklistGenerationInfo from './set-model-info-solidity/make-worklist-generation-info'
import bpmn2solEJS from '../../../../templates/bpmn2sol.ejs'
import worklist2solEJS from '../../../../templates/worklist2sol.ejs'

const bpmn2solTemplate = ejs.compile(bpmn2solEJS)
const worklist2solTemplate = ejs.compile(worklist2solEJS)

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
        globalEdgeIndexMap: Map<string, number> = new Map()

      ////////////////////////////////////////////////////////////
      const {
        globalNodeMap,
        globalControlFlowInfo,
      } = collectControlFlowInfo(proc)

      modelInfo.globalNodeMap = globalNodeMap

      const generationInfo = setModelInfoSolidity({
        globalControlFlowInfo,
        globalNodeMap,
      })
      modelInfo.controlFlowInfoMap = generationInfo
        .map(
          ({ controlFlowInfo }) =>
            controlFlowInfo,
        )
        .reduce(
          (map, info) =>
            map.set(info.self.id, info),
          new Map(),
        )
      modelInfo.solidity = generationInfo
        .map(
          ({
            codeGenerationInfo,
            worklistGenerationInfo,
          }) => [
            codeGenerationInfo &&
              bpmn2solTemplate(
                makeCodeGenerationInfo(codeGenerationInfo),
              ),
            worklistGenerationInfo &&
            worklist2solTemplate(
              makeWorklistGenerationInfo(
                worklistGenerationInfo,
              ),
            ),
          ]
          .filter(x => x)
          .join('')
        ).join('')
      //////////////////////////////////////////////////////////////////////////////////
      debug(modelInfo.solidity)
      modelInfo.entryContractName = modelInfo.name + ":" + (proc.name ? proc.name.replace(/\s+/g, "_") : proc.id) + "_Contract"
      return modelInfo
  },
)
