const { DataTypes } = require('sequelize');

const DetailModel = (sequelize) => {
    return sequelize.define('detail', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        category: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        detailOrder: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        arrTime: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        place: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        detailMemo: {
            type: DataTypes.INTEGER,
        },
    });
};

module.exports = DetailModel;
