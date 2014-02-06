exports.forwardOrFail = function(code, message, err) {
    if (err) {
        this.json(500, err)
    } else {
        this.json(code, message)
    }
}
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
        this.json(500, err)
    } else if(!obj && message) {
        this.json(404, message)
    } else {
        this.json(200, obj)
    }
}