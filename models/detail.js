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
            // allowNull: false,
        },
        arrTime: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        place: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        distance: {
            type: DataTypes.INTEGER,
        },
        detailMemo: {
            type: DataTypes.STRING,
        },
    });
};

module.exports = DetailModel;
