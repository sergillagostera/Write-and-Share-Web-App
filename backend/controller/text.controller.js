const { Sequelize, sequelize } = require('../config/db.config.js');
const db = require('../config/db.config.js');
const Text = db.texts;

// Post a new Text
exports.create = (req, res) => {
    
    Text.create({
        username: req.body.username,
        title: req.body.title,
        originalTitle: req.body.originalTitle,
        originalAuthor: req.body.originalAuthor,
        genre: req.body.genre,
        theme: req.body.theme,
        language: req.body.language,
        text: req.body.text
    }).then(text => {
        res.send(text);
    }).catch(err => {
        res.status(500).send("Error (" + err + ")");
    })
};

// Get all Texts
exports.findAll = (req, res) => {
    Text.findAll().then(continuations => {
        res.send(continuations);
    }).catch(err => {
        res.status(500).send("Error (" + err + ")");
    })
};

// Get Texts by username
exports.findByUsername = (req, res) => {
    Text.findAll({
        where: {
            username: req.params.username
        }    
    }).then(continuations => {
        res.send(continuations);
    }).catch(err => {
        res.status(500).send("Error (" + err + ")");
    })
};

// Get a Text by text_id
exports.findById = (req, res) => {
    Text.findOne({
        where: {
            text_id: req.params.text_id
        }
    }).then(text => {
        res.send(text);
    }).catch(err => {
        res.status(500).send("Error (" + err + ")");
    })
};

// Get all Texts order by search options
exports.search = (req, res) => {
    var whereAndStatement = {};
    var whereOrStatement = {};
    var orderStatement = [];
    
    if (req.params.language != "null") {
        whereAndStatement.language = req.params.language; 
    }

    if (req.params.genre != "null") {
        whereAndStatement.genre = req.params.genre; 
    }

    switch (req.params.order) {

        case "null":
        case "oldest":
            orderStatement = [sequelize.literal('createdAt ASC')];
            break;
        case "newest":
            orderStatement = [sequelize.literal('createdAt DESC')];
            break;
        case "contributions":
            orderStatement = [sequelize.literal('continuationsCount DESC')];
            break;
    }

    if (req.params.search != "@null") {

        whereOrStatement = {
            [Sequelize.Op.or]: {
                title: {
                    [Sequelize.Op.substring]: req.params.search
                },

                username: {
                    [Sequelize.Op.substring]: req.params.search
                },

                theme: {
                    [Sequelize.Op.substring]: req.params.search
                },

                originalAuthor: {
                    [Sequelize.Op.substring]: req.params.search
                },

                originalTitle: {
                    [Sequelize.Op.substring]: req.params.search
                }
            }
        } 

    }

    Text.findAll({

        attributes: {
            include: [
                [Sequelize.literal('(SELECT COUNT(*) FROM continuation where continuation.text_id=text.text_id)'), 'continuationsCount']
            ],
        },

        order: orderStatement,
        where: {
            [Sequelize.Op.and]: [ whereAndStatement, whereOrStatement ]
        }
    }).then(texts => {
        res.send(texts);
    }).catch(err => {
        res.status(500).send("Error (" + err + ")");
    })
};

// Get a Text by username & title (confirmPublication)
exports.findByUsernameTitle = (req, res) => {
    Text.findOne({
        where: {
            username: req.params.username,
            title: req.params.title
        }
    }).then(text => {
        res.send(text);
    }).catch(err => {
        res.status(500).send("Error (" + err + ")");
    })
};

// Delete a Text by text_id
exports.delete = (req, res) => {
    Text.destroy({
        where: {
            text_id: req.params.text_id
        }
    }).then(() => {
        res.status(200).send("Text has been deleted!");
    }).catch(err => {
        res.status(500).send("Error (" + err + ")");
    })
};