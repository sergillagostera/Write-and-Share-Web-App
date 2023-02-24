module.exports = (sequelize, Sequelize) => {
    const Like = sequelize.define('like', {

        username: {
            type: Sequelize.STRING(15),
            primaryKey: true,

            references: {
                model: "user",
                key: "username"
            },
            onDelete: 'cascade',
        },
        continuation_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,

            references: {
                model: "continuation",
                key: "continuation_id"
            },
            onDelete: 'cascade',
        }

    }, {
        timestamps: false //disable the fields createdAt and updatedAt from the model
    });

    return Like;
};