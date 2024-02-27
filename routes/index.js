const express = require('express');
const { main, login, signup, myPage, map, calender } = require('../controller');
const router = express.Router();

router.get('/', main);
router.get('/login', login);
router.get('/signup', signup);
router.get('/myPage', myPage);
router.get('/map', map);
router.get('/calender', calender);

module.exports = router;
