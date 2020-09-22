const express = require("express");
const router = express.Router();
let urlController = require('../controllers/UrlController')

router.get('/:code', urlController.url_redirect)


module.exports = router;
