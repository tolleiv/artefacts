var helper = require('./helper')
var async = require('async');
var extend = require('util')._extend;

module.exports = function (app) {
    app.put("/c/:project/:pipeline/:artefact/:state/:code", function (req, res) {
        helper.resolveRelatedObjectsBySlug(app, req.params,
            function(models) {
                var parts = ["/artefact"];
                parts.push(models.artefact.id);
                parts.push(models.state.id);
                parts.push(req.params.code);

                res.redirect(parts.join('/'));
            },
            helper.forwardOrFail.bind(res, 409)
        );
    });

    app.post("/c/:project/:pipeline/:artefact/:state/:code", function(req, res) {
        var m = app.get('model');

        function createArtefactState(models, artefact, cb) {
            var artefactstate = extend({}, req.body);
            artefactstate.artefact = artefact;
            artefactstate.state = models.state;
            artefactstate.code =  req.params.code;

            var as = new m.ArtefactState(artefactstate);
            as.save(app.get('connection'), function(err, obj) {
                cb(err, artefact)
            });
        }

        function createArtefact(models, cb) {
            var artefact = extend({}, req.body);
            artefact.pipeline = models.pipeline;
            artefact.version = req.params.artefact;

            var a = new m.Artefact(artefact);
            a.save(app.get('connection'), function (err, obj) {
                console.log(err)
                cb(err, models, obj)
            });
        }

        function readArtefact(artefact, cb) {
            var a = m.Artefact.using(app.get('connection'))
            a.include('artefactstates').where('id = ?', artefact.id)
                .first(cb);
        }

        async.waterfall([
            function (callback) {
                var data = {
                    project: req.params.project,
                    pipeline: req.params.pipeline,
                    state: req.params.state
                };
                helper.resolveRelatedObjectsBySlug(app, data,
                    function (models) { callback(null, models); },
                    function (errors) { callback(errors, null); }
                );
            },
            createArtefact,
            createArtefactState,
            readArtefact
        ],
            function(err, artefact) {
                if (err) res.json(409, { message: err.message, stack: err.stack })
                else res.json(200, artefact);
            }


        );
    });
}

