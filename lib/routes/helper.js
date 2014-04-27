var async = require('async');


exports.getProject = getProject = function (app, value, by, related, callback) {
    var m = app.get('model').Project.using(app.get('connection'))
    m.where(by + ' = ?', value).first(callback)
};
exports.getPipeline = getPipeline = function (app, value, by, related, callback) {
    var query = {};
    query[by] = value;
    if (related.project) query['project_id'] = related.project.id;
    var m = app.get('model').Pipeline.using(app.get('connection'))
    m.where(query).first(callback)
};
exports.getArtefact = getArtefact = function (app, value, by, related, callback) {
    var query = {};
    query[by] = value;
    if (related.pipeline) query['pipeline_id'] = related.pipeline.id;
    var m = app.get('model').Artefact.using(app.get('connection'))
    m.where(query).first(callback)
};

exports.getState = getState = function (app, value, by, related, callback) {
    var m = app.get('model').State.using(app.get('connection'))
    m.where(by + ' = ?', value).first(callback)
};

var resolveRelatedObjectsBy = function (list, callbackOk, callbackNok) {
    var result = {}, errors = {};
    var loop = function (keys, cb) {
        if (keys.length == 0) {
            cb();
            return;
        }
        var key = keys[0];
        list[key](result, function (err, obj) {
            if (!err && obj) {
                result[key] = obj;
            } else {
                errors[key] = err || new Error(key + " invalid");
            }
            loop(keys.slice(1), cb);
        });
    };
    loop(Object.keys(list), function () {
        if (Object.keys(errors).length === 0 && Object.keys(list).length > 0) callbackOk(result);
        else  callbackNok(errors);
    });
};

var resolveRelatedObjectsById = function (app, data, callbackOk, callbackNok) {
    var list = {};

    if (data['project_id']) list.project = getProject.bind(this, app, data['project_id'], 'id');
    if (data['pipeline_id']) list.pipeline = getPipeline.bind(this, app, data['pipeline_id'], 'id');
    if (data['artefact_id']) list.artefact = getArtefact.bind(this, app, data['artefact_id'], 'id');
    if (data['state_id']) list.state = getState.bind(this, app, data['state_id'], 'id');

    resolveRelatedObjectsBy(list, callbackOk, callbackNok);
};

var resolveRelatedObjectsBySlug = function (app, data, callbackOk, callbackNok) {
    var list = {};

    if (data['project']) list.project = getProject.bind(this, app, data['project'], 'title');
    if (data['pipeline']) list.pipeline = getPipeline.bind(this, app, data['pipeline'], 'title');
    if (data['artefact']) list.artefact = getArtefact.bind(this, app, data['artefact'], 'version');
    if (data['state']) list.state = getState.bind(this, app, data['state'], 'title');

    resolveRelatedObjectsBy(list, callbackOk, callbackNok);
};

exports.resolveObjectsById = function (req, res, next) {
    resolveRelatedObjectsById(this, req.idParams || req.body,
        function (result) {
            req.model = result;
            next();
        },
        function (errors) {
            var result = {}
            if (errors['project']) result['project'] = errors['project'].message
            if (errors['pipeline']) result['project'] = errors['pipeline'].message
            if (errors['artefact']) result['project'] = errors['artefact'].message
            if (errors['state']) result['project'] = errors['state'].message
            res.json(404, result)
        });
};

exports.resolveObjectsBySlug = function (req, res, next) {
    resolveRelatedObjectsBySlug(this, req.slugParams || req.params,
        function (result) {
            req.model = result;
            next();
        },
        function (errors) {
            var result = {}
            if (errors['project']) result['project'] = errors['project'].message
            if (errors['pipeline']) result['project'] = errors['pipeline'].message
            if (errors['artefact']) result['project'] = errors['artefact'].message
            if (errors['state']) result['project'] = errors['state'].message
            res.json(404, result)
        });
};

exports.failOnError = function (req, type, action, next, err, result) {
    if (err) {
        this.json(409, {message: err.message, stack: err.stack})
    } else {
        req.data = req.data || {};
        req.data.type = type;
        req.data.action = action;
        if  (result) req.data[type] = req.data.result = result;
        next();
    }
};
exports.failOnEmptyResult = function (message, req, res, next) {
    !req.data.result ? res.json(404, message) : next();
};

exports.forwardResults = function (req, res) {
    res.json(200, req.data.result)
};

exports.emitResult = function (req, res, next) {
    if (req.data.action) {
        this.get('eventEmitter').emit('object-' + req.data.action, req.data.type, req.data.result, req.params.id);
    }
    next();
};
