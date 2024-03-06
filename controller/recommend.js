const { Types } = require('mysql2');
const { Group, Recplace } = require('../models');

exports.find = async (req, res) => {
    const result = await Recplace.findAll();
    res.json({ success: true, result, message: '추천 장소 전체 목록 불러오기' });
};

exports.slideList = async (req, res) => {
    const result = await Recplace.findAll({ where: { isActive: 1 } });
    res.json({ success: true, result, message: '추천 장소 슬라이드 목록 불러오기' });
};

exports.register = async (req, res) => {
    const { place, memo } = req.body;
    const result = await Recplace.create({ place, memo });
    res.json({ success: true, message: '추천 장소 등록 완료' });
};

exports.updateChk = async (req, res) => {
    const { id, isActive } = req.body;
    const result = await Recplace.update({ isActive }, { where: { id } });
    res.json({ success: true, message: '활성화 정보 업데이트 완료' });
};
