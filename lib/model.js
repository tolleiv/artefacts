/*
var Schema = require('jugglingdb').Schema;
exports.model = function(persistence, options) {
    var schema = new Schema(persistence, options);

    var Project = schema.define('Project', {
        title:     { type: String, length: 255 },
        timestamp: { type: Number,  default: Date.now }
    });
    var Pipeline = schema.define('Pipeline', {
        title:     { type: String, length: 255, default:'main' },
    });

    Project.hasMany(Pipeline,   {as: 'pipelines',  foreignKey: 'pipelineId'});
    Pipeline.belongsTo(Project, {as: 'project', foreignKey: 'pipelineId'});

    return {
        Project:Project,
        Pipeline:Pipeline,
        migrate: function(cb) {schema.automigrate(cb);},
        close: function(cb) { schema.disconnect(cb); }
    };
}
*/