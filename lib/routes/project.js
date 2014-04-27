var helper = require('./helper')

var showProject = function (req, res, next) {
    var m = this.get('model').Project.using(this.get('connection'))
    m.where('id = ?', req.params.id).first(
        helper.failOnError.bind(res, req, 'project', null, next)
    );
};

module.exports = function (app) {
    app.get("/projects", function (req, res, next) {
        var m = app.get('model').Project.using(app.get('connection'))
        m.all(helper.failOnError.bind(res, req, 'project', null, next));
    }, helper.forwardResults);

    app.get("/project/:id",
        showProject.bind(app),
        helper.failOnEmptyResult.bind(null, "Project not found"),
        helper.forwardResults
    );

    app.post("/project", function (req, res, next) {
            var m = app.get('model')
            var p = new m.Project(req.body);
            p.save(app.get('connection'),
                helper.failOnError.bind(res, req, 'project', 'created', next)
            );
        },
        helper.emitResult.bind(app),
        helper.forwardResults
    );

    app.put("/project/:id", function (req, res, next) {
            var m = app.get('model').Project
            m.update(app.get('connection'), req.params.id, req.body,
                helper.failOnError.bind(res, req, 'project', 'updated', next)
            );
        },
        helper.failOnEmptyResult.bind(null, "Project not found"),
        helper.emitResult.bind(app),
        showProject.bind(app),
        helper.forwardResults);

    app.del("/project/:id", function (req, res, next) {
            var m = app.get('model').Project.using(app.get('connection'))
            m.where('id = ?', req.params.id).deleteAll(
                helper.failOnError.bind(res, req, 'project', 'deleted', next)
            );
        },
        helper.emitResult.bind(app),
        helper.forwardResults
    );
}

