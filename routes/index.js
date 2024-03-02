const express = require('express');
const { main, login, signup, myPage, chatlist, chat, map, calendar, checklist } = require('../controller');
const { auth } = require('../middleware');
const router = express.Router();

router.get('/', main);
router.get('/login', login);
router.get('/signup', signup);
router.get('/myPage', myPage);
router.get('/checklist', checklist);
router.get('/chatlist', chatlist);
router.get('/chat', chat);
router.get('/map', map);
router.get('/calendar', calendar);

module.exports = router;
