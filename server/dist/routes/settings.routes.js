"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const settings_controller_1 = require("../controllers/settings.controller");
const router = (0, express_1.Router)();
router.get('/settings', settings_controller_1.settingsController.getSettings);
router.patch('/settings', settings_controller_1.settingsController.updateSettings);
exports.default = router;
