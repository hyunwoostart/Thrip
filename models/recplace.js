const { DataTypes } = require('sequelize');

const recplaceModel = (sequelize) => {
    return sequelize.define('recplace', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        place: {
            type: DataTypes.STRING,
        },
        memo: {
            type: DataTypes.STRING,
        },
        isActive: {
            type: DataTypes.TINYINT(1),
            allowNull: false,
            defaultValue: 0,
        },
    });
};

module.exports = recplaceModel;
