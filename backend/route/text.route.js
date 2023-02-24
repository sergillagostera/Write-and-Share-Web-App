module.exports = function(app) {
    const text = require('../controller/text.controller.js');

    // Post a new Text
    app.post('/api/text', text.create);

    // Get all Texts
    app.get("/api/texts", text.findAll);

    // Get Texts by username
    app.get("/api/texts/:username", text.findByUsername);

    // Get a Text by text_id
    app.get("/api/text/:text_id", text.findById);

    // Get all Texts order by search options
    app.get("/api/texts/:language/:order/:genre/:search", text.search);

    // Get a Text by username & title (confirmPublication)
    app.get("/api/text/:username/:title", text.findByUsernameTitle);

    // Delete a Text by text_id
    app.delete("/api/text/:text_id", text.delete);

}