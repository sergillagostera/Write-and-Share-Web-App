module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('user', {

        username: {
            type: Sequelize.STRING(15),
            primaryKey: true,
        },
        password: {
            type: Sequelize.STRING(64).BINARY, //case sensitive
            allowNull: false
        }

    }, {
        timestamps: false //disable the fields createdAt and updatedAt from the model
    });

    return User;
};