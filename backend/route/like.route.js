module.exports = function(app) {
    const like = require('../controller/like.controller.js');

    // Post a new Continuation
    app.post('/api/like', like.create);

    // Delete a Like by username and continuation_id
    app.delete("/api/like/:username/:continuation_id", like.delete);

}