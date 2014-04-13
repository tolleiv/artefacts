var helper = require('./helper')

var showState = function (app) {
    return function (req, res) {
        var m = app.get('model').State.using(app.get('connection'));
        m.where('id = ?', req.params.id).first(
            helper.forwardResult.bind(res, "State not found")
        );
    }
};

module.exports = function (app) {
    app.get("/state/:id", showState(app));

    app.post("/state", function (req, res) {
        var m = app.get('model')
        var p = new m.State(req.body);
        p.save(app.get('connection'),
            helper.forwardResult.bind(res)
        );
    });
    app.put("/state/:id", function (req, res, next) {
        var m = app.get('model').State;
        m.update(app.get('connection'), req.params.id, req.body, function (err, result) {
            err ? res.json(500, {message: err.message, stack: err.stack}) : next();
        });
    }, showState(app));

    app.del("/state/:id", function (req, res) {
        var m = app.get('model').State.using(app.get('connection'))
        m.where('id = ?', req.params.id).deleteAll(
            helper.forwardResult.bind(res)
        );
    });
}

