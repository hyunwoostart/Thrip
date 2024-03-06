const express = require('express');
const {
    login,
    signup,
    find,
    queryFind,
    findId,
    certId,
    certPw,
    update,
    del,
    changePw,
} = require('../controller/member');
const { auth } = require('../middleware');
const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.get('/find', auth, find);
router.get('/queryFind', queryFind);
router.get('/findId', findId);
router.patch('/update', auth, update);
router.delete('/delete', auth, del);
router.get('/certId', certId);
router.get('/certPw', certPw);
router.patch('/changePw', changePw);

module.exports = router;
