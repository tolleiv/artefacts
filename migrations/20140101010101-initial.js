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
        db.createTable.bind(db, 'ArtefactStates', {
            id: { type: 'int', primaryKey: true },
            last_updated: { type: 'datetime', notNull: true },
            artefact_id: { type: 'int', notNull: true },
            state_id: { type: 'int', notNull: true },
            build_url: { type: 'string' },
            code: { type: 'string' }
        }),
        db.createTable.bind(db, 'States', {
            id: { type: 'int', primaryKey: true },
            last_updated: { type: 'datetime', notNull: true },
            title: { type: 'string' },
            time_to_red: { type: 'int' }
        }),
        db.addIndex.bind(db, 'ArtefactStates', 'code_idx', ['code'], false),
        db.addIndex.bind(db, 'Projects', 'project_title_idx', ['title'], false),
        db.addIndex.bind(db, 'Pipelines', 'pipeline_title_idx', ['title'], false),
        db.addIndex.bind(db, 'Artefacts', 'artefact_version_idx', ['version'], false),
        db.addIndex.bind(db, 'States', 'state_title_idx', ['title'], false)
    ],
        function (err) {
            err && console.log(err);
            callback.apply(arguments)
        });


};

exports.down = function (db, callback) {
    async.series([
        db.removeIndex.bind(db, 'ArtefactStates', 'code_idx'),
        db.removeIndex.bind(db, 'Projects', 'project_title_idx'),
        db.removeIndex.bind(db, 'Pipelines', 'pipeline_title_idx'),
        db.removeIndex.bind(db, 'Artefacts', 'artefact_version_idx'),
        db.removeIndex.bind(db, 'States', 'state_title_idx'),
        db.dropTable.bind(db, 'Projects'),
        db.dropTable.bind(db, 'Pipelines'),
        db.dropTable.bind(db, 'Artefacts'),
        db.dropTable.bind(db, 'ArtefactStates'),
        db.dropTable.bind(db, 'States')
    ], callback);
};