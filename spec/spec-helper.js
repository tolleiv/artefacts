var http = require('http');
var dbm = require('db-migrate');
var request = require("request");
var assert = require('assert');
var path = require('path');
var model = require('../lib/models')

var server, app, started = false, migrate;

exports.migrate = migrate = {
    db: { "driver": "sqlite3", "filename": "test.db", silent: true },

    connect: function (callback) {
        dbm.connect(this.db, function (err, migrator) {
            assert.ifError(err);
            migrator.migrationsDir = path.resolve('./migrations');
            migrator.driver.createMigrationsTable(function (err) {
                assert.ifError(err);
                callback(migrator);
            });
        });
    },
    close: function (migrator, callback) {
        migrator.driver.close(function (err) {
            assert.ifError(err);
            callback();
        });
    },
    up: function (callback) {
        global.silent=true
        var done = this.close.bind(this)
        this.connect(function (migrator) {
            migrator.up({count: Number.MAX_VALUE}, function (err) {
                assert.ifError(err);
                global.silent=false
                done(migrator, callback);
            });
        })
    },
    down: function (callback) {
        global.silent=true
        var done = this.close.bind(this)
        this.connect(function (migrator) {
            migrator.down({count: 1}, function (err) {
                assert.ifError(err);
                global.silent=false
                done(migrator, callback);
            });
        });
    }
}

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
    del: function (path, callback) {
        return request.del("http://127.0.0.1:3000" + path, callback);
    },
    respondsPositive:  function (cb) {
        return function (err, res, body) {
            expect(err).toBeNull();
            expect(res.statusCode).toEqual(200);
            if (res.statusCode != 200) console.log(res.body)
            cb && cb(body);
        }
    },
    respondsNegative: function (cb) {
        return function (err, res, body) {
            expect(err).toBe(null)
            expect(res.statusCode).toBeGreaterThan(399)
            expect(res.statusCode).toBeLessThan(500)
            cb && cb(body);
        }
    }
};


var createModel = function (persist, objects, callback) {
    migrate.up(function () {
        persist.connect(function (err, conn) {
            var actions = [model.Project.deleteAll, model.Pipeline.deleteAll, model.Artefact.deleteAll,
                model.StateMachine.deleteAll, model.State.deleteAll]
            for (var i = 0; i < objects.length; i++) {
                actions.push(objects[i].save)
            }
            conn.chain(actions, function (err, results) {
                err && console.log(err)
                callback(conn)
            });
        });
    })
}
var startServer = function (env, model, conn) {
    app = require("../lib/api.js").app;
    app.set('env', env);
    app.set('model', model);
    app.set('connection', conn)
    server = http.createServer(app);
    server.listen(3000)
        .on('listening', function () {
            setTimeout(function () {
                started = true;
            }, 100)
        })
        .on('close', function () {
            started = false;
        });
};

exports.start = function (persist, models, objects) {
    return function () {
        persist.env = 'test';
        createModel(persist, objects, function (conn) {
            startServer('test', models, conn)
        })
    }
};

exports.isStarted = function () {
    return started;
};

exports.stop = function (cb) {
    migrate.down(function () {
        server.close(cb);
    });
};
