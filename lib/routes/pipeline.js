var helper = require('./helper')

var showPipeline = function(app) {
    return function (req, res) {
        var m = app.get('model').Pipeline.using(app.get('connection'))
        m.where('id = ?', req.params.id).first(
            helper.forwardResult.bind(res, "Pipeline not found")
        );
    }
}

module.exports = function (app) {
    app.get("/project/:id/pipelines", function (req, res) {
        var m = app.get('model').Pipeline.using(app.get('connection'))
        m.where('project_id = ?', req.params.id).all(
            helper.forwardResult.bind(res)
        );
    });

    app.get("/pipeline/:id", showPipeline(app));

    app.post("/pipeline", function (req, res) {
        var m = app.get('model')
        var data = req.body;
        helper.resolveRelatedObjectsById(app, data,
            function(models) {
                delete data.project_id
                data.project = models.project;
                var p = new m.Pipeline(data);
                p.save(app.get('connection'),
                    helper.forwardOrFail.bind(res, 200, p)
                );
            },
            helper.forwardOrFail.bind(res, 404, { message: 'Project invalid', error: 20140602072100 })
        );
    });

    app.put("/pipeline/:id", function (req, res, next) {
        var m = app.get('model').Pipeline
        var data = req.body;
        delete data.id;
        delete data.project_id;
        delete data.project;
        m.update(app.get('connection'), req.params.id, data, function (err, result) {
            err ? res.json(500, err) : next();
        });
    }, showPipeline(app));

    app.del("/pipeline/:id", function (req, res) {
        var m = app.get('model').Pipeline.using(app.get('connection'))
        m.where('id = ?', req.params.id).deleteAll(
            helper.forwardResult.bind(res)
        );
    });
}