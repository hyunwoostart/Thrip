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

exports.update = async (req, res) => {
    const { id, place, memo, isActive } = req.body;
    const result = await Recplace.update({ place, memo, isActive }, { where: { id } });
    res.json({ success: true, message: '업데이트 완료' });
};

exports.recClick = async (req, res) => {
    const { groupId, userId } = req.body;
    const find = await Group.findOne({ where: { id: groupId } });
    let memList = [];
    let newList = [];
    if (find.recMember[0]) {
        for (let i = 0; i < find.recMember.length; i++) {
            memList.push(find.recMember[i]);
            console.log(memList);
        }
    }
    if (memList.includes(userId)) {
        newList = memList.filter((id) => id != userId);
        console.log('아이디 있음', newList);
    } else {
        memList.push(userId);
        console.log('아이디 없음', memList);
        newList = memList;
    }
    const result = await Group.update({ recMember: newList, recCount: newList.length }, { where: { id: groupId } });
    res.json({ success: true, result: { recMember: newList }, message: '추천 정보 수정 완료' });
};
