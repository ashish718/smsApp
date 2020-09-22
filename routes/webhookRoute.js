
const express = require("express");
const router = express.Router();
let webhookController = require('../controllers/webhookController')

router.post('/store/:shop/:topic/:subtopic', webhookController.WebhookResponse)

module.exports = router;
