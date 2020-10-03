"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
const registryCtrl = require("../controllers/registry-controller");
router.post('/registries', registryCtrl.deployRuntimeRegistry);
router.get('/registries/:registryAddress/address', registryCtrl.getRuntimeRegistryInfo);
router.get('/registries/:registryId', registryCtrl.getRuntimeRegistryInfo);
module.exports = router;
//# sourceMappingURL=index.js.map