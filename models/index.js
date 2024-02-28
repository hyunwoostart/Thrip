'use strict';

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize = new Sequelize(config.database, config.username, config.password, config);

db.Member = require('./member')(sequelize);
db.Group = require('./group')(sequelize);
db.Detail = require('./detail')(sequelize);
db.Checklist = require('./checklist')(sequelize);

db.Group.hasMany(db.Detail);
db.Detail.belongsTo(db.Group);

db.Group.hasMany(db.Checklist);
db.Checklist.belongsTo(db.Group);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
