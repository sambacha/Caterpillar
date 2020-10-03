"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
const processModelsCtrl = require("../controllers/process-models-controller");
const processInstancesCtrl = require("../controllers/process-instances-controller");
router.post('/models/compile', processModelsCtrl.compileProcessModels);
router.post('/models', processModelsCtrl.deployProcessModels);
router.get('/models', processModelsCtrl.queryProcessModels);
router.get('/models/:mHash', processModelsCtrl.retrieveModelMetadata);
router.post('/models/:mHash/processes', processInstancesCtrl.createNewProcessInstance);
router.get('/models/:mHash/processes', processInstancesCtrl.queryProcessInstances);
router.get('/processes/:pAddress', processInstancesCtrl.queryProcessState);
router.put('/worklists/:wlAddress/workitems/:wiIndex', processInstancesCtrl.executeWorkitem);
module.exports = router;
//# sourceMappingURL=index.js.map