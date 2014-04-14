var helper = require('./helper')

var showProject = function(app) {
    return function(req, res) {
        var m = app.get('model').Project.using(app.get('connection'))
        m.where('id = ?', req.params.id).first(
            helper.forwardResult.bind(res, "Project not found")
        );
    }
}

module.exports = function (app) {
    app.get("/projects", function (req, res) {
        var m = app.get('model').Project.using(app.get('connection'))
        m.all(helper.forwardResult.bind(res));
    });

    app.get("/project/:id", showProject(app));

    app.post("/project", function (req, res) {
        var m = app.get('model')
        var p = new m.Project(req.body);
        p.save(app.get('connection'),
            helper.forwardResult.bind(res)
        );
    });

    app.put("/project/:id", function (req, res, next) {
        var m = app.get('model').Project
        m.update(app.get('connection'), req.params.id, req.body, function (err, result) {
            err ? res.json(500, {message: err.message, stack: err.stack}) : next();
        });
    }, showProject(app));

    app.del("/project/:id", function (req, res) {
        var m = app.get('model').Project.using(app.get('connection'))
        m.where('id = ?', req.params.id).deleteAll(
            helper.forwardResult.bind(res)
        );
    });
}

