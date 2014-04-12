var persist = require("persist");
var Artefact = require("./artefact");
var type = persist.type;

module.exports = State = persist.define("State", {
    "lastUpdated": { type: type.DATETIME },
    "time": { type: type.DATETIME },
    "stage": { type: type.STRING },
    "person": { type: type.STRING }
})
    .hasOne(Artefact);

State.onSave = function (obj, connection, callback) {
    obj.lastUpdated = new Date();
    callback();
}