var async = require('async');



exports.getProject = getProject = function(app, value, by, related, callback) {
    var m = app.get('model').Project.using(app.get('connection'))
    m.where(by + ' = ?', value).first(callback)
};
exports.getPipeline = getPipeline = function(app, value, by, related, callback) {
    var query = {}; query[by] = value;
    if (related.project) query['project_id'] = related.project.id;
    var m = app.get('model').Pipeline.using(app.get('connection'))
    m.where(query).first(callback)
};
exports.getArtefact = getArtefact = function(app, value, by, related, callback) {
    var query = {}; query[by] = value;
    if (related.pipeline) query['pipeline_id'] = related.pipeline.id;
    var m = app.get('model').Artefact.using(app.get('connection'))
    m.where(query).first(callback)
};

exports.getState = getState = function(app, value, by, related, callback) {
    var m = app.get('model').State.using(app.get('connection'))
    m.where(by + ' = ?', value).first(callback)
};

function resolveRelatedObjectsBy(list, callbackOk, callbackNok) {
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
                errors[key] = err || new Error(key + " not found");
            }
            loop(keys.slice(1), cb);
        });
    };
    loop(Object.keys(list), function () {
        if (Object.keys(errors).length === 0 && Object.keys(list).length > 0) callbackOk(result);
        else  callbackNok(errors);
    });
};

exports.resolveRelatedObjectsById = function(app, data, callbackOk, callbackNok) {
    var list = {};

    if (data['project_id']) list.project = getProject.bind(this, app, data['project_id'], 'id');
    if (data['pipeline_id']) list.pipeline = getPipeline.bind(this, app, data['pipeline_id'], 'id');
    if (data['artefact_id']) list.artefact = getArtefact.bind(this, app, data['artefact_id'], 'id');
    if (data['state_id']) list.state = getState.bind(this, app, data['state_id'], 'id');

    resolveRelatedObjectsBy(list, callbackOk, callbackNok);
};

exports.resolveRelatedObjectsBySlug = function(app, data, callbackOk, callbackNok) {
    var list = {};

    if (data['project']) list.project = getProject.bind(this, app, data['project'], 'title');
    if (data['pipeline']) list.pipeline = getPipeline.bind(this, app, data['pipeline'], 'title');
    if (data['artefact']) list.artefact = getArtefact.bind(this, app, data['artefact'], 'version');
    if (data['state']) list.state = getState.bind(this, app, data['state'], 'title');

    resolveRelatedObjectsBy(list, callbackOk, callbackNok);
};


exports.forwardOrFail = function(code, message, err) {
    if (err && err.constructor == Error) {
        this.json(409, { message: err.message, stack: err.stack })
    } else {
        this.json(code, message)
    }
};
exports.forwardResult = function() {
    var message, err, obj;

    if (arguments.length == 3) {
        message = arguments[0];
        err = arguments[1];
        obj = arguments[2];
    } else {
        err = arguments[0];
        obj = arguments[1];
    }
    if (err) {
        this.json(409, { message: err.message, stack: err.stack })
    } else if(!obj && message) {
        this.json(404, message)
    } else {
        this.json(200, obj)
    }
};