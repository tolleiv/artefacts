var helper = require('./helper')

var showPipeline = function (req, res, next) {
    var m = this.get('model').Pipeline.using(this.get('connection'))
    m.where('id = ?', req.params.id).first(
        helper.failOnError.bind(res, req, 'pipeline', null, next)
    );
}

module.exports = function (app) {
    app.get("/project/:id/pipelines", function (req, res, next) {
        var m = app.get('model').Pipeline.using(app.get('connection'))
        m.where('project_id = ?', req.params.id).all(
            helper.failOnError.bind(res, req, 'pipeline', null, next)
        );
    }, helper.forwardResults);

    app.get("/pipeline/:id",
        showPipeline.bind(app),
        helper.failOnEmptyResult.bind(null, "Pipeline not found"),
        helper.forwardResults
    );

    app.post("/pipeline",
        helper.resolveObjectsById.bind(app),
        function (req, res, next) {
            var m = app.get('model')
            var data = req.body;
            delete data.project_id;
            data.project = req.model.project;
            var p = new m.Pipeline(data);
            p.save(app.get('connection'),
                helper.failOnError.bind(res, req, 'pipeline', 'created', next)
            );
        },
        helper.emitResult.bind(app),
        helper.forwardResults
    );

    app.put("/pipeline/:id", function (req, res, next) {
            var m = app.get('model').Pipeline
            var data = req.body;
            delete data.id;
            delete data.project_id;
            delete data.project;
            m.update(app.get('connection'), req.params.id, data,
                helper.failOnError.bind(res, req, 'pipeline', 'updated', next)
            );
        },
        helper.failOnEmptyResult.bind(null, "Pipeline not found"),
        helper.emitResult.bind(app),
        showPipeline.bind(app),
        helper.forwardResults);

    app.del("/pipeline/:id", function (req, res, next) {
            var m = app.get('model').Pipeline.using(app.get('connection'))
            m.where('id = ?', req.params.id).deleteAll(
                helper.failOnError.bind(res, req, 'pipeline', 'deleted', next)
            );
        },
        helper.emitResult.bind(app),
        helper.forwardResults);
}