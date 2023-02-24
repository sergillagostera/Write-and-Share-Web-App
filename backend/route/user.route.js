module.exports = function(app) {
    const user = require('../controller/user.controller.js');

    // Create a new User
    app.post('/api/user', user.create);

    // Retrieve a single User by username
    app.get("/api/user/username/:username", user.findByUsername);

    // Retrieve a single User by username and password (sign in)
    app.get("/api/user/signIn/:username/:password", user.signIn);

    // Delete a User by username
    app.delete("/api/user/:username/", user.delete);
    
}