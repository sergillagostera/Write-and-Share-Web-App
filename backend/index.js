var express = require('express');
var app = express();

// parse requests of content-type - application/json
app.use(express.json());

const cors = require('cors');
const corsOptions = {
  origin: "http://localhost:8081",
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

const db = require('./config/db.config.js');

db.sequelize.sync({ force: false }).then(() => {
  console.log('Drop and Resync with { force: true }');
});

require('./route/user.route.js')(app);
require('./route/text.route.js')(app);
require('./route/continuation.route.js')(app);
require('./route/like.route.js')(app);

// Create a Server
var server = app.listen(8080, function() {
  var host = server.address().address
  var port = server.address().port

  console.log("App listening at http://%s:%s", host, port)
});