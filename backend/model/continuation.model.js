module.exports = (sequelize, Sequelize) => {
    const Continuation = sequelize.define('continuation', {

        continuation_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }, 
        text_id: {
            type: Sequelize.INTEGER,
            allowNull: false,

            references: {
                model: "text",
                key: "text_id"
            },
            onDelete: 'cascade',
        },
        previousContinuation: {
            type: Sequelize.INTEGER,

            references: {
                model: "continuation",
                key: "continuation_id"
            },
            onDelete: 'cascade',
        },
        username: {
            type: Sequelize.STRING(15),
            allowNull: false,

            references: {
                model: "user",
                key: "username"
            },
            onDelete: 'cascade',
        },
        textC: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        mergedText: {
            type: Sequelize.TEXT,
            allowNull: false,        
        }

    });

    return Continuation;
};