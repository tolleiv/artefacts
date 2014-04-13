var persist = require("persist");
var type = persist.type;

module.exports = ArtefactState = persist.define("ArtefactState", {
    "lastUpdated": { type: type.DATETIME },
    "code": { type: type.STRING, defaultValue: 'red' },
    "buildUrl": { type: type.STRING }
});

ArtefactState.onSave = function (obj, connection, callback) {
    obj.lastUpdated = new Date();
    callback();
}