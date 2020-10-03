"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
const interpreterController = require("../controllers/interpreter-controller");
const iFlowController = require("../controllers/iflow-controller");
const iDataController = require("../controllers/idata-controller");
router.post('/interpreter', interpreterController.createNewInterpreterInstance);
router.post('/interpreter/models', interpreterController.parseAndDeployProcessModelFull);
router.get('/interpreter/models', interpreterController.getParsedModelList);
router.get('/interpreter/models/:mHash', interpreterController.getProcessModelMetadata);
router.post('/i-flow', iFlowController.createNewIFlowInstance);
router.patch('/i-flow/:cfAddress/element', iFlowController.setElementInIflowNode);
router.patch('/i-flow/:cfAddress/child', iFlowController.setChildInIflowNode);
router.patch('/i-flow/:cfAddress/factory', iFlowController.relateFactoryToIFlow);
router.get('/i-flow/:cfAddress', iFlowController.getIFlowOnChainInfo);
router.post('/i-flow/:cfAddress/i-data', iDataController.createNewProcessInstance);
router.get('/i-flow/:cfAddress/i-data', iDataController.getProcessInstancesList);
router.get('/i-flow/:eIndex/i-data/:pcAddress', iDataController.checkOutTaskInProcessInstance);
router.patch('/i-flow/:eIndex/i-data/:pcAddress', iDataController.checkInTaskInProcessInstance);
router.get('/i-data/:pcAddress', iDataController.getProcessInstanceState);
module.exports = router;
//# sourceMappingURL=index.js.map