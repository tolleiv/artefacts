var express = require('express');
var persist = require("persist");
var model = require('./models');

var app = express();
exports.app = app;

app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});

//app.use(express.bodyParser());
app.use(express.urlencoded());
app.use(express.json());
app.use(express.methodOverride());
app.use(app.router);

require('./routes/project')(app)
require('./routes/pipeline')(app)
require('./routes/artefact')(app)
require('./routes/state')(app)

if (__filename == process.argv[1]) {
    persist.connect(function(err, connection) {


        app.set('connection', connection);
    });
    app.set('model', model);
    app.listen(3000);
}