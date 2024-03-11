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
    admin,
    bestdetail,
} = require('../controller');
const router = express.Router();

router.get('/', main);
router.get('/login', login);
router.get('/signup', signup);
router.get('/find', find);
router.get('/myPage', mypage);
router.get('/checklist', checklist);
router.get('/chat', chat);
router.get('/map', map);
router.get('/calendar', calendar);
router.get('/triplist', triplist);
router.get('/tripdetail', tripdetail);
router.get('/recommend/admin', admin);
router.get('/bestdetail', bestdetail);

module.exports = router;
