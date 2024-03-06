const express = require('express');
const { find, slideList, register, update } = require('../controller/recommend');
const router = express.Router();

router.get('/find', find);
router.get('/slideList', slideList);
router.post('/register', register);
router.patch('/update', update);

module.exports = router;
