const express = require('express');
const { find, register, updateChk } = require('../controller/recommend');
const router = express.Router();

router.get('/find', find);
router.post('/register', register);
router.post('/updateChk', updateChk);

module.exports = router;
