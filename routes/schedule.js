const express = require('express');
const {
    scheduleList,
    findGroup,
    groupWrite,
    detailWrite,
    findChk,
    addChk,
    updateChk,
    findChat,
    chat,
} = require('../controller/schedule');
const middleware = require('../middleware');

const router = express.Router();

router.get('/scheduleList', scheduleList);
router.get('/findGroup', findGroup);
router.post('/groupWrite', groupWrite);
router.post('/detailWrite', detailWrite);
router.get('/findChk', findChk);
router.post('/addChk', addChk);
router.patch('/updateChk', updateChk);
router.get('/findChat', findChat);
router.post('/chat', chat);

module.exports = router;
