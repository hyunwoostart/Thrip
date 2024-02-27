const express = require('express');
const { main, login, signup, map } = require('../controller');
const router = express.Router();

router.get('/', main);
router.get('/login', login);
router.get('/signup', signup);
router.get('/map', map);

module.exports = router;
