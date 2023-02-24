const db = require('../config/db.config.js');
const User = db.users;
const bcrypt = db.bcrypt;

// Post a User
exports.create = (req, res) => {

    const salt = bcrypt.genSaltSync(10, 'a');
    const password = bcrypt.hashSync(req.body.password, salt);
    User.create({
        username: req.body.username,
        password: password
    }).then(user => {
        res.send(user);
    }).catch(err => {
        res.status(500).send("Error (" + err + ")");
    })
};

// Get a User by his username
exports.findByUsername = (req, res) => {
    User.findOne({
        where: {
            username: req.params.username
        }
    }).then(user => {
        if (user != null) {
            res.send(user.username);
        } else {
            res.send(undefined);
        }
        
    }).catch(err => {
        res.status(500).send("Error (" + err + ")");
    })
};

// Get a username by his username & password (SignIn)
exports.signIn = (req, res) => {
    User.findOne({
        where: {
            username: req.params.username
        }
    }).then(user => {
        if (user != null && bcrypt.compareSync(req.params.password, user.password)) {
            console.log("Verified user");
            res.send(user.username);

        } else {
            console.log("Unverified user");
            res.send(undefined);
        }
    }).catch(err => {
        res.status(500).send("Error (" + err + ")");
    })
};

// Delete a User by username
exports.delete = (req, res) => {

    User.destroy({
        where: {
            username: req.params.username
        }
    }).then(() => {
        res.status(200).send("User has been deleted!");
    }).catch(err => {
        res.status(500).send("Error (" + err + ")");
    })
};