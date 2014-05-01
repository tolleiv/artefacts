var express = require('express');
var path = require('path');

var app = express();
exports.app = app;

app.configure(function () {
    app.set('views', path.join(__dirname, '..', 'res', 'views'));
    app.set('view engine', 'jade');
    //app.set('view options', { pretty:true });
    app.locals.pretty = true;
    app.use(express.favicon());
    app.use(express.urlencoded());
    app.use(express.json());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, '..', 'res', 'public')));
});

app.configure('development', function () {
    app.use(express.logger('dev'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});

//app.use(express.bodyParser());

require('./routes/ui')(app)
require('./routes/compound')(app)
require('./routes/project')(app)
require('./routes/pipeline')(app)
require('./routes/artefact')(app)
require('./routes/state')(app)