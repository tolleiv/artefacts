var persist = require("persist");
var Pipeline = require("./pipeline");
var type = persist.type;

module.exports = Artefact = persist.define("Artefact", {
    "lastUpdated": { type: type.DATETIME },
    "version": { type: type.STRING },
    "buildUrl": { type: type.STRING },
    "artefactPath": { type: type.STRING }
})
    .hasOne(Pipeline);

Artefact.onSave = function (obj, connection, callback) {
    obj.lastUpdated = new Date();
    callback();
};
Artefact.validate = function (obj, callback) {
    obj.pipeline.artefacts.all(function (err, list) {
        var dup = false;
        for (var i = 0; i < list.length; i++) {
            dup = dup || list[i].version === obj.version;
        }
        callback(!dup, 'Wrong version, version number already exists');
    });
};
Artefact.getCurrentState = function() {
    return null;
}
