const express = require('express');
const {
    scheduleList,
    findGroup,
    best,
    detail,
    groupWrite,
    removeGroup,
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
router.get('/best', best);
router.post('/groupWrite', groupWrite);
router.get('/detail', detail);
router.patch('/removeGroup', removeGroup);
router.post('/detailWrite', detailWrite);
router.get('/findChk', findChk);
router.post('/addChk', addChk);
router.patch('/updateChk', updateChk);
router.get('/findChat', findChat);
router.post('/chat', chat);

module.exports = router;
