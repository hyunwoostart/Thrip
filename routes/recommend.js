const express = require('express');
const { find, slideList, register, update, recClick } = require('../controller/recommend');
const router = express.Router();

router.get('/find', find);
router.get('/slideList', slideList);
router.post('/register', register);
router.patch('/update', update);
router.patch('/recClick', recClick);

module.exports = router;
