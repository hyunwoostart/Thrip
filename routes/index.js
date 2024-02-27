const express = require('express');
const { main, login, signup, myPage, map } = require('../controller');

const router = express.Router();

router.get('/', main);
router.get('/login', login);
router.get('/signup', signup);
router.get('/myPage', myPage);
router.get('/myPage', map);

module.exports = router;
