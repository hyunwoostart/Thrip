const { Group, Detail, Checklist, Chat } = require('../models');

// 내 일정 리스트 조회
exports.scheduleList = async (req, res) => {
    const result = await Group.findAll();
    res.json({ success: true, result, message: '일정 리스트 조회 완료' });
};

// 일정 하나 조회
exports.findGroup = async (req, res) => {
    const result = await Group.findOne({ where: { id: req.query.id } });
    res.json({ success: true, result, message: '일정 조회 완료' });
};

// 일정 상세 내용 조회
exports.detail = async (req, res) => {
    const result = await Group.findByPk(req.params.id, { include: [{ model: [Detail, Checklist] }] });
    res.json({ success: true, result });
};

// 일정 추가
exports.groupWrite = async (req, res) => {
    const { depDate, arrDate, dueDate, groupName, groupMemo } = req.body;
    const result = await Group.create({ depDate, arrDate, dueDate, groupName, groupMemo });
    res.json({ success: true, message: '날짜 등록 완료' });
};

exports.detailWrite = async (req, res) => {
    const { category, arrTime, place, distance, detailMemo } = req.body;
    const result = await Detail.create({ arrTime, place, distance, detailMemo });
    res.json({ success: true, message: '일정 상세 등록 완료' });
};

// 체크리스트 불러오기
exports.findChk = async (req, res) => {
    // const result = await Checklist.findByPk(id);
    const result = await Checklist.findAll({ order: [['id', 'asc']] });
    res.json({ success: true, result });
};

// 체크리스트 업데이트
exports.updateChk = async (req, res) => {
    const { id, isActive } = req.body;
    const result = await Checklist.update({ isActive }, { where: { id } });
    res.json({ success: true, message: '리스트 수정 완료' });
};

// 체크리스트 추가
exports.addChk = async (req, res) => {
    const { listName } = req.body;
    const result = await Checklist.create({ listName });
    res.json({ success: true, result, message: '리스트 추가 완료' });
};

// 채팅 조회
exports.findChat = async (req, res) => {
    const { groupId } = req.query;
    const result = await Chat.findAll({ where: { groupId } });
    res.json({ success: true, result, message: '채팅 목록 조회 완료' });
};

// 채팅 추가
exports.chat = async (req, res) => {
    const { userId, username, chatMsg, groupId } = req.body;
    const result = await Chat.create({ userId, username, chatMsg, groupId });
    res.json({ success: true, result, message: '채팅 추가 완료' });
};
