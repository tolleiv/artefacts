var persist = require("persist");
var model = require('./models');

module.exports = function (app) {
    persist.connect(function (err, connection) {
        app.set('connection', connection);
    });
    app.set('model', model);
}

