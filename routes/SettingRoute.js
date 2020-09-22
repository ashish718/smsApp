const express = require("express");
const router = express.Router();
let SettingController = require('../controllers/SettingController')
let GetSettingController = require('../controllers/GetSettingController')

router.post('/myaction', SettingController.myapiaction)
router.post('/template', SettingController.templateSetting)
router.post('/abandanTemplate', SettingController.abandanTemplateSetting)
router.get('/option',GetSettingController.optionFunc)
router.get('/abandanTemplate',GetSettingController.abandanTemplateFunc)
router.get('/template',GetSettingController.templateFunc)
router.get('/smsCount',GetSettingController.smsCountFunc)
router.get('/history',GetSettingController.historyFunc)
router.get('/dashboard',GetSettingController.dashboardFunc)

module.exports = router;
