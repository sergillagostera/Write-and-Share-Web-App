const { Sequelize, sequelize } = require('../config/db.config.js');
const db = require('../config/db.config.js');
const { username } = require('../config/env.js');
const Continuation = db.continuations;

// Post a new Continuation
exports.create = (req, res) => {

    Continuation.create({
        text_id: req.body.text_id,
        previousContinuation: req.body.previousContinuation,
        username: req.body.username,
        textC: req.body.text,
        mergedText: req.body.mergedText,
    }).then(continuation => {
        res.send(continuation);
    }).catch(err => {
        res.status(500).send("Error (" + err + ")");
    })
};

// Get Continuations by username
exports.findByUsername = (req, res) => {
    Continuation.findAll({
        include: [{
            model: db.likes,
            attributes: ["username"],
            as: "Likes"
        },{
            model: db.texts,
            attributes: ["username", "title"],
            as: "Text"
        }],
        where: {
            username: req.params.username
        }
    }).then(continuations => {
        res.send(continuations);
    }).catch(err => {
        res.status(500).send("Error (" + err + ")");
    })
};

// Get Continuation by continuation_id
exports.findByContinuationId = (req, res) => {
    Continuation.findOne({
        where: {
            continuation_id: req.params.continuation_id
        }
    }).then(continuation => {
        res.send(continuation);
    }).catch(err => {
        res.status(500).send("Error (" + err + ")");
    })
};

// Get Continuations by text_id and previousContinuation
exports.findByTextIdPreviousContinuation = (req, res) => {
    var whereStatement = {};

    if (req.params.text_id != "null") {
        whereStatement.text_id = req.params.text_id; 
    }

    if (req.params.previousContinuation != "null"){
        whereStatement.previousContinuation = req.params.previousContinuation;
    } else {
        whereStatement.previousContinuation = null; 
    }

    Continuation.findAll({
        include: [{
            model: db.likes,
            attributes: ['username'],
            as: "Likes"
        }],
        where: whereStatement

    }).then(continuations => {
        res.send(continuations);
    }).catch(err => {
        res.status(500).send("Error (" + err + ")");
    })
};

// Get Continuations by order options
exports.order = (req, res) => {
    var whereStatement = {};
    var orderStatement = [];

    if (req.params.text_id != "null") {
        whereStatement.text_id = req.params.text_id; 
    }

    if (req.params.previousContinuation != "null"){
        whereStatement.previousContinuation = req.params.previousContinuation;
    } else {
        whereStatement.previousContinuation = null; 
    }

    switch (req.params.order) {

        case "null":
        case "oldest":
            orderStatement = [sequelize.literal('createdAt ASC')];
            break;
        case "newest":
            orderStatement = [sequelize.literal('createdAt DESC')];
            break;
        case "likes":
            orderStatement = [sequelize.literal('likesCount DESC')];
            break;
    }
    
    Continuation.findAll({
        
        attributes: {
            include: [
                [Sequelize.literal('(SELECT COUNT(*) FROM `like` where like.continuation_id=continuation.continuation_id)'), 'likesCount']
            ],
        },
        
        include: [{
            model: db.likes,
            as: "Likes",
            attributes: ['username'],
        }],

        order: orderStatement,
        where: whereStatement

    }).then(continuations => {
        res.send(continuations);
    }).catch(err => {
        res.status(500).send("Error (" + err + ")");
    })
};

// Delete a Continuation by continuation_id
exports.delete = (req, res) => {
    Continuation.destroy({
        where: {
            continuation_id: req.params.continuation_id
        }
    }).then(() => {
        res.status(200).send("Continuation has been deleted!");
    }).catch(err => {
        res.status(500).send("Error (" + err + ")");
    })
};