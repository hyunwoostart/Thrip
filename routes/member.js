const express = require('express');
const { login, signup, find, update } = require('../controller/member');
const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/find', find);
router.post('/update', update);

module.exports = router;
