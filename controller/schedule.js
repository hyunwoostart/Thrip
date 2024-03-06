const { Types } = require('mysql2');
const { Member, Group, Detail, Checklist, Chat } = require('../models');
const { Op } = require('sequelize');

// 내 일정 리스트 조회
exports.scheduleList = async (req, res) => {
    const { id } = req.query;
    const find = await Member.findOne({ where: { id } });
    const result = await Group.findAll({ where: { id: find.mySchedule } });
    console.log(result[0].id);
    res.json({ success: true, result, message: '일정 리스트 조회 완료' });
};

// 일정 하나 조회
exports.findGroup = async (req, res) => {
    const result = await Group.findOne({ where: { id: req.query.id } });
    res.json({ success: true, result, message: '일정 조회 완료' });
};

// 일정 상세 내용 조회
exports.detail = async (req, res) => {
    const result = await Detail.findAll({ where: { groupId: req.query.groupId } });
    res.json({ success: true, result });
};

// 일정 추가
exports.groupWrite = async (req, res) => {
    const { depDate, arrDate, dueDate, groupName, groupMember, groupMemo } = req.body;
    if (req.body.id) {
        const id = Number(req.body.id);
        console.log('존재');
        const result = await Group.update(
            { depDate, arrDate, dueDate, groupName, groupMember, groupMemo },
            { where: { id } }
        );
        for (let i = 0; i < groupMember.length; i++) {
            const newList = [];
            const member = await Member.findOne({ where: { id: groupMember[i] } });
            for (let i = 0; i < member.mySchedule.length; i++) {
                newList.push(member.mySchedule[i]);
            }
            if (!newList.includes(id)) {
                newList.push(id);
            }
            const addMem = await Member.update({ mySchedule: newList }, { where: { id: groupMember[i] } });
        }
        res.json({ success: true, result: { id }, message: '일정 생성 완료' });
    } else {
        console.log('없음');
        const result = await Group.create({ depDate, arrDate, dueDate, groupName, groupMember, groupMemo });
        for (let i = 0; i < groupMember.length; i++) {
            const newList = [];
            const member = await Member.findOne({ where: { id: groupMember[i] } });
            for (let i = 0; i < member.mySchedule.length; i++) {
                newList.push(member.mySchedule[i]);
            }
            newList.push(result.id);
            const addMem = await Member.update({ mySchedule: newList }, { where: { id: groupMember[i] } });
        }
        res.json({ success: true, result, message: '일정 생성 완료' });
    }
};

exports.detailWrite = async (req, res) => {
    const { category, detailOrder, arrTime, place, distance, detailMemo, groupId, tabLength } = req.body;
    const spill = await Detail.destroy({ where: { category, detailOrder: { [Op.gt]: tabLength } } });
    const find = await Detail.findOne({ where: { category, detailOrder } });
    if (find) {
        const result = await Detail.update(
            { arrTime, place, distance, detailMemo, groupId },
            { where: { category, detailOrder } }
        );
    } else {
        const result = await Detail.create({ category, detailOrder, arrTime, place, distance, detailMemo, groupId });
    }
    res.json({ success: true, message: '일정 상세 등록 완료' });
};

// 체크리스트 불러오기
exports.findChk = async (req, res) => {
    const result = await Checklist.findAll({ where: { groupId: req.query.groupId } });
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
    const { listName, groupId } = req.body;
    const result = await Checklist.create({ listName, groupId });
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
