const express = require('express');
const {
    main,
    login,
    signup,
    find,
    mypage,
    map,
    calendar,
    checklist,
    chat,
    triplist,
    tripdetail,
} = require('../controller');
const router = express.Router();

router.get('/', main);
router.get('/login', login);
router.get('/signup', signup);
router.get('/find', find);
router.get('/mypage', mypage);
router.get('/checklist', checklist);
router.get('/chat', chat);
router.get('/map', map);
router.get('/calendar', calendar);
router.get('/triplist', triplist);
router.get('/tripdetail', tripdetail);

module.exports = router;
