var showProject = function(app) {
    return function showProject(req, res) {
        var m = app.get('model').Project.using(app.get('connection'))
        m.where('id = ?', req.params.id).first(function (err, p) {
            err ? res.json(500, err) : res.json(200, p);
        });
    }
}

module.exports = function (app) {
    app.get("/", function (req, res) {
        var m = app.get('model').Project.using(app.get('connection'))
        m.all(function (err, p) {
            err ? res.json(500, err) : res.json(200, p);
        });
    });

    app.get("/project/:id", showProject(app));

    app.post("/project", function (req, res) {
        var m = app.get('model')
        var p = new m.Project(req.body);
        p.save(app.get('connection'), function (err) {
            err ? res.json(500, err) : res.json(200, p);
        });
    });

    app.put("/project/:id", function (req, res, next) {
        var m = app.get('model').Project
        m.update(app.get('connection'), req.params.id, req.body, function (err, result) {
            err ? res.json(500, err) : next();
        });
    }, showProject(app));


    app.del("/project/:id", function (req, res) {
        var m = app.get('model').Project.using(app.get('connection'))
        m.where('id = ?', req.params.id).deleteAll(function (err) {
            err ? res.json(500, err) : res.json(200);
        });
    });
}

