module.exports = function(app) {
    const continuation = require('../controller/continuation.controller.js');

    // Post a new Continuation
    app.post('/api/continuation', continuation.create);

    // Get Continuations by username
    app.get("/api/continuations/:username", continuation.findByUsername);

    // Get Continuation by continuation_id
    app.get("/api/continuation/:continuation_id", continuation.findByContinuationId);

    // Get Continuations by text_id and previousContinuation
    app.get("/api/continuations/:text_id/:previousContinuation", continuation.findByTextIdPreviousContinuation);

    // Get Continuations by order options
    app.get("/api/continuations/:order/:text_id/:previousContinuation", continuation.order);

    // Delete a Continuation by continuation_id
    app.delete("/api/continuation/:continuation_id", continuation.delete);
}