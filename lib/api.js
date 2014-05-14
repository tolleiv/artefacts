var express = require('express');
var favicon = require('serve-favicon');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var morgan  = require('morgan');
var errorhandler = require('errorhandler')
var path = require('path');

var app = express();
exports.app = app;

/* istanbul ignore next */
var env = process.env.NODE_ENV || 'development';

app.set('views', path.join(__dirname, '..', 'res', 'views'));
app.set('view engine', 'jade');
app.locals.pretty = true;
app.use(favicon(path.join(__dirname, '..', 'res', 'public', 'favicon.ico')));
app.use(bodyParser())
app.use(express.static(path.join(__dirname, '..', 'res', 'public')));

/* istanbul ignore if */
if ('development' == env) {
    app.use(morgan({ format: 'dev', immediate: true }));
    app.use(errorhandler());
}

require('./routes/ui')(app)
require('./routes/compound')(app)
require('./routes/project')(app)
require('./routes/pipeline')(app)
require('./routes/artefact')(app)
require('./routes/state')(app)