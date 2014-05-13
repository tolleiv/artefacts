var helper = require('./helper')
var async = require('async');
var extend = require('util')._extend;

module.exports = function (app) {

    app.get("/c/:project/:pipeline/:state/:code",
        helper.resolveObjectsBySlug.bind(app),
        function(req, res, next) {
            var a = app.get('model').ArtefactState.using(app.get('connection'))
            a
                .include('artefacts')
                .where({
                    'state_id': req.model.state.id,
                    'artefact.pipeline_id': req.model.pipeline.id,
                    'code': req.params.code})
                .orderBy('lastUpdated', 'desc')
                .first(
                    helper.failOnError.bind(res, req, 'artefactstate', null, next)
                );
        },
        helper.failOnEmptyResult,
        function(req, res, next) {
            req.data.result = req.data.artefactstate.artefacts;
            next();
        },
        helper.forwardResults);

    app.put("/c/:project/:pipeline/:artefact/:state/:code",
        helper.resolveObjectsBySlug.bind(app),
        function (req, res, next) {
            var parts = ["/artefact"];
            parts.push(req.model.artefact.id);
            parts.push(req.model.state.id);
            parts.push(req.params.code);
            res.redirect(parts.join('/'));
        }
    );

    app.post("/c/:project/:pipeline/:artefact/:state/:code",
        function (req, res, next) {
            req.slugParams = {
                project: req.params.project,
                pipeline: req.params.pipeline,
                state: req.params.state
            };
            next();
        },
        helper.resolveObjectsBySlug.bind(app),
        function (req, res, next) { // create artefact
            var artefact = extend({}, req.body);
            artefact.pipeline = req.model.pipeline;
            artefact.version = req.params.artefact;
            var m = app.get('model');
            var a = new m.Artefact(artefact);
            a.save(app.get('connection'),
                helper.failOnError.bind(res, req, 'artefact', 'created', next)
            );
        },
        function (req, res, next) { // create artefact state
            var artefactstate = extend({}, req.body);
            artefactstate.artefact = req.data.artefact;
            artefactstate.state = req.model.state;
            artefactstate.code = req.params.code;
            var m = app.get('model');
            var as = new m.ArtefactState(artefactstate);
            as.save(app.get('connection'),
                helper.failOnError.bind(res, req, 'artefactstate', 'created', next)
            );
        },
        function (req, res, next) { // show artefact
            var a = app.get('model').Artefact.using(app.get('connection'))
            a.include('artefactstates').where('id = ?', req.data.artefact.id)
                .first(
                    helper.failOnError.bind(res, req, 'artefact', null, next)
                );
        },
        helper.forwardResults
    );



    function modelCount(type, req, res, next) {
        var m = app.get('model');
        m[type].count(app.get('connection'), helper.failOnError.bind(res, req, type.toLowerCase(), null, next));
    }

    app.get("/c/statistics",
        modelCount.bind(null, 'Project'),
        modelCount.bind(null, 'Pipeline'),
        modelCount.bind(null, 'Artefact'),
        function (req, res, next) {
            app.get('connection').runSqlAll("SELECT code, COUNT(code) as amount FROM ArtefactStates GROUP BY code",
                helper.failOnError.bind(res, req, 'states', null, next)
            );
        },
        function (req, res, next) {
            var result = {
                projects: req.data.project || 0,
                pipelines: req.data.pipeline || 0,
                artefacts: req.data.artefact || 0,
                states: {}
            };
            for (var i in Object.keys(req.data.states)) {
                result.states[req.data.states[i].code] = req.data.states[i].amount;
            }
            req.data.result = result;
            next();
        },
        helper.forwardResults
    );
}

