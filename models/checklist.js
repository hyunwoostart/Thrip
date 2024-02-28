const { DataTypes } = require('sequelize');

const ChecklistModel = (sequelize) => {
    return sequelize.define('checklist', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        listName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isActive: {
            type: DataTypes.TINYINT(1),
            allowNull: false,
            defaultValue: 0,
        },
    });
};

module.exports = ChecklistModel;
