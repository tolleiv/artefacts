var async = require('async');

exports.getProject = getProject = function(app, id, callback) {
    var m = app.get('model').Project.using(app.get('connection'))
    m.where('id = ?', id).first(callback)
};
exports.getPipeline = getPipeline = function(app, id, callback) {
    var m = app.get('model').Pipeline.using(app.get('connection'))
    m.where('id = ?', id).first(callback)
};
exports.getStateMachine = getStateMachine = function(app, id, callback) {
    var m = app.get('model').StateMachine.using(app.get('connection'))
    m.where('id = ?', id).first(callback)
};

exports.getModelObjects = function(app, data, callbackOk, callbackNok) {
    var list = {}, result = {}, errors = {};

    if (data['project_id']) list.project = getProject.bind(this, app, data['project_id']);
    if (data['pipeline_id']) list.pipeline = getPipeline.bind(this, app, data['pipeline_id']);
    if (data['state_machine_id']) list.statemachine = getStateMachine.bind(this, app, data['state_machine_id']);
    var loop = function(keys, cb) {
        if (keys.length == 0) { cb(); return; }
        var key = keys[0];
        list[key](function(err, obj) {
            if (!err && obj) {
                result[key] = obj;
            } else {
                errors[key] = err || new Error(key + " not found");
            }
            loop(keys.slice(1), cb);
        });
    };
    loop(Object.keys(list), function() {
        if (Object.keys(errors).length === 0 && Object.keys(list).length >0) callbackOk(result);
        else  callbackNok(errors);
    });
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
        console.log(err.message)
        this.json(409, { message: err.message, stack: err.stack })
    } else if(!obj && message) {
        this.json(404, message)
    } else {
        this.json(200, obj)
    }
};