const { DataTypes } = require('sequelize');

const GroupModel = (sequelize) => {
    return sequelize.define('group', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        depDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        arrDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        dueDate: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        groupName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        groupMember: {
            type: DataTypes.JSON,
        },
        groupMemo: {
            type: DataTypes.STRING,
        },
        recMember: {
            type: DataTypes.JSON,
            defaultValue: [],
        },
        recCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    });
};

module.exports = GroupModel;
