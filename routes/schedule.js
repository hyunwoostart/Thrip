const express = require('express');
const { detailWrite } = require('../controller/schedule');
const middleware = require('../middleware');

const router = express.Router();

router.post('/detailWrite', detailWrite);

module.exports = router;
