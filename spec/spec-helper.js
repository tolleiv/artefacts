var Requester, request;
var http = require('http');
request = require("request");

var server, app, started=false;

exports.req = {
    get: function (path, callback) {
        return request("http://127.0.0.1:3000" + path, callback);
    },
    post: function (path, data, callback) {
        return request.post({
            url: "http://127.0.0.1:3000" + path,
            json: data
        }, callback);
    },
    put: function (path, data, callback) {
        return request.put({
            url: "http://127.0.0.1:3000" + path,
            json: data
        }, callback);
    },
    del: function(path, callback) {
        return request.del("http://127.0.0.1:3000" + path, callback);
    }
};


var createModel = function(persist, objects, callback) {
    persist.connect(function(err, conn) {
        var actions = [Project.deleteAll]
        for(var i=0;i<objects.length;i++) {
            actions.push(objects[i].save)
        }
        conn.chain(actions, function(err, results) {
            callback(conn)
        });
    });
}
var startServer = function (env, model, conn) {
    app = require("../lib/api.js").app;
    app.set('env', env);
    app.set('model', model);
    app.set('connection', conn)
    server = http.createServer(app);
    server.listen(3000)
        .on('listening', function () {
            setTimeout(function() { started=true; }, 100)
        })
        .on('close', function() { started=false; });
};

exports.start = function(persist, models, objects) {
    return function() {
        persist.env = 'dev';
        createModel(persist, objects, function(conn) {
            startServer('dev', models, conn)
        })
    }
};

exports.isStarted = function() {
    return started;
};

exports.stop = function (cb) {
    server.close(cb);
};
