var helper = require('./helper')

var showArtefact = function (req, res, next) {
    var m = this.get('model').Artefact.using(this.get('connection'))
    m.include('artefactstates').where('id = ?', req.params.id).first(
        helper.failOnError.bind(res, req, 'artefact', null, next)
    );
};

var getStateByTitle = function (req, res, next) {
    var s = this.get('model').State.using(this.get('connection'));
    s.where('title = ?', req.params.title).first(
        helper.failOnError.bind(res, req, 'state', null, next)
    );
};

module.exports = function (app) {
    app.get("/pipeline/:id/artefacts", function (req, res, next) {
            var m = app.get('model').Artefact.using(app.get('connection'))
            m.where('pipeline_id = ?', req.params.id).all(
                helper.failOnError.bind(res, req, 'artefact', null, next)
            );
        },
        helper.forwardResults
    );

    app.get("/artefact/:id",
        showArtefact.bind(app),
        helper.failOnEmptyResult.bind(null, "Artefact not found"),
        helper.forwardResults
    );

    app.post("/artefact",
        helper.resolveObjectsById.bind(app),
        function (req, res, next) {
            var m = app.get('model')
            var data = req.body;
            delete data.pipeline_id;
            data.pipeline = req.model.pipeline;
            var p = new m.Artefact(data);
            p.save(app.get('connection'),
                helper.failOnError.bind(res, req, 'artefact', 'created', next)
            );
        },
        helper.emitResult.bind(app),
        helper.forwardResults
    );

    app.put("/artefact/:id/:title", function (req, res) {
        res.redirect('/artefact/' + req.params.id + '/' + req.params.title + '/yellow');
    });

    app.put("/artefact/:id/:title/:code",
        getStateByTitle.bind(app),
        showArtefact.bind(app),
        function (req, res, next) {
            var m = app.get('model');
            var data = {code: req.params.code};
            for (var k in req.body) data[k] = req.body[k];

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
                state.update(app.get('connection'), data,
                    helper.failOnError.bind(res, req, 'artefact', 'updated', next)
                );
            }

            function isNotRelated(artefact, state) {
                data.artefact = artefact;
                data.state = state;
                var as = new m.ArtefactState(data);
                as.save(app.get('connection'),
                    helper.failOnError.bind(res, req, 'artefact', 'deleted', next)
                );
            }

            artefactRelatedToState(req.data.artefact, req.data.state, isRelated, isNotRelated);
        },
        showArtefact.bind(app),
        helper.forwardResults
    );


    app.put("/artefact/:id",
        showArtefact.bind(app),
        helper.failOnEmptyResult.bind(null, "Artefact not found"),
        function (req, res, next) {
            req.data.result.update(app.get('connection'), req.body,
                helper.failOnError.bind(res, req, 'artefact', 'updated', next)
            );
        },
        helper.emitResult.bind(app),
        showArtefact.bind(app),
        helper.forwardResults
    );


    app.del("/artefact/:id", function (req, res, next) {
            var m = app.get('model').Artefact.using(app.get('connection'))
            m.where('id = ?', req.params.id).deleteAll(
                helper.failOnError.bind(res, req, 'artefact', 'deleted', next)
            );
        },
        helper.emitResult.bind(app),
        helper.forwardResults
    );
}

