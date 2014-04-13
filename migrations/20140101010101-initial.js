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
            state_machine_id: { type: 'int', notNull: true },
            title: { type: 'string' }
        }),
        db.createTable.bind(db, 'Artefacts', {
            id: { type: 'int', primaryKey: true },
            last_updated: { type: 'datetime', notNull: true },
            pipeline_id: { type: 'int', notNull: true },
            current_state_id: { type: 'int' },
//            state_id: { type: 'int' }, // not used but needed by node-persist
            version: { type: 'string' },
            build_url: { type: 'string' },
            artefact_path: { type: 'string' }
        }),

        db.createTable.bind(db, 'StateMachines', {
           id:  { type: 'int', primaryKey: true },
           last_updated: { type: 'datetime', notNull: true },
           title: { type: 'string' },
           initial_state_id: { type: 'int' },
//           state_id: { type: 'int' } // not used but needed by node-persist
        }),

        db.createTable.bind(db, 'States', {
            id: { type: 'int', primaryKey: true },
            last_updated: { type: 'datetime', notNull: true },
            state_machine_id: { type: 'int', notNull: true },
            title: { type: 'string' },
            ttl: { type: 'int' },
            color: { type: 'string' }
        })
    ],
        function(err) {
            err && console.log(err);
            callback.apply(arguments)
        });


};

exports.down = function (db, callback) {
    async.series([
        db.dropTable.bind(db, 'Projects'),
        db.dropTable.bind(db, 'Pipelines'),
        db.dropTable.bind(db, 'Artefacts'),
        db.dropTable.bind(db, 'StateMachines'),
        db.dropTable.bind(db, 'States')
    ], callback);
};