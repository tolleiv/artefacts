exports.getProject = function(app, id, callbackOk, callbackNok) {
    var m = app.get('model').Project.using(app.get('connection'))
    m.where('id = ?', id).first(function (err, p) {
        err  || !p ? callbackNok(err) : callbackOk(p)
    })
};
exports.getPipeline = function(app, id, callbackOk, callbackNok) {
    var m = app.get('model').Pipeline.using(app.get('connection'))
    m.where('id = ?', id).first(function (err, p) {
        err  || !p ? callbackNok(err) : callbackOk(p)
    })
};
exports.forwardOrFail = function(code, message, err) {
    if (err) {
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