const { Member } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

// 로그인
exports.login = async (req, res) => {
    const { userId, pw } = req.body;
    // 검색
    const result = await Member.findOne({ where: { userId } });
    if (result) {
        const password = await bcrypt.compare(pw, result.password);
        if (password) {
            const token = jwt.sign({ id: result.id }, process.env.SECRET, { expiresIn: '1h' });

            res.json({ success: true, result: result.username, token });
        } else {
            res.json({ success: false, message: '비밀번호를 다시 확인해주세요.' });
        }
    } else {
        res.json({ success: false, message: '존재하지 않는 아이디입니다.' });
    }
};

// 회원가입
exports.signup = async (req, res) => {
    const { username, userId, pw, email, tel, mySchedule } = req.body;
    // 존재여부 확인
    const find = await Member.findOne({ where: { userId } });
    if (find) {
        res.json({ success: false, message: '이미 존재하는 회원 아이디' });
    } else {
        const password = await bcrypt.hash(pw, 11);
        // 생성
        const result = await Member.create({ userId, username, userId, password, email, tel, mySchedule });
        res.json({ success: true, message: '회원가입 완료' });
    }
};

// 회원조회
exports.find = async (req, res) => {
    const { id } = req.user;
    const result = await Member.findOne({ where: { id } });
    res.json({ success: true, result });
};

// 회원조회
exports.queryFind = async (req, res) => {
    const { id } = req.query;
    console.log(id);
    const result = await Member.findOne({ where: { id } });
    res.json({ success: true, result });
};

// 아이디로 회원 조회
exports.findId = async (req, res) => {
    const { userId } = req.query;
    console.log(userId);
    const result = await Member.findAll({ where: { userId: { [Op.like]: '%' + userId + '%' } } });
    res.json({ success: true, result });
};

// 정보수정
exports.update = async (req, res) => {
    const { id } = req.user;
    console.log(Boolean(req.body.pw));
    if (req.body.pw) {
        const { pw, email, tel } = req.body;
        const password = await bcrypt.hash(pw, 11);
        const result = await Member.update({ password, email, tel }, { where: { id } });
    } else {
        const { email, tel } = req.body;
        const result = await Member.update({ email, tel }, { where: { id } });
    }
    res.json({ success: true, message: '회원 정보 수정이 완료되었습니다.' });
};

// 회원탈퇴
exports.del = async (req, res) => {
    const { id } = req.user;
    const result = await Member.destroy({ where: { id } });
    res.json({ success: true });
};

// 아이디 찾기
exports.certId = async (req, res) => {
    const { username, email } = req.query;
    const result = await Member.findOne({ where: { username, email } });
    console.log(result);
    if (result) {
        res.json({ success: true, result: result.id, message: '회원 정보 조회가 완료되었습니다.' });
    } else {
        res.json({ success: false, message: '일치하는 회원 정보가 존재하지 않습니다.' });
    }
};

// 비밀번호 찾기
exports.certPw = async (req, res) => {
    const { userId, email } = req.query;
    const result = await Member.findOne({ where: { userId, email } });
    if (result) {
        res.json({ success: true, result: result.id, message: '회원 정보 조회가 완료되었습니다.' });
    } else {
        res.json({ success: false, message: '일치하는 회원 정보가 존재하지 않습니다.' });
    }
};

// 비밀번호 변경
exports.changePw = async (req, res) => {
    const { id, pw } = req.body;
    const password = await bcrypt.hash(pw, 11);
    const result = await Member.update({ password }, { where: { id } });
    res.json({ success: true, message: '비밀번호가 변경되었습니다.' });
};
