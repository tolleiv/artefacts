var helper = require('./helper')

var showArtefact = function (app) {
    return function (req, res) {
        var m = app.get('model').Artefact.using(app.get('connection'))
        m.include('artefactstates').where('id = ?', req.params.id)
            .first(helper.forwardResult.bind(res, {message: "Artefact not found", error: 20140602173107}));
    }
};

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
        var data = req.body;
        helper.resolveRelatedObjects(app, data,
            function (models) {
                delete data.pipeline_id;
                data.pipeline = models.pipeline;
                var a = new m.Artefact(data);
                a.save(app.get('connection'),
                    helper.forwardOrFail.bind(res, 200, a)
                );
            },
            helper.forwardOrFail.bind(res, 404, { message: 'Artefact invalid', error: 20140602173100 })
        );
    });

    app.put("/artefact/:id/:title", function (req, res) {
        res.redirect('/artefact/' + req.params.id + '/' + req.params.title + '/yellow');
    });

    app.put("/artefact/:id/:title/:code", function (req, res, next) {
        var m = app.get('model');
        var data = {code: req.params.code};
        for (var k in req.body) data[k] = req.body[k];


        function getStateByTitle(title, cb) {
            var s = m.State.using(app.get('connection'));
            s.where('title = ?', title).first(function (err, obj) {
                if (err) {
                    helper.forwardOrFail.call(res, 404, { message: 'State not found', error: 20140602173105 })
                } else {
                    cb(obj);
                }
            });
        }

        function artefactRelatedToState(artefact, state, yes, no) {
            var as = m.ArtefactState.using(app.get('connection'));
            as.where('artefact_id = ? AND state_id = ?', artefact.id, state.id).first(function (err, obj) {
                if (err) {
                    helper.forwardResult.call(res, err)
                } else {
                    obj ? yes(obj) : no(artefact, state);
                }
            });
        }

        function isRelated(state) {
            state.update(app.get('connection'), data, function (err, result) {
                err ? res.json(500, {message: err.message, stack: err.stack}) : next();
            });
        }

        function isNotRelated(artefact, state) {
            data.artefact = artefact;
            data.state = state;
            var as = new m.ArtefactState(data);
            as.save(app.get('connection'), next);
        }

        getStateByTitle(req.params.title, function (state) {
            helper.resolveRelatedObjects(app, {artefact_id: req.params.id}, function(models) {
                artefactRelatedToState(models.artefact, state, isRelated, isNotRelated);
            });
        });
    }, showArtefact(app));


    app.put("/artefact/:id", function (req, res, next) {
        var m = app.get('model').Artefact.using(app.get('connection'));
        m.where('id = ?', req.params.id).first(function (err, obj) {
            if (err) {
                res.json(500, {message: err.message, stack: err.stack});
            } else {
                obj.update(app.get('connection'), req.body, function (err, result) {
                    err ? res.json(500, {message: err.message, stack: err.stack}) : next();
                });
            }
        });
    }, showArtefact(app));

    app.del("/artefact/:id", function (req, res) {
        var m = app.get('model').Artefact.using(app.get('connection'))
        m.where('id = ?', req.params.id).deleteAll(
            helper.forwardResult.bind(res)
        );
    });
}

