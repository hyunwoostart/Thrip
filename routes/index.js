const express = require('express');
const {
    main,
    login,
    signup,
    myPage,
    map,
    calendar,
    checklist,
} = require('../controller');
const router = express.Router();

router.get('/', main);
router.get('/login', login);
router.get('/signup', signup);
router.get('/myPage', myPage);
router.get('/checklist', checklist);
router.get('/map', map);
router.get('/calendar', calendar);

module.exports = router;
