const { Group, Detail, Checklist } = require('../models');

// 내 일정 리스트 조회
exports.scheduleList = async (req, res) => {};

// 일정 상세 내용 조회
exports.detail = async (req, res) => {
    const result = await Group.findByPk(req.params.id, { include: [{ model: [Detail, Checklist] }] });
    res.json({ success: true, result });
};

// 일정 추가
exports.write = async (req, res) => {
    const { depDate, arrDate, dueDate, groupName, groupMemo } = req.body;
    const result = await post.create({});
};
