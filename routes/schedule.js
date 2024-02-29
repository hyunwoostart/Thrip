const express = require('express');
const { groupWrite, detailWrite } = require('../controller/schedule');
const middleware = require('../middleware');

const router = express.Router();

router.post('/groupWrite', groupWrite);
router.post('/detailWrite', detailWrite);

module.exports = router;
