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

    app.get("/c/statistics", function(req, res) {

        function modelCount(type, cb) {
            var m = app.get('model');
            m[type].count(app.get('connection'), cb);
        }
        function stateCount(cb) {
            app.get('connection').runSqlAll("SELECT code, COUNT(code) as amount FROM ArtefactStates GROUP BY code", cb)
        }


        async.series([
            modelCount.bind(this, 'Project'),
            modelCount.bind(this, 'Pipeline'),
            modelCount.bind(this, 'Artefact'),
            stateCount.bind(this)
        ], function(err, results) {
            var result = {
                projects: results[0],
                pipelines: results[1],
                artefacts: results[2],
                states: {}
            };
            for(var i in Object.keys(results[3])) {
                result.states[results[3][i].code] = results[3][i].amount;
            }

            helper.forwardResult.call(res, err, result)
        });
    });
}

