const env = require('./env.js');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

const sequelize = new Sequelize(env.database, env.username, env.password, {
    host: env.host,
    port: env.port,
    dialect: env.dialect,
    define: {
        freezeTableName: true, //disable the modification of table names
    }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.bcrypt = bcrypt;
db.users = require('../model/user.model.js')(sequelize, Sequelize);
db.texts = require('../model/text.model.js')(sequelize, Sequelize);
db.continuations = require('../model/continuation.model.js')(sequelize, Sequelize);
db.likes = require('../model/like.model.js')(sequelize, Sequelize);

// Continuations - Likes
db.continuations.hasMany(db.likes, {
    as: "Likes",
    foreignKey: "continuation_id"
});

db.likes.belongsTo(db.continuations, {
    foreignKey: "continuation_id"
});

// Texts - Continuations
db.texts.hasMany(db.continuations, {
    foreignKey: "text_id"
});

db.continuations.belongsTo(db.texts, {
    as: "Text",
    foreignKey: "text_id"
});

// Users - Texts
db.users.hasMany(db.texts, {
    as: "Texts",
    foreignKey: "username"
});

db.texts.belongsTo(db.users, {
    foreignKey: "username"
});

// Users - Continuations
db.users.hasMany(db.continuations, {
    as: "Continuations",
    foreignKey: "username"
});

db.continuations.belongsTo(db.users, {
    foreignKey: "username"
});

// Users - Likes
db.users.hasMany(db.likes, {
    as: "Likes",
    foreignKey: "username"
});

db.likes.belongsTo(db.users, {
    foreignKey: "username"
});

module.exports = db;