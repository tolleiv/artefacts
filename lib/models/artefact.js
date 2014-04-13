var persist = require("persist");
var type = persist.type;

module.exports = Artefact = persist.define("Artefact", {
    "lastUpdated": { type: type.DATETIME },
    "version": { type: type.STRING },
    "buildUrl": { type: type.STRING },
    "artefactPath": { type: type.STRING }
});

Artefact.onSave = function (obj, connection, callback) {
    obj.lastUpdated = new Date();
    callback();
};
Artefact.validate = function (obj, callback) {

    var validateVersions = function(err, pipeline) {
        pipeline.artefacts.all(function (err, list) {
            var dup = false;
            list = list || [];
            for (var i = 0; i < list.length; i++) {
                if(list[i].id != obj.id) {
                    dup = dup || list[i].version === obj.version;
                }
            }
            callback(!dup, 'Wrong version, version number already exists');
        });
    };

    if (!obj.pipeline || !obj.pipelineId) {
        callback(false, 'Invalid pipeline association')
    } else {
        if (typeof obj.pipeline.artefacts == 'undefined') {
            obj.pipeline.getById(obj.pipelineId, validateVersions);
        } else {
            validateVersions(null, obj.pipeline);
        }
    }
};