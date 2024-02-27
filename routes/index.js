const express = require('express');
const { main, login, signup } = require('../controller');
const router = express.Router();

router.get('/', main);
router.get('/login', login);
router.get('/signup', signup);

module.exports = router;
