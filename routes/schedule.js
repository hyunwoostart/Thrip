const express = require('express');
const { groupWrite, detailWrite, findChk, addChk, updateChk } = require('../controller/schedule');
const middleware = require('../middleware');

const router = express.Router();

router.post('/groupWrite', groupWrite);
router.post('/detailWrite', detailWrite);
router.get('/findChk', findChk);
router.post('/addChk', addChk);
router.patch('/updateChk', updateChk);

module.exports = router;
