const express = require('express');
const { login, signup, find, update, del } = require('../controller/member');
const { auth } = require('../middleware');
const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.get('/find', auth, find);
router.patch('/update', auth, update);
router.delete('/delete', auth, del);

module.exports = router;
