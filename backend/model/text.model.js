module.exports = (sequelize, Sequelize) => {
    const Text = sequelize.define('text', {

        text_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
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
        title: {
            type: Sequelize.STRING(50),
            allowNull: false,
        },
        originalAuthor: {
            type: Sequelize.STRING(50),
        },
        originalTitle: {
            type: Sequelize.STRING(50),
        },
        genre: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                isIn: [['prose', 'poetry', 'drama']]
            }
        },
        theme: {
            type: Sequelize.STRING(25),
            allowNull: false,
        },
        language: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                isIn: [['catalan', 'spanish', 'english']]
            }
        },
        text: {
            type: Sequelize.TEXT,
            allowNull: false,
        },

    });

    return Text;
};