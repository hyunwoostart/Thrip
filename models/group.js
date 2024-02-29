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
    });
};

module.exports = GroupModel;
