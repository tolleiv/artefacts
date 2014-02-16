var helper = require('./helper')

var showArtefact = function(app) {
    return function (req, res) {
        var m = app.get('model').Artefact.using(app.get('connection'))
        m.where('id = ?', req.params.id).first(
            helper.forwardResult.bind(res, "Artefact not found")
        );
    }
}

module.exports = function (app) {
    app.get("/pipeline/:id/artefacts", function (req, res) {
        var m = app.get('model').Artefact.using(app.get('connection'))
        m.where('pipeline_id = ?', req.params.id).all(
            helper.forwardResult.bind(res)
        );
    });

    app.get("/artefact/:id", showArtefact(app));
    app.post("/artefact", function (req, res) {
        var m = app.get('model');
        helper.getPipeline(app, req.body.pipeline_id,
            function(pipeline) {
                var data = req.body;
                delete data.pipeline_id
                data.pipeline = pipeline;
                var a = new m.Artefact(data);
                a.save(app.get('connection'),
                    helper.forwardOrFail.bind(res, 200, a)
                );
            },
            helper.forwardOrFail.bind(res, 404, { message: 'Artefact invalid', error: 20140602173100 })
        );
    });

    app.put("/artefact/:id", function (req, res, next) {
        var m = app.get('model').Artefact
        m.update(app.get('connection'), req.params.id, req.body, function (err, result) {
            err ? res.json(500, {message: err.message, stack: err.stack}) : next();
        });
    }, showArtefact(app));

    app.del("/artefact/:id", function (req, res) {
        var m = app.get('model').Artefact.using(app.get('connection'))
        m.where('id = ?', req.params.id).deleteAll(
            helper.forwardResult.bind(res)
        );
    });
}

