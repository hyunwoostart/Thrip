const express = require('express');
const {
    main,
    login,
    signup,
    myPage,
    map,
    calendar,
    checklist,
    triplist,
    tripdetail,
    chat,
} = require('../controller');
const router = express.Router();

router.get('/', main);
router.get('/login', login);
router.get('/signup', signup);
router.get('/myPage', myPage);
router.get('/checklist', checklist);
router.get('/chat', chat);
router.get('/map', map);
router.get('/calendar', calendar);
router.get('/triplist', triplist);
router.get('/tripdetail', tripdetail);

module.exports = router;
