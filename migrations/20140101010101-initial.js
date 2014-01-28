var dbm = require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function(db, callback) {
  async.series([
    db.createTable.bind(db, 'Projects', {
      id: { type: 'int', primaryKey: true },
      last_updated: { type: 'datetime', notNull: true },
      title: { type: 'string' }
    })
  ], callback);
};

exports.down = function(db, callback) {
  async.series([
    db.dropTable.bind(db, 'Projects')
  ], callback);
};