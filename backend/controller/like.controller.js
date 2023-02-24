const { likes } = require('../config/db.config.js');
const db = require('../config/db.config.js');
const Like = db.likes;

// Post a new Continuation
exports.create = (req, res) => {
    Like.create({
        username: req.body.username,
        continuation_id: req.body.continuation_id
    }).then(like => {
        res.send(like);
    }).catch(err => {
        res.status(500).send("Error (" + err + ")");
    })
};

// Delete a Like by username and continuation_id
exports.delete = (req, res) => {

    Like.destroy({
        where: {
            username: req.params.username,
            continuation_id: req.params.continuation_id
        }
    }).then(() => {
        res.status(200).send("Like has been deleted!");
    }).catch(err => {
        res.status(500).send("Error (" + err + ")");
    })
};