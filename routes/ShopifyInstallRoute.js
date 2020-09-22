const express = require("express");
const router = express.Router();
let ShopifyInstallController = require('../controllers/ShopifyInstallController')

router.get('/shopify', ShopifyInstallController.InstallApp)
router.get('/shopify/callback', ShopifyInstallController.InstallAppCallback)

module.exports = router;
