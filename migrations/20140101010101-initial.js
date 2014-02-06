var dbm = require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function (db, callback) {
    async.series([
        db.createTable.bind(db, 'Projects', {
            id: { type: 'int', primaryKey: true },
            last_updated: { type: 'datetime', notNull: true },
            title: { type: 'string' }
        }),
        db.createTable.bind(db, 'Pipelines', {
            id: { type: 'int', primaryKey: true },
            last_updated: { type: 'datetime', notNull: true },
            project_id: { type: 'int', notNull: true },
            title: { type: 'string' }
        }),
        db.createTable.bind(db, 'Artefacts', {
            id: { type: 'int', primaryKey: true },
            last_updated: { type: 'datetime', notNull: true },
            pipeline_id: { type: 'int', notNull: true },
            version: { type: 'string' },
            build_url: { type: 'string' },
            artefact_path: { type: 'string' }
        }),
        db.createTable.bind(db, 'Stages', {
            id: { type: 'int', primaryKey: true },
            last_updated: { type: 'datetime', notNull: true },
            project_id: { type: 'int', notNull: true },
            time: { type: 'string' },
            state: { type: 'string' },
            person: { type: 'string' }
        })
    ], callback);


};

exports.down = function (db, callback) {
    async.series([
        db.dropTable.bind(db, 'Projects'),
        db.dropTable.bind(db, 'Pipelines'),
        db.dropTable.bind(db, 'Artefacts'),
        db.dropTable.bind(db, 'Stages')
    ], callback);
};